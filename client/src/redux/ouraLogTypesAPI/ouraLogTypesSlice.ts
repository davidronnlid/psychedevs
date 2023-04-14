import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import {
  OuraResponseData,
  SleepData,
  DailyActivity,
  DailyReadiness,
  DailySleep,
  Heartrate,
} from "../../typeModels/ouraModel";

interface OuraState {
  ouraData: OuraResponseData;
}

const initialState: OuraState = {
  ouraData: {
    daily_activity: { data: [] },
    sleep: { data: [] },
    daily_readiness: { data: [] },
    daily_sleep: { data: [] },
    heartrate: { data: [] },
  },
};

const ouraSlice = createSlice({
  name: "oura",
  initialState,
  reducers: {
    setDailyActivity: (state, action: PayloadAction<DailyActivity[]>) => {
      state.ouraData.daily_activity.data = action.payload;
    },
    setSleep: (state, action: PayloadAction<SleepData[]>) => {
      state.ouraData.sleep.data = action.payload;
    },
    setDailyReadiness: (state, action: PayloadAction<DailyReadiness[]>) => {
      state.ouraData.daily_readiness.data = action.payload;
    },
    setDailySleep: (state, action: PayloadAction<DailySleep[]>) => {
      state.ouraData.daily_sleep.data = action.payload;
    },
    setHeartrate: (state, action: PayloadAction<Heartrate[]>) => {
      state.ouraData.heartrate.data = action.payload;
    },
    setOuraData: (state, action: PayloadAction<OuraResponseData>) => {
      state.ouraData = action.payload;
    },
  },
});

export const selectDailyActivity = (state: RootState) =>
  state.oura.ouraData.daily_activity.data;
export const selectSleep = (state: RootState) => state.oura.ouraData.sleep.data;
export const selectDailyReadiness = (state: RootState) =>
  state.oura.ouraData.daily_readiness.data;
export const selectDailySleep = (state: RootState) =>
  state.oura.ouraData.daily_sleep.data;
export const selectHeartrate = (state: RootState) =>
  state.oura.ouraData.heartrate.data;
export const selectOuraData = (state: RootState) => state.oura.ouraData;

export const {
  setDailyActivity,
  setSleep,
  setDailyReadiness,
  setDailySleep,
  setHeartrate,
  setOuraData,
} = ouraSlice.actions;
export default ouraSlice.reducer;
