import { FetchLogsResponseElement } from "../typeModels/logTypeModel";

export const hasCollectedLogTypeToday = (
  FetchLogsResponseElement: FetchLogsResponseElement[] | undefined,
  logTypeId: string
): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (typeof FetchLogsResponseElement === "undefined") {
    console.log("Undefined FetchLogsResponseElement array");
    return false;
  } else {
    return FetchLogsResponseElement.some((logElement) => {
      return logElement.logs.some((log) => {
        const logDate = new Date(log.date);
        logDate.setHours(0, 0, 0, 0);

        return (
          logDate.getTime() === today.getTime() &&
          logElement._id.logType_id === logTypeId
        );
      });
    });
  }
};
