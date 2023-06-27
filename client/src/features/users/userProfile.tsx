import React from "react";
import useGetUser from "../../functions/useGetUser";

const UserProfile: React.FC<any> = () => {
  const user: any = useGetUser();
  console.log("🚀 ~ file: userProfile.tsx:6 ~ user:", user);

  return (
    <div>
      <h2>User Profile</h2>
      <ul>
        <li>Name: {user?.userWithoutPassword.name}</li>{" "}
        <li>Id: {user?.userWithoutPassword.sub}</li>
      </ul>
    </div>
  );
};

export default UserProfile;
