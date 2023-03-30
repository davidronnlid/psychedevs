import React, { ChangeEventHandler } from "react";

interface SelectNameProps {
  name: string;
  handleNameChange: ChangeEventHandler<HTMLInputElement>;
  nameError?: string;
}

const SelectName: React.FC<SelectNameProps> = ({
  name,
  handleNameChange,
  nameError,
}) => {
  return (
    <>
      <label style={{ marginBottom: "5px" }}>Name:*</label>
      <input
        type="text"
        value={name}
        onChange={handleNameChange}
        style={{
          padding: "5px",
          borderRadius: "5px",
          border: nameError ? "1px solid red" : "1px solid gray",
        }}
        required
      />
      {nameError && (
        <p style={{ color: "red", fontSize: "0.8em", marginTop: "2px" }}>
          {nameError}
        </p>
      )}
    </>
  );
};

export default SelectName;
