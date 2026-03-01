import * as nodemailer from "nodemailer";
import { IcsPluginSettings } from "./types";

export async function sendIcsEmail(
  icsContent: string,
  filename: string,
  dateStr: string,
  settings: IcsPluginSettings
): Promise<void> {
  const transporter = nodemailer.createTransport({
    host: settings.smtpHost,
    port: settings.smtpPort,
    secure: settings.smtpPort === 465,
    auth: {
      user: settings.smtpUser,
      pass: settings.smtpPass,
    },
  });

  await transporter.sendMail({
    from: settings.smtpUser,
    to: settings.recipientEmail,
    subject: `Daily Schedule - ${dateStr}`,
    text: `Your schedule for ${dateStr} is attached.`,
    attachments: [
      {
        filename,
        content: icsContent,
        contentType: "text/calendar",
      },
    ],
  });
}
