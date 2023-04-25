import { Bar } from "react-chartjs-2";
import { useFetchOuraLogsQuery } from "../../redux/ouraAPI/logs/ouraLogsAPI";
import { SleepData, DailyActivity } from "../../typeModels/ouraModel";
import { Chart, ChartDataset } from "chart.js";
import { LinearScale } from "chart.js/auto";
import React, { useState, useEffect } from "react";
import { Autocomplete, TextField } from "@mui/material";

Chart.register(LinearScale);

type ChartOptionsType = {
  scales: {
    y1: {
      type: "linear";
      position: "left";
      beginAtZero: true;
      display: boolean;

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
      display: boolean;

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
  const [dropdownOpen, setDropdownOpen] = useState(false);

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
    },
    {
      id: "rem_sleep_duration",
      label: "REM Sleep Duration",
      data: sleepData.map((item) => item.rem_sleep_duration),
    },
    {
      id: "steps",
      label: "Steps",
      data: dailyActivityData.map((item) => item.steps),
    },
  ];

  const generateChartOptions = (selectedLogs: string[]) => {
    const selectedLogData = selectedLogs.map((logId) =>
      logTypes.find((log) => log.id === logId)
    );
    const y1LogType = selectedLogData.find(
      (log) => log && selectedLogs.indexOf(log.id) === 0
    );
    const y2LogType = selectedLogData.find(
      (log) => log && selectedLogs.indexOf(log.id) === 1
    );

    const y1AxisDisplay = !!y1LogType;
    const y2AxisDisplay = !!y2LogType;

    const chartOptions: ChartOptionsType = {
      scales: {
        y1: {
          type: "linear",
          position: "left",
          beginAtZero: true,
          display: y1AxisDisplay,
          title: {
            display: y1AxisDisplay,
            text: y1LogType ? y1LogType.label : "",
            color: "#001219",
            font: {
              size: 16,
            },
            rotation: 0,
          },
        },
        y2: {
          type: "linear",
          position: "right",
          beginAtZero: true,
          display: y2AxisDisplay,
          title: {
            display: y2AxisDisplay,
            text: y2LogType ? y2LogType.label : "",
            color: "#26ace2",
            font: {
              size: 16,
            },
            rotation: 0,
          },
        },
      },
    };

    return chartOptions;
  };

  const [filteredLogTypes, setFilteredLogTypes] = useState(logTypes);

  useEffect(() => {
    setFilteredLogTypes(
      logTypes.filter((log) =>
        log.label.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search]);

  const handleLogTypeSelect = (_event: any, newValue: any) => {
    if (newValue.length <= 2) {
      setSelectedLogs(newValue.map((item: any) => item.id));
    }
  };

  if (ouraLogsIsLoading) {
    return <div>Loading...</div>;
  }

  if (ouraLogsError) {
    return <div>Error: {ouraLogsError.toString()}</div>;
  }

  const labels = sleepData.map((item) => item.day);

  const getChartDataForLogType = (logTypeId: string, logTypeIndex: number) => {
    const logType = logTypes.find((log) => log.id === logTypeId);

    const yAxisID = selectedLogs.indexOf(logTypeId) === 0 ? "y1" : "y2";

    if (logType) {
      const backgroundColor = logTypeIndex === 0 ? "#001219" : "#26ace2";
      const borderColor = logTypeIndex === 0 ? "#001219" : "#26ace2";

      return {
        label: logType.label,
        data: logType.data,
        backgroundColor,
        borderColor,
        borderWidth: 1,
        yAxisID,
      };
    }
    return null;
  };

  const chartData = {
    labels,
    datasets: selectedLogs
      .map((log, index) => getChartDataForLogType(log, index))
      .filter((dataset) => dataset !== null) as ChartDataset<"bar", number[]>[],
  };

  return (
    <>
      <Autocomplete
        multiple
        open={dropdownOpen}
        onOpen={() => {
          if (selectedLogs.length < 2) {
            setDropdownOpen(true);
          }
        }}
        onClose={() => setDropdownOpen(false)}
        options={filteredLogTypes}
        getOptionLabel={(option) => option?.label || ""}
        onChange={handleLogTypeSelect}
        value={selectedLogs.map((logId) =>
          logTypes.find((log) => log.id === logId)
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Select 2 log types to display logs for"
            disabled={selectedLogs.length >= 2}
            helperText={
              selectedLogs.length >= 2
                ? "Further log type selection is disabled because you have selected 2/2 log types to analyze logs of"
                : ""
            }
          />
        )}
      />

      <Bar data={chartData} options={generateChartOptions(selectedLogs)} />
    </>
  );
};

export default AllLogsGraph;
