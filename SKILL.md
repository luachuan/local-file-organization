---
name: local-file-organizer
description: "本地文件整理助手 - 按类型/日期整理文件，删除重复项，支持预览和撤销！纯本地运行，保护隐私！"
---

# 本地文件整理助手 🗂️

## 功能
- ✅ 按文件类型整理（图片/文档/视频/代码/其他）
- ✅ 按日期整理（年/月）
- ✅ 删除重复文件（基于哈希）
- ✅ **预览模式**（先看会做什么，不实际执行）
- ✅ **撤销功能**（记录操作，可一键撤销）
- ✅ **配置文件**（~/.config/file-organizer.json）
- ✅ 生成整理报告

## 快速开始
```bash
# 预览按类型整理（不实际执行）
node index.js organize --type --preview ./

# 实际按类型整理
node index.js organize --type ./

# 预览按日期整理
node index.js organize --date --preview ./

# 实际按日期整理
node index.js organize --date ./

# 预览删除重复文件
node index.js dedupe --preview ./

# 实际删除重复文件
node index.js dedupe ./

# 撤销最后一次操作
node index.js undo

# 生成整理报告
node index.js report ./

# 初始化配置文件
node index.js config --init

# 查看当前配置
node index.js config
```

## 配置
编辑 `~/.config/file-organizer.json` 自定义文件类型映射和目标文件夹。

## 许可证
MIT
