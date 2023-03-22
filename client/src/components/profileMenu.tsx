import ProfileAvatar from "./profileAvatar";
import React, { useState } from "react";
import DropdownMenu from "./profileDropdown";

const ProfileMenu: React.FC = () => {
  const [toggleState, setToggleState] = useState(false);

  const handleToggle = (state: boolean) => {
    setToggleState(state);
  };

  return (
    <div className="profileMenu">
      <button onClick={() => handleToggle(!toggleState)}>
        <ProfileAvatar />
      </button>
      <DropdownMenu toggleState={toggleState} onToggle={handleToggle} />
    </div>
  );
};

export default ProfileMenu;
