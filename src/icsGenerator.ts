import { ScheduleEntry } from "./types";

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

function formatDateIcs(date: Date): string {
  return (
    date.getFullYear().toString() +
    pad2(date.getMonth() + 1) +
    pad2(date.getDate())
  );
}

function escapeIcsText(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

/**
 * Fold lines longer than 75 octets per RFC 5545.
 * Continuation lines start with a single space.
 */
function foldLine(line: string): string {
  const bytes = new TextEncoder().encode(line);
  if (bytes.length <= 75) return line;

  const parts: string[] = [];
  let start = 0;
  let limit = 75;

  while (start < bytes.length) {
    const chunk = bytes.slice(start, start + limit);
    parts.push(new TextDecoder().decode(chunk));
    start += limit;
    limit = 74; // subsequent lines: 1 space + 74 bytes
  }

  return parts.join("\r\n ");
}

export function generateIcs(
  entries: ScheduleEntry[],
  date: Date,
  calendarName: string
): string {
  const dateStr = formatDateIcs(date);

  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//ics4obsidian//EN",
    `X-WR-CALNAME:${calendarName}`,
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
  ];

  for (const entry of entries) {
    const startHHMM = entry.startTime.replace(":", "");
    const endHHMM = entry.endTime.replace(":", "");
    const uid = `${dateStr}T${startHHMM}00@ics4obsidian`;

    // Handle overnight events (endTime < startTime)
    let endDateStr = dateStr;
    if (entry.endTime < entry.startTime) {
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      endDateStr = formatDateIcs(nextDay);
    }

    lines.push(
      "BEGIN:VEVENT",
      foldLine(`UID:${uid}`),
      `DTSTART:${dateStr}T${startHHMM}00`,
      `DTEND:${endDateStr}T${endHHMM}00`,
      foldLine(`SUMMARY:${escapeIcsText(entry.summary)}`)
    );
    if (entry.description) {
      lines.push(
        foldLine(`DESCRIPTION:${escapeIcsText(entry.description)}`)
      );
    }
    lines.push("END:VEVENT");
  }

  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}
