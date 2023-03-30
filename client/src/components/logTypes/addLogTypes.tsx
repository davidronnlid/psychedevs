import React, { useState } from "react";
import { Button, Checkbox, FormControlLabel } from "@mui/material";
import { useAddLogType } from "../../functions/logTypesHooks";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { addLogType, selectLogTypes } from "../../redux/logTypesSlice";
import ConfirmationMessage from "../confirmationMessage";
import SelectAnswerFormat from "./selectAnswerFormat";
import { selectAnswerFormats } from "../../redux/answerFormatsSlice";
import SelectName from "./selectName";

interface Props {}

const AddLogTypeForm: React.FC<Props> = () => {
  const dispatch = useAppDispatch();

  const logTypesOfUser = useAppSelector(selectLogTypes);

  const nameExists = (name: string) => {
    return logTypesOfUser.some(
      (logType) => logType.name.toLowerCase() === name.toLowerCase()
    );
  };

  const [nameError, setNameError] = useState<string>("");

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setName(newName);

    if (nameExists(newName)) {
      setNameError("Name already exists. Please make some change to the name.");
    } else {
      setNameError("");
    }
  };

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
    { label: "Mon", value: selectedWeekdays[0] },
    { label: "Tue", value: selectedWeekdays[1] },
    { label: "Wed", value: selectedWeekdays[2] },
    { label: "Thu", value: selectedWeekdays[3] },
    { label: "Fri", value: selectedWeekdays[4] },
    { label: "Sat", value: selectedWeekdays[5] },
    { label: "Sun", value: selectedWeekdays[6] },
  ];

  const [isSaved, setIsSaved] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    addLogTypeToDB({
      answer_format: answerFormat,
      name,
      weekdays: selectedWeekdays,
      logType_id: "",
    });

    dispatch(
      addLogType({
        answer_format: answerFormat,
        name,
        weekdays: selectedWeekdays,
        logType_id: "",
      })
    );

    setName("");
    setAnswerFormat("");
    setSelectedWeekdays([true, true, true, true, true, true, true]);
    setIsSaved(true);
  };

  const answerFormats = useAppSelector(selectAnswerFormats);

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
          <SelectName
            handleNameChange={handleNameChange}
            nameError={nameError}
            name={name}
          />

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginBottom: "10px",
            }}
          >
            <SelectAnswerFormat
              setParentAnswerFormat={setAnswerFormat}
              defaultAnswerFormat={answerFormats.answerFormats[0].answer_format}
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
                    key={index}
                    control={
                      <Checkbox
                        checked={weekday.value}
                        onChange={() =>
                          setSelectedWeekdays((prevState) =>
                            prevState.map((item, idx) =>
                              idx === index ? !item : item
                            )
                          )
                        }
                      />
                    }
                    label={weekday.label}
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
            disabled={nameError.length > 0}
          >
            Add Log Type
          </Button>
        </div>
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
