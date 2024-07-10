export interface WithingsResponseData {
  daily_activity: {
    data: DailyActivity[];
  };
  sleep: {
    data: SleepData[];
  };
}

export interface WithingsLogsDataByType {
  [logTypeId: string]: WithingsLog[];
}

export interface WithingsLog {
  id: string;
  day: string;
  [key: string]: number | any;
}

export interface WithingsLogTypeCategoriesResponseData {
  daily_activity: boolean;
  sleep: boolean;
}

export interface WithingsLogType {
  logTypeName: string;
  unit: string;
}

export interface WithingsLogTypesResponseData {
  daily_activity: WithingsLogType[] | null;
  sleep: WithingsLogType[] | null;
}

export interface SleepData {
  average_breath: number;
  average_heart_rate: number;
  average_hrv: number;
  awake_time: number;
  bedtime_end: string;
  bedtime_start: string;
  day: string;
  deep_sleep_duration: number;
  latency: number;
  light_sleep_duration: number;
  rem_sleep_duration: number;
  time_in_bed: number;
  total_sleep_duration: number;
  id: string;
}

export interface DailyActivity {
  day: string;
  active_calories: number;
  average_met_minutes: number;
  resting_time: number;
  steps: number;
  id: string;
}
