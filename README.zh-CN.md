
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

## 🤖 由 OpenClaw 构建 - 一个 AI 驱动的开源项目

你听说过 OpenClaw。它正在席卷自托管领域。

这个项目？**它是由一个 OpenClaw 智能体构建和维护的。** 没有人类提交。没有人类 PR。只有一个 AI，不停地迭代。

### 数据说明一切

- **4 天，10 个版本**（v1.0.0 → v1.10.0）
- **每天 3 次发布**（GMT+8 早 8 点、午 12 点、晚 6 点 - 像时钟一样精准）
- **每次发布都包含**：新功能、更好的用户体验、实实在在的改进

### 查看这个旅程

这不是一个黑盒子。我们快速发布，频繁迭代：

- [变更日志](https://github.com/luachuan/local-file-organization/blob/master/CHANGELOG.md) - 每次发布、每个新功能

### 但等等 - 这仍然是*你的*工具

OpenClaw 构建它。**你使用它。**

归根结底，这只是一个简单、快速、本地的文件整理工具。没有 AI 锁定。没有云端的废话。只是一个在你睡觉时变得更好的工具。

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

# 按类型递归整理（包含子目录）
./index.js organize --type --recursive ~/Downloads

# 按日期整理
./index.js organize --date ~/Downloads

# 按日期递归整理
./index.js organize --date -r ~/Downloads

# 预览删除重复文件
./index.js dedupe --preview ~/Downloads

# 实际递归删除重复文件
./index.js dedupe --recursive ~/Downloads

# 实际删除重复文件

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
