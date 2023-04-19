import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import { SleepData } from "../../typeModels/ouraModel";
import { useFetchOuraLogsQuery } from "../../redux/ouraAPI/logs/ouraLogsAPI";

const dataTypes = [
  { key: "average_breath", label: "Average Breath", color: "#8884d8" },
  { key: "average_heart_rate", label: "Average Heart Rate", color: "#82ca9d" },
  { key: "average_hrv", label: "Average HRV", color: "#FFBB28" },
  { key: "awake_time", label: "Awake Time", color: "#FF8042" },
];

const OuraLineChart: React.FC = () => {
  const {
    data: ouraData,
    error: ouraError,
    isLoading: ouraLoading,
  } = useFetchOuraLogsQuery();

  if (ouraLoading || !ouraData || !ouraData.sleep || !ouraData.sleep.data) {
    return <p>Loading...</p>;
  }

  // Create an array of objects with only the relevant keys
  const chartData = ouraData.sleep.data.map((data: SleepData) => {
    const chartItem: any = { day: data.day };
    dataTypes.forEach(({ key }) => {
      chartItem[key] = data[key];
    });
    return chartItem;
  });

  // Calculate the min and max values for the YAxis domain
  const minMaxValues = chartData.reduce(
    (acc, cur) => {
      dataTypes.forEach(({ key }) => {
        acc.min = Math.min(acc.min, cur[key]);
        acc.max = Math.max(acc.max, cur[key]);
      });
      return acc;
    },
    { min: Number.POSITIVE_INFINITY, max: Number.NEGATIVE_INFINITY }
  );

  const yAxisDomain = [minMaxValues.min, minMaxValues.max];

  return (
    <>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis domain={yAxisDomain} />
          <Legend />
          {dataTypes.map((dataType) => (
            <Line
              key={dataType.key}
              type="monotone"
              dataKey={dataType.key}
              stroke={dataType.color}
              activeDot={{ r: 8 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </>
  );
};

export default OuraLineChart;
