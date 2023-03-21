import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

import { User } from "../typeModels/userModel";
import MenuContents from "./menuContents";

interface HamburgerProps {
  user?: User;
}

const Hamburger: React.FC<HamburgerProps> = ({ user }): JSX.Element => {
  const [open, setOpen] = useState(false);

  console.log(user);

  const handleToggleMenu = () => {
    setOpen(!open);
  };
  const headerHeight = (50 * 239) / 714 + "vw";

  return (
    <>
      {open && (
        <div
          className={`fullScreenMenu${open ? " open" : " close"}`}
          style={{
            top: headerHeight,
          }}
        >
          <MenuContents user={user} />
        </div>
      )}
      {open ? (
        <div style={{ position: "fixed", top: "5vw", right: "3vw" }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="close"
            onClick={() => handleToggleMenu()}
          >
            <CloseIcon style={{ color: "white" }} />
          </IconButton>
        </div>
      ) : (
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={() => handleToggleMenu()}
          style={{ position: "fixed", top: "5vw", right: "3vw" }}
        >
          <MenuIcon style={{ color: "white" }} />
        </IconButton>
      )}
    </>
  );
};

export default Hamburger;
