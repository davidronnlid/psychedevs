import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { OuraResponseData } from "../../typeModels/ouraModel";

const baseUrl =
  process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_BACKEND_LOCAL_URL
    : process.env.REACT_APP_PROD_URL;

const token = localStorage.getItem("user_sesh_JWT");
console.log("Token from localStorage:", token);

export const ouraAPI = createApi({
  reducerPath: "ouraAPI",
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
    fetchOuraData: builder.query<OuraResponseData, void>({
      query: () => "/oura/data",
    }),
  }),
});

export const { useFetchOuraDataQuery } = ouraAPI;
