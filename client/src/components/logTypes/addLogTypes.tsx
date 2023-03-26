import { Button } from "@mui/material";
import React, { useState } from "react";
import { useAddLogType } from "../../functions/logTypesHooks";
import { useAppDispatch } from "../../redux/hooks";
import { addLogType } from "../../redux/logTypesSlice";
import ConfirmationMessage from "../confirmationMessage";

const AddLogTypeForm = () => {
  const dispatch = useAppDispatch();

  const [addLogTypeToDB, isLoading, error] = useAddLogType();

  const [name, setName] = useState("");
  const [answerFormat, setAnswerFormat] = useState("");

  const [isSaved, setIsSaved] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(addLogType({ answer_format: answerFormat, name }));
    addLogTypeToDB({ answer_format: answerFormat, name });
    setName("");
    setAnswerFormat("");
    setIsSaved(true);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <br />
        <label>
          Answer Format:
          <input
            type="text"
            value={answerFormat}
            onChange={(e) => setAnswerFormat(e.target.value)}
          />
        </label>
        <br />
        <Button variant="contained" color="primary" type="submit">
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
