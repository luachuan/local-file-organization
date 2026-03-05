#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const os = require('os');

const CONFIG_PATH = path.join(os.homedir(), '.config', 'file-organizer.json');
const LOG_PATH = path.join(os.homedir(), '.cache', 'file-organizer', 'operations.json');

const DEFAULT_CONFIG = {
  types: {
    images: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'],
    docs: ['.pdf', '.doc', '.docx', '.txt', '.md', '.xls', '.xlsx', '.ppt', '.pptx'],
    videos: ['.mp4', '.avi', '.mov', '.mkv', '.flv'],
    code: ['.js', '.ts', '.py', '.java', '.c', '.cpp', '.h', '.go', '.rs', '.html', '.css', '.json'],
    audio: ['.mp3', '.wav', '.flac', '.aac', '.ogg']
  },
  targetDirs: {
    images: 'Images',
    docs: 'Documents',
    videos: 'Videos',
    code: 'Code',
    audio: 'Audio',
    other: 'Other'
  }
};

function loadConfig() {
  if (fs.existsSync(CONFIG_PATH)) {
    try {
      return { ...DEFAULT_CONFIG, ...JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8')) };
    } catch (e) {
      console.warn('Warning: Could not load config, using defaults');
      return DEFAULT_CONFIG;
    }
  }
  return DEFAULT_CONFIG;
}

function saveConfig(config) {
  const dir = path.dirname(CONFIG_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
}

function loadLog() {
  const dir = path.dirname(LOG_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (fs.existsSync(LOG_PATH)) {
    try {
      return JSON.parse(fs.readFileSync(LOG_PATH, 'utf8'));
    } catch (e) {
      return [];
    }
  }
  return [];
}

function saveLog(log) {
  const dir = path.dirname(LOG_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(LOG_PATH, JSON.stringify(log, null, 2));
}

function getFileType(filePath, config) {
  const ext = path.extname(filePath).toLowerCase();
  for (const [type, exts] of Object.entries(config.types)) {
    if (exts.includes(ext)) return type;
  }
  return 'other';
}

function getFileHash(filePath) {
  const hash = crypto.createHash('sha256');
  hash.update(fs.readFileSync(filePath));
  return hash.digest('hex');
}

function organizeByType(dir, config, preview = false) {
  const files = fs.readdirSync(dir).filter(f => fs.statSync(path.join(dir, f)).isFile());
  const operations = [];

  for (const file of files) {
    const src = path.join(dir, file);
    const type = getFileType(src, config);
    const targetDir = path.join(dir, config.targetDirs[type]);
    const dest = path.join(targetDir, file);
    operations.push({ type: 'move', src, dest, targetDir, file });
  }

  if (preview) {
    console.log('=== Preview: Would organize %d files ===', operations.length);
    for (const op of operations) {
      console.log('  %s → %s', op.file, path.join(config.targetDirs[getFileType(op.src, config)], op.file));
    }
    return { preview: true, operations };
  }

  const report = { moved: 0, skipped: 0, errors: [] };
  const log = loadLog();
  const timestamp = Date.now();

  for (const op of operations) {
    try {
      if (!fs.existsSync(op.targetDir)) fs.mkdirSync(op.targetDir, { recursive: true });
      if (!fs.existsSync(op.dest)) {
        fs.renameSync(op.src, op.dest);
        report.moved++;
        log.push({ timestamp, type: 'move', src: op.src, dest: op.dest });
      } else {
        report.skipped++;
      }
    } catch (e) {
      report.errors.push({ file: op.file, error: e.message });
    }
  }
  saveLog(log);
  return report;
}

function organizeByDate(dir, config, preview = false) {
  const files = fs.readdirSync(dir).filter(f => fs.statSync(path.join(dir, f)).isFile());
  const operations = [];

  for (const file of files) {
    const src = path.join(dir, file);
    const stat = fs.statSync(src);
    const date = new Date(stat.mtime);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const targetDir = path.join(dir, String(year), month);
    const dest = path.join(targetDir, file);
    operations.push({ type: 'move', src, dest, targetDir, file });
  }

  if (preview) {
    console.log('=== Preview: Would organize %d files by date ===', operations.length);
    for (const op of operations) {
      const stat = fs.statSync(op.src);
      const date = new Date(stat.mtime);
      console.log('  %s → %d/%s/%s', op.file, date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), op.file);
    }
    return { preview: true, operations };
  }

  const report = { moved: 0, skipped: 0, errors: [] };
  const log = loadLog();
  const timestamp = Date.now();

  for (const op of operations) {
    try {
      if (!fs.existsSync(op.targetDir)) fs.mkdirSync(op.targetDir, { recursive: true });
      if (!fs.existsSync(op.dest)) {
        fs.renameSync(op.src, op.dest);
        report.moved++;
        log.push({ timestamp, type: 'move', src: op.src, dest: op.dest });
      } else {
        report.skipped++;
      }
    } catch (e) {
      report.errors.push({ file: op.file, error: e.message });
    }
  }
  saveLog(log);
  return report;
}

function dedupe(dir, config, preview = false) {
  const files = fs.readdirSync(dir).filter(f => fs.statSync(path.join(dir, f)).isFile());
  const hashes = new Map();
  const operations = [];

  for (const file of files) {
    const src = path.join(dir, file);
    try {
      const hash = getFileHash(src);
      if (hashes.has(hash)) {
        operations.push({ type: 'delete', path: src, file, original: hashes.get(hash) });
      } else {
        hashes.set(hash, file);
      }
    } catch (e) {
      // skip
    }
  }

  if (preview) {
    console.log('=== Preview: Would delete %d duplicate files ===', operations.length);
    for (const op of operations) {
      console.log('  %s (duplicate of %s)', op.file, op.original);
    }
    return { preview: true, operations };
  }

  const report = { deleted: 0, kept: hashes.size, errors: [] };
  const log = loadLog();
  const timestamp = Date.now();

  for (const op of operations) {
    try {
      log.push({ timestamp, type: 'delete', path: op.path, original: op.original });
      fs.unlinkSync(op.path);
      report.deleted++;
    } catch (e) {
      report.errors.push({ file: op.file, error: e.message });
    }
  }
  saveLog(log);
  return report;
}

function undoLast() {
  const log = loadLog();
  if (log.length === 0) {
    console.log('No operations to undo');
    return;
  }

  const lastOp = log[log.length - 1];
  const timestamp = lastOp.timestamp;
  const lastOps = log.filter(op => op.timestamp === timestamp);

  console.log('=== Undoing last %d operations ===', lastOps.length);
  let undone = 0;

  for (const op of [...lastOps].reverse()) {
    try {
      if (op.type === 'move' && fs.existsSync(op.dest)) {
        const dir = path.dirname(op.src);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        fs.renameSync(op.dest, op.src);
        console.log('  Undo: %s → %s', path.basename(op.dest), path.basename(op.src));
        undone++;
      }
    } catch (e) {
      console.warn('  Could not undo %s: %s', op.src || op.path, e.message);
    }
  }

  const newLog = log.filter(op => op.timestamp !== timestamp);
  saveLog(newLog);
  console.log('Undone %d operations', undone);
}

function generateReport(dir, config) {
  const files = fs.readdirSync(dir).filter(f => fs.statSync(path.join(dir, f)).isFile());
  const dirs = fs.readdirSync(dir).filter(f => fs.statSync(path.join(dir, f)).isDirectory());
  const typeCounts = {};
  for (const file of files) {
    const type = getFileType(path.join(dir, file), config);
    typeCounts[type] = (typeCounts[type] || 0) + 1;
  }
  return {
    path: dir,
    totalFiles: files.length,
    totalDirs: dirs.length,
    typeCounts
  };
}

const args = process.argv.slice(2);
const command = args[0];
const config = loadConfig();
const preview = args.includes('--preview');

// 找到目录参数
let targetDir = process.cwd();
for (let i = 1; i < args.length; i++) {
  if (!args[i].startsWith('--')) {
    targetDir = args[i];
    break;
  }
}

if (command === 'organize' && args.includes('--type')) {
  console.log(organizeByType(targetDir, config, preview));
} else if (command === 'organize' && args.includes('--date')) {
  console.log(organizeByDate(targetDir, config, preview));
} else if (command === 'dedupe') {
  console.log(dedupe(targetDir, config, preview));
} else if (command === 'undo') {
  undoLast();
} else if (command === 'report') {
  console.log(generateReport(targetDir, config));
} else if (command === 'config') {
  if (args.includes('--init')) {
    saveConfig(DEFAULT_CONFIG);
    console.log('Config initialized at', CONFIG_PATH);
  } else {
    console.log('Config:', JSON.stringify(config, null, 2));
  }
} else {
  console.log('Usage:');
  console.log('  node index.js organize --type|--date [--preview] <dir>  Organize files');
  console.log('  node index.js dedupe [--preview] <dir>                  Remove duplicates');
  console.log('  node index.js undo                                          Undo last operation');
  console.log('  node index.js report <dir>                                   Generate report');
  console.log('  node index.js config [--init]                                Show/init config');
}
