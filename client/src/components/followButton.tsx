import React from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";

interface Props {
  isFollowing: boolean;
  onClick: () => void;
}

const FollowButton: React.FC<Props> = ({ isFollowing, onClick }) => {
  const FollowButton = styled(Button)({
    backgroundColor: !isFollowing ? "#BDBDBD" : "#2196f3",
    color: !isFollowing ? "#212121" : "#fff",
    "&:hover": {
      backgroundColor: !isFollowing ? "#BDBDBD" : "#1976d2",
    },
  });

  return (
    <FollowButton onClick={onClick}>
      {!isFollowing ? "Unfollow" : "Follow"}
    </FollowButton>
  );
};

export default FollowButton;
