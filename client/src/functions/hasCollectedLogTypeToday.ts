import { FetchLogsResponseElement } from "../typeModels/logTypeModel";
import getTodayDate from "./getToday";

export const hasCollectedLogTypeToday = (
  logsOfToday: FetchLogsResponseElement[] | undefined,
  logTypeId: string
): boolean => {
  let today = getTodayDate();

  console.log(
    "🚀 ~ file: hasCollectedLogTypeToday.ts:9 ~ today:",
    today,
    logsOfToday
  );

  if (typeof logsOfToday === "undefined") {
    console.log("Undefined FetchLogsResponseElement array (logsOfToday)");
    return false;
  } else {
    return logsOfToday.some((fetchLogsResponseElement) => {
      return fetchLogsResponseElement.logs.some((log) => {
        const logDate = new Date(log.date);

        logDate.setHours(0, 0, 0, 0);

        console.log("logDate, today", log, logDate.getTime(), today.getTime());

        return (
          logDate.getTime() === today.getTime() &&
          fetchLogsResponseElement._id.logType_id === logTypeId
        );
      });
    });
  }
};
