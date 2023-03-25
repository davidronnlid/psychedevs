import React, { useEffect, useState } from "react";
import Chart from "../../components/logsChart";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import { useJwt } from "../../redux/authSlice";
import RemovedItemsMessage from "../../components/removedItemsMessage";

interface MoodLog {
  date: Date;
  value: number;
  _id: string;
}

type Props = {
  MoodLogList: MoodLog[];
};

const LogsPage: React.FC<Props> = () => {
  const [openLogs, setOpenLogs] = useState<boolean[]>([]);
  const [moodLogList, setMoodLogList] = useState<MoodLog[]>([]);
  const [deletedSuccess, setDeletedSuccess] = useState<boolean>(false);

  const [idsOfLogsToRemove, setIdsOfLogsToRemove] = useState<string[]>([]);
  const token = useJwt();

  const filteredLogs = moodLogList.filter(
    (log: MoodLog) => !idsOfLogsToRemove.includes(log._id)
  );

  const handleRemoveWorkInProgress = (logId: string) => {
    setIdsOfLogsToRemove([...idsOfLogsToRemove, logId]);
  };

  const removeIdsOfLogsToRemove = () => {
    setIdsOfLogsToRemove([]);
  };

  const confirmRemoval = async () => {
    console.log("removal confirmation func activated", idsOfLogsToRemove);
    const baseUrl =
      process.env.NODE_ENV === "development"
        ? process.env.REACT_APP_BACKEND_LOCAL_URL
        : process.env.REACT_APP_PROD_URL;

    try {
      const idsString = idsOfLogsToRemove.join(",,");

      const response = await fetch(`${baseUrl}/vas/logs?ids=${idsString}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data = await response.json();

      setMoodLogList(data);
    } catch (error) {
      console.error("Error removing log type: ", error);
    }
    setIdsOfLogsToRemove([]);

    setDeletedSuccess(true);
    setTimeout(() => {
      setDeletedSuccess(false);
    }, 10000);
  };

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

        console.log("sending req");
        if (response.ok) {
          console.log("awaiting response");
          const data = await response.json();
          console.log("received data: ", data);

          setMoodLogList(data);
          setOpenLogs(new Array(data.length).fill(false));

          throw new Error("Error fetching user logs");
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchLogs();
    // This code ensures user will not see the success message regarding deleted logs again next time they come back to this page
  }, [token]);

  return (
    <>
      <h2>Your logs listed</h2>
      <div>
        {filteredLogs
          .sort((a, b) => {
            const dateA: any = new Date(a.date).toISOString();
            const dateB: any = new Date(b.date).toISOString();
            return dateA.localeCompare(dateB);
          })
          .map((elm: MoodLog, index: number) => {
            const logsWithSameDate = filteredLogs.filter(
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
                      // if logs of this date have already been rendered, skip, else render it - this comment is trying to say this should be implemented in the future
                      <>
                        <li
                          key={index}
                          style={{ display: "flex", alignItems: "center" }}
                        >
                          <div style={{ flex: 1 }}>{log.value}</div>
                          <DeleteIcon
                            onClick={() => handleRemoveWorkInProgress(log._id)}
                            style={{ cursor: "pointer" }}
                          />
                        </li>
                        <hr
                          style={{
                            border: "none",
                            borderBottom: "1px solid gray",
                          }}
                        />
                      </>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
      </div>
      {idsOfLogsToRemove.length > 0 ? (
        <>
          <Button onClick={() => confirmRemoval()}>Confirm removal</Button>
          <Button onClick={() => removeIdsOfLogsToRemove()}>Cancel</Button>
        </>
      ) : null}

      {deletedSuccess ? <RemovedItemsMessage itemType={"logs"} /> : null}

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
