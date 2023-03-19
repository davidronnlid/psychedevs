import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { BrowserRouter } from "react-router-dom";
import reportWebVitals from "./reportWebVitals";
import "./index.css";
import RDRRoutes from "./RDRRoutes";

const container = document.getElementById("root")!;
const root = createRoot(container);

const App = () => {
  return (
    <React.StrictMode>
      <Provider store={store}>
        <BrowserRouter>
          <RDRRoutes />
        </BrowserRouter>
      </Provider>
    </React.StrictMode>
  );
};

root.render(<App />);

reportWebVitals();
