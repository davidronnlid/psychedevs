import { Counter } from "./redux/Counter";
import "./App.css";
import DataFetching from "./features/backendConnection";
import VasForm from "./features/vas_form/vasForm";
import { Link } from "react-router-dom";
import UserProfileButton from "./components/navButton";
import HandleLoginState from "./features/signupAndLoginForms/handleLoginState";
import { useJwt } from "./redux/authSlice";

const App: React.FC = (): JSX.Element => {
  const jwt = useJwt();

  const updatedJwt = useJwt();
  console.log("Updated JWT: ", updatedJwt);

  return (
    <div className="App">
      <UserProfileButton buttonText="Go to User Profile" />
      <Link to="/logs">Logs Page</Link>
      <DataFetching />
      <Counter />
      <VasForm value={0} />

      <HandleLoginState jwt={jwt} />

      <p>Token available: {jwt}</p>
    </div>
  );
};

export default App;
