import React, { useState } from "react";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import InfoIcon from "@mui/icons-material/Info";

interface UsernameValidationProps {
  onUsernameValid: (isValid: boolean) => void;
  onUsernameChange: (newUsername: string) => void;
  username: string;
}

const UsernameValidation: React.FC<UsernameValidationProps> = ({
  onUsernameValid,
  onUsernameChange,
  username,
}) => {
  const validateUsername = (username: string): boolean => {
    const minLength = 3;
    const maxLength = 30;
    const isValid =
      /^[a-zA-Z0-9-_]+$/.test(username) &&
      username.length >= minLength &&
      username.length <= maxLength;
    return isValid;
  };

  const onUserNChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newUsername = event.target.value;
    onUsernameValid(validateUsername(newUsername));
    onUsernameChange(newUsername);
  };

  return (
    <div className="Username-validation">
      <label htmlFor="Username">Username:</label>
      <Tooltip
        style={{ cursor: "default" }}
        title="Username must be 3-30 characters long and can only include letters, numbers, hyphens, and underscores."
        arrow
        placement="top-start"
      >
        <IconButton>
          <InfoIcon />
        </IconButton>
      </Tooltip>
      <br />
      <input
        type="username"
        id="username"
        name="username"
        value={username}
        onChange={onUserNChange}
      />
    </div>
  );
};

export default UsernameValidation;
