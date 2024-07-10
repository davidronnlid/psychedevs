import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import userReducer from "./userSlice";
import logTypesReducer from "./logTypesSlice";
import answerFormatsReducer from "./answerFormatsSlice";
import logsReducer from "./logsAPI/logsSlice";
import { logsAPI } from "./logsAPI/logsAPI";

import ouraLogsReducer from "./ouraAPI/logs/ouraLogsSlice";
import ouraLogTypesReducer from "./ouraAPI/logTypes/ouraLogTypesSlice";
import ouraLogTypeCategoriesReducer from "./ouraAPI/logTypeCategories/ouraLogTypeCategoriesSlice";
import { ouraLogsAPI } from "./ouraAPI/logs/ouraLogsAPI";
import { ouraLogTypeCategoriesAPI } from "./ouraAPI/logTypeCategories/ouraLogTypeCategoriesAPI";
import { ouraLogTypesAPI } from "./ouraAPI/logTypes/ouraLogTypesAPI";

import withingsLogsReducer from "./withingsAPI/logs/withingsLogsSlice";
import withingsLogTypesReducer from "./withingsAPI/logTypes/withingsLogTypesSlice";
import withingsLogTypeCategoriesReducer from "./withingsAPI/logTypeCategories/withingsLogTypeCategoriesSlice";
import { withingsLogsAPI } from "./withingsAPI/logs/withingsLogsAPI";
import { withingsLogTypesAPI } from "./withingsAPI/logTypes/withingsLogTypesAPI";
import { WithingsLogTypeCategoriesAPI } from "./withingsAPI/logTypeCategories/withingsLogTypeCategoriesAPI";

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
    ouraLogTypeCategoriesAPI: ouraLogTypeCategoriesAPI.reducer,
    ouraLogs: ouraLogsReducer,
    ouraLogTypes: ouraLogTypesReducer,
    ouraLogTypeCategories: ouraLogTypeCategoriesReducer,
    withingsLogsAPI: withingsLogsAPI.reducer,
    withingsLogTypesAPI: withingsLogTypesAPI.reducer,
    withingsLogTypeCategoriesAPI: WithingsLogTypeCategoriesAPI.reducer,
    withingsLogs: withingsLogsReducer,
    withingsLogTypes: withingsLogTypesReducer,
    withingsLogTypeCategories: withingsLogTypeCategoriesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      logsAPI.middleware,
      ouraLogsAPI.middleware,
      ouraLogTypesAPI.middleware,
      ouraLogTypeCategoriesAPI.middleware
    ),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
