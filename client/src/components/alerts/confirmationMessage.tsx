import { CheckCircle } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import Snackbar from "@mui/material/Snackbar";
import SnackbarContent from "@mui/material/SnackbarContent";
import { Dispatch, SetStateAction } from "react";

interface Props {
  message: string;
  state: boolean;
  stateSetter: Dispatch<SetStateAction<boolean>>;
}

const ConfirmationMessage: React.FC<Props> = ({
  message,
  state,
  stateSetter,
}) => {
  return (
    <Snackbar
      open={state}
      autoHideDuration={5000} // Hide success message after 5 seconds
      onClose={() => stateSetter(false)}
    >
      <SnackbarContent
        message={message}
        action={
          <IconButton
            size="small"
            color="inherit"
            onClick={() => stateSetter(false)}
          >
            <CheckCircle fontSize="small" />
          </IconButton>
        }
      />
    </Snackbar>
  );
};

export default ConfirmationMessage;
