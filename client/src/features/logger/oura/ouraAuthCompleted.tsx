import { useEffect, useState } from "react";
import OuraData from "./ouraData";
import { useFetchOuraLogsQuery } from "../../../redux/ouraAPI/logs/ouraLogsAPI";

interface Props {
  onOuraAuthCompleted: (ouraAuthCompleted: boolean) => void;
  ouraAuthCompleted: boolean;
}

const OuraAuthCompleted = ({
  onOuraAuthCompleted,
  ouraAuthCompleted,
}: Props) => {
  const token = localStorage.getItem("user_sesh_JWT");
  // const {
  //   data: ouraLogsData,
  //   error: ouraLogsError,
  //   isLoading: ouraLogsLoading,
  // } = useFetchOuraLogsQuery({ logTypeIds: ["rem_sleep_data", "steps"] });

  // const [hasCalledOnOuraAuthCompleted, setHasCalledOnOuraAuthCompleted] =
  //   useState(false);
  // console.log(ouraLogsData, " in ouraAuthCompleted file");

  // useEffect(() => {
  //   if (ouraLogsData && !hasCalledOnOuraAuthCompleted) {
  //     onOuraAuthCompleted(true);
  //     setHasCalledOnOuraAuthCompleted(true);
  //   }
  // }, [token, onOuraAuthCompleted]);

  return (
    <div>
      {/* {ouraAuthCompleted ? ( */}
      <>
        {/* {(["daily_activity", "sleep"] as const).map((key: any) => (
            <OuraData
              ouraData={ouraLogsData?.[key]?.data}
              ouraLogType={key}
              key={key}
            />
          ))} */}
      </>
      {/* ) : ( */}
      <p>Loading oura data in ouraAuthCompleted.tsx...</p>
      {/* )} */}
    </div>
  );
};

export default OuraAuthCompleted;
