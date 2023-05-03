import React, { Dispatch, SetStateAction, useEffect } from "react";
import { Button } from "@mui/material";
import { OuraLogTypeCategoriesResponseData } from "../../../typeModels/ouraModel";

interface OuraLogTypeCategoryButtonsProps {
  logTypeCategories: OuraLogTypeCategoriesResponseData;
  setSelectedLogTypeCategory: (category: string) => void;
  selectedLogTypeCategory: string;
}

const OuraLogTypeCategoryButtons: React.FC<OuraLogTypeCategoryButtonsProps> = ({
  logTypeCategories,
  setSelectedLogTypeCategory,
  selectedLogTypeCategory,
}) => {
  const convertLogTypeCategoryToDisplayName = (logTypeCategoryKey: string) => {
    switch (logTypeCategoryKey) {
      case "daily_activity":
        return "Activity";
      case "sleep":
        return "Sleep";
      default:
        return logTypeCategoryKey;
    }
  };

  useEffect(() =>
    console.log("selectedLogTypeCategory ", selectedLogTypeCategory)
  );

  return (
    <div
      style={{
        display: "flex",
      }}
    >
      {logTypeCategories &&
        Object.entries(logTypeCategories)
          .filter(([_, value]) => value)
          .map(([key, _]) => {
            const isSelected =
              selectedLogTypeCategory === key ? "outlined" : "contained";
            return (
              <Button
                key={key}
                onClick={() => setSelectedLogTypeCategory(key)}
                variant={isSelected}
                sx={{
                  marginRight: "0.5rem",
                  marginTop: "0.5rem",
                  marginBottom: "0.5rem",
                }}
              >
                {convertLogTypeCategoryToDisplayName(key)}
              </Button>
            );
          })}
    </div>
  );
};

export default OuraLogTypeCategoryButtons;
