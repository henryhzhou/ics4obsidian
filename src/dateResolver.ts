import { App, TFile } from "obsidian";
import { IcsPluginSettings } from "./types";

/**
 * Resolve the target date for a schedule note.
 * Priority: frontmatter "date" → filename date → today
 */
export function resolveDate(
  file: TFile,
  app: App,
  settings: IcsPluginSettings
): Date {
  // 1. Frontmatter date field
  const cache = app.metadataCache.getFileCache(file);
  if (cache?.frontmatter?.date) {
    const parsed = new Date(cache.frontmatter.date);
    if (!isNaN(parsed.getTime())) return parsed;
  }

  // 2. Extract date from filename
  if (settings.useNoteDateOverToday) {
    const dateFromName = parseDateFromFilename(
      file.basename,
      settings.dateFormat
    );
    if (dateFromName) return dateFromName;
  }

  // 3. Fallback to today
  return new Date();
}

function parseDateFromFilename(
  basename: string,
  format: string
): Date | null {
  // Build regex from format string
  const pattern = format
    .replace("YYYY", "(\\d{4})")
    .replace("MM", "(\\d{2})")
    .replace("DD", "(\\d{2})");

  const regex = new RegExp(pattern);
  const match = regex.exec(basename);
  if (!match) return null;

  // Determine capture group order from format
  const parts = format.match(/(YYYY|MM|DD)/g);
  if (!parts || parts.length < 3) return null;

  const values: Record<string, number> = {};
  parts.forEach((p, idx) => {
    values[p] = parseInt(match[idx + 1], 10);
  });

  const d = new Date(values["YYYY"], values["MM"] - 1, values["DD"]);
  return isNaN(d.getTime()) ? null : d;
}
