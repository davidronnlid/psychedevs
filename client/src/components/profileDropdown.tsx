import React from "react";
import { useOnClickOutside } from "../functions/customHooks";
import { useAppSelector } from "../redux/hooks";
import { selectUser } from "../redux/userSlice";

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

  useOnClickOutside(menuRef, () => {
    onToggle(false);
  });

  return (
    <div ref={menuRef} tabIndex={0}>
      {" "}
      {toggleState && (
        <div className="dropdownMenu">
          <div className="dropdownMenuItem" onClick={() => onToggle(false)}>
            <p style={{ fontSize: "1.2rem" }}>
              Logged in as: <b>{user.username}</b>.
            </p>
          </div>
          <div className="dropdownMenuItem" onClick={() => onToggle(false)}>
            Option 2
          </div>
          <div className="dropdownMenuItem" onClick={() => onToggle(false)}>
            Option 3
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;

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
