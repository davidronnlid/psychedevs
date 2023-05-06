import { useFetchLogTypes } from "../../functions/logTypesHooks";
import { useAppSelector } from "../../redux/hooks";
import { selectLogTypes } from "../../redux/logTypesSlice";
import { Log, LogType } from "../../typeModels/logTypeModel";
import LogsOfALogType from "./vas_logs/logsOfALogType";
import {
  Select,
  MenuItem,
  FormControl,
  SelectChangeEvent,
  Box,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { calculateCorrelation } from "../../functions/correlations";
import VerticalSpacer from "../../components/VerticalSpacer";
import { selectLogs } from "../../redux/logsAPI/logsSlice";
import InfoModal from "../../components/InfoModal";
import AllLogsGraph from "./AllLogsGraph";

const LogsAnalyzerPage = () => {
  const [inProcessOfLoading, err] = useFetchLogTypes();
  const logTypes = useAppSelector(selectLogTypes);

  const logsData = useAppSelector(selectLogs);

  const [selectedLogTypeName, setSelectedLogTypeName] = useState("");
  const [selectedLogTypeNameTwo, setSelectedLogTypeNameTwo] = useState("");
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

  useEffect(() => {
    console.log(
      "🚀 ~ file: logsAnalyzerPage.tsx:46 ~ useEffect ~ selectedLogTypeIds:"
    );
  }, [selectedLogTypeName, selectedLogTypeNameTwo, inProcessOfLoading]);

  if (inProcessOfLoading) return <div>Loading...</div>;
  if (err) return <div>Error: {err}</div>;

  const handleChange = (event: SelectChangeEvent<string>) => {
    setSelectedLogTypeName(event.target.value);
  };

  const handleChangeTwo = (event: SelectChangeEvent<string>) => {
    setSelectedLogTypeNameTwo(event.target.value);
  };

  return (
    <>
      <VerticalSpacer size="2rem" />
      <Typography variant="h4" gutterBottom>
        Logs
      </Typography>
      <AllLogsGraph />
    </>
  );
};

export default LogsAnalyzerPage;
