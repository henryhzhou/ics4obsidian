# ics4obsidian

An Obsidian plugin that exports daily schedule tables (in Markdown format) to .ics calendar files, with support for email sending and auto-deletion.

## Features

- Parse schedule tables from Obsidian notes
- Export to RFC 5545 standard .ics files
- Send .ics files via SMTP email
- Auto-delete .ics files after email send
- Flexible column name configuration and date recognition

## Installation

1. Clone the repository:

```bash
git clone https://github.com/henryhzhou/ics4obsidian.git
cd ics4obsidian
```

2. Install dependencies:

```bash
npm install
```

3. Build the project:

```bash
npm run build
```

4. Copy to your Obsidian vault:

```bash
cp main.js manifest.json /path/to/your/vault/.obsidian/plugins/ics4obsidian/
```

5. Enable the plugin in Obsidian

## Usage

### Create a Schedule Table

Add a table to your note with time, task, and optional note columns:

| Time        | Task            | Note      |
| ----------- | --------------- | --------- |
| 8:00-9:00   | Morning meeting | Online    |
| 9:00-10:30  | Development     | Feature A |
| 14:00-15:00 | Code review     | PR #123   |

### Export

1. Open command palette (Ctrl/Cmd + P)
2. Run "Export schedule to ICS"
3. Select export location
4. .ics file is created in your vault

## Configuration

Configure in plugin settings:

- **Column names**: Customize time, task, and note column names
- **Calendar name**: Name for exported calendar
- **Export path**: Location to save .ics files
- **Date format**: Pattern for recognizing dates in notes
- **SMTP settings**: Email server configuration (host, port, username, password, recipient)
- **Auto-send**: Automatically send .ics via email
- **Auto-delete**: Delete .ics file after successful send

## Table Format

- **Time column** (default: Time): Format as `HH:MM-HH:MM` or `HH:MM ~ HH:MM`
- **Task column** (default: Task): Event name
- **Note column** (default: Note): Event description

## Date Recognition

Plugin recognizes dates in this order:

1. `date` field in note frontmatter
2. Date in filename (e.g., `2026-03-01.md`)
3. Current date

## Development

Build with sourcemap for debugging:

```bash
npm run dev
```

## Project Structure

```
src/
  main.ts          → Plugin entry, commands, export flow
  settings.ts      → Settings UI
  tableParser.ts   → Markdown table parsing
  icsGenerator.ts  → ICS file generation
  dateResolver.ts  → Date recognition
  emailSender.ts   → Email sending
  types.ts         → Type definitions
```

## License

MIT
