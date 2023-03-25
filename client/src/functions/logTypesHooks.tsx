import { useState, useEffect } from "react";
import { useJwt } from "../redux/authSlice";
import { useAppDispatch } from "../redux/hooks";
import { setLogTypes } from "../redux/logTypesSlice";
import { LogType } from "../typeModels/logTypeModel";

export const useFetchLogTypes = (): [boolean, string | null] => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const token = useJwt();

  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchLogTypesData = async () => {
      const baseUrl =
        process.env.NODE_ENV === "development"
          ? process.env.REACT_APP_BACKEND_LOCAL_URL
          : process.env.REACT_APP_PROD_URL;

      console.log("TOKEN IN FetchLogTypes", token);

      try {
        const response = await fetch(`${baseUrl}/logs/log-types`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }

        const data: LogType[] = await response.json();

        console.log("About to set this logTypes data into redux state ", data);

        dispatch(setLogTypes(data));
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching log types data: ", error);
        setError("Error fetching log types data");
        setIsLoading(false);
      }
    };
    fetchLogTypesData();
  }, [token, dispatch]);

  return [isLoading, error];
};

export const useAddLogType = (): [
  (newLogType: LogType) => Promise<void>,
  boolean,
  string | null
] => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const token = useJwt();
  const dispatch = useAppDispatch();

  const handleAddLogType = async (newLogType: LogType) => {
    setIsLoading(true);
    const baseUrl =
      process.env.NODE_ENV === "development"
        ? process.env.REACT_APP_BACKEND_LOCAL_URL
        : process.env.REACT_APP_PROD_URL;

    try {
      const response = await fetch(`${baseUrl}/logs/log-types`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newLogType),
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data = await response.json();
      dispatch(setLogTypes(data));
      setIsLoading(false);

      setIsLoading(false);
    } catch (error) {
      console.error("Error adding log type: ", error);
      setError("Error adding log type");
      setIsLoading(false);
    }
  };

  return [handleAddLogType, isLoading, error];
};
