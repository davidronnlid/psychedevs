import { Check } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useState } from "react";

type OuraLogType = {
  ouraLogType: string;
  transformedOuraLogType: string;
  value: any;
};

function transformOuraLogTypes(logTypes: [string, any][]): OuraLogType[] {
  return logTypes.map(([logType, value]) => {
    const transformedLogType = logType
      .replace(/_/g, " ")
      .replace(/^\w/, (c) => c.toUpperCase());
    return {
      ouraLogType: logType,
      transformedOuraLogType: transformedLogType,
      value,
    };
  });
}

interface Props {
  ouraData: any;
  ouraLogType: string;
}

const OuraData = ({ ouraData, ouraLogType }: Props) => {
  console.log("Received updatedOuraData in OuraData component! ", ouraData);

  const logTypeKeys = ouraData
    ? Object.keys(ouraData[0]).filter((key) => key !== "summary_date")
    : [];

  const logTypeTuples = logTypeKeys.map(
    (key) => [key, ouraData[0][key]] as [string, unknown]
  );
  const transformedLogTypes = transformOuraLogTypes(logTypeTuples);

  console.log(
    "🚀 ~ file: ouraAuthCompleted.tsx:124 ~ OuraAuthCompleted ~ transformedLogTypes:",
    transformedLogTypes
  );

  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <>
        <ul>
          <li
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "70%",
            }}
          >
            {ouraLogType} <Check />
            <Button variant="outlined" onClick={toggleOpen}>
              {isOpen ? "Hide specific log types" : "Show specific log types"}
            </Button>
          </li>
        </ul>

        {isOpen && (
          <ul>
            {transformedLogTypes.map((key) => (
              <li key={key.ouraLogType}>
                <h3>{key.transformedOuraLogType}</h3>
                <p>{key.value.toString()}</p>
              </li>
            ))}
          </ul>
        )}
      </>
    </div>
  );
};

export default OuraData;
