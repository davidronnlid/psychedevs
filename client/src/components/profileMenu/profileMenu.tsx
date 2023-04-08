import ProfileAvatar from "./profileAvatar";
import React, { useState } from "react";
import DropdownMenu from "./profileDropdown";
import { useIsAuthenticated } from "../../redux/authSlice";
import Tooltip from "@mui/material/Tooltip";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";

const ProfileMenu: React.FC = () => {
  const [toggleState, setToggleState] = useState(false);

  const handleToggle = (state: boolean) => {
    setToggleState(state);
  };

  const userLoaded = useIsAuthenticated();

  return userLoaded ? (
    <div className="profileMenu">
      <button
        onClick={() => handleToggle(true)}
        style={{ backgroundColor: "#001219", border: "none" }}
      >
        <Tooltip title="Click to open profile menu" arrow>
          <ProfileAvatar size="large" />
        </Tooltip>
      </button>{" "}
      <DropdownMenu toggleState={toggleState} onToggle={handleToggle} />
    </div>
  ) : (
    <div className="profileMenu signupOrLoginMenu ">
      <Link to="/signup" style={{ textDecoration: "none" }}>
        <Button
          style={{
            color: "white",
          }}
        >
          Sign up
        </Button>
      </Link>
      <span
        style={{
          color: "white",
        }}
      >
        |
      </span>
      <Link to="/login" style={{ textDecoration: "none" }}>
        <Button
          style={{
            color: "white",
          }}
        >
          Login
        </Button>
      </Link>
    </div>
  );
};

export default ProfileMenu;
