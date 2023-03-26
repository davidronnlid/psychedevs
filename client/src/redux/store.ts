import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import userReducer from "./userSlice";
import logTypesReducer from "./logTypesSlice";
import answerFormatsReducer from "./answerFormatsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    logTypes: logTypesReducer,
    answerFormats: answerFormatsReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
