import Button from "@mui/material/Button";
import React from "react";
import { useOnClickOutside } from "../../functions/customHooks";
import { setAuthState } from "../../redux/authSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { selectUser } from "../../redux/userSlice";
import UserProfileButton from "./../navButton";

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
    console.log("registered log out clic k");

    try {
      console.log("registered log out cl ick");

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
          <div className="dropdownMenuItem" id="usernameInDropDown">
            <p style={{ fontSize: "1.2rem" }}>
              Logged in as: <b>{user.username}</b>.
            </p>
          </div>
          <div className="dropdownMenuItem" onClick={() => onToggle(false)}>
            <UserProfileButton buttonText="manage account" />
          </div>
          <div className="dropdownMenuItem" onClick={() => onToggle(false)}>
            <Button color="warning" onClick={() => logOut()}>
              Log out
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
