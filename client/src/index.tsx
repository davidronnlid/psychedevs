import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { BrowserRouter } from "react-router-dom";
import reportWebVitals from "./reportWebVitals";
import "./styles/index.css";
import AppContainer from "./AppContainer";

const container = document.getElementById("root")!;
const root = createRoot(container);

const App = () => {
  return (
    <React.StrictMode>
      <Provider store={store}>
        <BrowserRouter>
          <AppContainer />
        </BrowserRouter>
      </Provider>
    </React.StrictMode>
  );
};

root.render(<App />);

reportWebVitals();
