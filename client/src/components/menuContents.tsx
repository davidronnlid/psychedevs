import React from "react";
import { User } from "../typeModels/userModel";

interface MenuContentsProps {
  user?: User;
}

const MenuContents: React.FC<MenuContentsProps> = ({ user }) => {
  const baseUrl =
    process.env.NODE_ENV === "development"
      ? process.env.REACT_APP_BACKEND_LOCAL_URL
      : process.env.REACT_APP_PROD_URL;

  const imageUrl = `${baseUrl}/uploads/profile-pics/${user?.profile_pic_filename}`;

  return (
    <div style={{ backgroundColor: "black", padding: "10px" }}>
      {user?.profile_pic_filename ? (
        <img
          src={imageUrl}
          alt="Profile pic"
          style={{ height: "60px", marginBottom: "10px" }}
        />
      ) : null}
      <span style={{ fontSize: "1.2rem" }}>{user?.username}</span>
    </div>
  );
};

export default MenuContents;

// Menu should contain LogOut button, as well as links to the Logger, Logs analyzer and Logs planner page

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
