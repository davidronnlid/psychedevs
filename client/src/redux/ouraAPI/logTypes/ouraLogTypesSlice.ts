import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { OuraLogTypesResponseData } from "../../../typeModels/ouraModel";

interface OuraLogTypesState {
  ouraLogTypes: OuraLogTypesResponseData;
}

const initialState: OuraLogTypesState = {
  ouraLogTypes: {
    daily_activity: null,
    sleep: null,
  },
};

const ouraLogTypesSlice = createSlice({
  name: "ouraLogTypes",
  initialState,
  reducers: {
    setOuraLogTypes: (
      state,
      action: PayloadAction<OuraLogTypesResponseData>
    ) => {
      state.ouraLogTypes = action.payload;
    },
  },
});

export const selectLogTypes = (state: RootState) => state.logTypes.logTypes;

export const { setOuraLogTypes } = ouraLogTypesSlice.actions;
export default ouraLogTypesSlice.reducer;
