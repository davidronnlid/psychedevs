import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LogType } from "../typeModels/logTypeModel";
import { RootState } from "./store";

interface LogTypesState {
  logTypes: LogType[];
}

const initialState: LogTypesState = {
  logTypes: [],
};

const logTypesSlice = createSlice({
  name: "logTypes",
  initialState,
  reducers: {
    setLogTypes: (state, action: PayloadAction<LogType[]>) => {
      state.logTypes = [...action.payload];
    },
  },
});

export const selectLogTypes = (state: RootState) => state.logTypes.logTypes;

export const { setLogTypes } = logTypesSlice.actions;
export default logTypesSlice.reducer;
