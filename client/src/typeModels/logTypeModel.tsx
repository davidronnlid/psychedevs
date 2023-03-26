export interface LogType {
  name: string;
  answer_format: string;
  logType_id?: string;
  weekdays: boolean[];
}

export type FetchLogTypesResult = {
  success: boolean;
  data: LogType[] | null;
  error: string | null;
};

export interface AnswerFormat extends Pick<LogType, "answer_format"> {}
