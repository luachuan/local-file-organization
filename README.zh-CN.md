
# Local File Organizer

你的文件值得更好的对待。

---

## 问题

你的 Downloads 文件夹乱成一团。你找不到上个月的那张照片。你需要的 PDF 被埋在 300 个其他文件下面。

你试过其他工具。它们要你写 50 行配置。它们要把你的文件上传到云端。它们要你花一个小时学习怎么用。

这还不够好。

---

## 解决方案

Local File Organizer。简单。本地。搞定。

### 零配置。

一个命令。就这么多。不用写配置文件。不用设置选项。只需整理。

### 100% 本地。

你的文件永远不会离开你的机器。一个字节都不会。没有云端。没有账号。只有你和你的文件。

### 撤销只需一键。

人都会犯错。一个命令，就像什么都没发生过。

---

## 快速开始

### 安装

```bash
git clone https://github.com/luachuan/local-file-organization.git &amp;&amp; cd local-file-organization &amp;&amp; chmod +x index.js
```

### 使用

```bash
./index.js organize --type ~/Downloads
```

就这么多。你的 Downloads 文件夹已经整理好了。

---

## 功能

- 按类型整理（图片/文档/视频/代码/音频/其他）
- 按日期整理（年/月）
- 删除重复文件（基于哈希）
- 预览模式（先看会做什么，不实际执行）
- 撤销（一键撤销最后一次操作）
- 监控模式（监控文件夹，自动整理新文件）
- 配置文件（在 ~/.config/file-organizer.json 自定义）
- 100% 本地（不上云，不泄露数据）

---

## 详细配置

对于想要更多控制的高级用户，编辑 `~/.config/file-organizer.json`：

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

## 更多命令

```bash
# 预览按类型整理（不实际执行）
./index.js organize --type --preview ~/Downloads

# 按日期整理
./index.js organize --date ~/Downloads

# 预览删除重复文件
./index.js dedupe --preview ~/Downloads

# 实际删除重复文件
./index.js dedupe ~/Downloads

# 撤销最后一次操作
./index.js undo

# 生成整理报告
./index.js report ~/Downloads

# 初始化配置（可选，高级用户）
./index.js config --init

# 查看当前配置
./index.js config

# 监控文件夹，自动按类型整理
./index.js watch ~/Downloads

# 监控文件夹，自动按日期整理
./index.js watch --date ~/Downloads
```

---

## 未来计划

我们在做重要的事。如果你有想法，提个 Issue。

---

## 许可

MIT

---

---

For English version, see [README.md](README.md).
