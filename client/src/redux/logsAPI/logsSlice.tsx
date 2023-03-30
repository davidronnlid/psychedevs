import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Log } from "../../typeModels/logTypeModel";
import { RootState } from "../store";

interface LogsState {
  logs: Log[];
}

const initialState: LogsState = {
  logs: [],
};

const logsSlice = createSlice({
  name: "logs",
  initialState,
  reducers: {
    setLogs: (state, action: PayloadAction<Log[]>) => {
      state.logs = [...action.payload];
    },
    addLog: (state, action: PayloadAction<Log>) => {
      state.logs.push(action.payload);
    },
    updateLog: (state, action: PayloadAction<Log>) => {
      const logToUpdate = state.logs.find(
        (log) => log._id === action.payload._id
      );
      if (logToUpdate) {
        Object.assign(logToUpdate, action.payload);
      }
    },
    deleteLog: (state, action: PayloadAction<string>) => {
      const index = state.logs.findIndex((log) => log._id === action.payload);
      if (index !== -1) {
        state.logs.splice(index, 1);
      }
    },
  },
});

export const selectLogs = (state: RootState) => state.logs.logs;

export const { setLogs, addLog, updateLog, deleteLog } = logsSlice.actions;
export default logsSlice.reducer;
