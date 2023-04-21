import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { OuraLogTypesResponseData } from "../../../typeModels/ouraModel";

const baseUrl =
  process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_BACKEND_LOCAL_URL
    : process.env.REACT_APP_PROD_URL;

const token = localStorage.getItem("user_sesh_JWT");
interface FetchOuraLogTypesParams {
  category: string;
}

export const ouraLogTypesAPI = createApi({
  reducerPath: "ouraLogTypesAPI",
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    fetchOuraLogTypes: builder.query<
      OuraLogTypesResponseData,
      FetchOuraLogTypesParams
    >({
      query: ({ category }) => ({
        url: `/oura/log-types/${category}`,
      }),
    }),
  }),
});

export const { useFetchOuraLogTypesQuery } = ouraLogTypesAPI;
