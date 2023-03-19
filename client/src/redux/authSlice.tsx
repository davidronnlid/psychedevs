import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { useAppSelector } from "./hooks";

interface AuthState {
  isAuthenticated: boolean;
  jwt: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  jwt: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthState: (state, action: PayloadAction<AuthState>) => {
      state.isAuthenticated = action.payload.isAuthenticated;
      state.jwt = action.payload.jwt;
    },
  },
});

const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
const selectJwt = (state: RootState) => state.auth.jwt;

export const useIsAuthenticated = () => useAppSelector(selectIsAuthenticated);
export const useJwt = () => useAppSelector(selectJwt);

export const { setAuthState } = authSlice.actions;
export default authSlice.reducer;
