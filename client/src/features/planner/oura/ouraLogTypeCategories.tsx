import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { useFetchOuraLogTypeCategoriesQuery } from "../../../redux/ouraAPI/logTypeCategories/ouraLogTypeCategoriesAPI";
import { useFetchOuraLogTypesQuery } from "../../../redux/ouraAPI/logTypes/ouraLogTypesAPI";
import { setLogTypeCategories } from "../../../redux/ouraAPI/logTypeCategories/ouraLogTypeCategoriesSlice";
import { selectLogTypeCategories } from "../../../redux/ouraAPI/logTypeCategories/ouraLogTypeCategoriesSlice";
import OuraLogTypeCategoryButtons from "./ouraLogTypeCategoryButtons";
import { OuraLogType } from "../../../typeModels/ouraModel";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Box, Button, Typography } from "@mui/material";
import { useJwt } from "../../../redux/authSlice";
import OuraLogo from "../../../images/OuraLogo.png";

import { CSSProperties } from "react";

const OuraLogTypeCategoriesStyles: Record<string, CSSProperties> = {
  button: {
    display: "flex",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "13rem",
    marginTop: "1.5rem",
    marginLeft: "-.5rem",
  },
  Box: {
    display: "flex",
    justifyContent: "space-evenly",
    alignItems: "center",
    marginLeft: "-0.35rem",
    marginTop: "4rem",
    width: "10rem",
  },
  logoOfIntegrateButton: {
    width: "3.75rem",
    position: "relative",
    top: "-2px",
    left: "4px",
  },
  logoOfOuraLogTypesTitle: {
    width: "3.75rem",
    position: "relative",
    top: "-5px",
    left: "0px",
  },
};

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

  const token = useJwt();

  const handleIntegrateOura = async () => {
    const baseUrl =
      process.env.NODE_ENV === "development"
        ? process.env.REACT_APP_BACKEND_LOCAL_URL
        : process.env.REACT_APP_PROD_URL;

    console.log("About to send req to /oura/auth");

    try {
      const response = await fetch(`${baseUrl}/oura/auth`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Error fetching oura data");
      }
      const data = await response.json();
      console.log(
        "🚀 ~ file: plannerPage.tsx:43 ~ handleIntegrateOura ~ data:",
        data
      );

      // Redirect the user to the Oura authentication URL
      window.location.href = data.redirectUrl;
    } catch (error) {
      console.log(error);
    }
  };

  // Render a loading message, error message, or the log types based on the API call status
  if (ouraLogTypeCategoriesLoading) {
    return <p>Loading oura log type categories...</p>;
  } else if (ouraLogTypeCategoriesError) {
    return (
      <Button
        onClick={() => handleIntegrateOura()}
        style={OuraLogTypeCategoriesStyles.button}
      >
        <Typography>Integrate with </Typography>
        <img
          src={OuraLogo}
          alt="Oura logo"
          style={OuraLogTypeCategoriesStyles.logoOfIntegrateButton}
        />
      </Button>
    );
  } else {
    return (
      <>
        <Box sx={OuraLogTypeCategoriesStyles.Box}>
          <img
            src={OuraLogo}
            alt="Oura logo"
            style={OuraLogTypeCategoriesStyles.logoOfOuraLogTypesTitle}
          />
          <Typography variant="h6" gutterBottom>
            log types
          </Typography>
        </Box>
        <Typography variant="subtitle1" gutterBottom>
          Categories
        </Typography>
        <OuraLogTypeCategoryButtons
          logTypeCategories={logTypeCategories}
          setSelectedLogTypeCategory={setSelectedLogTypeCategory}
          selectedLogTypeCategory={selectedLogTypeCategory}
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
