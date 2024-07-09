import { Line } from "react-chartjs-2";
import { useFetchOuraLogsQuery } from "../../redux/ouraAPI/logs/ouraLogsAPI";
import { Chart, ChartDataset } from "chart.js";
import { LinearScale } from "chart.js/auto";
import React, { useState, useEffect, useMemo } from "react";
import {
  Autocomplete,
  TextField,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useOuraLogTypes } from "../../functions/useOuraLogTypes";
import { calculateCorrelation } from "../../functions/correlations";
import { useFetchOuraLogTypeCategoriesQuery } from "../../redux/ouraAPI/logTypeCategories/ouraLogTypeCategoriesAPI";
import DateRangePicker from "../../components/dateRangePicker";
import { selectLogTypes } from "../../redux/logTypesSlice";
import { useAppSelector } from "../../redux/hooks";
import { useFetchLogsQuery } from "../../redux/logsAPI/logsAPI";
import { Log } from "../../typeModels/logTypeModel";
import {
  CorrelationCalculationInput,
  CorrelationDataPoint,
} from "../../typeModels/statsModel";
import VerticalSpacer from "../../components/VerticalSpacer";
import { CorrelationComponent } from "./CorrelationComponent";
import { CorrelationDataType } from "../../typeModels/correlationModel";
import LogTypeSelectorComponent from "../../components/logTypeSelector";

function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

Chart.register(LinearScale);

type ChartOptionsType = {
  responsive: boolean;
  maintainAspectRatio: boolean;
  scales: {
    y1: {
      type: "linear";
      position: "left";
      beginAtZero: true;
      display: boolean;
      min: number;
      max: number;
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
      type: "linear" | "time";
      position: "right";
      beginAtZero: true;
      display: boolean;
      min: number;
      max: number;
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
  const [correlationData, setCorrelationData] = useState<CorrelationDataType>({
    correlation: null,
    pValue: 1,
    requiredSampleSize: null,
    existingSampleSize: null,
  });

  const PDLogTypes = useAppSelector(selectLogTypes);

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
      unit: logType.unit,
    }));

    const pdMapped = PDLogTypes.map((logType) => ({
      id: logType.logType_id,
      label: logType.name,
      unit: logType.unit,
    }));

    return [...ouraMapped, ...pdMapped];
  }, [ouraLogTypes, PDLogTypes]);

  const defaultSelectedLogTypes = useMemo(() => {
    const defaults = ["average_hrv", "total_sleep_duration"];
    return defaults.filter((logTypeId) =>
      allLogTypes.some((logType) => logType.id === logTypeId)
    );
  }, [allLogTypes]);

  const [selectedLogTypes, setSelectedLogTypes] = useState<string[]>([]);

  useEffect(() => {
    if (selectedLogTypes.length === 0) {
      setSelectedLogTypes(defaultSelectedLogTypes);
    }
  }, [defaultSelectedLogTypes, selectedLogTypes]);

  const [search, setSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const {
    data: ouraLogTypeCategoriesData,
    error: ouraLogTypeCategoriesError,
    isLoading: ouraLogTypeCategoriesLoading,
    isSuccess: ouraLogTypeCategoriesSuccess,
  } = useFetchOuraLogTypeCategoriesQuery();

  const generateChartOptions = (selectedLogTypes: string[]) => {
    const y1LogType = allLogTypes.find(
      (log) => log && selectedLogTypes.indexOf(log.id ?? "") === 0
    );
    const y2LogType = allLogTypes.find(
      (log) => log && selectedLogTypes.indexOf(log.id ?? "") === 1
    );

    const y1AxisDisplay = !!y1LogType;
    const y2AxisDisplay = !!y2LogType;

    console.log(y1LogType, " is y1LogType");

    let y1MinValue = Number.POSITIVE_INFINITY;
    let y1MaxValue = Number.NEGATIVE_INFINITY;
    let y2MinValue = Number.POSITIVE_INFINITY;
    let y2MaxValue = Number.NEGATIVE_INFINITY;

    if (chartData.datasets && chartData.datasets.length > 0) {
      chartData.datasets.forEach((dataset: any) => {
        if (dataset.yAxisID === "y1") {
          dataset.data.forEach((value: number) => {
            if (value < y1MinValue) y1MinValue = value;
            if (value > y1MaxValue) y1MaxValue = value;
          });
        } else if (dataset.yAxisID === "y2") {
          dataset.data.forEach((value: number) => {
            if (value < y2MinValue) y2MinValue = value;
            if (value > y2MaxValue) y2MaxValue = value;
          });
        }
      });
    }

    // Calculate margins
    const y1Margin = (y1MaxValue - y1MinValue) * 0.025;
    const y2Margin = (y2MaxValue - y2MinValue) * 0.025;

    const chartOptions: ChartOptionsType = {
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        y1: {
          type: "linear",
          position: "left",
          beginAtZero: true,
          display: y1AxisDisplay,
          min: y1MinValue - y1Margin,
          max: y1MaxValue + y1Margin,
          title: {
            display: y1AxisDisplay,
            text: y1LogType
              ? y1LogType.label +
                " " +
                "(" +
                capitalizeFirstLetter(y1LogType.unit) +
                ")"
              : "",
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
          min: y2MinValue - y2Margin,
          max: y2MaxValue + y2Margin,
          title: {
            display: y2AxisDisplay,
            text: y2LogType
              ? y2LogType.label +
                " " +
                "(" +
                capitalizeFirstLetter(y2LogType.unit) +
                ")"
              : "",
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
    const allDayLabels = new Set<string>();

    selectedLogTypes.forEach((logTypeId) => {
      let dayLabelsForLogType;

      if (PDLogTypes.some((PDLType) => PDLType.logType_id === logTypeId)) {
        dayLabelsForLogType = PDLogsData?.filter(
          (PDLogsOfAPDLogType: any) =>
            PDLogsOfAPDLogType._id.logType_id === logTypeId
        ).flatMap((PDLogsOfAPDLogType: any) =>
          PDLogsOfAPDLogType.logs.map((log: Log) =>
            convertDateToYMD(log.date.toString())
          )
        );
      } else {
        dayLabelsForLogType = ouraLogsData?.[logTypeId]?.map(
          (ouraLog: any) => ouraLog.day
        );
      }

      if (dayLabelsForLogType) {
        dayLabelsForLogType.forEach((dayLabel: string) => {
          if (!allDayLabels.has(dayLabel)) {
            allDayLabels.add(dayLabel);
          }
        });
      }
    });

    const uniqueDayLabels = Array.from(allDayLabels);

    uniqueDayLabels.sort();

    return uniqueDayLabels;
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
          return ouraLog?.[logTypeId] ?? null;
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
          return log?.value ?? null;
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
        label:
          logType.label + " " + "(" + capitalizeFirstLetter(logType.unit) + ")",
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
    // Purpose of this useEffect is to calculate correlation data and set correlation state
    const uniqueDayLabels = getUniqueDayLabels();

    const dataOfALogTypeForCorrelationCalculation = (logTypeId: string) => {
      console.log(
        "useEffect to calculate correlation was called!!",
        logTypeId,
        uniqueDayLabels
      );

      const logType = allLogTypes.find((log) => log.id === logTypeId);

      if (logType) {
        let logData: any;

        if (ouraLogTypes.some((logType) => logType.id === logTypeId)) {
          logData = uniqueDayLabels.map((day) => {
            const ouraLog = ouraLogsData?.[logTypeId]?.find(
              (ouraLog) => ouraLog.day === day
            );
            const logToReturn: CorrelationDataPoint = {
              value: ouraLog?.[logTypeId] ?? null,
              day: ouraLog?.day ?? null,
            };

            return logToReturn;
          });

          console.log(
            "useEffect to calculate correlation, ouraLogs: ",
            logData
          );
        } else if (
          PDLogTypes.some((logType) => logType.logType_id === logTypeId)
        ) {
          logData = uniqueDayLabels.map((day) => {
            const logsOfLogType = PDLogsData?.find(
              (logs) => logs._id.logType_id === logTypeId
            );
            const log = logsOfLogType?.logs.find(
              (log) => convertDateToYMD(log.date.toString()) === day
            );

            const dayVal = log?.date
              ? convertDateToYMD(log.date.toString())
              : null;

            const logToReturn: CorrelationDataPoint = {
              value: log?.value ?? null,
              day: dayVal,
            };

            return logToReturn ?? null;
          });
          console.log("useEffect to calculate correlation,  PDLogs: ", logData);
        }

        if (Array.isArray(logData)) {
          logData = logData.flat();
          return logData;
        } else {
          console.error(
            "logData is not an array, have you entered start and end dates?:",
            logData
          );
        }
      }
    };

    console.log(
      "before setting dataForCorrelationCalculation, ",
      selectedLogTypes
    );

    const dataForCorrelationCalculation = selectedLogTypes.map((logTypeId) =>
      dataOfALogTypeForCorrelationCalculation(logTypeId)
    );

    if (dataForCorrelationCalculation.length > 1) {
      console.log("YOOO setting this", dataForCorrelationCalculation);

      setCorrelationData(calculateCorrelation(dataForCorrelationCalculation));
    }

    console.log("YOOO", correlationData);
  }, [ouraLogsData, PDLogsData, selectedLogTypes]);

  return ouraLogTypeCategoriesData ? (
    <>
      <Typography variant="h5">All logs graph</Typography>

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
      <VerticalSpacer size="1rem" />

      <LogTypeSelectorComponent
        selectedLogTypes={selectedLogTypes}
        setSelectedLogTypes={setSelectedLogTypes}
      />
      <br />
      <DateRangePicker
        onStartDateChange={handleStartDateChange}
        onEndDateChange={handleEndDateChange}
      />
      <VerticalSpacer size="1rem" />
      {correlationData.correlation ? (
        <CorrelationComponent
          selectedLogTypes={selectedLogTypes}
          correlationData={correlationData}
        />
      ) : null}
    </>
  ) : (
    <></>
  );
};

export default AllLogsGraph;
