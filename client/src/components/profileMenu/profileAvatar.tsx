import React, { useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import { useAppSelector } from "../../redux/hooks";
import { selectProfilePicFilename } from "../../redux/userSlice";

interface ProfileAvatarProps {
  size: "small" | "large";
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ size }) => {
  console.log("🚀 ~ file: profileAvatar.tsx:12 ~ size:", size);
  const profile_pic_file_name = useAppSelector(selectProfilePicFilename);

  const baseUrl =
    process.env.NODE_ENV === "development"
      ? process.env.REACT_APP_BACKEND_LOCAL_URL
      : process.env.REACT_APP_PROD_URL;

  const imageUrl = `${baseUrl}/uploads/profile-pics/${profile_pic_file_name}`;

  const avatarSx = {
    small: {
      width: { xs: 15, sm: 30, md: 40 },
      height: { xs: 15, sm: 30, md: 40 },
    },
    large: {
      width: { xs: 40, sm: 60, md: 100 },
      height: { xs: 40, sm: 60, md: 100 },
    },
  };

  useEffect(() => {}, [profile_pic_file_name]);

  return <Avatar sx={avatarSx[size]} alt="profile pic" src={imageUrl} />;
};

export default ProfileAvatar;
