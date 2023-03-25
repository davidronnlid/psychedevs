import { Button } from "@mui/material";
import React, { useState } from "react";
import { useAddLogType } from "../../functions/logTypesHooks";

const AddLogTypeForm = () => {
  const [addLogType, isLoading, error] = useAddLogType();

  const [name, setName] = useState("");
  const [answerFormat, setAnswerFormat] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addLogType({ answer_format: answerFormat, name });
    setName("");
    setAnswerFormat("");
  };

  return (
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
      </Button>{" "}
    </form>
  );
};

export default AddLogTypeForm;
