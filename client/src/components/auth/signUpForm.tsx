import React, { useState } from "react";
import { setAuthState } from "../../redux/authSlice";
import { useAppDispatch } from "../../redux/hooks";
import PasswordValidation from "./passwordValidation";
import UsernameValidation from "./usernameValidation";
import styles from "./Form.module.css";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";

interface SignupFormProps {
  // Define the interface for the Signupform inputs
  username: string;
  password: string;
}

const SignupForm: React.FC<SignupFormProps> = () => {
  // Define state for the Signupform inputs
  const [SignupformInputs, setSignupFormInputs] = useState<SignupFormProps>({
    username: "",
    password: "",
  });

  const [submitSuccess, setSubmitSuccess] = useState<boolean | undefined>(
    undefined
  );

  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isUsernameValid, setIsUsernameValid] = useState(false);

  const handlePasswordValidChange = (isValid: boolean) => {
    setIsPasswordValid(isValid);
  };

  const handleUsernameValidChange = (isValid: boolean) => {
    setIsUsernameValid(isValid);
  };

  const dispatch = useAppDispatch();

  const handlePasswordChange = (newPassword: string) => {
    setSignupFormInputs({
      ...SignupformInputs,
      password: newPassword,
    });
  };

  const handleUsernameChange = (newUsername: string) => {
    setSignupFormInputs({
      ...SignupformInputs,
      username: newUsername,
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

  // Define a function to handle Signupform submission
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const baseUrl =
        process.env.NODE_ENV === "development"
          ? process.env.REACT_APP_BACKEND_LOCAL_URL
          : process.env.REACT_APP_PROD_URL;

      const req_endpoint = `${baseUrl}/auth/signup`;

      console.log(req_endpoint);

      const response = await fetch(req_endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(SignupformInputs),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
        setSubmitSuccess(false);
      }
      console.log("SignupForm submitted successfully");

      // Get the JWT token from the response and save it to localStorage and app (Redux) state
      const data = await response.json();
      localStorage.setItem("user_sesh_JWT", data.token);
      dispatch(setAuthState({ isAuthenticated: true, jwt: data.token }));

      console.log("data received in signup component: " + data.token);

      // Check if there's any temporary data in localStorage
      const tempData = localStorage.getItem("tempData");
      if (tempData) {
        // Save the temporary data to the user's account
        // (assuming you have a function to save data called `saveData`)
        await saveData(JSON.parse(tempData));

        // Remove temporary data from localStorage
        localStorage.removeItem("tempData");
      }
      setSubmitSuccess(true);

      // Reset Signupform inputs after submission
      setSignupFormInputs({
        username: "",
        password: "",
      });
    } catch (error) {
      console.error("Error submitting Signupform:", error);
      setSubmitSuccess(false);
    }
  };

  return (
    <div className={styles.formWrapper}>
      {typeof submitSuccess === "undefined" ? (
        <form onSubmit={handleSubmit}>
          <h3 className={styles.title}>
            Join the PsycheDevs community to start saving your data!
          </h3>
          <UsernameValidation
            onUsernameValid={handleUsernameValidChange}
            username={SignupformInputs.username}
            onUsernameChange={handleUsernameChange}
          />
          <PasswordValidation
            onPasswordValid={handlePasswordValidChange}
            password={SignupformInputs.password}
            onPasswordChange={handlePasswordChange}
          />
          <Button
            type="submit"
            disabled={!isPasswordValid || !isUsernameValid}
            variant="contained"
            color="primary"
            className={styles.submitButton}
            style={{ marginTop: "1.5rem" }}
          >
            Sign up
          </Button>
        </form>
      ) : null}
      {submitSuccess === true ? (
        <>
          <h3>You are signed up and ready to go!</h3>
          <Link to="/logs">Go to Logs Planner</Link>
        </>
      ) : null}
      {submitSuccess === false ? <>Hey false</> : null}
    </div>
  );
};

export default SignupForm;
