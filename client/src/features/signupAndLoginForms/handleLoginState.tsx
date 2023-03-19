import Form from "./signupAndLoginForm";
import { setAuthState, useJwt } from "../../redux/authSlice";
import { useAppDispatch } from "../../redux/hooks";

interface AuthedApp {
  jwt: string | null;
}

const HandleLoginState: React.FC<AuthedApp> = ({ jwt }): JSX.Element => {
  const dispatch = useAppDispatch();

  const updatedJwt = useJwt();
  console.log(updatedJwt);

  const logOut = () => {
    try {
      dispatch(setAuthState({ isAuthenticated: false, jwt: null }));
    } catch (error) {
      console.error(error);
    }

    console.log("registered log out click");
    localStorage.setItem("user_sesh_JWT", "");
  };

  return (
    <>
      {updatedJwt ? (
        <>
          <button onClick={() => logOut()}>Log out</button>
        </>
      ) : (
        <>
          <Form username="" password="" signupOrLogin={true} />
          <Form username="" password="" signupOrLogin={false} />
        </>
      )}
    </>
  );
};

export default HandleLoginState;
