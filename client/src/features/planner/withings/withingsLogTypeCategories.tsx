import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Box, Button, Typography } from "@mui/material";
import { useJwt } from "../../../redux/authSlice";
import WithingsLogo from "../../../images/WithingsLogo.png";

import { CSSProperties } from "react";
import {
  selectLogTypeCategories,
  setLogTypeCategories,
} from "../../../redux/withingsAPI/logTypeCategories/withingsLogTypeCategoriesSlice";
import { useFetchWithingsLogTypeCategoriesQuery } from "../../../redux/withingsAPI/logTypeCategories/withingsLogTypeCategoriesAPI";
import { useFetchWithingsLogTypesQuery } from "../../../redux/withingsAPI/logTypes/withingsLogTypesAPI";
import WithingsLogTypeCategoryButtons from "./withingsLogTypeCategoryButtons";
import { WithingsLogType } from "../../../typeModels/withingsModel";

const WithingsLogTypeCategoriesStyles: Record<string, CSSProperties> = {
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
  logoOfWithingsLogTypesTitle: {
    width: "3.75rem",
    position: "relative",
    top: "-5px",
    left: "0px",
  },
};

const WithingsLogTypeCategories: React.FC = (): JSX.Element => {
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
    data: WithingsLogTypeCategoriesData,
    error: WithingsLogTypeCategoriesError,
    isLoading: WithingsLogTypeCategoriesLoading,
    isSuccess: WithingsLogTypeCategoriesSuccess,
  } = useFetchWithingsLogTypeCategoriesQuery();

  useEffect(() => {
    console.log(
      "selectedLogTypeCategory changed to: ",
      selectedLogTypeCategory
    );

    if (WithingsLogTypeCategoriesSuccess && WithingsLogTypeCategoriesData) {
      console.log(
        "Setting this into WithingsLogTypeCategories state: ",
        WithingsLogTypeCategoriesData
      );
      dispatch(setLogTypeCategories(WithingsLogTypeCategoriesData));
    }
  }, [
    dispatch,
    WithingsLogTypeCategoriesSuccess,
    WithingsLogTypeCategoriesData,
    selectedLogTypeCategory,
  ]);

  console.log(
    "about to fetch data with selectedLogTypeCategory set to: ",
    selectedLogTypeCategory
  );

  const {
    data: WithingsLogTypesData,
    error: WithingsLogTypesError,
    isLoading: WithingsLogTypesLoading,
  } = useFetchWithingsLogTypesQuery({ category: selectedLogTypeCategory });

  console.log(
    "WithingsLogTypesData is: ",
    WithingsLogTypesData,
    "or error: ",
    WithingsLogTypesError
  );

  useEffect(() => {
    if (WithingsLogTypesData) {
      console.log("Received log types:", WithingsLogTypesData);
    }
  }, [WithingsLogTypesData]);

  const token = useJwt();

  const handleIntegrateWithings = async () => {
    const baseUrl =
      process.env.NODE_ENV === "development"
        ? process.env.REACT_APP_BACKEND_LOCAL_URL
        : process.env.REACT_APP_PROD_URL;

    console.log("About to send req to /Withings/auth");

    try {
      const response = await fetch(`${baseUrl}/Withings/auth`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Error fetching Withings data");
      }
      const data = await response.json();
      console.log(
        "🚀 ~ file: plannerPage.tsx:43 ~ handleIntegrateWithings ~ data:",
        data
      );

      // Redirect the user to the Withings authentication URL
      window.location.href = data.redirectUrl;
    } catch (error) {
      console.log(error);
    }
  };

  // Render a loading message, error message, or the log types based on the API call status
  if (WithingsLogTypeCategoriesLoading) {
    return <p>Loading Withings log type categories...</p>;
  } else if (WithingsLogTypeCategoriesError) {
    return (
      <Button
        onClick={() => handleIntegrateWithings()}
        style={WithingsLogTypeCategoriesStyles.button}
      >
        <Typography>Integrate with </Typography>
        <img
          src={WithingsLogo}
          alt="Withings logo"
          style={WithingsLogTypeCategoriesStyles.logoOfIntegrateButton}
        />
      </Button>
    );
  } else {
    return (
      <>
        <Box sx={WithingsLogTypeCategoriesStyles.Box}>
          <img
            src={WithingsLogo}
            alt="Withings logo"
            style={WithingsLogTypeCategoriesStyles.logoOfWithingsLogTypesTitle}
          />
          <Typography variant="h6" gutterBottom>
            log types
          </Typography>
        </Box>
        <Typography variant="subtitle1" gutterBottom>
          Categories
        </Typography>
        <WithingsLogTypeCategoryButtons
          logTypeCategories={logTypeCategories}
          setSelectedLogTypeCategory={setSelectedLogTypeCategory}
          selectedLogTypeCategory={selectedLogTypeCategory}
        />
        {WithingsLogTypesData && (
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
                {WithingsLogTypesData.daily_activity?.map(
                  (WithingsLogType: WithingsLogType, index: number) => (
                    <TableRow key={index}>
                      <TableCell>{WithingsLogType.logTypeName}</TableCell>
                      <TableCell>
                        {capitalizeFirstLetter(WithingsLogType.unit)}
                      </TableCell>
                    </TableRow>
                  )
                )}
                {WithingsLogTypesData.sleep?.map(
                  (WithingsLogType: WithingsLogType, index: number) => (
                    <TableRow key={index}>
                      <TableCell>{WithingsLogType.logTypeName}</TableCell>
                      <TableCell>
                        {capitalizeFirstLetter(WithingsLogType.unit)}
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

export default WithingsLogTypeCategories;

// When user clicks on a category, then they should be prompted to fill in which dates and log Types they want to display logs for, after which the corresponding logs should be displayed
