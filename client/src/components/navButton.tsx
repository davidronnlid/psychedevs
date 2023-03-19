import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import { ObjectId } from "mongoose";

type Props = {
  buttonText: string;
  linkTo: string;
};

interface User {
  _id: ObjectId;
}

const UserProfileButton: React.FC<Props> = ({ buttonText, linkTo }) => {
  const [userId, setUserId] = useState<User | null>(null);

  useEffect(() => {
    const getUserId = async () => {
      try {
        const token = localStorage.getItem("user_sesh_JWT");

        if (!token || token === "") {
          console.log("Not logged in");
        } else {
          const baseUrl =
            process.env.NODE_ENV === "development"
              ? process.env.REACT_APP_BACKEND_LOCAL_URL
              : process.env.REACT_APP_PROD_URL;

          const response = await fetch(`${baseUrl}/users/user-id`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          const data = await response.json();
          console.log(data);
          setUserId(data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (!userId) {
      getUserId();
    }
  }, [userId]);

  return (
    <>
      {userId ? (
        <Button
          component={Link}
          to={`/user-profile/${userId}`}
          variant="contained"
          color="primary"
        >
          {buttonText}
        </Button>
      ) : (
        <p>Not logged in...</p>
      )}
    </>
  );
};

export default UserProfileButton;
