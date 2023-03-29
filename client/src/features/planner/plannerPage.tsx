import { useFetchLogTypes } from "../../functions/logTypesHooks";
import LogTypesData from "../../components/logTypes/logTypesUI";
import Typography from "@mui/material/Typography";
import AddLogTypeForm from "../../components/logTypes/addLogTypes";
import VerticalSpacer from "../../components/VerticalSpacer";

const Planner = () => {
  const [inProcessOfLoading, err] = useFetchLogTypes();

  return (
    <>
      <VerticalSpacer size="3rem" />

      <Typography variant="h4" gutterBottom>
        Logs planner
      </Typography>
      <VerticalSpacer size="1rem" />

      <Typography variant="h5" gutterBottom>
        What's planned
      </Typography>
      <VerticalSpacer size="0.75rem" />

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
