import { BrowserRouter, Routes, Route } from "react-router";

import { ApiEndpointContextProvider } from "../context/ApiEndpointcontext";
import { Garage } from "./garage";
import { Hvac } from "./hvac";
import "./App.css";

const version = `v${process.env.REACT_APP_VERSION}`;

export const App = () => {
  return (
    <ApiEndpointContextProvider>
      <div className="app-container">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Garage />} />
            <Route path="/hvac" element={<Hvac />} />
          </Routes>
        </BrowserRouter>
        <div className="version">{version}</div>
      </div>
    </ApiEndpointContextProvider>
  );
};
