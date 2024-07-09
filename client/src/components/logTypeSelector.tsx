// LogTypeSelectorComponent.jsx
import React, { useState, useEffect, useMemo } from "react";
import { Autocomplete, TextField } from "@mui/material";
import { useAppSelector } from "../redux/hooks";
import { useOuraLogTypes } from "../functions/useOuraLogTypes";
import { selectLogTypes } from "../redux/logTypesSlice";

const LogTypeSelectorComponent = ({
  selectedLogTypes,
  setSelectedLogTypes,
}: any) => {
  const PDLogTypes = useAppSelector(selectLogTypes);

  const { logTypes: ouraSleepLogTypes } = useOuraLogTypes("sleep");

  const { logTypes: ouraDailyActivityLogTypes } =
    useOuraLogTypes("daily_activity");

  const ouraLogTypes = useMemo(() => {
    return [...ouraSleepLogTypes, ...ouraDailyActivityLogTypes];
  }, [ouraSleepLogTypes, ouraDailyActivityLogTypes]);

  const allLogTypes = useMemo(() => {
    const ouraMapped = ouraLogTypes.map((logType) => ({
      id: logType.id,
      label: logType.label,
      unit: logType.unit,
    }));

    const pdMapped = PDLogTypes.map((logType) => ({
      id: logType.logType_id,
      label: logType.name,
      unit: logType.unit,
    }));

    return [...ouraMapped, ...pdMapped];
  }, [ouraLogTypes, PDLogTypes]);

  const [search, setSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const filteredLogTypes = useMemo(() => {
    return allLogTypes.filter((logType) =>
      logType.label.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, allLogTypes]);

  const handleLogTypeSelect = (_event: any, newValue: any) => {
    if (newValue.length <= 2) {
      const selectedOura = newValue
        .filter((item: any) => ouraLogTypes.some((log) => log.id === item.id))
        .map((item: any) => item.id);
      const selectedPD = newValue
        .filter((item: any) =>
          PDLogTypes.some((log) => log.logType_id === item.id)
        )
        .map((item: any) => item.id);

      setSelectedLogTypes([...selectedOura, ...selectedPD]);
    }
  };

  return (
    <Autocomplete
      multiple
      open={dropdownOpen}
      onOpen={() => {
        if (selectedLogTypes.length < 2) {
          setDropdownOpen(true);
        }
      }}
      onClose={() => setDropdownOpen(false)}
      options={filteredLogTypes}
      getOptionLabel={(option) => option?.label || ""}
      onChange={handleLogTypeSelect}
      value={selectedLogTypes.map((logId: any) =>
        allLogTypes.find((log) => log.id === logId)
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Select 2 log types to display logs for"
          disabled={selectedLogTypes.length >= 2}
          helperText={
            selectedLogTypes.length >= 2
              ? "Max number of log types selected"
              : ""
          }
        />
      )}
    />
  );
};

export default LogTypeSelectorComponent;
