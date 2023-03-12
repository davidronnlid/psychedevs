import React from "react";
import { IconButton } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";

const BackButton: React.FC = () => {
  const handleBackButtonClick = () => {
    window.history.back();
  };

  return (
    <IconButton aria-label="back" onClick={handleBackButtonClick}>
      <ArrowBack />
    </IconButton>
  );
};

export default BackButton;
