import React, { useState, useEffect } from "react";

interface Data {
  express: string;
}

const DataFetching: React.FC = () => {
  const [data, setData] = useState<Data>({ express: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const baseUrl =
          process.env.NODE_ENV === "development"
            ? process.env.BACKEND_LOCAL_URL
            : process.env.PROD_URL;

        const response = await fetch(`${baseUrl}/express_backend`);
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        setError(error);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.toString()}</div>;
  return <div>{data.express}</div>;
};

export default DataFetching;
