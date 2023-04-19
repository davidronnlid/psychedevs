import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { useFetchOuraLogTypeCategoriesQuery } from "../../../redux/ouraAPI/logTypeCategories/ouraLogTypeCategoriesAPI";
import { useFetchOuraLogTypesQuery } from "../../../redux/ouraAPI/logTypes/ouraLogTypesAPI";
import { setLogTypeCategories } from "../../../redux/ouraAPI/logTypeCategories/ouraLogTypeCategoriesSlice";
import { selectLogTypeCategories } from "../../../redux/ouraAPI/logTypeCategories/ouraLogTypeCategoriesSlice";
import { Button } from "@mui/material";
import { OuraLogType } from "../../../typeModels/ouraModel";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

const OuraLogTypeCategories: React.FC = (): JSX.Element => {
  const [selectedLogTypeCategory, setSelectedLogTypeCategory] =
    useState<string>("");

  const dispatch = useAppDispatch();
  const logTypeCategories = useAppSelector(selectLogTypeCategories);
  const {
    data: ouraLogTypeCategoriesData,
    error: ouraLogTypeCategoriesError,
    isLoading: ouraLogTypeCategoriesLoading,
    isSuccess: ouraLogTypeCategoriesSuccess,
  } = useFetchOuraLogTypeCategoriesQuery();

  useEffect(() => {
    console.log(
      "selectedLogTypeCategory changed to: ",
      selectedLogTypeCategory
    );

    if (ouraLogTypeCategoriesSuccess && ouraLogTypeCategoriesData) {
      console.log(
        "Setting this into ouraLogTypeCategories state: ",
        ouraLogTypeCategoriesData
      );
      dispatch(setLogTypeCategories(ouraLogTypeCategoriesData));
    }
  }, [
    dispatch,
    ouraLogTypeCategoriesSuccess,
    ouraLogTypeCategoriesData,
    selectedLogTypeCategory,
  ]);

  const convertLogTypeToDisplayName = (logTypeCategoryKey: string) => {
    switch (logTypeCategoryKey) {
      case "daily_activity":
        return "Activity";
      case "sleep":
        return "Sleep";
      default:
        return logTypeCategoryKey;
    }
  };
  const renderLogTypes = () => {
    if (!logTypeCategories) {
      return null;
    }
    return Object.entries(logTypeCategories)
      .filter(([_, value]) => value)
      .map(([key, _]) => (
        <Button key={key} onClick={() => setSelectedLogTypeCategory(key)}>
          {convertLogTypeToDisplayName(key)}
        </Button>
      ));
  };

  const renderOuraLogTypesData = () => {
    if (!ouraLogTypesData) {
      return null;
    }

    return (
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <b>Log Type Name</b>
              </TableCell>
              <TableCell>
                <b>Unit</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ouraLogTypesData.sleep?.map((logType: OuraLogType, index: any) => (
              <TableRow key={index}>
                <TableCell>{logType.logTypeName}</TableCell>
                <TableCell>{logType.unit}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const {
    data: ouraLogTypesData,
    error: ouraLogTypesError,
    isLoading: ouraLogTypesLoading,
  } = useFetchOuraLogTypesQuery(
    { category: selectedLogTypeCategory },
    {
      skip: !selectedLogTypeCategory,
    }
  );

  console.log(
    "ouraLogTypesData is: ",
    ouraLogTypesData,
    "or error: ",
    ouraLogTypesError
  );

  useEffect(() => {
    if (ouraLogTypesData) {
      console.log("Received log types:", ouraLogTypesData);
    }
  }, [ouraLogTypesData]);

  // Render a loading message, error message, or the log types based on the API call status
  if (ouraLogTypeCategoriesLoading) {
    return <p>Loading oura log type catgegories...</p>;
  } else if (ouraLogTypeCategoriesError) {
    return (
      <p>
        Error fetching oura log type catgegories:{" "}
        {ouraLogTypeCategoriesError.toString()}
      </p>
    );
  } else {
    return (
      <>
        {renderLogTypes()}
        {renderOuraLogTypesData()}
      </>
    );
  }
};

export default OuraLogTypeCategories;

// When user clicks on a category, then they should be prompted to fill in which dates and log Types they want to display logs for, after which the corresponding logs should be displayed
