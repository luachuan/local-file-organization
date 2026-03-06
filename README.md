
# Local File Organizer

Your files deserve better.

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

```bash
git clone https://github.com/luachuan/local-file-organization.git &amp;&amp; cd local-file-organization &amp;&amp; chmod +x index.js
```

### Use

```bash
./index.js organize --type ~/Downloads
```

That's it. Your Downloads folder is organized.

---

## What It Does

- Organize by type (images/docs/videos/code/audio)
- Organize by date (year/month)
- Remove duplicates (hash-based)
- Preview mode (see what happens without changing anything)
- Undo (one click undo for last operation)
- Watch mode (monitor a folder and auto-organize new files)
- Config file (customize at ~/.config/file-organizer.json)
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

# Organize by date
./index.js organize --date ~/Downloads

# Preview remove duplicates
./index.js dedupe --preview ~/Downloads

# Actually remove duplicates
./index.js dedupe ~/Downloads

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
```

---

## Future Plans

We're building what matters. If you have ideas, open an issue.

---

## License

MIT
