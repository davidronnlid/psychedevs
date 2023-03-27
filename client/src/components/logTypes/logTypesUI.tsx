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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Box from "@mui/system/Box";
import { useState } from "react";
import { LogType } from "../../typeModels/logTypeModel";
import { useJwt } from "../../redux/authSlice";
import ConfirmationMessage from "../confirmationMessage";

const LogTypesData = () => {
  const [namesOfLogTypesToRemove, setNamesOfLogTypesToRemove] = useState<
    string[]
  >([]);
  const [deletedSuccess, setDeletedSuccess] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  const logTypes = useAppSelector(selectLogTypes);

  const token = useJwt();

  const filteredLogTypes = logTypes.filter(
    (logType: LogType) => !namesOfLogTypesToRemove.includes(logType.name)
  );

  const boolArrToWeekdays = (boolArr: boolean[]): string[] => {
    const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return boolArr.reduce((acc: string[], curr, index) => {
      if (curr) {
        acc.push(weekdays[index]);
      }
      return acc;
    }, []);
  };

  const weekdayedLogTypes = filteredLogTypes.map((logType) => ({
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
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ borderRight: "1px solid gray" }}>
                Log type name
              </TableCell>
              <TableCell style={{ borderRight: "1px solid gray" }}>
                Answer format
              </TableCell>{" "}
              <TableCell style={{ borderRight: "1px solid gray" }}>
                Weekdays to log
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {weekdayedLogTypes.map((logType) => (
              <>
                <TableRow key={logType.name}>
                  <TableCell style={{ borderRight: "1px solid gray" }}>
                    {logType.name}
                  </TableCell>
                  <TableCell style={{ borderRight: "1px solid gray" }}>
                    {logType.answer_format}
                  </TableCell>
                  <TableCell style={{ borderRight: "1px solid gray" }}>
                    {logType.weekdays.join(", ")}
                  </TableCell>
                  <TableCell style={{ borderRight: "1px solid gray" }}>
                    <DeleteIcon
                      onClick={() => handleRemoveWorkInProgress(logType.name)}
                    />
                  </TableCell>
                </TableRow>
                <Box borderBottom={1} mx={3} />
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
    </>
  );
};
export default LogTypesData;
