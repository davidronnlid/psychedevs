import ProfileAvatar from "./profileAvatar";
import React, { useState } from "react";
import DropdownMenu from "./profileDropdown";
import { useIsAuthenticated } from "../redux/authSlice";
import Tooltip from "@mui/material/Tooltip";

const ProfileMenu: React.FC = () => {
  const [toggleState, setToggleState] = useState(false);

  const handleToggle = (state: boolean) => {
    setToggleState(state);
  };

  const userLoaded = useIsAuthenticated();

  return userLoaded ? (
    <div className="profileMenu">
      <button onClick={() => handleToggle(true)}>
        <Tooltip title="Click to open profile menu" arrow>
          <ProfileAvatar />
        </Tooltip>
      </button>{" "}
      <DropdownMenu toggleState={toggleState} onToggle={handleToggle} />
    </div>
  ) : null;
};

export default ProfileMenu;
