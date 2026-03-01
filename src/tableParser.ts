import { ScheduleEntry, IcsPluginSettings } from "./types";

const TIME_REGEX = /(\d{1,2}:\d{2})\s*[-~–—]\s*(\d{1,2}:\d{2})/;

function splitColumnNames(csv: string): string[] {
  return csv.split(",").map((s) => s.trim().toLowerCase());
}

function findColumnIndex(
  headers: string[],
  aliases: string[]
): number {
  return headers.findIndex((h) =>
    aliases.includes(h.trim().toLowerCase())
  );
}

function parseCells(row: string): string[] {
  return row
    .split("|")
    .map((c) => c.trim())
    .filter((_, i, arr) => i > 0 && i < arr.length);
}

function isSeparatorRow(line: string): boolean {
  return /^\|[\s:-]+\|/.test(line.trim());
}

export function parseScheduleTable(
  markdown: string,
  settings: IcsPluginSettings
): ScheduleEntry[] {
  const timeAliases = splitColumnNames(settings.timeColumnNames);
  const taskAliases = splitColumnNames(settings.taskColumnNames);
  const noteAliases = splitColumnNames(settings.noteColumnNames);

  const lines = markdown.split("\n");
  const entries: ScheduleEntry[] = [];

  let i = 0;
  while (i < lines.length) {
    const line = lines[i].trim();

    // Look for a table header row containing a time column
    if (!line.startsWith("|") || !line.endsWith("|")) {
      i++;
      continue;
    }

    const headers = parseCells(line);
    const timeIdx = findColumnIndex(headers, timeAliases);
    if (timeIdx === -1) {
      i++;
      continue;
    }
    const taskIdx = findColumnIndex(headers, taskAliases);
    const noteIdx = findColumnIndex(headers, noteAliases);

    // Skip separator row
    i++;
    if (i < lines.length && isSeparatorRow(lines[i])) {
      i++;
    }

    // Parse data rows
    while (i < lines.length) {
      const row = lines[i].trim();
      if (!row.startsWith("|") || !row.endsWith("|")) break;
      if (isSeparatorRow(row)) break;

      const cells = parseCells(row);
      const timeCell = cells[timeIdx] || "";
      const match = TIME_REGEX.exec(timeCell);

      if (match) {
        entries.push({
          startTime: match[1],
          endTime: match[2],
          summary: taskIdx >= 0 ? (cells[taskIdx] || "").trim() : "",
          description: noteIdx >= 0 ? (cells[noteIdx] || "").trim() : "",
        });
      }
      i++;
    }
    continue;
  }

  return entries;
}
