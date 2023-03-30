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
        answer_format="1-5 scale"
        name="How do you feel right now?"
        logType_id="26c52f7614af611a6435e98eec2a150fff3ab020c918d8b791b836c8749e9856"
      />
    </div>
  );
};

export default App;
