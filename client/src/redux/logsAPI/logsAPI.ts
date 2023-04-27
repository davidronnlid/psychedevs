import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { FetchLogsResponseElement } from "../../typeModels/logTypeModel";

const baseUrl =
  process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_BACKEND_LOCAL_URL
    : process.env.REACT_APP_PROD_URL;

const token = localStorage.getItem("user_sesh_JWT");
console.log("Token from localStorage:", token);

export const logsAPI = createApi({
  reducerPath: "logsAPI",
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      console.log("Headers before sending the request:", headers);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    fetchLogs: builder.query<
      FetchLogsResponseElement[],
      { startDate: string; endDate: string; logTypeIds: string[] }
    >({
      query: ({ startDate, endDate, logTypeIds }) => {
        const queryParams = new URLSearchParams({
          startDate,
          endDate,
          logTypeIds: JSON.stringify(logTypeIds),
        });

        return {
          url: `/vas/logs?${queryParams}`,
          method: "GET",
        };
      },
    }),
  }),
});

export const { useFetchLogsQuery } = logsAPI;
