import React, { useEffect, useState } from "react";
import { Link, Route, Routes } from "react-router-dom";
import UserProfile from "./userProfile";

interface User {
  _id: string;
  username: string;
}

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const token = localStorage.getItem("user_sesh_JWT");

        const baseUrl =
          process.env.NODE_ENV === "development"
            ? process.env.REACT_APP_BACKEND_LOCAL_URL
            : process.env.REACT_APP_PROD_URL;

        console.log(
          process.env.REACT_APP_BACKEND_LOCAL_URL,
          process.env.REACT_APP_PROD_URL
        );

        const response = await fetch(`${baseUrl}/users/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        console.log("Response data", data);
        setUsers(data);
      } catch (error) {
        console.error(error);
      }
    };

    getUsers();
  }, []);

  return (
    <div>
      <h2>List of Users</h2>
      <ul>
        {users.map((user) => {
          const pathValue = `/user-profile/${user._id}`;

          return (
            <li key={user._id}>
              <Link to={pathValue}>Go to {user.username}'s profile</Link>
            </li>
          );
        })}
      </ul>

      <Routes>
        {users.map((user) => (
          <Route
            key={user._id}
            path={`/user-profile/${user._id}`}
            element={<UserProfile user={user} />}
          />
        ))}
      </Routes>
    </div>
  );
};

export default UsersPage;
