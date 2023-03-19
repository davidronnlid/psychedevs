import { useState, useEffect } from "react";
import Form from "./signupAndLoginForm";

const HandleLoginState = (): JSX.Element => {
  const [jwt, setJwt] = useState<string | null>(
    localStorage.getItem("user_sesh_JWT")
  );

  const logOut = () => {
    console.log("registered log out click");
    localStorage.setItem("user_sesh_JWT", "");
    setJwt("");
  };

  const handleJwtChange = (newJwt: string | null) => {
    setJwt(newJwt); // update the state with the new jwt
  };

  useEffect(() => {
    setJwt(localStorage.getItem("user_sesh_JWT"));
  }, []);

  return (
    <>
      {!jwt || jwt === "" ? (
        <>
          {" "}
          <Form
            username=""
            password=""
            signupOrLogin={true}
            onJwtChange={handleJwtChange}
          />
          <Form
            username=""
            password=""
            signupOrLogin={false}
            onJwtChange={handleJwtChange}
          />
        </>
      ) : (
        <>
          <button onClick={() => logOut()}>Log out</button>
        </>
      )}
    </>
  );
};

export default HandleLoginState;
