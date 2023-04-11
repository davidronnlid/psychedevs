import { useFetchLogTypes } from "../../functions/logTypesHooks";
import LogTypesData from "../../components/logTypes/logTypesUI";
import Typography from "@mui/material/Typography";
import AddLogTypeForm from "../../components/logTypes/addLogTypes";
import VerticalSpacer from "../../components/VerticalSpacer";
import { Button, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import OuraData from "../../components/oura/ouraData";

import { useState } from "react";
import { useJwt } from "../../redux/authSlice";

const Planner = () => {
  const token = useJwt();

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

  const [isToggled, setIsToggled] = useState(false);

  const handleToggle = () => {
    setIsToggled(!isToggled);
  };

  const handleIntegrateOura = async () => {
    const baseUrl =
      process.env.NODE_ENV === "development"
        ? process.env.REACT_APP_BACKEND_LOCAL_URL
        : process.env.REACT_APP_PROD_URL;

    console.log("About to send req to /oura/auth");

    try {
      const response = await fetch(`${baseUrl}/oura/auth`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Error fetching HRV data");
      }
      const data = await response.json();
      console.log(
        "🚀 ~ file: plannerPage.tsx:43 ~ handleIntegrateOura ~ data:",
        data
      );

      // Redirect the user to the Oura authentication URL
      window.location.href = data.redirectUrl;
    } catch (error) {
      console.log(error);
      // setError(error.message);
    } finally {
    }
  };

  return (
    <>
      <VerticalSpacer size="3rem" />

      <Typography variant="h4" gutterBottom>
        Logs planner
      </Typography>
      <VerticalSpacer size="1rem" />

      <Button onClick={() => handleIntegrateOura()}>Integrate with Oura</Button>

      <Button variant="contained" onClick={handleToggle}>
        Load oura data
      </Button>
      {isToggled && <OuraData />}

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
    </>
  );
};

export default Planner;
