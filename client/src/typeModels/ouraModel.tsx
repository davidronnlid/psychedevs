export interface OuraResponseData {
  daily_activity: {
    data: DailyActivity[];
  };
  sleep: {
    data: SleepData[];
  };
}

export interface OuraLogTypeCategoriesResponseData {
  daily_activity: boolean;
  sleep: boolean;
}

export interface OuraLogType {
  logTypeName: string;
  unit: string;
}

export interface OuraLogTypesResponseData {
  daily_activity: OuraLogType[] | null;
  sleep: OuraLogType[] | null;
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
