export interface SleepData {
  id: string;
  average_breath: number;
  average_heart_rate: number;
  average_hrv: number;
  awake_time: number;
  bedtime_end: string;
  bedtime_start: string;
  day: string;
  deep_sleep_duration: number;
  efficiency: number;
  heart_rate: {
    interval: number;
    items: number[];
    timestamp: string;
  };
  hrv: {
    interval: number;
    items: number[];
    timestamp: string;
  };
  latency: number;
  light_sleep_duration: number;
  low_battery_alert: boolean;
  lowest_heart_rate: number;
  movement_30_sec: string;
  period: number;
  readiness: {
    contributors: { [key: string]: number };
    score: number;
    temperature_deviation: number;
    temperature_trend_deviation: number;
  };
  readiness_score_delta: number;
  rem_sleep_duration: number;
  restless_periods: number;
  sleep_phase_5_min: string;
  sleep_score_delta: number;
  time_in_bed: number;
  total_sleep_duration: number;
  type: string;
  [key: string]: any;
}

export interface DailyActivity {
  active_calories: number;
  average_met_minutes: number;
  class_5_min: string;
  contributors: {
    meet_daily_targets: number;
    move_every_hour: number;
    recovery_time: number;
    stay_active: number;
    training_frequency: number;
    [key: string]: number;
  };
  day: string;
  equivalent_walking_distance: number;
  high_activity_met_minutes: number;
  high_activity_time: number;
  id: string;
  inactivity_alerts: number;
  low_activity_met_minutes: number;
  low_activity_time: number;
  medium_activity_met_minutes: number;
  medium_activity_time: number;
  met: {
    interval: number;
    items: number[];
    timestamp: string;
  };
  meters_to_target: number;
  non_wear_time: number;
  resting_time: number;
  score: number;
  sedentary_met_minutes: number;
  sedentary_time: number;
  steps: number;
  target_calories: number;
  target_meters: number;
  timestamp: string;
  total_calories: number;
}
