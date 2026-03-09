
# Local File Organizer

Your files deserve better.

---

中文用户请移步 [中文版 README](README.zh-CN.md)。

---

---

## The Problem

Your Downloads folder is a mess. You can't find that photo from last month. That PDF you need is buried under 300 other files.

You tried other tools. They want you to write 50 lines of config. They want to upload your files to the cloud. They want you to spend an hour learning how to use them.

That's not good enough.

---

## The Solution

Local File Organizer. Simple. Local. Done.

### Zero config.

One command. That's it. No config files to write. No options to set. Just organize.

### 100% local.

Your files never leave your machine. Not one byte. No cloud. No accounts. Just you and your files.

### Undo is one click.

Mistakes happen. One command and it's like it never happened.

---

## Quick Start

### Install

#### Option 1: npm (recommended)

```bash
npm install -g local-file-organizer
```

#### Option 2: One-click install (Linux/macOS)

```bash
curl -sSL https://raw.githubusercontent.com/luachuan/local-file-organization/master/install.sh | bash
```

#### Option 3: From source

```bash
git clone https://github.com/luachuan/local-file-organization.git &amp;&amp; cd local-file-organization &amp;&amp; chmod +x index.js
```

### Use

```bash
lfo organize --type ~/Downloads
```

(If you installed from source, use `./index.js` instead of `lfo`.)

That's it. Your Downloads folder is organized.

### Want to customize?

Copy the example config and make it yours:

```bash
mkdir -p ~/.config
curl -sSL https://raw.githubusercontent.com/luachuan/local-file-organization/master/config.example.json &gt; ~/.config/file-organizer.json
# Then edit ~/.config/file-organizer.json to match your needs!
```

---

## 🤖 Built by OpenClaw - An AI-Powered Project

You've heard about OpenClaw. It's taking the self-hosted world by storm.

This project? **It's built *and maintained* by an OpenClaw agent.** No human commits. No human PRs. Just an AI, iterating non-stop.

### The Numbers Speak for Themselves

- **4 days, 10 versions** (v1.0.0 → v1.10.0)
- **3 releases per day** (8 AM, 12 PM, 6 PM GMT+8 - like clockwork)
- **Every release ships**: New features, better UX, real improvements

### See the Journey

This isn't a black box. We ship fast and iterate often:

- [Changelog](https://github.com/luachuan/local-file-organization/blob/master/CHANGELOG.md) - Every release, every new feature

### But Wait - This Is Still *Your* Tool

OpenClaw builds it. **You use it.**

At the end of the day, this is just a simple, fast, local file organizer. No AI lock-in. No cloud nonsense. Just a tool that gets better *while you sleep*.

---

## What It Does

- Organize by type (images/docs/videos/code/audio)
- Organize by date (year/month)
- Organize by extension (JPG/PNG/PDF/MD/etc. for finer-grained control)
- Remove duplicates (hash-based)
- Preview mode (see what happens without changing anything)
- Undo (one click undo for last operation)
- Watch mode (monitor a folder and auto-organize new files)
- Config file (customize at ~/.config/file-organizer.json)
- Verbose mode (see exactly what's happening)
- Quiet mode (suppress all output for scripts/cron jobs)
- 100% local (no cloud, no data leaks)

---

## The Details

For power users who want more control, edit `~/.config/file-organizer.json`:

```json
{
  "types": {
    "images": [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"],
    "docs": [".pdf", ".doc", ".docx", ".txt", ".md", ".xls", ".xlsx", ".ppt", ".pptx"],
    "videos": [".mp4", ".avi", ".mov", ".mkv", ".flv"],
    "code": [".js", ".ts", ".py", ".java", ".c", ".cpp", ".h", ".go", ".rs", ".html", ".css", ".json"],
    "audio": [".mp3", ".wav", ".flac", ".aac", ".ogg"]
  },
  "targetDirs": {
    "images": "Images",
    "docs": "Documents",
    "videos": "Videos",
    "code": "Code",
    "audio": "Audio",
    "other": "Other"
  }
}
```

---

## More Commands

```bash
# Preview organize by type (no changes)
./index.js organize --type --preview ~/Downloads

# Organize by type recursively (including subdirectories)
./index.js organize --type --recursive ~/Downloads

# Organize by type with verbose output
./index.js organize --type --verbose ~/Downloads

# Organize by date
./index.js organize --date ~/Downloads

# Organize by date recursively
./index.js organize --date -r ~/Downloads

# Organize by extension (finer-grained control)
./index.js organize --extension ~/Downloads

# Organize by extension quietly (no output)
./index.js organize --extension --quiet ~/Downloads

# Preview remove duplicates
./index.js dedupe --preview ~/Downloads

# Actually remove duplicates recursively
./index.js dedupe --recursive ~/Downloads

# Actually remove duplicates

# Undo last operation
./index.js undo

# Generate report
./index.js report ~/Downloads

# Initialize config (optional, for advanced users)
./index.js config --init

# Show config
./index.js config

# Watch folder and auto-organize by type
./index.js watch ~/Downloads

# Watch folder and auto-organize by date
./index.js watch --date ~/Downloads

# Watch folder and auto-organize by extension
./index.js watch --extension ~/Downloads
```

---

## Future Plans

We're building what matters. If you have ideas, open an issue.

---

## License

MIT
