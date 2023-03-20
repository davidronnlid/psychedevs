import { useState } from "react";
import { useSelector } from "react-redux";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

import { selectUsername, selectProfilePicFilename } from "../redux/userSlice";
import { User } from "../typeModels/userModel";

interface HamburgerProps {
  logOutFunc: () => void;
  user?: User;
}

const Hamburger: React.FC<HamburgerProps> = ({
  logOutFunc,
  user,
}): JSX.Element => {
  const [open, setOpen] = useState(false);
  const username = useSelector(selectUsername);
  const profilePicFilename = useSelector(selectProfilePicFilename);

  // Upon component loading, set imageUrl to a state variable which corresponds to:
  const baseUrl =
    process.env.NODE_ENV === "development"
      ? process.env.REACT_APP_BACKEND_LOCAL_URL
      : process.env.REACT_APP_PROD_URL;

  const imageUrl = `${baseUrl}/uploads/profile-pics/${user?.profile_pic_filename}`;

  const handleToggleMenu = () => {
    setOpen(!open);
    // logOutFunc();
  };

  return (
    <>
      {open ? (
        <div style={{ position: "fixed", top: "5vw", right: "3vw" }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="close"
            onClick={() => handleToggleMenu()}
            style={{ marginTop: "10px" }}
          >
            <CloseIcon />
          </IconButton>
          {/* {user?.profile_pic_filename(
                <img
                  src={imageUrl}
                  alt="Profile pic"
                  style={{ height: "60px", marginBottom: "10px" }}
                />
              )
            : null} */}
          <span style={{ fontSize: "1.2rem" }}>{username}</span>
        </div>
      ) : (
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={() => handleToggleMenu()}
          style={{ position: "fixed", top: "5vw", right: "3vw" }}
        >
          <MenuIcon />
        </IconButton>
      )}
    </>
  );
};

export default Hamburger;
