import Avatar from "@mui/material/Avatar";
import { useAppSelector } from "../../redux/hooks";
import "./profileAvatar.scss";
import { selectProfilePicFilename } from "../../redux/userSlice";

const ProfileAvatar = () => {
  const profile_pic_file_name = useAppSelector(selectProfilePicFilename);

  const baseUrl =
    process.env.NODE_ENV === "development"
      ? process.env.REACT_APP_BACKEND_LOCAL_URL
      : process.env.REACT_APP_PROD_URL;

  const imageUrl = `${baseUrl}/uploads/profile-pics/${profile_pic_file_name}`;

  return (
    <Avatar
      className="avatar responsive-avatar"
      alt="profile pic"
      src={imageUrl}
    />
  );
};

export default ProfileAvatar;
