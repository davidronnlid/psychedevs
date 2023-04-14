import { useEffect, useState } from "react";
import OuraData from "./ouraData";
import { OuraResponseData } from "../../../typeModels/ouraModel";

interface Props {
  onOuraAuthCompleted: (ouraAuthCompleted: boolean) => void;
  ouraAuthCompleted: boolean;
}

const OuraAuthCompleted = ({
  onOuraAuthCompleted,
  ouraAuthCompleted,
}: Props) => {
  const [ouraData, setOuraData] = useState<OuraResponseData | null>(null);
  const token = localStorage.getItem("user_sesh_JWT");

  useEffect(() => {
    const fetchData = async () => {
      const baseUrl =
        process.env.NODE_ENV === "development"
          ? process.env.REACT_APP_BACKEND_LOCAL_URL
          : process.env.REACT_APP_PROD_URL;

      try {
        const response = await fetch(`${baseUrl}/oura/data`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Token sent:", token);

        if (!response.ok) {
          throw new Error("Error fetching data from /oura/data");
        }

        const responseData = await response.json();
        console.log(
          "🚀 ~ file: ouraAuthCompleted.tsx:48 ~ fetchData ~ responseData:",
          responseData
        );

        setOuraData(responseData);
        if (responseData && !hasCalledOnOuraAuthCompleted) {
          onOuraAuthCompleted(true);
          setHasCalledOnOuraAuthCompleted(true);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [token, onOuraAuthCompleted]);

  const [hasCalledOnOuraAuthCompleted, setHasCalledOnOuraAuthCompleted] =
    useState(false);

  return (
    <div>
      {ouraAuthCompleted ? (
        <>
          {(
            [
              "daily_activity",
              "sleep",
              "daily_readiness",
              "daily_sleep",
              "heartrate",
            ] as const
          ).map((key) => (
            <OuraData
              key={key}
              ouraData={ouraData?.[key]?.data}
              ouraLogType={key}
            />
          ))}
        </>
      ) : (
        <p>Loading oura data...</p>
      )}
    </div>
  );
};

export default OuraAuthCompleted;
