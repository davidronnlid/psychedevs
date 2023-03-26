import { useFetchLogTypes } from "../../functions/logTypesHooks";
import { useAppSelector } from "../../redux/hooks";
import { selectLogTypes } from "../../redux/logTypesSlice";
import { LogType } from "../../typeModels/logTypeModel";
import VasForm from "./vas_form/vasForm";

const Logger = () => {
  const [inProcessOfLoading, err] = useFetchLogTypes();
  const logTypesData = useAppSelector(selectLogTypes);
  console.log("logTypesData ", logTypesData);

  const today = new Date();
  let dayOfWeek = today.getDay(); // Returns a number between 0 and 6 representing the day of the week

  // These below lines are to set dayOfWeek to 0-6 : monday-sunday since today.getDay() starts at 0=sunday
  if (dayOfWeek === 0) {
    dayOfWeek = 6;
  } else {
    dayOfWeek--;
  }

  const filteredLogTypesData = logTypesData.filter(
    (logType) => logType.weekdays[dayOfWeek] === true
  );

  console.log("filteredLogTypesData ", dayOfWeek, filteredLogTypesData); // will log an array of logType objects with true for the current dayOfWeek

  const originalLogType = "1-5 scale";

  const containsOriginalLogType = logTypesData.filter(
    (logTypeData) => logTypeData.logType_id === originalLogType
  );
  console.log(
    "🚀 ~ file: logger.tsx:31 ~ Logger ~ containsOriginalLogType:",
    containsOriginalLogType
  );

  //   When other log formats have been implemented, then USBAT log those too

  // For each logType obj, if weekdays has boolean of today set to true, then render that logTypes Form

  return (
    <div>
      <>
        {inProcessOfLoading && <p>Loading...</p>}
        {err && <p>Error: {err}</p>}
        {filteredLogTypesData.map((logType: LogType) => (
          <VasForm
            value={3}
            name={logType.name}
            answer_format={logType.answer_format}
          />
        ))}
      </>
    </div>
  );
};

export default Logger;
