# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ics4obsidian is an Obsidian plugin (desktop-only) that parses daily schedule tables (Markdown table format) from notes, exports them as .ics files, optionally emails them via SMTP, and auto-deletes the .ics after send.

## Build & Dev Commands

```bash
npm install          # install dependencies
npm run build        # production build (minified, no sourcemap)
npm run dev          # development build (with inline sourcemap)
```

Build output: `main.js` in project root. Deploy by copying `main.js` + `manifest.json` to vault's `.obsidian/plugins/ics4obsidian/`.

## Architecture

```
src/
  main.ts          → Plugin entry: commands, ribbon icon, export flow orchestration
  settings.ts      → Settings tab UI (imports IcsPlugin type from main.ts)
  tableParser.ts   → Markdown table → ScheduleEntry[] (pure function, no Obsidian deps)
  icsGenerator.ts  → ScheduleEntry[] + Date → RFC 5545 ICS string (pure function)
  dateResolver.ts  → Resolves target date: frontmatter → filename → today fallback
  emailSender.ts   → Sends .ics as email attachment via nodemailer SMTP
  types.ts         → ScheduleEntry interface, IcsPluginSettings interface, DEFAULT_SETTINGS
```

Data flow: `main.ts:exportSchedule()` reads active note → `tableParser` extracts entries → `dateResolver` determines date → `icsGenerator` produces ICS → writes to vault → (if autoSendEmail) `emailSender` sends via SMTP → (if autoDeleteAfterSend) deletes .ics from vault.

## Key Design Decisions

- ICS strings are built manually (no ical-generator dependency) since we only need VEVENT with DTSTART/DTEND/SUMMARY/DESCRIPTION
- DTSTART/DTEND use local time (no "Z" suffix) so Apple Calendar interprets them in device timezone
- Column name matching is case-insensitive and configurable via comma-separated aliases in settings
- Time parsing regex: `/(\d{1,2}:\d{2})\s*[-~–—]\s*(\d{1,2}:\d{2})/` handles `8:00-9:00`, `08:00 ~ 09:00`, etc.
- UIDs are deterministic (`{date}T{startTime}@ics4obsidian`) so re-exporting updates rather than duplicates events
- RFC 5545 compliance: CRLF line endings, text escaping (backslash, semicolon, comma), 75-octet line folding
- Email via nodemailer (only runtime dependency); plugin is desktop-only (isDesktopOnly: true) since nodemailer needs Node.js
- Email send is fire-and-forget per export; .ics file is deleted only after successful send

## Settings (stored in plugin data.json)

Configurable column name aliases (timeColumnNames, taskColumnNames, noteColumnNames), calendar name, export path, date format pattern, whether to prefer note date over today, and SMTP email settings (host, port, user, password, recipient, auto-send toggle, auto-delete toggle). SMTP password is stored in plaintext in data.json — use app-specific passwords.
