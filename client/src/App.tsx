import Logger from "./features/logger/logger";
import VasForm from "./features/logger/vas_form/vasForm";
import { useJwt } from "./redux/authSlice";

const App: React.FC = (): JSX.Element => {
  const updatedJwt = useJwt();
  console.log("Updated JWT: ", updatedJwt);

  return updatedJwt ? (
    <Logger />
  ) : (
    <div className="App">
      <VasForm
        value={3}
        answer_format="1-5_scale"
        name="How do you feel right now?"
      />
    </div>
  );
};

export default App;
