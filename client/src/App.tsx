import { Counter } from "./features/counter/Counter";
import "./App.css";
import DataFetching from "./features/backendConnection";
import VasForm from "./features/vas_form/vasForm";
import { Link } from "react-router-dom";
import UserProfileButton from "./components/navButton";
import HandleLoginState from "./features/signupAndLoginForms/handleLoginState";
import { useState } from "react";

function App() {
  const [jwt, setJwt] = useState<string | null>(null);

  const handleJwtChange = (newJwt: string | null) => {
    setJwt(newJwt); // update the jwt state in the parent component
  };

  return (
    <div className="App">
      <header className="App-header">
        <UserProfileButton buttonText="Go to User Profile" />
        <Link to="/logs">Logs Page</Link>
        <DataFetching />
        <Counter />
        <VasForm value={0} />

        <HandleLoginState onJwtChange={handleJwtChange} />

        <p>Token available: {localStorage.getItem("user_sesh_JWT")}</p>
      </header>
    </div>
  );
}

export default App;
