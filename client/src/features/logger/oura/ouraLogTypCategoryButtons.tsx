import React from "react";
import { Button } from "@mui/material";
import { OuraLogTypeCategoriesResponseData } from "../../../typeModels/ouraModel";

interface OuraLogTypeCategoryButtonsProps {
  logTypeCategories: OuraLogTypeCategoriesResponseData;
  setSelectedLogTypeCategory: (category: string) => void;
}

const OuraLogTypeCategoryButtons: React.FC<OuraLogTypeCategoryButtonsProps> = ({
  logTypeCategories,
  setSelectedLogTypeCategory,
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

  return (
    <>
      {logTypeCategories &&
        Object.entries(logTypeCategories)
          .filter(([_, value]) => value)
          .map(([key, _]) => (
            <Button key={key} onClick={() => setSelectedLogTypeCategory(key)}>
              {convertLogTypeCategoryToDisplayName(key)}
            </Button>
          ))}
    </>
  );
};

export default OuraLogTypeCategoryButtons;
