import "./App.css";
import VasForm from "./features/vas_form/vasForm";
import { useJwt } from "./redux/authSlice";

const App: React.FC = (): JSX.Element => {
  const updatedJwt = useJwt();
  console.log("Updated JWT: ", updatedJwt);

  return (
    <div className="App">
      <VasForm value={3} />
    </div>
  );
};

export default App;
