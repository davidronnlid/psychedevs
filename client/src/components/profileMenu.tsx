import Avatar from "@mui/material/Avatar";
import { selectUser } from "../redux/userSlice";
import React from "react";
import { useAppSelector } from "../redux/hooks";

const ProfileMenu: React.FC = () => {
  const user = useAppSelector(selectUser);

  const baseUrl =
    process.env.NODE_ENV === "development"
      ? process.env.REACT_APP_BACKEND_LOCAL_URL
      : process.env.REACT_APP_PROD_URL;

  const imageUrl = `${baseUrl}/uploads/profile-pics/${user?.profile_pic_filename}`;
  return (
    <>
      {user?.profile_pic_filename ? (
        <img
          src={imageUrl}
          alt="Profile pic"
          style={{ height: "60px", marginBottom: "10px" }}
        />
      ) : null}
      <span style={{ fontSize: "1.2rem" }}>{user?.username}</span>
    </>
  );
};

export default ProfileMenu;

// Profile pic menu should contain LogOut button, and upon clicking profile pic USBAT go to their profile

// And logout button:
// const logOut = () => {
//     try {
//       dispatch(setAuthState({ isAuthenticated: false, jwt: null }));

//       //Set hamburger openState here? Nah bro, but work on this
//     } catch (error) {
//       console.error(error);
//     }

//     console.log("registered log out click");
//     localStorage.setItem("user_sesh_JWT", "");
//   };

// NOTE THAT HEADER CHANGES HEIGHT UPON CLICKING BURGER, THIS INFO MAY OR MAY NOT BE USEFUL FOR DEBUGGING HOW TO DISPLAY THE ABOVE DEFINED CONTENTS IN THE MENU
