import { Button, Typography } from "@mui/material";
import { useJwt } from "../../../redux/authSlice";

const WithingsIntegration = () => {
  const token = useJwt();

  const handleIntegrateWithings = async () => {
    const baseUrl =
      process.env.NODE_ENV === "development"
        ? process.env.REACT_APP_BACKEND_LOCAL_URL
        : process.env.REACT_APP_PROD_URL;

    console.log("About to send req to /withings/auth");

    try {
      const response = await fetch(`${baseUrl}/withings/auth`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Error fetching HRV data");
      }
      const data = await response.json();
      console.log("🚀 ~ handleIntegrateWithings ~ data:", data);

      // Redirect the user to the Oura authentication URL
      window.location.href = data.redirectUrl;
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <h1>Withings Integration</h1>
      <Button onClick={() => handleIntegrateWithings()}>
        <Typography>Integrate with Withings</Typography>
      </Button>
    </div>
  );
};

export default WithingsIntegration;
