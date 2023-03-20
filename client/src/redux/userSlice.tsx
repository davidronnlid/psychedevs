import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../typeModels/userModel";
import { RootState } from "./store";

const initialState: User = {
  _id: "",
  username: "",
  profile_pic_filename: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setId: (state, action: PayloadAction<string>) => {
      state._id = action.payload;
    },
    setUsername: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
    },
    setProfilePicFilename: (state, action: PayloadAction<string>) => {
      state.profile_pic_filename = action.payload;
    },
    setUserState: (state, action: PayloadAction<User>) => {
      state._id = action.payload._id;
      state.username = action.payload.username;
      state.profile_pic_filename = action.payload.profile_pic_filename;
    },
  },
});

export const selectUser = (state: RootState) => state.user;

export const selectUserId = (state: RootState) => state.user._id;

export const selectUsername = (state: RootState) => state.user.username;

export const selectProfilePicFilename = (state: RootState) =>
  state.user.profile_pic_filename;

export const { setId, setUsername, setProfilePicFilename, setUserState } =
  userSlice.actions;
export default userSlice.reducer;
