import React from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { Dispatch, SetStateAction } from "react";

interface Props {
  message: string;
  state: boolean;
  stateSetter: Dispatch<SetStateAction<boolean>>;
}

const WarningMessage: React.FC<Props> = ({ message, state, stateSetter }) => {
  return (
    <>
      <Snackbar
        open={state}
        autoHideDuration={5000} // Hide warning message after 5 seconds
        onClose={() => stateSetter(false)}
      >
        <Alert
          onClose={() => stateSetter(false)}
          severity="warning"
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default WarningMessage;
