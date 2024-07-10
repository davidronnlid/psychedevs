import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { useFetchWithingsLogTypeCategoriesQuery } from "../../../redux/withingsAPI/logTypeCategories/withingsLogTypeCategoriesAPI";
import { useFetchWithingsLogTypesQuery } from "../../../redux/withingsAPI/logTypes/withingsLogTypesAPI";
import { setLogTypeCategories } from "../../../redux/withingsAPI/logTypeCategories/withingsLogTypeCategoriesSlice";
import { selectLogTypeCategories } from "../../../redux/withingsAPI/logTypeCategories/withingsLogTypeCategoriesSlice";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Box, Button, Typography } from "@mui/material";
import { useJwt } from "../../../redux/authSlice";
import WithingsLogo from "../../../images/OuraLogo.png";

import { CSSProperties } from "react";
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

const WithingsIntegration: React.FC = (): JSX.Element => {
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
    data: withingsLogTypeCategoriesData,
    error: withingsLogTypeCategoriesError,
    isLoading: withingsLogTypeCategoriesLoading,
    isSuccess: withingsLogTypeCategoriesSuccess,
  } = useFetchWithingsLogTypeCategoriesQuery();

  useEffect(() => {
    console.log(
      "selectedLogTypeCategory changed to: ",
      selectedLogTypeCategory
    );

    if (withingsLogTypeCategoriesSuccess && withingsLogTypeCategoriesData) {
      console.log(
        "Setting this into withingsLogTypeCategories state: ",
        withingsLogTypeCategoriesData
      );
      dispatch(setLogTypeCategories(withingsLogTypeCategoriesData));
    }
  }, [
    dispatch,
    withingsLogTypeCategoriesSuccess,
    withingsLogTypeCategoriesData,
    selectedLogTypeCategory,
  ]);

  console.log(
    "about to fetch data with selectedLogTypeCategory set to: ",
    selectedLogTypeCategory
  );

  const {
    data: withingsLogTypesData,
    error: withingsLogTypesError,
    isLoading: withingsLogTypesLoading,
  } = useFetchWithingsLogTypesQuery({ category: selectedLogTypeCategory });

  console.log(
    "withingsLogTypesData is: ",
    withingsLogTypesData,
    "or error: ",
    withingsLogTypesError
  );

  useEffect(() => {
    if (withingsLogTypesData) {
      console.log("Received log types:", withingsLogTypesData);
    }
  }, [withingsLogTypesData]);

  const token = useJwt();

  const handleIntegrateWithings = async () => {
    const baseUrl =
      process.env.NODE_ENV === "development"
        ? process.env.REACT_APP_BACKEND_LOCAL_URL
        : process.env.REACT_APP_PROD_URL;

    console.log("About to send req to /withings/auth");

    try {
      const response = await fetch(`${baseUrl}/withings/auth`, {
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
      console.log("🚀 ~ handleIntegrateWithings ~ data:", data);

      // Redirect the user to the Withings authentication URL
      window.location.href = data.redirectUrl;
    } catch (error) {
      console.log(error);
    }
  };

  if (withingsLogTypeCategoriesLoading) {
    return <p>Loading Withings log type categories...</p>;
  } else if (withingsLogTypeCategoriesError) {
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
        {withingsLogTypesData && (
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
                {withingsLogTypesData.daily_activity?.map(
                  (withingsLogType: WithingsLogType, index: number) => (
                    <TableRow key={index}>
                      <TableCell>{withingsLogType.logTypeName}</TableCell>
                      <TableCell>
                        {capitalizeFirstLetter(withingsLogType.unit)}
                      </TableCell>
                    </TableRow>
                  )
                )}
                {withingsLogTypesData.sleep?.map(
                  (withingsLogType: WithingsLogType, index: number) => (
                    <TableRow key={index}>
                      <TableCell>{withingsLogType.logTypeName}</TableCell>
                      <TableCell>
                        {capitalizeFirstLetter(withingsLogType.unit)}
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

export default WithingsIntegration;
