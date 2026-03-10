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
  },
  defaultExclude: ['node_modules', '.git', '.DS_Store', 'Thumbs.db', '*.tmp', '*.log', '.cache', '.npm', '.yarn']
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

function getAllFiles(dir, recursive = false, exclude = []) {
  let files = [];
  const entries = fs.readdirSync(dir);
  for (const entry of entries) {
    const fullPath = path.join(dir, entry);
    const relativePath = path.relative(dir, fullPath);
    
    // Check if this entry is excluded
    const isExcluded = exclude.some(ex => {
      // First, try regex (if starts and ends with /)
      if (ex.startsWith('/') && ex.endsWith('/')) {
        try {
          const regex = new RegExp(ex.slice(1, -1));
          if (regex.test(relativePath)) return true;
        } catch (e) {
          // Invalid regex, skip
        }
      }
      // Exact match or wildcard match (simple)
      if (ex === relativePath) return true;
      if (ex.endsWith('*') && relativePath.startsWith(ex.slice(0, -1))) return true;
      if (ex.startsWith('*') && relativePath.endsWith(ex.slice(1))) return true;
      return false;
    });
    
    if (isExcluded) continue;
    
    const stat = fs.statSync(fullPath);
    if (stat.isFile()) {
      files.push(fullPath);
    } else if (stat.isDirectory() && recursive) {
      files = files.concat(getAllFiles(fullPath, recursive, exclude));
    }
  }
  return files;
}

function organizeByType(dir, config, preview = false, recursive = false, exclude = [], verbose = false, quiet = false, sinceDate = null) {
  const allExcludes = [...(config.defaultExclude || []), ...exclude];
  const files = getAllFiles(dir, recursive, allExcludes).map(f => path.relative(dir, f));
  const operations = [];

  for (const file of files) {
    const src = path.join(dir, file);
    const stat = fs.statSync(src);
    if (sinceDate && stat.mtime < sinceDate) continue; // Skip if older than sinceDate
    const type = getFileType(src, config);
    const targetDir = path.join(dir, config.targetDirs[type]);
    const dest = path.join(targetDir, path.basename(file));
    operations.push({ type: 'move', src, dest, targetDir, file });
  }

  if (preview) {
    if (!quiet) {
      console.log('=== Preview: Would organize %d files ===', operations.length);
      for (const op of operations) {
        console.log('  %s → %s', op.file, path.join(config.targetDirs[getFileType(op.src, config)], path.basename(op.file)));
      }
    }
    return { preview: true, operations };
  }

  const report = { moved: 0, skipped: 0, errors: [] };
  const log = loadLog();
  const timestamp = Date.now();

  if (verbose &amp;&amp; !quiet) console.log('=== Organizing %d files by type ===', operations.length);
  
  for (const op of operations) {
    try {
      if (!fs.existsSync(op.targetDir)) fs.mkdirSync(op.targetDir, { recursive: true });
      if (!fs.existsSync(op.dest)) {
        fs.renameSync(op.src, op.dest);
        report.moved++;
        log.push({ timestamp, type: 'move', src: op.src, dest: op.dest });
        if (verbose &amp;&amp; !quiet) console.log('  ✓ Moved: %s → %s', op.file, path.join(config.targetDirs[getFileType(op.src, config)], path.basename(op.file)));
      } else {
        report.skipped++;
        if (verbose &amp;&amp; !quiet) console.log('  - Skipped (exists): %s', op.file);
      }
    } catch (e) {
      report.errors.push({ file: op.file, error: e.message });
      if (verbose &amp;&amp; !quiet) console.log('  ✗ Error: %s - %s', op.file, e.message);
    }
  }
  saveLog(log);
  
  if (verbose &amp;&amp; !quiet) {
    console.log('\n=== Summary ===');
    console.log('  Moved: %d', report.moved);
    console.log('  Skipped: %d', report.skipped);
    console.log('  Errors: %d', report.errors.length);
  }
  
  return report;
}

function organizeByExtension(dir, config, preview = false, recursive = false, exclude = [], verbose = false, quiet = false, sinceDate = null) {
  const allExcludes = [...(config.defaultExclude || []), ...exclude];
  const files = getAllFiles(dir, recursive, allExcludes).map(f => path.relative(dir, f));
  const operations = [];

  for (const file of files) {
    const src = path.join(dir, file);
    const stat = fs.statSync(src);
    if (sinceDate && stat.mtime < sinceDate) continue; // Skip if older than sinceDate
    const ext = path.extname(src).toLowerCase() || 'no-extension';
    const extDir = ext.startsWith('.') ? ext.slice(1).toUpperCase() : ext.toUpperCase();
    const targetDir = path.join(dir, extDir);
    const dest = path.join(targetDir, path.basename(file));
    operations.push({ type: 'move', src, dest, targetDir, file, ext });
  }

  if (preview) {
    if (!quiet) {
      console.log('=== Preview: Would organize %d files by extension ===', operations.length);
      for (const op of operations) {
        console.log('  %s → %s/%s', op.file, op.ext.startsWith('.') ? op.ext.slice(1).toUpperCase() : op.ext.toUpperCase(), path.basename(op.file));
      }
    }
    return { preview: true, operations };
  }

  const report = { moved: 0, skipped: 0, errors: [] };
  const log = loadLog();
  const timestamp = Date.now();

  if (verbose &amp;&amp; !quiet) console.log('=== Organizing %d files by extension ===', operations.length);
  
  for (const op of operations) {
    try {
      if (!fs.existsSync(op.targetDir)) fs.mkdirSync(op.targetDir, { recursive: true });
      if (!fs.existsSync(op.dest)) {
        fs.renameSync(op.src, op.dest);
        report.moved++;
        log.push({ timestamp, type: 'move', src: op.src, dest: op.dest });
        if (verbose &amp;&amp; !quiet) console.log('  ✓ Moved: %s → %s/%s', op.file, op.ext.startsWith('.') ? op.ext.slice(1).toUpperCase() : op.ext.toUpperCase(), path.basename(op.file));
      } else {
        report.skipped++;
        if (verbose &amp;&amp; !quiet) console.log('  - Skipped (exists): %s', op.file);
      }
    } catch (e) {
      report.errors.push({ file: op.file, error: e.message });
      if (verbose &amp;&amp; !quiet) console.log('  ✗ Error: %s - %s', op.file, e.message);
    }
  }
  saveLog(log);
  
  if (verbose &amp;&amp; !quiet) {
    console.log('\n=== Summary ===');
    console.log('  Moved: %d', report.moved);
    console.log('  Skipped: %d', report.skipped);
    console.log('  Errors: %d', report.errors.length);
  }
  
  return report;
}

function organizeByDate(dir, config, preview = false, recursive = false, exclude = [], verbose = false, quiet = false, sinceDate = null) {
  const allExcludes = [...(config.defaultExclude || []), ...exclude];
  const files = getAllFiles(dir, recursive, allExcludes).map(f => path.relative(dir, f));
  const operations = [];

  for (const file of files) {
    const src = path.join(dir, file);
    const stat = fs.statSync(src);
    if (sinceDate && stat.mtime < sinceDate) continue; // Skip if older than sinceDate
    const date = new Date(stat.mtime);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const targetDir = path.join(dir, String(year), month);
    const dest = path.join(targetDir, path.basename(file));
    operations.push({ type: 'move', src, dest, targetDir, file, date });
  }

  if (preview) {
    if (!quiet) {
      console.log('=== Preview: Would organize %d files by date ===', operations.length);
      for (const op of operations) {
        console.log('  %s → %d/%s/%s', op.file, op.date.getFullYear(), String(op.date.getMonth() + 1).padStart(2, '0'), path.basename(op.file));
      }
    }
    return { preview: true, operations };
  }

  const report = { moved: 0, skipped: 0, errors: [] };
  const log = loadLog();
  const timestamp = Date.now();

  if (verbose &amp;&amp; !quiet) console.log('=== Organizing %d files by date ===', operations.length);
  
  for (const op of operations) {
    try {
      if (!fs.existsSync(op.targetDir)) fs.mkdirSync(op.targetDir, { recursive: true });
      if (!fs.existsSync(op.dest)) {
        fs.renameSync(op.src, op.dest);
        report.moved++;
        log.push({ timestamp, type: 'move', src: op.src, dest: op.dest });
        if (verbose &amp;&amp; !quiet) console.log('  ✓ Moved: %s → %d/%s/%s', op.file, op.date.getFullYear(), String(op.date.getMonth() + 1).padStart(2, '0'), path.basename(op.file));
      } else {
        report.skipped++;
        if (verbose &amp;&amp; !quiet) console.log('  - Skipped (exists): %s', op.file);
      }
    } catch (e) {
      report.errors.push({ file: op.file, error: e.message });
      if (verbose &amp;&amp; !quiet) console.log('  ✗ Error: %s - %s', op.file, e.message);
    }
  }
  saveLog(log);
  
  if (verbose &amp;&amp; !quiet) {
    console.log('\n=== Summary ===');
    console.log('  Moved: %d', report.moved);
    console.log('  Skipped: %d', report.skipped);
    console.log('  Errors: %d', report.errors.length);
  }
  
  return report;
}

function dedupe(dir, config, preview = false, recursive = false, exclude = []) {
  const allExcludes = [...(config.defaultExclude || []), ...exclude];
  const files = getAllFiles(dir, recursive, allExcludes);
  const hashes = new Map();
  const operations = [];

  for (const file of files) {
    const src = file;
    try {
      const hash = getFileHash(src);
      if (hashes.has(hash)) {
        operations.push({ type: 'delete', path: src, file: path.relative(dir, src), original: path.relative(dir, hashes.get(hash)) });
      } else {
        hashes.set(hash, src);
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

function generateReport(dir, config, recursive = false) {
  const allFiles = [];
  const allDirs = [];
  
  function scan(currentDir) {
    const entries = fs.readdirSync(currentDir);
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry);
      const stat = fs.statSync(fullPath);
      if (stat.isFile()) {
        allFiles.push({ path: fullPath, relativePath: path.relative(dir, fullPath), size: stat.size, mtime: stat.mtime });
      } else if (stat.isDirectory()) {
        allDirs.push({ path: fullPath, relativePath: path.relative(dir, fullPath) });
        if (recursive) {
          scan(fullPath);
        }
      }
    }
  }
  
  scan(dir);
  
  const typeCounts = {};
  const extCounts = {};
  let totalSize = 0;
  
  for (const file of allFiles) {
    const type = getFileType(file.path, config);
    typeCounts[type] = (typeCounts[type] || 0) + 1;
    
    const ext = path.extname(file.path).toLowerCase() || 'no-extension';
    extCounts[ext] = (extCounts[ext] || 0) + 1;
    
    totalSize += file.size;
  }
  
  // Sort extension counts by count descending
  const sortedExtCounts = Object.entries(extCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20); // Top 20 extensions
  
  // Format size
  function formatSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
  
  return {
    path: dir,
    totalFiles: allFiles.length,
    totalDirs: allDirs.length,
    totalSize: totalSize,
    totalSizeFormatted: formatSize(totalSize),
    typeCounts,
    topExtensions: sortedExtCounts,
    recursive: recursive
  };
}

function watchDir(dir, config, organizeBy = 'type', recursive = false, exclude = []) {
  const allExcludes = [...(config.defaultExclude || []), ...exclude];
  console.log(`Watching ${dir} for changes (organize by: ${organizeBy}, recursive: ${recursive}, exclude: ${allExcludes.length > 0 ? allExcludes.join(', ') : 'none'})...`);
  console.log('Press Ctrl+C to stop.');

  const watchedFiles = new Set();
  let debounceTimer = null;

  function scanAndOrganize() {
    if (organizeBy === 'type') {
      organizeByType(dir, config, false, recursive, exclude);
    } else if (organizeBy === 'date') {
      organizeByDate(dir, config, false, recursive, exclude);
    } else if (organizeBy === 'extension') {
      organizeByExtension(dir, config, false, recursive, exclude);
    }
  }

  function handleChange(eventType, filename) {
    if (!filename) return;
    const filePath = path.join(dir, filename);
    if (watchedFiles.has(filePath)) return;

    watchedFiles.add(filePath);
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      scanAndOrganize();
      watchedFiles.clear();
    }, 500);
  }

  fs.watch(dir, { recursive }, handleChange);
}

const args = process.argv.slice(2);
const command = args[0];
const config = loadConfig();
const preview = args.includes('--preview') || args.includes('--dry-run');
const recursive = args.includes('--recursive') || args.includes('-r');
const verbose = args.includes('--verbose') || args.includes('-v');
const quiet = args.includes('--quiet') || args.includes('-q');

// Parse --since option
let sinceDate = null;
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--since' && args[i + 1]) {
    sinceDate = new Date(args[i + 1]);
    i++; // skip the value
  }
}

// Parse exclude options
const exclude = [];
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--exclude' && args[i + 1]) {
    exclude.push(args[i + 1]);
    i++; // skip the value
  }
}

// 找到目录参数
let targetDir = process.cwd();
for (let i = 1; i < args.length; i++) {
  if (!args[i].startsWith('--') && args[i - 1] !== '--exclude') {
    targetDir = args[i];
    break;
  }
}

if (command === 'organize' && args.includes('--type')) {
  console.log(organizeByType(targetDir, config, preview, recursive, exclude, verbose, quiet, sinceDate));
} else if (command === 'organize' && args.includes('--date')) {
  console.log(organizeByDate(targetDir, config, preview, recursive, exclude, verbose, quiet, sinceDate));
} else if (command === 'organize' && args.includes('--extension')) {
  console.log(organizeByExtension(targetDir, config, preview, recursive, exclude, verbose, quiet, sinceDate));
} else if (command === 'dedupe') {
  console.log(dedupe(targetDir, config, preview, recursive, exclude));
} else if (command === 'watch') {
  const organizeBy = args.includes('--date') ? 'date' : (args.includes('--extension') ? 'extension' : 'type');
  watchDir(targetDir, config, organizeBy, recursive, exclude);
} else if (command === 'undo') {
  undoLast();
} else if (command === 'report') {
  const report = generateReport(targetDir, config, recursive);
  
  // Pretty print the report
  if (!quiet) {
    console.log('=== Directory Report ===');
    console.log('  Path: %s', report.path);
    console.log('  Total Files: %d', report.totalFiles);
    console.log('  Total Directories: %d', report.totalDirs);
    console.log('  Total Size: %s', report.totalSizeFormatted);
    console.log('  Recursive: %s', report.recursive ? 'Yes' : 'No');
    console.log('');
    console.log('=== File Type Counts ===');
    for (const [type, count] of Object.entries(report.typeCounts)) {
      console.log('  %s: %d', type, count);
    }
    console.log('');
    console.log('=== Top 20 Extensions ===');
    for (const [ext, count] of report.topExtensions) {
      console.log('  %s: %d', ext || '(no extension)', count);
    }
  }
  
  // Always output the JSON for machine readability
  console.log(JSON.stringify(report, null, 2));
} else if (command === 'config') {
  if (args.includes('--init')) {
    saveConfig(DEFAULT_CONFIG);
    console.log('Config initialized at', CONFIG_PATH);
  } else {
    console.log('Config:', JSON.stringify(config, null, 2));
  }
} else {
  console.log('Usage:');
  console.log('  organize --type|--date|--extension [--preview|--dry-run] [--recursive|-r] [--verbose|-v] [--quiet|-q] [--exclude <path>] [--since <date>] <dir>  Organize files');
  console.log('  dedupe [--preview] [--recursive|-r] [--exclude <path>] <dir>                                      Remove duplicates');
  console.log('  watch [--date|--extension] [--recursive|-r] [--exclude <path>] <dir>                                          Watch and auto-organize');
  console.log('  undo                                                                                                Undo last operation');
  console.log('  report [--recursive|-r] <dir>                                                                     Generate report (show file counts, sizes, types, extensions)');
  console.log('  config [--init]                                                                                     Show/init config');
  console.log('');
  console.log('Options:');
  console.log('  --preview, --dry-run  Show what would be done without actually doing it');
  console.log('  --recursive, -r  Recursively organize subdirectories');
  console.log('  --verbose, -v  Show detailed output of each operation');
  console.log('  --quiet, -q  Suppress all output');
  console.log('  --exclude <path>  Exclude specific files/directories (supports wildcards and regex)');
  console.log('  --since <date>  Only process files modified after this date (ISO format, e.g., 2026-03-01)');
  console.log('');
  console.log('Exclude tips:');
  console.log('  - Exact path: --exclude "node_modules"');
  console.log('  - Wildcard: --exclude "*.log"');
  console.log('  - Regex: --exclude "/\\.tmp$/"');
  console.log('  - Multiple: --exclude "node_modules" --exclude "*.log"');
}
