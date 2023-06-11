import React, { Dispatch, SetStateAction, useState } from "react";
import {
  TextField,
  Button,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
} from "@mui/material";
import { Log, LogType } from "../../typeModels/logTypeModel";
import SelectAnswerFormat from "./selectAnswerFormat";
import VerticalSpacer from "../VerticalSpacer";
import { selectAnswerFormats } from "../../redux/answerFormatsSlice";
import { useAppSelector } from "../../redux/hooks";
import SelectName from "./selectName";
import { selectLogTypes } from "../../redux/logTypesSlice";

interface LogTypeEditFormProps {
  onSubmit: (
    logTypeToUpdate: LogType,
    updatedLogType: LogType
  ) => Promise<void>;
  onCancel: () => void;
  editMode: boolean;
  logType?: LogType | null;
  setEditMode: Dispatch<SetStateAction<boolean>>;
}

const LogTypeEditForm: React.FC<LogTypeEditFormProps> = ({
  onSubmit,
  onCancel,
  editMode,
  logType,
  setEditMode,
}) => {
  console.log("Received logType in edit form", logType);
  const [name, setName] = useState(editMode ? logType?.name || "" : "");

  const [nameError, setNameError] = useState<string>("");

  const logTypesOfUser = useAppSelector(selectLogTypes);

  const nameExists = (name: string) => {
    return logTypesOfUser.some(
      (logType: LogType) => logType.name.toLowerCase() === name.toLowerCase()
    );
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setName(newName);

    if (newName !== logType?.name && nameExists(newName)) {
      setNameError("Name already exists. Please make some change to the name.");
    } else {
      setNameError("");
    }
  };

  const [answerFormat, setAnswerFormat] = useState(
    editMode ? logType?.answer_format || "" : ""
  );
  const [unit, setUnit] = useState(editMode ? logType?.unit || "" : "");

  console.log("logType?.weekdays: ", logType?.weekdays);
  const [selectedWeekdays, setSelectedWeekdays] = useState<boolean[]>(
    editMode
      ? logType?.weekdays || [true, true, true, true, true, true, true]
      : [true, true, true, true, true, true, true]
  );

  const handleWeekdayChange = (weekdayIndex: number) => {
    const newSelectedWeekdays = [...selectedWeekdays];
    newSelectedWeekdays[weekdayIndex] = !newSelectedWeekdays[weekdayIndex];
    setSelectedWeekdays(newSelectedWeekdays);
  };

  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement>,
    logTypeToUpdate: LogType
  ) => {
    e.preventDefault();
    const updatedLogType: LogType = {
      name,
      answer_format: answerFormat,
      weekdays: selectedWeekdays,
      unit,
      logType_id: logType ? logType.logType_id : "",
    };
    onSubmit(logTypeToUpdate, updatedLogType);
    setEditMode(false);
  };
  const weekdayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const answerFormats = useAppSelector(selectAnswerFormats);

  return (
    <Dialog open={editMode} onClose={onCancel}>
      <DialogTitle>{editMode ? "Log type editor" : null}</DialogTitle>
      <VerticalSpacer size={"1rem"} />
      <form
        onSubmit={(event) => {
          if (logType) {
            handleSubmit(event, logType);
          }
        }}
      >
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <SelectName
              handleNameChange={handleNameChange}
              nameError={nameError}
              name={name}
            />
            <SelectAnswerFormat
              setParentAnswerFormat={setAnswerFormat}
              defaultAnswerFormat={
                logType?.answer_format ||
                answerFormats.answerFormats[0].answer_format
              }
            />

            <FormControl component="fieldset">
              <FormLabel component="legend">Weekdays to log</FormLabel>
              <FormGroup row>
                {weekdayLabels.map((label, index) => (
                  <FormControlLabel
                    key={index}
                    control={
                      <Checkbox
                        checked={selectedWeekdays[index]}
                        onChange={() => handleWeekdayChange(index)}
                      />
                    }
                    label={label}
                  />
                ))}
              </FormGroup>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => onCancel()}>Cancel</Button>
          <Button type="submit" variant="contained">
            {editMode ? "Save" : null}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default LogTypeEditForm;
