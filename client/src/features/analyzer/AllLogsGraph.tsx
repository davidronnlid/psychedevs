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
import { selectLogTypes } from "../../redux/logTypesSlice";
import { useAppSelector } from "../../redux/hooks";
import { useFetchLogsQuery } from "../../redux/logsAPI/logsAPI";

Chart.register(LinearScale);

type CombinedLogType = {
  id: string | undefined;
  label: string | undefined;
};

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
  const PDLogTypes = useAppSelector(selectLogTypes);

  const [selectedLogTypes, setSelectedLogTypes] = useState<string[]>([]);

  const [search, setSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const {
    logTypes: ouraSleepLogTypes,
    error,
    isLoading,
  } = useOuraLogTypes("sleep");

  const {
    logTypes: ouraDailyActivityLogTypes,
    error: ouraDailyActivityLogTypesError,
    isLoading: ouraDailyActivityLogTypesIsLoading,
  } = useOuraLogTypes("daily_activity");

  const ouraLogTypes = useMemo(() => {
    return [...ouraSleepLogTypes, ...ouraDailyActivityLogTypes];
  }, [ouraSleepLogTypes, ouraDailyActivityLogTypes]);

  const allLogTypes = useMemo(() => {
    const ouraMapped = ouraLogTypes.map((logType) => ({
      id: logType.id,
      label: logType.label,
    }));

    const pdMapped = PDLogTypes.map((logType) => ({
      id: logType.logType_id,
      label: logType.name,
    }));

    return [...ouraMapped, ...pdMapped];
  }, [ouraLogTypes, PDLogTypes]);

  const {
    data: ouraLogTypeCategoriesData,
    error: ouraLogTypeCategoriesError,
    isLoading: ouraLogTypeCategoriesLoading,
    isSuccess: ouraLogTypeCategoriesSuccess,
  } = useFetchOuraLogTypeCategoriesQuery();

  const generateChartOptions = (selectedLogTypes: string[]) => {
    const selectedLogData = selectedLogTypes.map((logId) =>
      ouraLogTypes.find((log) => log.id === logId)
    );
    const y1LogType = selectedLogData.find(
      (log) => log && selectedLogTypes.indexOf(log.id) === 0
    );
    const y2LogType = selectedLogData.find(
      (log) => log && selectedLogTypes.indexOf(log.id) === 1
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

  const [filteredLogTypes, setFilteredLogTypes] =
    useState<{ id: string | undefined; label: string }[]>(ouraLogTypes);

  useEffect(() => {
    setFilteredLogTypes(allLogTypes);
  }, [allLogTypes]);

  useEffect(() => {
    setFilteredLogTypes(
      allLogTypes.filter((logType) =>
        logType.label.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, allLogTypes]);

  // const [correlationData, setCorrelationData] = useState<{
  //   correlation: number | null;
  //   pValue: number | null;
  //   requiredSampleSize?: number | null;
  //   existingSampleSize?: number | null;
  // }>({
  //   correlation: null,
  //   pValue: null,
  //   requiredSampleSize: null,
  //   existingSampleSize: null,
  // });

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  console.log(
    "🚀 ~ file: AllLogsGraph.tsx:168 ~ ouraLogsData:",
    startDate,
    endDate,
    selectedLogTypes
  );
  const {
    data: PDLogsData,
    error: PDLogsError,
    isLoading: PDLogsIsLoading,
  } = useFetchLogsQuery({
    startDate,
    endDate,
    logTypeIds: selectedLogTypes.filter((logTypeId) =>
      PDLogTypes.some((logType) => logType.logType_id === logTypeId)
    ),
  });

  console.log(PDLogsData, " is PDLogsData");

  const {
    data: ouraLogsData,
    error: ouraLogsError,
    isLoading: ouraLogsIsLoading,
  } = useFetchOuraLogsQuery({
    logTypeIds: selectedLogTypes,
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
  //   if (ouraLogsData && selectedLogTypes) {
  //     console.log(
  //       "🚀 ~ file: AllLogsGraph.tsx:179 ~ useEffect ~ selectedLogTypes:",
  //       selectedLogTypes
  //     );

  //     const newSelectedOuraLogsData = selectedLogTypes.map(
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
  // }, [ouraLogsData, selectedLogTypes]);
  const [selectedPDLogTypes, setSelectedPDLogTypes] = useState<string[]>([]);

  const handleLogTypeSelect = (_event: any, newValue: any) => {
    if (newValue.length <= 2) {
      const selectedOura = newValue
        .filter((item: any) => ouraLogTypes.some((log) => log.id === item.id))
        .map((item: any) => item.id);
      const selectedPD = newValue
        .filter((item: any) =>
          PDLogTypes.some((log) => log.logType_id === item.id)
        )
        .map((item: any) => item.id);

      setSelectedLogTypes([...selectedOura, ...selectedPD]);
      // setSelectedPDLogTypes(selectedPD);
      // Make sure that these state setters do not overwrite previous state
    }
  };

  const getChartDataForLogType = (logTypeId: string, logTypeIndex: number) => {
    const logType = allLogTypes.find((log) => log.id === logTypeId);

    const yAxisID = selectedLogTypes.indexOf(logTypeId) === 0 ? "y1" : "y2";

    if (logType) {
      const backgroundColor = logTypeIndex === 0 ? "#001219" : "#26ace2";
      const borderColor = logTypeIndex === 0 ? "#001219" : "#26ace2";

      console.log(PDLogTypes, " in datasetter func");

      let logData;
      if (ouraLogTypes.some((logType) => logType.id === logTypeId)) {
        logData =
          ouraLogsData?.[logTypeId]?.map(
            (ouraLog: any) => ouraLog[logTypeId]
          ) || "";
      } else if (
        PDLogTypes.some((logType) => logType.logType_id === logTypeId)
      ) {
        logData = PDLogsData?.map((PDLog: Log) => PDLog.value) || [];
      }

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

  const convertDateToYMD = (dateString: string): string => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const getUniqueDayLabels = () => {
    const allDayLabels: string[] = [];

    selectedLogTypes.forEach((logTypeId) => {
      let dayLabelsForLogType;

      if (PDLogTypes.some((log) => log.logType_id === logTypeId)) {
        dayLabelsForLogType = PDLogsData?.filter(
          (PDLog: any) => PDLog.logType_id === logTypeId
        ).map((PDLog: any) => convertDateToYMD(PDLog.date));
      } else {
        dayLabelsForLogType = ouraLogsData?.[logTypeId]?.map(
          (ouraLog: any) => ouraLog.day
        );
      }

      if (dayLabelsForLogType) {
        allDayLabels.push(...dayLabelsForLogType);
      }
    });

    return Array.from(new Set(allDayLabels));
  };

  const chartData = {
    labels: getUniqueDayLabels(),
    datasets: selectedLogTypes
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
          if (selectedLogTypes.length < 2) {
            setDropdownOpen(true);
          }
        }}
        onClose={() => setDropdownOpen(false)}
        options={filteredLogTypes}
        getOptionLabel={(option) => option?.label || ""}
        onChange={handleLogTypeSelect}
        value={selectedLogTypes.map((logId) =>
          allLogTypes.find((log) => log.id === logId)
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Select 2 log types to display logs for"
            disabled={selectedLogTypes.length >= 2}
            helperText={
              selectedLogTypes.length >= 2
                ? "Max number of log types selected"
                : ""
            }
          />
        )}
      />
      <br />
      <Line data={chartData} options={generateChartOptions(selectedLogTypes)} />

      {/* {correlationData &&
        selectedLogTypes[0] !== "" &&
        selectedLogTypes[1] !== "" &&
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
