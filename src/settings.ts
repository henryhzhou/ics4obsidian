import { App, PluginSettingTab, Setting } from "obsidian";
import type IcsPlugin from "./main";
import { DEFAULT_SETTINGS } from "./types";

export class IcsSettingTab extends PluginSettingTab {
  plugin: IcsPlugin;

  constructor(app: App, plugin: IcsPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    new Setting(containerEl)
      .setName("Calendar name")
      .setDesc("Name shown in Apple Calendar")
      .addText((text) =>
        text
          .setPlaceholder(DEFAULT_SETTINGS.calendarName)
          .setValue(this.plugin.settings.calendarName)
          .onChange(async (value) => {
            this.plugin.settings.calendarName = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Export path")
      .setDesc(
        "Subfolder in vault for .ics files (empty = vault root)"
      )
      .addText((text) =>
        text
          .setPlaceholder("")
          .setValue(this.plugin.settings.exportPath)
          .onChange(async (value) => {
            this.plugin.settings.exportPath = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Date format")
      .setDesc("Date pattern in note filenames")
      .addText((text) =>
        text
          .setPlaceholder(DEFAULT_SETTINGS.dateFormat)
          .setValue(this.plugin.settings.dateFormat)
          .onChange(async (value) => {
            this.plugin.settings.dateFormat = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Use note date over today")
      .setDesc("Prefer date from filename/frontmatter instead of today")
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.useNoteDateOverToday)
          .onChange(async (value) => {
            this.plugin.settings.useNoteDateOverToday = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Time column names")
      .setDesc("Comma-separated aliases for the time column header")
      .addText((text) =>
        text
          .setPlaceholder(DEFAULT_SETTINGS.timeColumnNames)
          .setValue(this.plugin.settings.timeColumnNames)
          .onChange(async (value) => {
            this.plugin.settings.timeColumnNames = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Task column names")
      .setDesc("Comma-separated aliases for the task column header")
      .addText((text) =>
        text
          .setPlaceholder(DEFAULT_SETTINGS.taskColumnNames)
          .setValue(this.plugin.settings.taskColumnNames)
          .onChange(async (value) => {
            this.plugin.settings.taskColumnNames = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Note column names")
      .setDesc("Comma-separated aliases for the note/description column header")
      .addText((text) =>
        text
          .setPlaceholder(DEFAULT_SETTINGS.noteColumnNames)
          .setValue(this.plugin.settings.noteColumnNames)
          .onChange(async (value) => {
            this.plugin.settings.noteColumnNames = value;
            await this.plugin.saveSettings();
          })
      );

    // --- Email Settings ---
    containerEl.createEl("h3", { text: "Email" });

    new Setting(containerEl)
      .setName("Auto send email")
      .setDesc("Automatically send .ics file via email after export")
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.autoSendEmail)
          .onChange(async (value) => {
            this.plugin.settings.autoSendEmail = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Delete .ics after send")
      .setDesc("Remove the .ics file from vault after email is sent")
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.autoDeleteAfterSend)
          .onChange(async (value) => {
            this.plugin.settings.autoDeleteAfterSend = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("SMTP host")
      .setDesc("e.g. smtp.gmail.com, smtp.qq.com, smtp.163.com")
      .addText((text) =>
        text
          .setPlaceholder("smtp.gmail.com")
          .setValue(this.plugin.settings.smtpHost)
          .onChange(async (value) => {
            this.plugin.settings.smtpHost = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("SMTP port")
      .setDesc("465 (SSL) or 587 (TLS)")
      .addText((text) =>
        text
          .setPlaceholder("465")
          .setValue(String(this.plugin.settings.smtpPort))
          .onChange(async (value) => {
            this.plugin.settings.smtpPort = parseInt(value, 10) || 465;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("SMTP user")
      .setDesc("Your email address")
      .addText((text) =>
        text
          .setPlaceholder("you@example.com")
          .setValue(this.plugin.settings.smtpUser)
          .onChange(async (value) => {
            this.plugin.settings.smtpUser = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("SMTP password")
      .setDesc("App password or authorization code")
      .addText((text) => {
        text.inputEl.type = "password";
        text
          .setPlaceholder("••••••••")
          .setValue(this.plugin.settings.smtpPass)
          .onChange(async (value) => {
            this.plugin.settings.smtpPass = value;
            await this.plugin.saveSettings();
          });
      });

    new Setting(containerEl)
      .setName("Recipient email")
      .setDesc("Email address to receive the .ics file")
      .addText((text) =>
        text
          .setPlaceholder("phone@example.com")
          .setValue(this.plugin.settings.recipientEmail)
          .onChange(async (value) => {
            this.plugin.settings.recipientEmail = value;
            await this.plugin.saveSettings();
          })
      );
  }
}
