import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";
import { App } from "./components/App";
import { GarageStatusContextProvider } from "./context/GarageStatusContext";
import { ApiEndpointContextProvider } from "./context/ApiEndpointcontext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ApiEndpointContextProvider>
      <GarageStatusContextProvider>
        <App />
      </GarageStatusContextProvider>
    </ApiEndpointContextProvider>
  </React.StrictMode>
);
