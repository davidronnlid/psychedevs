import React, { useState } from "react";
import {
  TextField,
  Button,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Box,
} from "@mui/material";
import { LogType } from "../../typeModels/logTypeModel";

interface LogTypeFormProps {
  onSubmit: (updatedLogType: LogType) => Promise<void>;
  onCancel: () => void;
  editMode: boolean;
  logType?: LogType | null;
}

const LogTypeForm: React.FC<LogTypeFormProps> = ({
  onSubmit,
  editMode,
  logType,
}) => {
  const [name, setName] = useState(editMode ? logType?.name || "" : "");
  const [answerFormat, setAnswerFormat] = useState(
    editMode ? logType?.answer_format || "" : ""
  );
  const [weekdays, setWeekdays] = useState(
    editMode ? logType?.weekdays || Array(7).fill(false) : Array(7).fill(false)
  );

  const handleWeekdayChange = (index: number) => {
    const newWeekdays = [...weekdays];
    newWeekdays[index] = !newWeekdays[index];
    setWeekdays(newWeekdays);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const logType: LogType = {
      name,
      answer_format: answerFormat,
      weekdays,
    };
    onSubmit(logType);
  };

  const weekdaysLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <form onSubmit={handleSubmit}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <TextField
          label="Log Type Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <TextField
          label="Answer Format"
          value={answerFormat}
          onChange={(e) => setAnswerFormat(e.target.value)}
          required
        />
        <FormControl component="fieldset">
          <FormLabel component="legend">Weekdays to log</FormLabel>
          <FormGroup row>
            {weekdaysLabels.map((label, index) => (
              <FormControlLabel
                key={label}
                control={
                  <Checkbox
                    checked={weekdays[index]}
                    onChange={() => handleWeekdayChange(index)}
                  />
                }
                label={label}
              />
            ))}
          </FormGroup>
        </FormControl>
        <Button type="submit" variant="contained">
          {editMode ? "Edit Log Type" : "Add Log Type"}
        </Button>
      </Box>
    </form>
  );
};

export default LogTypeForm;
