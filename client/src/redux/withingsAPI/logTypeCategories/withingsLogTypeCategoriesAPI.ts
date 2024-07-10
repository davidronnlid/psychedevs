import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { WithingsLogTypeCategoriesResponseData } from "../../../typeModels/withingsModel";

const baseUrl =
  process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_BACKEND_LOCAL_URL
    : process.env.REACT_APP_PROD_URL;

const token = localStorage.getItem("user_sesh_JWT");

export const WithingsLogTypeCategoriesAPI = createApi({
  reducerPath: "withingsLogTypeCategoriesAPI",
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
    fetchWithingsLogTypeCategories: builder.query<
      WithingsLogTypeCategoriesResponseData,
      void
    >({
      query: () => ({
        url: "/withings/log-type-categories",
        params: {
          log_type_categories: "daily_activity,sleep",
        },
      }),
    }),
  }),
});

export const { useFetchWithingsLogTypeCategoriesQuery } =
  WithingsLogTypeCategoriesAPI;
