import React from "react";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import InfoIcon from "@mui/icons-material/Info";

interface PasswordValidationProps {
  onPasswordValid: (isValid: boolean) => void;
  onPasswordChange: (newPassword: string) => void;
  password: string;
}

const PasswordValidation: React.FC<PasswordValidationProps> = ({
  onPasswordValid,
  onPasswordChange,
  password,
}) => {
  const validatePassword = (password: string): boolean => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return (
      password.length >= minLength &&
      hasUpperCase &&
      hasLowerCase &&
      hasNumber &&
      hasSpecialChar
    );
  };

  const onPassChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = event.target.value;
    onPasswordValid(validatePassword(newPassword));
    onPasswordChange(newPassword);
  };

  return (
    <div className="password-validation">
      <label htmlFor="password">Password:</label>
      <Tooltip
        style={{ cursor: "default" }}
        title="Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character (e.g., !@#$%^&amp;*())."
        arrow
        placement="top-start"
        disableTouchListener={false}
        enterTouchDelay={0}
      >
        <IconButton>
          <InfoIcon />
        </IconButton>
      </Tooltip>
      <br />
      <input
        type="password"
        id="password"
        name="password"
        value={password}
        onChange={onPassChange}
      />
    </div>
  );
};

export default PasswordValidation;
