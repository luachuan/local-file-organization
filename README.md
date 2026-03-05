# Local File Organizer 🗂️

🔒 **100% local run, no file data uploaded, all AI processing done locally**

I got tired of my Downloads folder being a mess—so I built this simple tool to organize files locally, without sending anything to the cloud.

**Supports**: Linux, macOS, Windows (requires Node.js 18+)

---

## 本地文件整理助手 🗂️

🔒 **100% 本地运行，不上传任何文件数据，所有 AI 处理均在本地完成**

我的 Downloads 文件夹总是乱成一团，所以写了这个简单的工具，在本地整理文件，不用上传任何数据到云端。

**支持系统**：Linux、macOS、Windows（需要 Node.js 18+）

---

## What it does / 功能

- Organize by file type (images/docs/videos/code/audio/other) / 按文件类型整理（图片/文档/视频/代码/音频/其他）
- Organize by date (year/month) / 按日期整理（年/月）
- Remove duplicate files (hash-based) / 删除重复文件（基于哈希）
- **Preview mode** - see what would happen without making changes / **预览模式** - 先看会做什么，不实际执行
- **Undo** - one-click undo for last operation / **撤销** - 一键撤销最后一次操作
- **Watch mode** - monitor a folder and auto-organize new files / **监控模式** - 监控文件夹，自动整理新文件
- **Config file** - customize types and target folders at ~/.config/file-organizer.json / **配置文件** - 在 ~/.config/file-organizer.json 自定义类型和目标文件夹
- **100% local** - no cloud, no data leaks / **100% 本地** - 不上云，不泄露数据

## Quick Start / 快速开始（零配置开箱即用）

### Install / 安装（一行命令）
```bash
git clone https://github.com/luachuan/local-file-organization.git && cd local-file-organization && chmod +x index.js
```

### Use / 使用（一行命令整理）
```bash
# Organize Downloads by type (zero config!) / 零配置整理 Downloads 按类型！
./index.js organize --type ~/Downloads
```

### More commands / 更多命令
```bash
# Preview organize by type (no changes) / 预览按类型整理（不实际执行
./index.js organize --type --preview ~/Downloads

# Organize by date / 按日期整理
./index.js organize --date ~/Downloads

# Preview remove duplicates / 预览删除重复文件
./index.js dedupe --preview ~/Downloads

# Actually remove duplicates / 实际删除重复文件
./index.js dedupe ~/Downloads

# Undo last operation / 撤销最后一次操作
./index.js undo

# Generate report / 生成整理报告
./index.js report ~/Downloads

# Initialize config (optional, for advanced users) / 初始化配置（可选，高级用户）
./index.js config --init

# Show config / 查看当前配置
./index.js config

# Watch folder and auto-organize by type / 监控文件夹，自动按类型整理
./index.js watch ~/Downloads

# Watch folder and auto-organize by date / 监控文件夹，自动按日期整理
./index.js watch --date ~/Downloads
```

## Config / 配置

Edit `~/.config/file-organizer.json` to customize:

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

## 💡 Future Plans / 未来计划
We're planning to add more features based on user feedback! If you have ideas or feature requests, please open a [GitHub Issue](https://github.com/luachuan/local-file-organization/issues)!

---

## License / 许可

MIT
