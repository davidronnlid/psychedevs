import { Button } from "@mui/material";
import { useEffect, useState } from "react";

interface SleepData {
  id: string;
  average_breath: number;
  average_heart_rate: number;
  average_hrv: number;
  awake_time: number;
  bedtime_end: string;
  bedtime_start: string;
  day: string;
  deep_sleep_duration: number;
  efficiency: number;
  heart_rate: {
    interval: number;
    items: number[];
    timestamp: string;
  };
  hrv: {
    interval: number;
    items: number[];
    timestamp: string;
  };
  latency: number;
  light_sleep_duration: number;
  low_battery_alert: boolean;
  lowest_heart_rate: number;
  movement_30_sec: string;
  period: number;
  readiness: {
    contributors: { [key: string]: number };
    score: number;
    temperature_deviation: number;
    temperature_trend_deviation: number;
  };
  readiness_score_delta: number;
  rem_sleep_duration: number;
  restless_periods: number;
  sleep_phase_5_min: string;
  sleep_score_delta: number;
  time_in_bed: number;
  total_sleep_duration: number;
  type: string;
  [key: string]: any;
}

interface Props {
  onOuraAuthCompleted: (ouraAuthCompleted: boolean) => void;
}

interface OuraLogType {
  ouraLogType: string;
  transformedOuraLogType: string;
}

function transformOuraLogTypes(logTypes: string[]): OuraLogType[] {
  return logTypes.map((logType) => {
    const transformedLogType = logType
      .replace(/_/g, " ")
      .replace(/^\w/, (c) => c.toUpperCase());
    return { ouraLogType: logType, transformedOuraLogType: transformedLogType };
  });
}

const OuraAuthCompleted = ({ onOuraAuthCompleted }: Props) => {
  const [data, setData] = useState<SleepData[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem("user_sesh_JWT");

  useEffect(() => {
    const fetchData = async () => {
      const baseUrl =
        process.env.NODE_ENV === "development"
          ? process.env.REACT_APP_BACKEND_LOCAL_URL
          : process.env.REACT_APP_PROD_URL;

      try {
        const response = await fetch(`${baseUrl}/oura/data`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Token sent:", token);

        if (!response.ok) {
          throw new Error("Error fetching data from /oura/data");
        }

        const responseData = await response.json();
        console.log(
          "🚀 ~ file: ouraAuthCompleted.tsx:30 ~ fetchData ~ responseData:",
          responseData.data.data
        );
        setData(responseData.data.data);
        onOuraAuthCompleted(true);
      } catch (error) {
        console.log(error); // setError(error.message);
      }
    };

    fetchData();
  }, [token]);

  // find all keys of the first element in the data array
  const logTypeKeys = data
    ? data.reduce((acc: Array<string>, obj: SleepData) => {
        Object.keys(obj).forEach((key) => {
          if (!acc.includes(key)) {
            acc.push(key);
          }
        });
        return acc;
      }, [])
    : [];

  const transformedLogTypes = transformOuraLogTypes(logTypeKeys);
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
      {error && <p>Error: {error}</p>}
      {data && (
        <>
          <h2>Oura integration log types</h2>
          <h4>Categories</h4>
          <ul>
            <li>
              Sleep{" "}
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
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
};

export default OuraAuthCompleted;
