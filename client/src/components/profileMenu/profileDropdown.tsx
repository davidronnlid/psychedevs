import Button from "@mui/material/Button";
import React from "react";
import { useOnClickOutside } from "../../functions/customHooks";
import { setAuthState } from "../../redux/authSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import UserProfileButton from "../navButton";
import ProfileAvatar from "./profileAvatar";
import useGetUser from "../../functions/useGetUser";
import { FetchUserResultData, User } from "../../typeModels/userModel";

interface DropdownMenuProps {
  onToggle: (state: boolean) => void;
  toggleState: boolean;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  onToggle,
  toggleState,
}) => {
  const userObj: FetchUserResultData = useGetUser();
  console.log("🚀 ~ file: profileDropdown.tsx:27 ~ userObj:", userObj);
  // const user: User = userObj?.userWithoutPassword;

  const menuRef = React.useRef<HTMLDivElement>(null);

  const dispatch = useAppDispatch();

  useOnClickOutside(menuRef, () => {
    onToggle(false);
  });

  const logOut = () => {
    try {
      dispatch(setAuthState({ isAuthenticated: false, jwt: null }));
      localStorage.setItem("user_sesh_JWT", "");
      const baseUrl =
        process.env.NODE_ENV === "development"
          ? process.env.REACT_APP_BACKEND_LOCAL_URL
          : process.env.REACT_APP_PROD_URL;
      fetch(baseUrl + "/auth/logout", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          // handle the response
          console.log(data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });

      return;
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div ref={menuRef} tabIndex={0} className="dropdownMenuContainer">
      {toggleState && (
        <div className="dropdownMenu">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: "1.2rem",
            }}
            className="dropdownMenuItem"
          >
            <ProfileAvatar size="small" />
            {/* {user.username.toLocaleUpperCase()} */}
          </div>
          <div className="dropdownMenuItem" onClick={() => onToggle(false)}>
            <UserProfileButton buttonText="MANAGE ACCOUNT" />
          </div>
          <div className="dropdownMenuItem" onClick={() => onToggle(false)}>
            <Button
              className="logoutButton"
              sx={{ color: "red" }}
              onClick={() => logOut()}
            >
              <ExitToAppIcon /> Log out
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
