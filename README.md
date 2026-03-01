# ics4obsidian

一个Obsidian插件，用于将Markdown表格格式的日程表导出为.ics日历文件，支持邮件发送和自动删除。

An Obsidian plugin that exports daily schedule tables (in Markdown format) to .ics calendar files, with support for email sending and auto-deletion.

---

## 功能 / Features

- 📅 从Obsidian笔记中解析日程表（Markdown表格格式）/ Parse schedule tables from Obsidian notes (Markdown table format)
- 📤 导出为RFC 5545标准的.ics文件 / Export to RFC 5545 standard .ics files
- 📧 支持通过SMTP邮件发送.ics文件 / Send .ics files via SMTP email
- 🗑️ 邮件发送后自动删除.ics文件 / Auto-delete .ics files after email send
- ⚙️ 灵活的列名配置和日期识别 / Flexible column name configuration and date recognition

## 安装 / Installation

### 方式一 / Option 1: 从发布版本安装 / Install from Release

1. 下载最新版本的 `main.js` 和 `manifest.json` / Download the latest `main.js` and `manifest.json`
2. 在你的Obsidian vault中创建目录：`.obsidian/plugins/ics4obsidian/` / Create directory in your Obsidian vault: `.obsidian/plugins/ics4obsidian/`
3. 将 `main.js` 和 `manifest.json` 复制到该目录 / Copy `main.js` and `manifest.json` to that directory
4. 在Obsidian中启用插件 / Enable the plugin in Obsidian

### 方式二 / Option 2: 从源代码构建 / Build from Source

1. 克隆本仓库 / Clone the repository:
```bash
git clone https://github.com/henryhzhou/ics4obsidian.git
cd ics4obsidian
```

2. 安装依赖 / Install dependencies:
```bash
npm install
```

3. 构建项目 / Build the project:
```bash
npm run build
```

4. 复制构建输出到Obsidian / Copy build output to Obsidian:
```bash
cp main.js manifest.json /path/to/your/vault/.obsidian/plugins/ics4obsidian/
```

## 使用方法 / Usage

### 基本用法 / Basic Usage

1. 在Obsidian笔记中创建日程表，格式如下 / Create a schedule table in your Obsidian note:

| 时间 / Time | 任务 / Task | 备注 / Note |
|------|------|------|
| 8:00-9:00 | 晨会 / Morning meeting | 线上会议 / Online call |
| 9:00-10:30 | 项目开发 / Development | 完成功能A / Complete feature A |
| 14:00-15:00 | 代码审查 / Code review | 审查PR #123 / Review PR #123 |

2. 打开命令面板 / Open command palette (Ctrl/Cmd + P)
3. 搜索并运行 "Export schedule to ICS" / Search and run "Export schedule to ICS"
4. 选择导出位置 / Select export location
5. .ics文件将被创建到你的vault中 / .ics file will be created in your vault

### 配置 / Configuration

在插件设置中可以配置 / Configure in plugin settings:

- **列名别名 / Column name aliases**: 自定义时间、任务、备注列的列名 / Customize time, task, and note column names
- **日历名称 / Calendar name**: 导出的日历名称 / Name for exported calendar
- **导出路径 / Export path**: .ics文件的保存位置 / Location to save .ics files
- **日期格式 / Date format**: 识别笔记中的日期格式 / Pattern for recognizing dates in notes
- **SMTP设置 / SMTP settings**: 邮件发送的服务器配置 / Email server configuration
- **自动发送 / Auto-send**: 启用后自动通过邮件发送.ics / Automatically send .ics via email
- **自动删除 / Auto-delete**: 邮件发送后自动删除.ics文件 / Delete .ics file after successful send

## 表格格式要求 / Table Format Requirements

- 表格必须包含**时间列** / Table must contain **time column** (默认列名 / default names: Time、时间)
- 时间格式 / Time format: `HH:MM-HH:MM` 或 / or `HH:MM ~ HH:MM`（支持多种分隔符 / supports various separators）
- 可选的**任务列** / Optional **task column** (默认列名 / default names: Task、任务)
- 可选的**备注列** / Optional **note column** (默认列名 / default names: Note、备注)

## 日期识别 / Date Recognition

插件按以下优先级识别日期 / Plugin recognizes dates in this priority order:

1. 笔记的frontmatter中的 `date` 字段 / `date` field in note frontmatter
2. 笔记文件名中的日期 / Date in filename (如 / e.g., `2026-03-01.md`)
3. 当前日期 / Current date

## 邮件配置 / Email Configuration

如果启用邮件功能，需要配置SMTP服务器 / To enable email functionality, configure SMTP server:

- **主机 / Host**: SMTP服务器地址 / SMTP server address (如 / e.g., `smtp.gmail.com`)
- **端口 / Port**: 通常为 / Usually `587`（TLS）或 / or `465`（SSL）
- **用户名 / Username**: 邮箱地址 / Email address
- **密码 / Password**: 应用专用密码 / App-specific password（不是邮箱密码 / not your email password）
- **收件人 / Recipient**: 接收.ics文件的邮箱地址 / Email address to receive .ics files

## 开发 / Development

### 开发构建 / Development Build

```bash
npm run dev
```

生成带sourcemap的构建文件，便于调试 / Generate build with sourcemap for debugging.

### 项目结构 / Project Structure

```
src/
  main.ts          → 插件入口、命令、导出流程 / Plugin entry, commands, export flow
  settings.ts      → 设置界面 / Settings UI
  tableParser.ts   → Markdown表格解析 / Markdown table parsing
  icsGenerator.ts  → ICS文件生成 / ICS file generation
  dateResolver.ts  → 日期识别 / Date recognition
  emailSender.ts   → 邮件发送 / Email sending
  types.ts         → 类型定义 / Type definitions
```

## 技术细节 / Technical Details

- **ICS标准 / ICS Standard**: RFC 5545
- **时间格式 / Time Format**: 本地时间（无Z后缀），由设备时区解释 / Local time (no "Z" suffix), interpreted in device timezone
- **UID生成 / UID Generation**: 确定性UID，重新导出会更新而非重复事件 / Deterministic UIDs, re-export updates rather than duplicates events
- **行尾 / Line Endings**: CRLF格式，符合RFC 5545规范 / CRLF format, RFC 5545 compliant
- **依赖 / Dependencies**: 仅运行时依赖nodemailer，插件为桌面版专用 / Runtime dependency on nodemailer only, desktop-only plugin

## 许可证 / License

MIT

## 反馈与贡献 / Feedback & Contributions

欢迎提交Issue和Pull Request / Issues and Pull Requests are welcome!
