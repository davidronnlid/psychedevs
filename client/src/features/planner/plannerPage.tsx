import { useFetchLogTypes } from "../../functions/logTypesHooks";
import LogTypesData from "../../components/logTypes/logTypes";
import Typography from "@mui/material/Typography";
import AddLogTypeForm from "../../components/logTypes/addLogTypes";

const Planner = () => {
  const [inProcessOfLoading, err] = useFetchLogTypes();

  return (
    <>
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

        <AddLogTypeForm />
      </div>
    </>
  );
};

export default Planner;
