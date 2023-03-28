import { Log } from "../typeModels/logTypeModel";

// hasLogTypeToday function
export const hasLogTypeToday = (
  logs: Log[] | undefined,
  logTypeId: string
): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (typeof logs === "undefined") {
    console.log("Undefined logs array");
    return false;
  } else {
    return logs.some((log) => {
      const logDate = new Date(log.date);
      logDate.setHours(0, 0, 0, 0);

      return (
        logDate.getTime() === today.getTime() && log.logType_id === logTypeId
      );
    });
  }
};
