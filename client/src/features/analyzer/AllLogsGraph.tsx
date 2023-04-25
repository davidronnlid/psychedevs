import { Line } from "react-chartjs-2";
import { useFetchOuraLogsQuery } from "../../redux/ouraAPI/logs/ouraLogsAPI";
import { Chart, ChartDataset } from "chart.js";
import { LinearScale } from "chart.js/auto";
import React, { useState, useEffect, useMemo, SetStateAction } from "react";
import { Autocomplete, TextField, Typography } from "@mui/material";
import { useOuraLogTypes } from "../../functions/useOuraLogTypes";
import { calculateCorrelation } from "../../functions/correlations";
import { Log } from "../../typeModels/logTypeModel";
import { OuraLog, OuraLogsDataByType } from "../../typeModels/ouraModel";
import { useFetchOuraLogTypeCategoriesQuery } from "../../redux/ouraAPI/logTypeCategories/ouraLogTypeCategoriesAPI";
import { Box } from "@mui/material";
import { DatePicker } from "@mui/lab";
import DateRangePicker from "../../components/dateRangePicker";

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
  const [selectedOuraLogTypes, setSelectedOuraLogTypes] = useState<string[]>(
    []
  );

  const [search, setSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const {
    logTypes: ouraSleepLogTypes,
    error,
    isLoading,
  } = useOuraLogTypes("sleep");
  console.log(
    "🚀 ~ file: AllLogsGraph.tsx:60 ~ ouraSleepLogTypes:",
    ouraSleepLogTypes
  );

  const {
    logTypes: ouraDailyActivityLogTypes,
    error: ouraDailyActivityLogTypesError,
    isLoading: ouraDailyActivityLogTypesIsLoading,
  } = useOuraLogTypes("daily_activity");
  console.log(
    "🚀 ~ file: AllLogsGraph.tsx:60 ~ ouraDailyActivityLogTypes:",
    ouraDailyActivityLogTypes
  );
  const ouraLogTypes = useMemo(() => {
    return [...ouraSleepLogTypes, ...ouraDailyActivityLogTypes];
  }, [ouraSleepLogTypes, ouraDailyActivityLogTypes]);

  const {
    data: ouraLogTypeCategoriesData,
    error: ouraLogTypeCategoriesError,
    isLoading: ouraLogTypeCategoriesLoading,
    isSuccess: ouraLogTypeCategoriesSuccess,
  } = useFetchOuraLogTypeCategoriesQuery();

  const generateChartOptions = (selectedOuraLogTypes: string[]) => {
    const selectedLogData = selectedOuraLogTypes.map((logId) =>
      ouraLogTypes.find((log) => log.id === logId)
    );
    const y1LogType = selectedLogData.find(
      (log) => log && selectedOuraLogTypes.indexOf(log.id) === 0
    );
    const y2LogType = selectedLogData.find(
      (log) => log && selectedOuraLogTypes.indexOf(log.id) === 1
    );

    console.log("y1LogType&y2LogType. ", y1LogType, y2LogType);

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

  const [filteredLogTypes, setFilteredLogTypes] = useState(ouraLogTypes);

  useEffect(() => {
    setFilteredLogTypes(ouraLogTypes);
  }, [ouraLogTypes]);

  useEffect(() => {
    setFilteredLogTypes(
      ouraLogTypes.filter((ouraLogType) =>
        ouraLogType.label.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, ouraLogTypes]);

  const [correlationData, setCorrelationData] = useState<{
    correlation: number | null;
    pValue: number | null;
    requiredSampleSize?: number | null;
    existingSampleSize?: number | null;
  }>({
    correlation: null,
    pValue: null,
    requiredSampleSize: null,
    existingSampleSize: null,
  });
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  console.log(
    "🚀 ~ file: AllLogsGraph.tsx:168 ~ ouraLogsData:",
    startDate,
    endDate
  );
  const {
    data: ouraLogsData,
    error: ouraLogsError,
    isLoading: ouraLogsIsLoading,
  } = useFetchOuraLogsQuery({
    logTypeIds: selectedOuraLogTypes,
    startDate,
    endDate,
  });

  const handleStartDateChange = (newStartDate: string) => {
    setStartDate(newStartDate);
  };

  const handleEndDateChange = (newEndDate: string) => {
    setEndDate(newEndDate);
  };

  // useEffect(() => {
  //   if (ouraLogsData && selectedOuraLogTypes) {
  //     console.log(
  //       "🚀 ~ file: AllLogsGraph.tsx:179 ~ useEffect ~ selectedOuraLogTypes:",
  //       selectedOuraLogTypes
  //     );

  //     const newSelectedOuraLogsData = selectedOuraLogTypes.map(
  //       (ouraLogType: any) => {
  //         return ouraLogsData[ouraLogType];
  //       }
  //     );
  //     console.log(
  //       "🚀 ~ file: AllLogsGraph.tsx:189 ~ useEffect ~ newSelectedOuraLogsData:",
  //       newSelectedOuraLogsData
  //     );

  //     console.log(
  //       "🚀 ~ file: AllLogsGraph.tsx:192 ~ useEffect ~ selectedOuraLogsData:",
  //       newSelectedOuraLogsData
  //     );
  //     const correlationResult = calculateCorrelation(newSelectedOuraLogsData);
  //     setCorrelationData(correlationResult);
  //   }
  // }, [ouraLogsData, selectedOuraLogTypes]);

  const handleLogTypeSelect = (_event: any, newValue: any) => {
    if (newValue.length <= 2) {
      setSelectedOuraLogTypes(newValue.map((item: any) => item.id));
    }
  };

  const getChartDataForLogType = (logTypeId: string, logTypeIndex: number) => {
    const logType = ouraLogTypes.find((log) => log.id === logTypeId);

    const yAxisID = selectedOuraLogTypes.indexOf(logTypeId) === 0 ? "y1" : "y2";

    if (logType) {
      const backgroundColor = logTypeIndex === 0 ? "#001219" : "#26ace2";
      const borderColor = logTypeIndex === 0 ? "#001219" : "#26ace2";

      const logData =
        ouraLogsData?.[logTypeId]?.map((ouraLog: any) => ouraLog[logTypeId]) ||
        "";

      return {
        label: logType.label,
        data: logData,
        backgroundColor,
        borderColor,
        borderWidth: 1,
        yAxisID,
      };
    }
    return null;
  };

  const getUniqueDayLabels = () => {
    const allDayLabels: string[] = [];

    selectedOuraLogTypes.forEach((logTypeId) => {
      const dayLabelsForLogType = ouraLogsData?.[logTypeId]?.map(
        (ouraLog: any) => ouraLog.day
      );

      if (dayLabelsForLogType) {
        allDayLabels.push(...dayLabelsForLogType);
      }
    });

    return Array.from(new Set(allDayLabels));
  };

  const chartData = {
    labels: getUniqueDayLabels(),
    datasets: selectedOuraLogTypes
      .map((logTypeId, index) => getChartDataForLogType(logTypeId, index))
      .filter((dataset) => dataset !== null) as ChartDataset<
      "line",
      number[]
    >[],
  };

  return ouraLogTypeCategoriesData ? (
    <>
      <Typography variant="h5">Oura logs</Typography>
      <br />
      <DateRangePicker
        onStartDateChange={handleStartDateChange}
        onEndDateChange={handleEndDateChange}
      />

      <br />
      <Autocomplete
        multiple
        open={dropdownOpen}
        onOpen={() => {
          if (selectedOuraLogTypes.length < 2) {
            setDropdownOpen(true);
          }
        }}
        onClose={() => setDropdownOpen(false)}
        options={filteredLogTypes}
        getOptionLabel={(option) => option?.label || ""}
        onChange={handleLogTypeSelect}
        value={selectedOuraLogTypes.map((logId) =>
          ouraLogTypes.find((log) => log.id === logId)
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Select 2 log types to display logs for"
            disabled={selectedOuraLogTypes.length >= 2}
            helperText={
              selectedOuraLogTypes.length >= 2
                ? "Max number of log types selected"
                : ""
            }
          />
        )}
      />
      <br />
      <Line
        data={chartData}
        options={generateChartOptions(selectedOuraLogTypes)}
      />

      {/* {correlationData &&
        selectedOuraLogTypes[0] !== "" &&
        selectedOuraLogTypes[1] !== "" &&
        ((correlationData?.existingSampleSize ?? 0) >=
          (correlationData?.requiredSampleSize ?? 1100) &&
        (correlationData?.pValue ?? 1) <= 0.05 ? (
          <>
            <p>YOOOO correlation bro</p>
            <p>Correlation: {correlationData.correlation}</p>
            <p>P-value: {correlationData.pValue}</p>
          </>
        ) : (
          <>
            <h3>No correlation was found. </h3>
            {(correlationData?.existingSampleSize ?? 0) <=
            (correlationData?.requiredSampleSize ?? 0) ? (
              <>
                <h4>
                  You need to collect more logs for these log types to find
                  possible correlations between them.{" "}
                </h4>
                <p>
                  Existing logs per log type:{" "}
                  {correlationData.existingSampleSize}
                </p>
                <p>
                  Estimated required logs per log type:{" "}
                  {correlationData.requiredSampleSize}
                </p>
              </>
            ) : (
              <h4>One of these log types has no logs.</h4>
            )}
          </>
        ))} */}
    </>
  ) : (
    <></>
  );
};

export default AllLogsGraph;
