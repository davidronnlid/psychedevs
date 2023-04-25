import { useFetchLogTypes } from "../../functions/logTypesHooks";
import LogTypesData from "../../components/logTypes/logTypesUI";
import Typography from "@mui/material/Typography";
import AddLogTypeForm from "../../components/logTypes/addLogTypes";
import VerticalSpacer from "../../components/VerticalSpacer";
import { Button, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";

import { useState } from "react";

import OuraLogTypeCategories from "../logger/oura/ouraLogTypeCategories";

const Planner = () => {
  const [inProcessOfLoading, err] = useFetchLogTypes();
  const [showAddLogTypeForm, setShowAddLogTypeForm] = useState(false);
  const [addLogTypeButtonText, setAddLogTypeButtonText] =
    useState("Add new log type");

  const handleToggleAddLogTypeForm = () => {
    setShowAddLogTypeForm(!showAddLogTypeForm);
    setAddLogTypeButtonText(
      showAddLogTypeForm ? "Add new log type" : "Close log type creator"
    );
  };

  return (
    <>
      <VerticalSpacer size="3rem" />

      <Typography variant="h4" gutterBottom>
        Logs planner
      </Typography>
      <VerticalSpacer size="1rem" />

      <Typography variant="h5" gutterBottom>
        Planned log types
      </Typography>
      <VerticalSpacer size="0.75rem" />

      <div>
        {inProcessOfLoading && <p>Loading...</p>}
        {err && <p>Error: {err}</p>}
        {!inProcessOfLoading && !err && <LogTypesData />}
        <Box>
          <Button
            variant="contained"
            color="primary"
            onClick={handleToggleAddLogTypeForm}
            startIcon={showAddLogTypeForm ? <CloseIcon /> : <AddIcon />}
          >
            {addLogTypeButtonText}
          </Button>
          {showAddLogTypeForm && <AddLogTypeForm />}
        </Box>
      </div>
      <OuraLogTypeCategories />
    </>
  );
};

export default Planner;
