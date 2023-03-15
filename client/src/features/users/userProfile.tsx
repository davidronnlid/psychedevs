import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface User {
  _id: string;
  username: string;
}

interface UserProfileProps {
  user?: User;
}

const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  const { userId } = useParams<{ userId: string }>();
  const [userData, setUserData] = useState<User | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);

  const handleFollowClick = async () => {
    setIsFollowing(!isFollowing);

    try {
      const token = localStorage.getItem("user_sesh_JWT");

      const baseUrl =
        process.env.NODE_ENV === "development"
          ? process.env.REACT_APP_BACKEND_LOCAL_URL
          : process.env.REACT_APP_PROD_URL;

      await fetch(`${baseUrl}/follow/${userId}?${isFollowing}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        const token = localStorage.getItem("user_sesh_JWT");

        const baseUrl =
          process.env.NODE_ENV === "development"
            ? process.env.REACT_APP_BACKEND_LOCAL_URL
            : process.env.REACT_APP_PROD_URL;

        const response = await fetch(`${baseUrl}/users/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error(error);
      }
    };
    if (!user) {
      getUser();
    } else {
      setUserData(user);
    }
  }, [userId, user]);

  if (!userData) {
    return <div>Loading user data...</div>;
  }

  return (
    <div>
      <h2>User Profile</h2>
      <ul>
        <li>ID: {userData._id}</li>
        <li>Username: {userData.username}</li>
      </ul>
    </div>
  );
};

export default UserProfile;
