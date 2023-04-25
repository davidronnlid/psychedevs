// useLogTypes.ts
import { useState, useEffect } from "react";
import { useFetchOuraLogTypesQuery } from "../redux/ouraAPI/logTypes/ouraLogTypesAPI";
import { OuraLogTypesResponseData } from "../typeModels/ouraModel";

type OuraLogTypeToDisplay = {
  id: string;
  label: string;
};

function isCategoryKey(key: string): key is keyof OuraLogTypesResponseData {
  return key === "daily_activity" || key === "sleep";
}

export const useOuraLogTypes = (
  category: string
): { logTypes: OuraLogTypeToDisplay[]; error: any; isLoading: boolean } => {
  const {
    data: ouraLogTypesData,
    error: ouraLogTypesError,
    isLoading: ouraLogTypesIsLoading,
  } = useFetchOuraLogTypesQuery({ category });
  console.log(
    "🚀 ~ file:  AllLogsGraph.tsx:60 useOuraLogTypes.ts:23 ~ ouraLogTypesData:",
    ouraLogTypesData
  );

  const [logTypes, setLogTypes] = useState<OuraLogTypeToDisplay[]>([]);

  useEffect(() => {
    if (ouraLogTypesData) {
      if (isCategoryKey(category)) {
        const logTypesForCategory =
          ouraLogTypesData[category]?.map((logType: any) => ({
            id: logType.logType,
            label: logType.logTypeName,
          })) || [];

        setLogTypes(logTypesForCategory);
      }
    }
  }, [ouraLogTypesData, category]);

  return {
    logTypes,
    error: ouraLogTypesError,
    isLoading: ouraLogTypesIsLoading,
  };
};
