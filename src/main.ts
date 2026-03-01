import { MarkdownView, Notice, Plugin } from "obsidian";
import { IcsPluginSettings, DEFAULT_SETTINGS } from "./types";
import { IcsSettingTab } from "./settings";
import { parseScheduleTable } from "./tableParser";
import { generateIcs } from "./icsGenerator";
import { resolveDate } from "./dateResolver";
import { sendIcsEmail } from "./emailSender";

export default class IcsPlugin extends Plugin {
  settings: IcsPluginSettings = DEFAULT_SETTINGS;

  async onload() {
    await this.loadSettings();

    this.addRibbonIcon(
      "calendar-plus",
      "Export schedule to ICS",
      () => this.exportSchedule()
    );

    this.addCommand({
      id: "export-schedule-ics",
      name: "Export schedule to ICS",
      checkCallback: (checking: boolean) => {
        const view =
          this.app.workspace.getActiveViewOfType(MarkdownView);
        if (view) {
          if (!checking) this.exportSchedule();
          return true;
        }
        return false;
      },
    });

    this.addSettingTab(new IcsSettingTab(this.app, this));
  }

  async exportSchedule() {
    const view =
      this.app.workspace.getActiveViewOfType(MarkdownView);
    if (!view || !view.file) {
      new Notice("No active note");
      return;
    }

    const file = view.file;
    const content = await this.app.vault.read(file);

    const entries = parseScheduleTable(content, this.settings);
    if (entries.length === 0) {
      new Notice("No schedule table found in this note");
      return;
    }

    const date = resolveDate(file, this.app, this.settings);
    const icsContent = generateIcs(
      entries,
      date,
      this.settings.calendarName
    );

    // Build output path
    const pad2 = (n: number) => String(n).padStart(2, "0");
    const dateStr = `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
    const dir = this.settings.exportPath
      ? this.settings.exportPath.replace(/\/+$/, "")
      : "";
    const icsPath = dir
      ? `${dir}/${dateStr}.ics`
      : `${dateStr}.ics`;

    // Ensure directory exists
    if (dir) {
      const adapter = this.app.vault.adapter;
      if (!(await adapter.exists(dir))) {
        await adapter.mkdir(dir);
      }
    }

    // Write or overwrite the .ics file
    const adapter = this.app.vault.adapter;
    await adapter.write(icsPath, icsContent);

    new Notice(`Exported ${entries.length} events to ${icsPath}`);

    // Send email if configured
    if (this.settings.autoSendEmail) {
      if (!this.settings.smtpHost || !this.settings.recipientEmail) {
        new Notice("Email not configured — check plugin settings");
        return;
      }
      try {
        const filename = `${dateStr}.ics`;
        await sendIcsEmail(icsContent, filename, dateStr, this.settings);
        new Notice(`Email sent to ${this.settings.recipientEmail}`);

        // Delete .ics file after successful send
        if (this.settings.autoDeleteAfterSend) {
          await adapter.remove(icsPath);
          new Notice(`Deleted ${icsPath}`);
        }
      } catch (err) {
        new Notice(`Email failed: ${err instanceof Error ? err.message : err}`);
      }
    }
  }

  async loadSettings() {
    this.settings = Object.assign(
      {},
      DEFAULT_SETTINGS,
      await this.loadData()
    );
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}
