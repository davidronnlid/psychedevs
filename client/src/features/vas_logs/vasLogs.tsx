import React, { useEffect, useState } from "react";
interface MoodLog {
  date: string;
  value: number;
}

interface MoodLogList extends Array<MoodLog> {}

const LogsPage: React.FC = () => {
  const [MoodLogList, setMoodLogList] = useState<MoodLogList | null>(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const token = localStorage.getItem("user_sesh_JWT");
        console.log("Token log", localStorage.getItem("user_sesh_JWT"));

        const baseUrl =
          process.env.NODE_ENV === "development"
            ? process.env.REACT_APP_BACKEND_LOCAL_URL
            : process.env.REACT_APP_PROD_URL;

        const response = await fetch(`${baseUrl}/vas/logs`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setMoodLogList(data);

          console.log(data);
        } else {
          throw new Error("Error fetching user logs");
        }

        console.log(response);
      } catch (error) {
        console.error(error);
      }
    };

    fetchLogs();
  }, []);

  return (
    <div>
      {MoodLogList ? (
        <div>
          {MoodLogList.map((elm: MoodLog) => (
            <>
              <h2>{elm.date}</h2>
              <p>{elm.value}</p>
            </>
          ))}
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default LogsPage;
