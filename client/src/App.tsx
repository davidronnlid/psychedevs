import { Counter } from "./features/counter/Counter";
import "./App.css";
import DataFetching from "./features/backendConnection";
import Form from "./features/signupAndLoginForms/signupAndLoginForm";
import VasForm from "./features/vas_form/vasForm";
import { Link } from "react-router-dom";
import UserProfileButton from "./components/navButton";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <UserProfileButton
          buttonText="Go to User Profile"
          linkTo="/user-profile"
        />
        <Link to="/logs">Logs Page</Link>
        <DataFetching />
        <Counter />
        <VasForm value={0} />
        <Form username="" password="" signupOrLogin={true} />
        <Form username="" password="" signupOrLogin={false} />
        <p>Token available: {localStorage.getItem("user_sesh_JWT")}</p>
      </header>
    </div>
  );
}

export default App;
