import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { useFetchOuraLogTypeCategoriesQuery } from "../../../redux/ouraAPI/logTypeCategories/ouraLogTypeCategoriesAPI";
import { useFetchOuraLogTypesQuery } from "../../../redux/ouraAPI/logTypes/ouraLogTypesAPI";
import { setLogTypeCategories } from "../../../redux/ouraAPI/logTypeCategories/ouraLogTypeCategoriesSlice";
import { selectLogTypeCategories } from "../../../redux/ouraAPI/logTypeCategories/ouraLogTypeCategoriesSlice";
import OuraLogTypeCategoryButtons from "./ouraLogTypCategoryButtons";
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

  function capitalizeFirstLetter(str: string) {
    if (!str || typeof str !== "string") {
      return "";
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

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

  console.log(
    "about to fetch data with selectedLogTypeCategory set to: ",
    selectedLogTypeCategory
  );

  const {
    data: ouraLogTypesData,
    error: ouraLogTypesError,
    isLoading: ouraLogTypesLoading,
  } = useFetchOuraLogTypesQuery({ category: selectedLogTypeCategory });

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
        <OuraLogTypeCategoryButtons
          logTypeCategories={logTypeCategories}
          setSelectedLogTypeCategory={setSelectedLogTypeCategory}
        />
        {ouraLogTypesData && (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <b>Log type name</b>
                  </TableCell>
                  <TableCell>
                    <b>Unit</b>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ouraLogTypesData.daily_activity?.map(
                  (ouraLogType: OuraLogType, index: number) => (
                    <TableRow key={index}>
                      <TableCell>{ouraLogType.logTypeName}</TableCell>
                      <TableCell>
                        {capitalizeFirstLetter(ouraLogType.unit)}
                      </TableCell>
                    </TableRow>
                  )
                )}
                {ouraLogTypesData.sleep?.map(
                  (ouraLogType: OuraLogType, index: number) => (
                    <TableRow key={index}>
                      <TableCell>{ouraLogType.logTypeName}</TableCell>
                      <TableCell>
                        {capitalizeFirstLetter(ouraLogType.unit)}
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </>
    );
  }
};

export default OuraLogTypeCategories;

// When user clicks on a category, then they should be prompted to fill in which dates and log Types they want to display logs for, after which the corresponding logs should be displayed
