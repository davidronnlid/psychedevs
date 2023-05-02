import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import MenuContents from "./menuContents";

const Hamburger: React.FC = (): JSX.Element => {
  const [open, setOpen] = useState(false);

  const handleToggleMenu = () => {
    setOpen(!open);
  };
  const handleCloseMenu = () => {
    setOpen(false);
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
          onClick={handleCloseMenu}
        >
          <MenuContents />
        </div>
      )}
      {open ? (
        <div>
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
        >
          <MenuIcon style={{ color: "white" }} />
        </IconButton>
      )}
    </>
  );
};

export default Hamburger;
