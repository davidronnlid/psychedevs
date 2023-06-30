import { useState, useEffect } from "react";

function useGetUser() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const baseUrl =
      process.env.NODE_ENV === "development"
        ? process.env.REACT_APP_BACKEND_LOCAL_URL
        : process.env.REACT_APP_PROD_URL;
    fetch(baseUrl + "/auth/user", {
      method: "GET",
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => setUser(data))
      .catch((error) =>
        console.error("An error occurred while fetching the user:", error)
      );
  }, []);

  return user;
}

export default useGetUser;
