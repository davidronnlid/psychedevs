import React, { useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { Dispatch, SetStateAction } from "react";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

interface Props {
  message: string;
  state: boolean;
  stateSetter: Dispatch<SetStateAction<boolean>>;
}

const InfoMessage: React.FC<Props> = ({ message, state, stateSetter }) => {
  return (
    <>
      <Snackbar
        open={state}
        autoHideDuration={5000} // Hide warning message after 3 seconds
        onClose={() => stateSetter(false)}
      >
        <Alert severity="info" sx={{ width: "100%" }}>
          {message}{" "}
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={() => stateSetter(false)}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Alert>
      </Snackbar>
    </>
  );
};

export default InfoMessage;
