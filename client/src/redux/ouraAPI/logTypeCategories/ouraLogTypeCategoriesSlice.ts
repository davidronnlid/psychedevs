import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { OuraLogTypeCategoriesResponseData } from "../../../typeModels/ouraModel";

interface OuraState {
  logTypeCategories: OuraLogTypeCategoriesResponseData;
}

const initialState: OuraState = {
  logTypeCategories: {
    daily_activity: false,
    sleep: false,
  },
};

const ouraSlice = createSlice({
  name: "ouraLogTypeCategories",
  initialState,
  reducers: {
    setLogTypeCategories: (
      state,
      action: PayloadAction<OuraLogTypeCategoriesResponseData>
    ) => {
      state.logTypeCategories = action.payload;
    },
  },
});

export const selectLogTypeCategories = (state: RootState) =>
  state.ouraLogTypeCategories.logTypeCategories;

export const { setLogTypeCategories } = ouraSlice.actions;
export default ouraSlice.reducer;
