import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import userReducer from "./userSlice";
import logTypesReducer from "./logTypesSlice";
import answerFormatsReducer from "./answerFormatsSlice";
import logsReducer from "./logsAPI/logsSlice";
import ouraLogsReducer from "./ouraAPI/ouraLogsSlice";
import ouraLogTypeCategoriesReducer from "./ouraAPI/ouraLogTypeCategoriesSlice";
import { logsAPI } from "./logsAPI/logsAPI";
import { ouraLogsAPI } from "./ouraAPI/ouraLogsAPI";
import { ouraLogTypesAPI } from "./ouraAPI/ouraLogTypeCategoriesAPI";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    logTypes: logTypesReducer,
    answerFormats: answerFormatsReducer,
    logsAPI: logsAPI.reducer,
    logs: logsReducer,
    ouraLogsAPI: ouraLogsAPI.reducer,
    ouraLogTypesAPI: ouraLogTypesAPI.reducer,
    ouraLogs: ouraLogsReducer,
    ouraLogTypeCategories: ouraLogTypeCategoriesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(logsAPI.middleware)
      .concat(ouraLogsAPI.middleware)
      .concat(ouraLogTypesAPI.middleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
