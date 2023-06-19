import EditIcon from "@mui/icons-material/Edit";
import {
  Button,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  TableBody,
} from "@mui/material";
import { useState } from "react";
import {
  FetchLogsResponseElement,
  Log,
  LogType,
} from "../../typeModels/logTypeModel";
import { useJwt } from "../../redux/authSlice";
import ConfirmationMessage from "../../components/alerts/confirmationMessage";

interface CollectedLogsProps {
  dateToDisplay: any;
  collectedLogTypes: LogType[];
  logsOfToday: FetchLogsResponseElement[] | undefined;
}

const CollectedLogs = ({
  dateToDisplay,
  collectedLogTypes,
  logsOfToday,
}: CollectedLogsProps) => {
  const token = useJwt();

  // Update log values state, functions and properties below
  const [editable, setEditable] = useState(false);
  const [updatedLogs, setUpdatedLogs] = useState<FetchLogsResponseElement[]>(
    []
  );
  const [confirmationMessageOpen, setConfirmationMessageOpen] = useState(false);

  const handleStartEditing = () => {
    setEditable(true);
  };

  const handleSaveUpdatedLogs = async () => {
    setEditable(false);
    console.log("updatedLogs ", updatedLogs);

    // Send PUT request to server to update the logs in the database
    try {
      const baseUrl =
        process.env.NODE_ENV === "development"
          ? process.env.REACT_APP_BACKEND_LOCAL_URL
          : process.env.REACT_APP_PROD_URL;

      const response = await fetch(`${baseUrl}/vas/logs`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token, // Assuming you have the token
        },
        body: JSON.stringify(updatedLogs),
      });

      if (!response.ok) {
        throw new Error("Failed to update logs");
      }

      if (response.ok) {
        setConfirmationMessageOpen(true);
      }
    } catch (error) {
      console.error("Error updating logs:", error);
    }
    setUpdatedLogs([]);
  };
  return (
    <>
      {" "}
      <Typography variant="h4" component="h1" gutterBottom>
        Logs <b>collected</b> today, {dateToDisplay}
      </Typography>
      <TableContainer component={Paper} sx={{}}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <b>Log Type Names</b>
              </TableCell>
              {editable ? (
                <>
                  Editing values |{" "}
                  <Button
                    color="primary"
                    size="small"
                    onClick={handleSaveUpdatedLogs}
                  >
                    Save
                  </Button>
                  |
                  <Button
                    color="primary"
                    size="small"
                    onClick={() => setEditable(false)}
                  >
                    {" "}
                    Cancel
                  </Button>
                </>
              ) : (
                <p>
                  Values |{" "}
                  <EditIcon
                    sx={{ cursor: "pointer" }}
                    onClick={handleStartEditing}
                  />
                </p>
              )}{" "}
            </TableRow>
          </TableHead>
          <TableBody>
            {collectedLogTypes.map((logType: LogType) => {
              const fetchLogsResponseElementOfLogTypeCollectedToday =
                logsOfToday?.find(
                  (fetchLogsResponseElement) =>
                    fetchLogsResponseElement.logs[0].logType_id ===
                    logType.logType_id
                );
              return (
                <TableRow key={logType.logType_id}>
                  <TableCell>
                    {logType.name} <i>({logType.answer_format})</i>
                  </TableCell>
                  {editable ? (
                    <TableCell
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => {
                        const updatedValue = parseFloat(
                          e.target.textContent ?? ""
                        );
                        const editingLogOfLogTypeId =
                          fetchLogsResponseElementOfLogTypeCollectedToday?._id
                            .logType_id;

                        // Check if the value is within the allowed range based on the answer_format
                        const isValueWithinRange =
                          (logType.answer_format === "1-5 scale" &&
                            updatedValue >= 1 &&
                            updatedValue <= 5) ||
                          (logType.answer_format === "1-10 scale" &&
                            updatedValue >= 1 &&
                            updatedValue <= 10);

                        if (
                          editingLogOfLogTypeId &&
                          fetchLogsResponseElementOfLogTypeCollectedToday
                            ?.logs[0].value !== updatedValue &&
                          !isNaN(updatedValue)
                        ) {
                          if (isValueWithinRange) {
                            let updatedLog: FetchLogsResponseElement = {
                              ...fetchLogsResponseElementOfLogTypeCollectedToday,
                              logs: fetchLogsResponseElementOfLogTypeCollectedToday.logs.map(
                                (log: Log) => ({ ...log, value: updatedValue })
                              ),
                            };
                            console.log(
                              "🚀 ~ file: logger.tsx:345 ~ {collectedLogtypes.map ~ updatedLog:",
                              updatedLog
                            );

                            setUpdatedLogs([...updatedLogs, updatedLog]);
                          } else {
                            // Reset the input value to the original log value if it's not within the allowed range
                            e.target.textContent =
                              fetchLogsResponseElementOfLogTypeCollectedToday
                                ?.logs[0].value !== undefined
                                ? fetchLogsResponseElementOfLogTypeCollectedToday.logs[0].value.toString()
                                : "";
                          }
                        }
                      }}
                    >
                      {
                        fetchLogsResponseElementOfLogTypeCollectedToday?.logs[0]
                          .value
                      }
                    </TableCell>
                  ) : (
                    <TableCell>
                      {
                        fetchLogsResponseElementOfLogTypeCollectedToday?.logs[0]
                          .value
                      }
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <ConfirmationMessage
        message="Success! Your new logs for today were saved."
        state={confirmationMessageOpen}
        stateSetter={setConfirmationMessageOpen}
      />
    </>
  );
};

export default CollectedLogs;
