import { BrowserRouter, Routes, Route } from "react-router";

import { GarageStatusContextProvider } from "../context/GarageStatusContext";
import { ApiEndpointContextProvider } from "../context/ApiEndpointcontext";
import { Garage } from "./garage/Garage";
import { Hvac } from "./hvac/Hvac";
import "./App.css";

const version = `v${process.env.REACT_APP_VERSION}`;

export const App = () => {
  return (
    <ApiEndpointContextProvider>
      <GarageStatusContextProvider>
        <div className="app-container">
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Garage />} />
              <Route path="/hvac" element={<Hvac />} />
            </Routes>
          </BrowserRouter>
          <div className="version">{version}</div>
        </div>
      </GarageStatusContextProvider>
    </ApiEndpointContextProvider>
  );
};
