import { useState } from "react";

import { LogType } from "../../typeModels/logTypeModel";
import { useFetchLogTypes } from "../../functions/logTypesHooks";
import LogTypesData from "../../components/logTypes/logTypes";
import Typography from "@mui/material/Typography";

const Planner = () => {
  const [logTypes, setLogTypes] = useState<LogType[]>([]);

  const [inProcessOfLoading, err] = useFetchLogTypes();

  return (
    <>
      {logTypes}
      <Typography variant="h4" gutterBottom>
        Logs Planner
      </Typography>
      <Typography variant="h5" gutterBottom>
        What's planned
      </Typography>
      <div>
        {inProcessOfLoading && <p>Loading...</p>}
        {err && <p>Error: {err}</p>}
        {!inProcessOfLoading && !err && <LogTypesData />}
      </div>
    </>
  );
};

export default Planner;
