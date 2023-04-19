import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import {
  OuraResponseData,
  SleepData,
  DailyActivity,
} from "../../../typeModels/ouraModel";

interface OuraState {
  ouraData: OuraResponseData;
}

const initialState: OuraState = {
  ouraData: {
    daily_activity: { data: [] },
    sleep: { data: [] },
  },
};

const ouraSlice = createSlice({
  name: "ouraLogs",
  initialState,
  reducers: {
    setDailyActivity: (state, action: PayloadAction<DailyActivity[]>) => {
      state.ouraData.daily_activity.data = action.payload;
    },
    setSleep: (state, action: PayloadAction<SleepData[]>) => {
      state.ouraData.sleep.data = action.payload;
    },
    setOuraLogsData: (state, action: PayloadAction<OuraResponseData>) => {
      state.ouraData = action.payload;
    },
  },
});

export const selectDailyActivity = (state: RootState) =>
  state.ouraLogs.ouraData.daily_activity.data;
export const selectSleep = (state: RootState) =>
  state.ouraLogs.ouraData.sleep.data;
export const selectOuraLogsData = (state: RootState) => state.ouraLogs.ouraData;

export const { setDailyActivity, setSleep, setOuraLogsData } =
  ouraSlice.actions;
export default ouraSlice.reducer;
