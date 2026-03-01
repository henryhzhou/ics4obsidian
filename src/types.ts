export interface ScheduleEntry {
  startTime: string;   // "08:00"
  endTime: string;     // "09:00"
  summary: string;     // "通勤"
  description: string; // "高等数学第三章"
}

export interface IcsPluginSettings {
  dateFormat: string;
  timeColumnNames: string;
  taskColumnNames: string;
  noteColumnNames: string;
  calendarName: string;
  useNoteDateOverToday: boolean;
  exportPath: string;
  // Email settings
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPass: string;
  recipientEmail: string;
  autoSendEmail: boolean;
  autoDeleteAfterSend: boolean;
}

export const DEFAULT_SETTINGS: IcsPluginSettings = {
  dateFormat: "YYYY-MM-DD",
  timeColumnNames: "时间,Time,time,时间段",
  taskColumnNames: "事项,Task,task,Event,活动,内容",
  noteColumnNames: "备注,Note,note,Description,描述",
  calendarName: "Daily Schedule",
  useNoteDateOverToday: true,
  exportPath: "",
  smtpHost: "",
  smtpPort: 465,
  smtpUser: "",
  smtpPass: "",
  recipientEmail: "",
  autoSendEmail: false,
  autoDeleteAfterSend: true,
};
