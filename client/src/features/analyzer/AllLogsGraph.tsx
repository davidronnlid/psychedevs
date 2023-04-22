import { Bar } from "react-chartjs-2";
import { useFetchOuraLogsQuery } from "../../redux/ouraAPI/logs/ouraLogsAPI";
import { SleepData, DailyActivity } from "../../typeModels/ouraModel";
import { Chart, ChartDataset } from "chart.js";
import { LinearScale } from "chart.js/auto";
import React, { useState, useEffect } from "react";

Chart.register(LinearScale);

type ChartOptionsType = {
  scales: {
    y1: {
      type: "linear";
      position: "left";
      beginAtZero: true;
      title: {
        display: boolean;
        text: string;
        color: string;
        font: {
          size: number;
        };
        rotation: number;
      };
    };
    y2: {
      type: "linear";
      position: "right";
      beginAtZero: true;
      title: {
        display: boolean;
        text: string;
        color: string;
        font: {
          size: number;
        };
        rotation: number;
      };
    };
  };
};

const AllLogsGraph: React.FC = () => {
  const {
    data: ouraLogsData,
    error: ouraLogsError,
    isLoading: ouraLogsIsLoading,
  } = useFetchOuraLogsQuery();
  const [selectedLogs, setSelectedLogs] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  const sleepData: SleepData[] = ouraLogsData?.sleep.data || [];
  const dailyActivityData: DailyActivity[] =
    ouraLogsData?.daily_activity.data || [];
  console.log(
    "🚀 ~ file: AllLogsGraph.tsx:55 ~ dailyActivityData:",
    dailyActivityData
  );

  const logTypes = [
    {
      id: "total_sleep_duration",
      label: "Total Sleep Duration",
      data: sleepData.map((item) => item.total_sleep_duration),
      backgroundColor: "rgba(75, 192, 192, 0.2)",
      borderColor: "rgba(75, 192, 192, 1)",
      yAxisID: "y1",
    },
    {
      id: "rem_sleep_duration",
      label: "REM Sleep Duration",
      data: sleepData.map((item) => item.rem_sleep_duration),
      backgroundColor: "rgba(75, 192, 192, 0.2)",
      borderColor: "rgba(75, 192, 192, 1)",
      yAxisID: "y1",
    },
    {
      id: "steps",
      label: "Steps",
      data: dailyActivityData.map((item) => item.steps),
      backgroundColor: "rgba(75, 192, 192, 0.2)",
      borderColor: "rgba(75, 192, 192, 1)",
      yAxisID: "y2",
    },
  ];

  const [filteredLogTypes, setFilteredLogTypes] = useState(logTypes);

  useEffect(() => {
    setFilteredLogTypes(
      logTypes.filter((log) =>
        log.label.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search]);

  const handleLogTypeSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = event.target.value;

    if (selectedLogs.includes(selected)) {
      setSelectedLogs(selectedLogs.filter((log) => log !== selected));
    } else {
      if (selectedLogs.length < 2) {
        setSelectedLogs([...selectedLogs, selected]);
      }
    }
  };

  if (ouraLogsIsLoading) {
    return <div>Loading...</div>;
  }

  if (ouraLogsError) {
    return <div>Error: {ouraLogsError.toString()}</div>;
  }

  const labels = sleepData.map((item) => item.day);

  const getChartDataForLogType = (logTypeId: string) => {
    const logType = logTypes.find((log) => log.id === logTypeId);
    if (logType) {
      return {
        label: logType.label,
        data: logType.data,
        backgroundColor: logType.backgroundColor,
        borderColor: logType.borderColor,
        borderWidth: 1,
        yAxisID: logType.yAxisID,
      };
    }
    return null;
  };

  const chartData = {
    labels,
    datasets: selectedLogs
      .map((log) => getChartDataForLogType(log))
      .filter((dataset) => dataset !== null) as ChartDataset<"bar", number[]>[],
  };

  const chartOptions: ChartOptionsType = {
    scales: {
      y1: {
        type: "linear",
        position: "left",
        beginAtZero: true,
        title: {
          display: true,
          text: "Sleep Duration (minutes) axis",
          color: "rgba(75, 192, 192, 1)",
          font: {
            size: 16, // Set the font size
          },
          rotation: 90, // Set the rotation to 0 for horizontal orientation
        },
      },
      y2: {
        type: "linear",
        position: "right",
        beginAtZero: true,
        title: {
          display: true,
          text: "Active Calories axis",
          color: "rgba(255, 206, 86, 1)",
          font: {
            size: 16, // Set the font size
          },
          rotation: 0, // Set the rotation to 0 for horizontal orientation
        },
      },
    },
  };

  return (
    <>
      <input
        type="text"
        placeholder="Search log types"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <select onChange={handleLogTypeSelect}>
        {filteredLogTypes.map((log) => (
          <option key={log.id} value={log.id}>
            {log.label}
          </option>
        ))}
      </select>
      <Bar data={chartData} options={chartOptions} />
    </>
  );
};

export default AllLogsGraph;
