import { useEffect, useState } from "react";
import SignUpForm from "../../components/auth/signUpForm";

const SignUpPage = () => {
  const [userProfile, setUserProfile] = useState<any>();

  useEffect(() => {
    const fetchUserProfile = async () => {
      console.log("called fetchUserProfile!!");
      const baseUrl =
        process.env.NODE_ENV === "development"
          ? process.env.REACT_APP_BACKEND_LOCAL_URL
          : process.env.REACT_APP_PROD_URL;

      try {
        const response = await fetch(baseUrl + "/signup");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const user = await response.json();
        console.log(
          "🚀 ~ file: signUpPage.tsx:20 ~ fetchUserProfile ~ user:",
          user
        );

        setUserProfile(user);
      } catch (error) {
        console.error(
          "An error occurred while fetching the user profile:",
          error
        );
      }
    };

    fetchUserProfile();
  }, []);

  if (!userProfile) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <p>{userProfile.toString()}</p>
      <SignUpForm username="" password="" />
    </>
  );
};

export default SignUpPage;
