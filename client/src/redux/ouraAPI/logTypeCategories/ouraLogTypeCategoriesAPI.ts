import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { OuraLogTypeCategoriesResponseData } from "../../../typeModels/ouraModel";

const baseUrl =
  process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_BACKEND_LOCAL_URL
    : process.env.REACT_APP_PROD_URL;

const token = localStorage.getItem("user_sesh_JWT");

export const ouraLogTypeCategoriesAPI = createApi({
  reducerPath: "ouraLogTypeCategoriesAPI",
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
    fetchOuraLogTypeCategories: builder.query<
      OuraLogTypeCategoriesResponseData,
      void
    >({
      query: () => ({
        url: "/oura/log-type-categories",
        params: {
          log_type_categories: "daily_activity,sleep",
        },
      }),
    }),
  }),
});

export const { useFetchOuraLogTypeCategoriesQuery } = ouraLogTypeCategoriesAPI;
