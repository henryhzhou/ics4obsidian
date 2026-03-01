# ics4obsidian

一个Obsidian插件，用于将Markdown表格格式的日程表导出为.ics日历文件，支持邮件发送和自动删除。

## 功能

- 📅 从Obsidian笔记中解析日程表（Markdown表格格式）
- 📤 导出为RFC 5545标准的.ics文件
- 📧 支持通过SMTP邮件发送.ics文件
- 🗑️ 邮件发送后自动删除.ics文件
- ⚙️ 灵活的列名配置和日期识别

## 安装

### 方式一：从发布版本安装

1. 下载最新版本的 `main.js` 和 `manifest.json`
2. 在你的Obsidian vault中创建目录：`.obsidian/plugins/ics4obsidian/`
3. 将 `main.js` 和 `manifest.json` 复制到该目录
4. 在Obsidian中启用插件

### 方式二：从源代码构建

1. 克隆本仓库：
```bash
git clone https://github.com/henryhzhou/ics4obsidian.git
cd ics4obsidian
```

2. 安装依赖：
```bash
npm install
```

3. 构建项目：
```bash
npm run build
```

4. 复制构建输出到Obsidian：
```bash
cp main.js manifest.json /path/to/your/vault/.obsidian/plugins/ics4obsidian/
```

## 使用方法

### 基本用法

1. 在Obsidian笔记中创建日程表，格式如下：

| 时间 | 任务 | 备注 |
|------|------|------|
| 8:00-9:00 | 晨会 | 线上会议 |
| 9:00-10:30 | 项目开发 | 完成功能A |
| 14:00-15:00 | 代码审查 | 审查PR #123 |

2. 打开命令面板（Ctrl/Cmd + P）
3. 搜索并运行 "Export schedule to ICS"
4. 选择导出位置
5. .ics文件将被创建到你的vault中

### 配置

在插件设置中可以配置：

- **列名别名**：自定义时间、任务、备注列的列名
- **日历名称**：导出的日历名称
- **导出路径**：.ics文件的保存位置
- **日期格式**：识别笔记中的日期格式
- **SMTP设置**：邮件发送的服务器配置
- **自动发送**：启用后自动通过邮件发送.ics
- **自动删除**：邮件发送后自动删除.ics文件

## 表格格式要求

- 表格必须包含**时间列**（默认列名：Time、时间）
- 时间格式：`HH:MM-HH:MM` 或 `HH:MM ~ HH:MM`（支持多种分隔符）
- 可选的**任务列**（默认列名：Task、任务）
- 可选的**备注列**（默认列名：Note、备注）

## 日期识别

插件按以下优先级识别日期：

1. 笔记的frontmatter中的 `date` 字段
2. 笔记文件名中的日期（如 `2026-03-01.md`）
3. 当前日期

## 邮件配置

如果启用邮件功能，需要配置SMTP服务器：

- **主机**：SMTP服务器地址（如 `smtp.gmail.com`）
- **端口**：通常为 `587`（TLS）或 `465`（SSL）
- **用户名**：邮箱地址
- **密码**：应用专用密码（不是邮箱密码）
- **收件人**：接收.ics文件的邮箱地址

## 开发

### 开发构建

```bash
npm run dev
```

生成带sourcemap的构建文件，便于调试。

### 项目结构

```
src/
  main.ts          → 插件入口、命令、导出流程
  settings.ts      → 设置界面
  tableParser.ts   → Markdown表格解析
  icsGenerator.ts  → ICS文件生成
  dateResolver.ts  → 日期识别
  emailSender.ts   → 邮件发送
  types.ts         → 类型定义
```

## 技术细节

- **ICS标准**：RFC 5545
- **时间格式**：本地时间（无Z后缀），由设备时区解释
- **UID生成**：确定性UID，重新导出会更新而非重复事件
- **行尾**：CRLF格式，符合RFC 5545规范
- **依赖**：仅运行时依赖nodemailer，插件为桌面版专用

## 许可证

MIT

## 反馈与贡献

欢迎提交Issue和Pull Request！
