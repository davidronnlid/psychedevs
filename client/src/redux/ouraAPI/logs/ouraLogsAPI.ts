import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { OuraLogsDataByType } from "../../../typeModels/ouraModel";

const baseUrl =
  process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_BACKEND_LOCAL_URL
    : process.env.REACT_APP_PROD_URL;

const token = localStorage.getItem("user_sesh_JWT");
console.log("Token from localStorage:", token);

export const ouraLogsAPI = createApi({
  reducerPath: "ouraLogsAPI",
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
    fetchOuraLogs: builder.query<OuraLogsDataByType, { logTypeIds: string[] }>({
      query: ({ logTypeIds }) => {
        const queryParam = logTypeIds
          .map((id) => `logTypeId[]=${id}`)
          .join("&");
        return `/oura/logs?${queryParam}`;
      },
    }),
  }),
});

export const { useFetchOuraLogsQuery } = ouraLogsAPI;
