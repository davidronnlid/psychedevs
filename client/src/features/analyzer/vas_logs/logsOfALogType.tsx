import React, { useEffect, useState } from "react";
import Chart from "../../../components/logsChart";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import { useJwt } from "../../../redux/authSlice";
import ConfirmationMessage from "../../../components/alerts/confirmationMessage";
import { Log } from "../../../typeModels/logTypeModel";

type Props = {
  logList: Log[];
  logType_id: string;
  name: string;
};

const LogsOfALogType: React.FC<Props> = ({ logType_id, logList, name }) => {
  const [openLogs, setOpenLogs] = useState<boolean[]>([]);
  const [logListLocalState, setlogListLocalState] = useState<Log[]>([]);
  const [deletedSuccess, setDeletedSuccess] = useState<boolean>(false);

  const [idsOfLogsToRemove, setIdsOfLogsToRemove] = useState<string[]>([]);
  const token = useJwt();

  const filteredLogs = logList.filter(
    (log: Log) =>
      log.logType_id === logType_id && !idsOfLogsToRemove.includes(log._id)
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

      setlogListLocalState(data);
    } catch (error) {
      console.error("Error removing log type: ", error);
    }
    setIdsOfLogsToRemove([]);

    setDeletedSuccess(true);
    setTimeout(() => {
      setDeletedSuccess(false);
    }, 5000);
  };

  const toggleLog = (index: number) => {
    const newOpenLogs = [...openLogs];
    newOpenLogs[index] = !newOpenLogs[index];
    setOpenLogs(newOpenLogs);
  };

  const [showLogs, setShowLogs] = useState<boolean>(true);

  return (
    <>
      <div style={{ display: "flex", alignItems: "center" }}>
        <h2>Your "{name}" logs</h2>
        <Button onClick={() => setShowLogs(!showLogs)}>
          {showLogs ? <FaAngleUp /> : <FaAngleDown />}
          {showLogs ? "Hide" : "Show"} Logs
        </Button>
      </div>

      {showLogs && (
        <>
          {logList.length > 0 ? (
            <Chart logs={logList} />
          ) : (
            <p>No mood logs found.</p>
          )}
          <div>
            {filteredLogs
              .sort((a, b) => {
                const dateA: any = new Date(a.date).toISOString();
                const dateB: any = new Date(b.date).toISOString();
                return dateA.localeCompare(dateB);
              })
              .map((elm: Log, index: number) => {
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
                          // if logs of this date have already been rendered, skip, else render it - this comment is trying to say skipping of duplicate ul's should be implemented in the future
                          <>
                            <li
                              key={index}
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <div style={{ flex: 1 }}>{log.value}</div>
                              <DeleteIcon
                                onClick={() =>
                                  handleRemoveWorkInProgress(log._id)
                                }
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
        </>
      )}
      {deletedSuccess ? (
        <ConfirmationMessage
          message="Successfully deleted logs"
          state={deletedSuccess}
          stateSetter={setDeletedSuccess}
        />
      ) : null}
    </>
  );
};

export default LogsOfALogType;
