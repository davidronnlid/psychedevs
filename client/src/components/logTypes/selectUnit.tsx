import React, { ChangeEventHandler } from "react";

interface SelectUnitProps {
  unit: string;
  handleUnitChange: ChangeEventHandler<HTMLInputElement>;
  unitError?: string;
}

const SelectUnit: React.FC<SelectUnitProps> = ({
  unit,
  handleUnitChange,
  unitError,
}) => {
  return (
    <>
      <label style={{ marginBottom: "5px" }}>Unit:*</label>
      <input
        type="text"
        value={unit}
        onChange={handleUnitChange}
        style={{
          padding: "5px",
          borderRadius: "5px",
          border: unitError ? "1px solid red" : "1px solid gray",
        }}
        required
      />
      {unitError && (
        <p style={{ color: "red", fontSize: "0.8em", marginTop: "2px" }}>
          {unitError}
        </p>
      )}
    </>
  );
};

export default SelectUnit;
