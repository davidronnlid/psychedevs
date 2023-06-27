import {
  FetchUserResult,
  FetchUserResultData,
  User,
} from "../typeModels/userModel";

export const fetchUserProfile = async (
  token: string
): Promise<FetchUserResult> => {
  const baseUrl =
    process.env.NODE_ENV === "development"
      ? process.env.REACT_APP_BACKEND_LOCAL_URL
      : process.env.REACT_APP_PROD_URL;

  if (!token || token === "") {
    return { success: false, data: null, error: "No token" };
  } else {
    try {
      const response = await fetch(`${baseUrl}/users/user-profile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data: FetchUserResultData = await response.json();
      return { success: true, data, error: null };
    } catch (error) {
      // Check if error is an instance of Error, and then access the message property
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      return { success: false, data: null, error: errorMessage };
    }
  }
};
