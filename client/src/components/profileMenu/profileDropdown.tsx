import Button from "@mui/material/Button";
import React, { useState } from "react";
import { useOnClickOutside } from "../../functions/customHooks";
import { setAuthState } from "../../redux/authSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { selectUser } from "../../redux/userSlice";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import UserProfileButton from "../navButton";
import ProfileAvatar from "./profileAvatar";

interface DropdownMenuProps {
  onToggle: (state: boolean) => void;
  toggleState: boolean;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  onToggle,
  toggleState,
}) => {
  const user = useAppSelector(selectUser);
  const menuRef = React.useRef<HTMLDivElement>(null);

  const dispatch = useAppDispatch();

  useOnClickOutside(menuRef, () => {
    onToggle(false);
  });

  const logOut = () => {
    try {
      dispatch(setAuthState({ isAuthenticated: false, jwt: null }));
      localStorage.setItem("user_sesh_JWT", "");
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
            {user.username.toLocaleUpperCase()}
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
