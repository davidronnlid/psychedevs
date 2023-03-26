import { Button, Checkbox, FormControlLabel } from "@mui/material";
import React, { useState } from "react";
import { useAddLogType } from "../../functions/logTypesHooks";
import { useAppDispatch } from "../../redux/hooks";
import { addLogType } from "../../redux/logTypesSlice";
import ConfirmationMessage from "../confirmationMessage";

const AddLogTypeForm = () => {
  const dispatch = useAppDispatch();

  const [addLogTypeToDB] = useAddLogType();

  const [name, setName] = useState("");
  const [answerFormat, setAnswerFormat] = useState("");

  const [selectedWeekdays, setSelectedWeekdays] = useState<boolean[]>([
    true,
    true,
    true,
    true,
    true,
    true,
    true,
  ]);

  const weekdays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const [isSaved, setIsSaved] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(
      addLogType({
        answer_format: answerFormat,
        name,
        weekdays: selectedWeekdays,
      })
    );
    addLogTypeToDB({
      answer_format: answerFormat,
      name,
      weekdays: selectedWeekdays,
    });
    setName("");
    setAnswerFormat("");
    setSelectedWeekdays([]);
    setIsSaved(true);
  };

  return (
    <>
      <h2>Add new log type</h2>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column" }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginBottom: "10px",
          }}
        >
          <label style={{ marginBottom: "5px" }}>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              padding: "5px",
              borderRadius: "5px",
              border: "1px solid gray",
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginBottom: "10px",
          }}
        >
          <label style={{ marginBottom: "5px" }}>Answer Format:</label>
          <input
            type="text"
            value={answerFormat}
            onChange={(e) => setAnswerFormat(e.target.value)}
            style={{
              padding: "5px",
              borderRadius: "5px",
              border: "1px solid gray",
            }}
          />
        </div>
        {name.length > 0 || answerFormat.length > 0 ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginBottom: "10px",
            }}
          >
            <label style={{ marginBottom: "5px" }}>
              Weekdays to log the new log type:
            </label>
            <div style={{ width: "400px", overflowX: "auto" }}>
              {weekdays.map((weekday, index) => (
                <FormControlLabel
                  key={weekday}
                  control={
                    <Checkbox
                      checked={selectedWeekdays[index]}
                      onChange={(e) => {
                        const { checked } = e.target;
                        setSelectedWeekdays((prev) =>
                          prev.map((value, i) =>
                            i === index ? checked : value
                          )
                        );
                      }}
                    />
                  }
                  label={weekday}
                />
              ))}
            </div>
          </div>
        ) : null}

        <Button
          variant="contained"
          color="primary"
          type="submit"
          style={{ marginBottom: "10px" }}
        >
          Add Log Type
        </Button>
      </form>
      <ConfirmationMessage
        message="Log type saved successfully"
        state={isSaved}
        stateSetter={setIsSaved}
      />
    </>
  );
};

export default AddLogTypeForm;
