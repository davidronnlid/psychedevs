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
import { LogType } from "../../typeModels/logTypeModel";
import SelectAnswerFormat from "./selectAnswerFormat";
import VerticalSpacer from "../VerticalSpacer";

interface LogTypeEditFormProps {
  onSubmit: (updatedLogType: LogType) => Promise<void>;
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
  const [name, setName] = useState(editMode ? logType?.name || "" : "");
  const [answerFormat, setAnswerFormat] = useState(
    editMode ? logType?.answer_format || "" : ""
  );
  const [selectedWeekdays, setSelectedWeekdays] = useState(
    editMode
      ? logType?.weekdays || [true, true, true, true, true, true, true]
      : [true, true, true, true, true, true, true]
  );
  const handleWeekdayChange = (weekdayIndex: number) => {
    const newSelectedWeekdays = [...selectedWeekdays];
    newSelectedWeekdays[weekdayIndex] = !newSelectedWeekdays[weekdayIndex];
    setSelectedWeekdays(newSelectedWeekdays);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const logType: LogType = {
      name,
      answer_format: answerFormat,
      weekdays: selectedWeekdays,
    };
    onSubmit(logType);
    setEditMode(false);
  };

  const weekdayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <Dialog open={editMode} onClose={onCancel}>
      <DialogTitle>{editMode ? "Edit Log Type" : null}</DialogTitle>
      <VerticalSpacer size={"3rem"} />
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <TextField
              label="Log Type Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <SelectAnswerFormat setParentAnswerFormat={setAnswerFormat} />

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
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onCancel()}>Cancel</Button>
        <Button type="submit" variant="contained">
          {editMode ? "Save" : null}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LogTypeEditForm;
