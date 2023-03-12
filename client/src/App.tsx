import logo from "./logo.svg";
import { Counter } from "./features/counter/Counter";
import "./App.css";
import DataFetching from "./features/backendConnection";
import Form from "./features/signupAndLoginForms/signupAndLoginForm";
import VasForm from "./features/vas_form/vasForm";
import { Link } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Link to="/users">Users Page</Link>
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
