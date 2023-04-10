import { useState, useEffect } from "react";

const OuraData = () => {
  const [hrvData, setHrvData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(
    "Unknown error in oura data fetching component"
  );

  useEffect(() => {
    const fetchHRVData = async () => {
      const baseUrl =
        process.env.NODE_ENV === "development"
          ? process.env.REACT_APP_BACKEND_LOCAL_URL
          : process.env.REACT_APP_PROD_URL;
      try {
        const response = await fetch(`${baseUrl}/oura/hrv`);
        if (!response.ok) {
          throw new Error("Error fetching HRV data");
        }
        const data = await response.json();
        setHrvData(data);
      } catch (error) {
        console.log(error);
        // setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHRVData();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>HRV Data</h1>
      {/* Display the HRV data as desired */}
      <pre>{JSON.stringify(hrvData, null, 2)}</pre>
    </div>
  );
};

export default OuraData;
