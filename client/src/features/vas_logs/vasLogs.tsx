import React, { useEffect, useState } from "react";
import Chart from "../../components/logsChart";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import Button from "@mui/material/Button";
import { useJwt } from "../../redux/authSlice";

interface MoodLog {
  date: Date;
  value: number;
}

type Props = {
  MoodLogList: MoodLog[];
};

const LogsPage: React.FC<Props> = ({ MoodLogList }) => {
  const [openLogs, setOpenLogs] = useState<boolean[]>([]);
  const [moodLogList, setMoodLogList] = useState<MoodLog[]>([]);
  const token = useJwt();

  const toggleLog = (index: number) => {
    const newOpenLogs = [...openLogs];
    newOpenLogs[index] = !newOpenLogs[index];
    setOpenLogs(newOpenLogs);
  };

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const baseUrl =
          process.env.NODE_ENV === "development"
            ? process.env.REACT_APP_BACKEND_LOCAL_URL
            : process.env.REACT_APP_PROD_URL;

        const response = await fetch(`${baseUrl}/vas/logs`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log(response);

        console.log("sending req");
        if (response.ok) {
          console.log("awaiting response");
          const data = await response.json();
          console.log("received data: ", data);
          // sort logs by date
          const sortLogsByDate = (logs: MoodLog[]): MoodLog[] => {
            return logs.sort((a, b) => {
              const dateA: any = new Date(a.date).toISOString();
              const dateB: any = new Date(b.date).toISOString();
              return dateA.localeCompare(dateB);
            });
          };

          const logListSortedBydDate = sortLogsByDate(data);

          setMoodLogList(logListSortedBydDate);
          setOpenLogs(new Array(logListSortedBydDate.length).fill(false));
        } else {
          throw new Error("Error fetching user logs");
        }

        console.log(response);
      } catch (error) {
        console.error(error);
      }
    };

    fetchLogs();
  }, [token]);

  return (
    <>
      <h2>Your logs listed</h2>
      <div>
        {moodLogList.map((elm: MoodLog, index: number) => {
          const logsWithSameDate = moodLogList.filter(
            (log) =>
              log.date.toString().slice(0, 10) ===
              elm.date.toString().slice(0, 10)
          );

          return (
            <div key={index}>
              <Button onClick={() => toggleLog(index)}>
                {openLogs[index] ? <FaAngleUp /> : <FaAngleDown />}
                {openLogs[index] ? "Close" : "Open"} Logs for{" "}
                {elm.date.toString().slice(0, 10)}
              </Button>

              {openLogs[index] && (
                <ul>
                  {logsWithSameDate.map((log, index) => (
                    // if logs of this date ha already been rendered, skip, else render it
                    <li key={index}>{log.value}</li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
      <h2>Your logs in a line chart</h2>
      {moodLogList.length > 0 ? (
        <Chart logs={moodLogList} />
      ) : (
        <p>No mood logs found.</p>
      )}
    </>
  );
};

export default LogsPage;
