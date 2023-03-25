export interface LogType {
  name: string;
  answer_format: string;
}

export type FetchLogTypesResult = {
  success: boolean;
  data: LogType[] | null;
  error: string | null;
};
