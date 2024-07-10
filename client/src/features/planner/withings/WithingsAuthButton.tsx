import React, { useState, useEffect } from "react";
import { generateRandomState } from "../../../functions/generateRandomState";

const WithingsAuthButton: React.FC = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuthorization = async () => {
      try {
        const baseUrl =
          process.env.NODE_ENV === "development"
            ? process.env.REACT_APP_BACKEND_LOCAL_URL
            : process.env.REACT_APP_PROD_URL;

        console.log("Base URL for authorization check:", baseUrl);

        const response = await fetch(
          `${baseUrl}/withings/check_withings_auth`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Authorization check response status:", response.status);

        if (response.ok) {
          const data = await response.json();
          console.log("Authorization check response data:", data);
          if (data.isAuthorized && data.withingsId) {
            setIsAuthorized(true);
            localStorage.setItem("withings_user", data.withingsId);
            console.log(
              "User is authorized, withingsId set in localStorage:",
              data.withingsId
            );
          } else {
            console.log("User is not authorized in response data.");
            setIsAuthorized(false);
          }
        } else {
          console.log("User is not authorized from response status.");
          setIsAuthorized(false);
        }
      } catch (error) {
        console.error("Error checking authorization:", error);
        setIsAuthorized(false);
      }
    };

    checkAuthorization();
  }, []);

  const scope = "user.info,user.metrics,user.activity";

  const handleAuth = () => {
    const state = generateRandomState();
    console.log("Generated state for Withings authorization:", state);

    const authorizeUrl = `https://account.withings.com/oauth2_user/authorize2?response_type=code&client_id=735ca4392928b4d8b5c42f41b4eb76d8d9b7a0c5cb3d40837a22f4f8a9b1bd0d&scope=${scope}&redirect_uri=https://localhost:5000/withings/callback&state=${state}`;

    localStorage.setItem("withings_state", state);
    console.log("Redirecting to Withings authorization URL:", authorizeUrl);
    window.location.href = authorizeUrl;
  };

  useEffect(() => {
    console.log("isAuthorized state has changed:", isAuthorized);
  }, [isAuthorized]);

  return (
    <button onClick={handleAuth} disabled={isAuthorized}>
      {isAuthorized ? "WITHINGS USER AUTHORIZED ALREADY" : "Authorize Withings"}
    </button>
  );
};

export default WithingsAuthButton;
