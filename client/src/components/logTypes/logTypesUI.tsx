import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { selectLogTypes, setLogTypes } from "../../redux/logTypesSlice";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";
import { LogType } from "../../typeModels/logTypeModel";
import { useJwt } from "../../redux/authSlice";
import ConfirmationMessage from "../confirmationMessage";
import EditIcon from "@mui/icons-material/Edit";
import LogTypeEditForm from "./logTypeEditForm";

const LogTypesData = () => {
  const [namesOfLogTypesToRemove, setNamesOfLogTypesToRemove] = useState<
    string[]
  >([]);
  const [deletedSuccess, setDeletedSuccess] = useState<boolean>(false);
  const [editMode, setEditMode] = useState(false);
  const [editingLogType, setEditingLogType] = useState<LogType | null>(null);

  const dispatch = useAppDispatch();

  const logTypes = useAppSelector(selectLogTypes);

  const token = useJwt();

  const filteredLogTypes = logTypes.filter(
    (logType: LogType) => !namesOfLogTypesToRemove.includes(logType.name)
  );

  const handleEditLogType = (logType: any) => {
    setEditingLogType(logType);
    setEditMode(true);
  };

  const handleSaveLogType = async (updatedLogType: LogType) => {
    const response = await fetch("/logs/log-types", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedLogType),
    });

    const updatedLogTypes = await response.json();
    dispatch(setLogTypes(updatedLogTypes));
    setEditMode(false);
    setEditingLogType(null);
  };

  const boolArrToWeekdays = (boolArr: boolean[]): string[] => {
    const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return boolArr.reduce((acc: string[], curr, index) => {
      if (curr) {
        acc.push(weekdays[index]);
      }
      return acc;
    }, []);
  };

  const weekdayedLogTypes = filteredLogTypes.map((logType: any) => ({
    ...logType,
    weekdays: boolArrToWeekdays(logType.weekdays),
  }));

  const handleRemoveWorkInProgress = (logTypeName: string) => {
    setNamesOfLogTypesToRemove([...namesOfLogTypesToRemove, logTypeName]);
  };

  const removeNamesOflogTypesToRemove = () => {
    setNamesOfLogTypesToRemove([]);
  };

  const confirmRemoval = async () => {
    console.log("removal confirmation func activated", namesOfLogTypesToRemove);
    const baseUrl =
      process.env.NODE_ENV === "development"
        ? process.env.REACT_APP_BACKEND_LOCAL_URL
        : process.env.REACT_APP_PROD_URL;

    try {
      const namesString = namesOfLogTypesToRemove.join(",,");

      const response = await fetch(
        `${baseUrl}/logs/log-types?names=${namesString}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data = await response.json();

      dispatch(setLogTypes(data));
      setDeletedSuccess(true);
    } catch (error) {
      console.error("Error removing log type: ", error);
    }

    setNamesOfLogTypesToRemove([]);
  };

  return (
    <>
      <TableContainer
        component={Paper}
        sx={{
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ "&:hover": { backgroundColor: "transparent" } }}>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  borderRight: "1px solid gray",
                }}
              >
                Log type name
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  borderRight: "1px solid gray",
                }}
              >
                Answer format
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  borderRight: "1px solid gray",
                }}
              >
                Weekdays to log
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {weekdayedLogTypes.map((logType) => (
              <>
                <TableRow
                  key={logType.name}
                  sx={{
                    "&:nth-of-type(odd)": {
                      backgroundColor: "rgba(0, 0, 0, 0.01)",
                    },
                    "&.MuiBox-root": {
                      // Add your custom styles here
                      border: "none",
                    },
                  }}
                >
                  <TableCell style={{ borderRight: "1px solid gray" }}>
                    {logType.name}
                  </TableCell>
                  <TableCell style={{ borderRight: "1px solid gray" }}>
                    {logType.answer_format}
                  </TableCell>
                  <TableCell style={{ borderRight: "1px solid gray" }}>
                    {logType.weekdays.join(", ")}
                  </TableCell>
                  <TableCell>
                    <DeleteIcon
                      onClick={() => handleRemoveWorkInProgress(logType.name)}
                      sx={{ cursor: "pointer" }}
                    />
                    <EditIcon
                      onClick={() => handleEditLogType(logType)}
                      sx={{ cursor: "pointer", marginLeft: 1 }}
                    />
                  </TableCell>
                </TableRow>
              </>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {namesOfLogTypesToRemove.length > 0 ? (
        <>
          <Button onClick={() => confirmRemoval()}>Confirm removal</Button>
          <Button onClick={() => removeNamesOflogTypesToRemove()}>
            Cancel
          </Button>
        </>
      ) : null}

      {deletedSuccess ? (
        <ConfirmationMessage
          message="Successfully deleted log types"
          state={deletedSuccess}
          stateSetter={setDeletedSuccess}
        />
      ) : null}
      {editMode ? (
        <Box>
          <LogTypeEditForm
            onSubmit={handleSaveLogType}
            onCancel={() => {
              setEditMode(false);
              setEditingLogType(null);
            }}
            logType={editingLogType}
            editMode
          />
        </Box>
      ) : null}
    </>
  );
};
export default LogTypesData;
