import { Button } from "@mui/material";
import React, { useState } from "react";
import { setAuthState } from "../../redux/authSlice";
import { useAppDispatch } from "../../redux/hooks";
import styles from "./Form.module.css";

interface LoginFormProps {
  // Define the interface for the Loginform inputs
  username: string;
  password: string;
}

const LoginForm: React.FC<LoginFormProps> = () => {
  // Define state for the Loginform inputs
  const [LoginformInputs, setLoginFormInputs] = useState<LoginFormProps>({
    username: "",
    password: "",
  });

  const dispatch = useAppDispatch();

  // Define a function to handle Loginform input changes
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLoginFormInputs({
      ...LoginformInputs,
      [event.target.name]: event.target.value,
    });
  };

  const saveData = async (tempData: any) => {
    const baseUrl =
      process.env.NODE_ENV === "development"
        ? process.env.REACT_APP_BACKEND_LOCAL_URL
        : process.env.REACT_APP_PROD_URL;

    const response = await fetch(`${baseUrl}/vas/logs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("user_sesh_JWT")}`,
      },
      body: JSON.stringify(tempData),
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    console.log("Temporary data saved successfully");
  };

  // Define a function to handle Loginform submission
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const baseUrl =
        process.env.NODE_ENV === "development"
          ? process.env.REACT_APP_BACKEND_LOCAL_URL
          : process.env.REACT_APP_PROD_URL;

      const req_endpoint = `${baseUrl}/auth/login`;

      console.log(req_endpoint);

      const response = await fetch(req_endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(LoginformInputs),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      console.log("LoginForm submitted successfully");

      // Get the JWT token from the response and save it to localStorage and app (Redux) state
      const data = await response.json();
      localStorage.setItem("user_sesh_JWT", data.token);
      dispatch(setAuthState({ isAuthenticated: true, jwt: data.token }));

      console.log("data received in login/signup component: " + data.token);

      // Check if there's any temporary data in localStorage
      const tempData = localStorage.getItem("tempData");
      if (tempData) {
        // Save the temporary data to the user's account
        // (assuming you have a function to save data called `saveData`)
        await saveData(JSON.parse(tempData));

        // Remove temporary data from localStorage
        localStorage.removeItem("tempData");
      }

      // Reset Loginform inputs after submission
      setLoginFormInputs({
        username: "",
        password: "",
      });
    } catch (error) {
      console.error("Error submitting Loginform:", error);
    }
  };

  return (
    <div className={styles.formWrapper}>
      <form onSubmit={handleSubmit}>
        <h3 className={styles.title}>Login:</h3>
        <div>
          <label htmlFor="username">Username:</label>
          <br />
          <input
            type="text"
            name="username"
            value={LoginformInputs.username}
            onChange={handleInputChange}
            required
          />
        </div>
        <div style={{ marginTop: "0.5rem" }}>
          <label htmlFor="password">Password:</label>
          <br />
          <input
            type="password"
            name="password"
            value={LoginformInputs.password}
            onChange={handleInputChange}
            required
          />
        </div>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          className={styles.submitButton}
          style={{ marginTop: "1.5rem" }}
        >
          Submit
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;
