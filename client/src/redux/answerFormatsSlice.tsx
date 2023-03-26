import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AnswerFormat } from "../typeModels/logTypeModel";
import { RootState } from "./store";

interface AnswerFormatsState {
  answerFormats: AnswerFormat[];
}

const initialState: AnswerFormatsState = {
  answerFormats: [
    { answer_format: "1-5 scale" },
    { answer_format: "1-10 scale" },
  ],
};

// Above initial state is the "DB" for available answer formats. It should be formatted with "_" for spaces and non-capitalized letters only (component code  handles formatting for UI display)

const answerFormatsSlice = createSlice({
  name: "answerFormats",
  initialState,
  reducers: {
    setAnswerFormats: (state, action: PayloadAction<AnswerFormat[]>) => {
      state.answerFormats = [...action.payload];
    },
  },
});

export const selectAnswerFormats = (state: RootState) => state.answerFormats;

export const { setAnswerFormats } = answerFormatsSlice.actions;

export default answerFormatsSlice.reducer;
