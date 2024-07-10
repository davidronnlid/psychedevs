import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { WithingsLogTypesResponseData } from "../../../typeModels/withingsModel";

const baseUrl =
  process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_BACKEND_LOCAL_URL
    : process.env.REACT_APP_PROD_URL;

const token = localStorage.getItem("user_sesh_JWT");
interface FetchWithingsLogTypesParams {
  category: string;
}

export const withingsLogTypesAPI = createApi({
  reducerPath: "WithingsLogTypesAPI",
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
    fetchWithingsLogTypes: builder.query<
      WithingsLogTypesResponseData,
      FetchWithingsLogTypesParams
    >({
      query: ({ category }) => ({
        url: `/withings/log-types/${category}`,
      }),
    }),
  }),
});

export const { useFetchWithingsLogTypesQuery } = withingsLogTypesAPI;
