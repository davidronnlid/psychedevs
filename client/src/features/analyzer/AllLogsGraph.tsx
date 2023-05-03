import { Line } from "react-chartjs-2";
import { useFetchOuraLogsQuery } from "../../redux/ouraAPI/logs/ouraLogsAPI";
import { Chart, ChartDataset } from "chart.js";
import { LinearScale } from "chart.js/auto";
import React, { useState, useEffect, useMemo, SetStateAction } from "react";
import { Autocomplete, TextField, Typography } from "@mui/material";
import { useOuraLogTypes } from "../../functions/useOuraLogTypes";
// import { calculateCorrelation } from "../../functions/correlations";
import { useFetchOuraLogTypeCategoriesQuery } from "../../redux/ouraAPI/logTypeCategories/ouraLogTypeCategoriesAPI";
import DateRangePicker from "../../components/dateRangePicker";
import { selectLogTypes } from "../../redux/logTypesSlice";
import { useAppSelector } from "../../redux/hooks";
import { useFetchLogsQuery } from "../../redux/logsAPI/logsAPI";
import { CircularProgress, LinearProgress } from "@mui/material";
import { Log } from "../../typeModels/logTypeModel";

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
    const y1LogType = allLogTypes.find(
      (log) => log && selectedLogTypes.indexOf(log.id ?? "") === 0
    );
    const y2LogType = allLogTypes.find(
      (log) => log && selectedLogTypes.indexOf(log.id ?? "") === 1
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
    logTypeIds: selectedLogTypes.filter((selectedLogType: string) =>
      PDLogTypes.some((logType) => logType.logType_id === selectedLogType)
    ),
  });

  const {
    data: ouraLogsData,
    error: ouraLogsError,
    isLoading: ouraLogsIsLoading,
  } = useFetchOuraLogsQuery({
    logTypeIds: selectedLogTypes.filter((selectedLogType: string) =>
      ouraLogTypes.some((logType) => logType.id === selectedLogType)
    ),
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

      if (PDLogTypes.some((PDLType) => PDLType.logType_id === logTypeId)) {
        // Above is checking whether the use has selected any log type in PDLogTypes

        dayLabelsForLogType = PDLogsData?.filter(
          (PDLogs: any) => PDLogs._id.logType_id === logTypeId
        ).map((PDLogs: any) =>
          PDLogs.logs
            .map((log: Log) => convertDateToYMD(log.date.toString()))
            .flat()
        );
      } else {
        dayLabelsForLogType = ouraLogsData?.[logTypeId]?.map(
          (ouraLog: any) => ouraLog.day
        );
      }

      if (dayLabelsForLogType) {
        allDayLabels.push(...dayLabelsForLogType);
      }
    });

    return Array.from(new Set(allDayLabels)).flat();
  };

  const getChartDataForLogType = (logTypeId: string, logTypeIndex: number) => {
    const logType = allLogTypes.find((log) => log.id === logTypeId);

    const allDayLabels = getUniqueDayLabels();

    // Loop over all days and check if there is a log object with a value for that day, if there is, then add the value to the logData array. If there is no value, then add null to the array.

    const yAxisID = selectedLogTypes.indexOf(logTypeId) === 0 ? "y1" : "y2";

    if (logType) {
      const backgroundColor = logTypeIndex === 0 ? "#001219" : "#26ace2";
      const borderColor = logTypeIndex === 0 ? "#001219" : "#26ace2";

      let logData: any;
      if (ouraLogTypes.some((logType) => logType.id === logTypeId)) {
        logData = allDayLabels.map((day) => {
          const ouraLog = ouraLogsData?.[logTypeId]?.find(
            (ouraLog) => ouraLog.day === day
          );
          return ouraLog ? ouraLog[logTypeId] : null;
        });
      } else if (
        PDLogTypes.some((logType) => logType.logType_id === logTypeId)
      ) {
        logData = allDayLabels.map((day) => {
          const logsOfLogType = PDLogsData?.find(
            (logs) => logs._id.logType_id === logTypeId
          );
          const log = logsOfLogType?.logs.find(
            (log) => convertDateToYMD(log.date.toString()) === day
          );
          return log ? log.value : null;
        });
      }

      if (Array.isArray(logData)) {
        logData = logData.flat();
      } else {
        console.error(
          "logData is not an array, have you entered start and end dates?:",
          logData
        );
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

  const chartData = {
    labels: getUniqueDayLabels(),
    datasets: selectedLogTypes
      .map((logTypeId, index) => getChartDataForLogType(logTypeId, index))
      .filter((dataset) => dataset !== null) as ChartDataset<
      "line",
      number[]
    >[],
  };
  useEffect(() => {
    console.log(
      "PDLogsIsLoading, ouraLogsIsLoading ",
      PDLogsIsLoading,
      ouraLogsIsLoading
    );
  });
  return ouraLogTypeCategoriesData ? (
    <>
      <Typography variant="h5">All logs graph</Typography>
      <br />
      <Typography variant="subtitle2">
        Select a date range and up to two log types for which to display logs.
      </Typography>
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

      {PDLogsIsLoading || ouraLogsIsLoading ? (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </div>
      ) : (
        <Line
          data={chartData}
          options={generateChartOptions(selectedLogTypes)}
        />
      )}

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
