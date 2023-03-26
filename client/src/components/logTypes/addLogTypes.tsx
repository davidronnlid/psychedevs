import { Button } from "@mui/material";
import React, { useState } from "react";
import { useAddLogType } from "../../functions/logTypesHooks";
import ConfirmationMessage from "../confirmationMessage";

const AddLogTypeForm = () => {
  const [addLogType, isLoading, error] = useAddLogType();

  const [name, setName] = useState("");
  const [answerFormat, setAnswerFormat] = useState("");

  const [isSaved, setIsSaved] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addLogType({ answer_format: answerFormat, name });
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
