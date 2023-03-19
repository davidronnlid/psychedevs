import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  _id: string;
  username: string;
  profile_pic_filename: string;
}

const initialState: UserState = {
  _id: "",
  username: "",
  profile_pic_filename: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserState: (state, action: PayloadAction<UserState>) => {
      state._id = action.payload._id;
      state.username = action.payload.username;
      state.profile_pic_filename = action.payload.profile_pic_filename;
    },
  },
});

export const { setUserState } = userSlice.actions;
export default userSlice.reducer;
