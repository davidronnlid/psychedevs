import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { useFetchOuraLogTypeCategoriesQuery } from "../../../redux/ouraAPI/ouraLogTypeCategoriesAPI";
import { setLogTypeCategories } from "../../../redux/ouraAPI/ouraLogTypeCategoriesSlice";
import { selectLogTypeCategories } from "../../../redux/ouraAPI/ouraLogTypeCategoriesSlice";

const OuraLogTypeCategories: React.FC = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const logTypes = useAppSelector(selectLogTypeCategories);
  const {
    data: ouraLogTypesData,
    error: ouraLogTypesError,
    isLoading: ouraLogTypesLoading,
    isSuccess: ouraLogTypesSuccess,
  } = useFetchOuraLogTypeCategoriesQuery();

  useEffect(() => {
    if (ouraLogTypesSuccess && ouraLogTypesData) {
      console.log("Setting this into ouraLogTypes state: ", ouraLogTypesData);
      dispatch(setLogTypeCategories(ouraLogTypesData));
    }
  }, [dispatch, ouraLogTypesSuccess, ouraLogTypesData]);

  const renderLogTypes = () => {
    return Object.entries(logTypes)
      .filter(([_, value]) => value)
      .map(([key, _]) => <p key={key}>{key}</p>);
  };

  // Render a loading message, error message, or the log types based on the API call status
  if (ouraLogTypesLoading) {
    return <p>Loading oura log types...</p>;
  } else if (ouraLogTypesError) {
    return <p>Error fetching oura log types: {ouraLogTypesError.toString()}</p>;
  } else {
    return <>{renderLogTypes()}</>;
  }
};

export default OuraLogTypeCategories;
