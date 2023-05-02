import React, { useEffect, useState } from "react";
import { useJwt } from "../../redux/authSlice";

interface User {
  _id: string;
  username: string;
}

interface UserProfileProps {
  user?: User;
}

const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  const [userData, setUserData] = useState<User | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [uploaded, setUploaded] = useState<Boolean>(false);
  const token = useJwt();

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      return;
    }

    const baseUrl =
      process.env.NODE_ENV === "development"
        ? process.env.REACT_APP_BACKEND_LOCAL_URL
        : process.env.REACT_APP_PROD_URL;

    console.log(selectedFile, " is selectedFile");
    const formData = new FormData();
    formData.append("image", selectedFile);
    try {
      const response = await fetch(`${baseUrl}/users/profile-pic`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const data = await response.json();
      setUploaded(data.success);
      console.log("handleUpload", data.success);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        const baseUrl =
          process.env.NODE_ENV === "development"
            ? process.env.REACT_APP_BACKEND_LOCAL_URL
            : process.env.REACT_APP_PROD_URL;

        const response = await fetch(`${baseUrl}/users/user-profile`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setUserData(data);

        setImageUrl(
          `${baseUrl}/uploads/profile-pics/${data.profile_pic_filename}`
        );
      } catch (error) {
        console.error(error);
      }
    };
    if (!user) {
      getUser();
    } else {
      setUserData(user);
    }
  }, [user]);

  if (!userData) {
    return <div>Loading user data...</div>;
  }

  return (
    <div>
      <h2>User Profile</h2>
      <ul>
        <li>Username: {userData.username}</li>
      </ul>
      <h2>Profile picture</h2>
      {imageUrl && (
        <img
          src={imageUrl}
          alt="Profile"
          style={{ width: "15vw", margin: "0 auto" }}
        />
      )}{" "}
      <input type="file" name="profilePic" onChange={handleFileInput} />
      <button onClick={handleUpload}>Upload</button>
      {uploaded ? (
        <p>
          Upload successful. Refresh page to see your updated profile picture.
        </p>
      ) : null}
    </div>
  );
};

export default UserProfile;
