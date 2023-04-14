import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import userReducer from "./userSlice";
import logTypesReducer from "./logTypesSlice";
import answerFormatsReducer from "./answerFormatsSlice";
import logsReducer from "./logsAPI/logsSlice";
import ouraReducer from "./ouraLogTypesAPI/ouraLogTypesSlice";
import { logsAPI } from "./logsAPI/logsAPI";
import { ouraAPI } from "./ouraLogTypesAPI/ouraLogTypesAPI";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    logTypes: logTypesReducer,
    answerFormats: answerFormatsReducer,
    logsAPI: logsAPI.reducer,
    logs: logsReducer,
    ouraAPI: ouraAPI.reducer,
    oura: ouraReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(logsAPI.middleware)
      .concat(ouraAPI.middleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
