import { BrowserRouter, Routes, Route, Navigate } from "react-router";

import { ApiEndpointContextProvider } from "../context/ApiEndpointcontext";
import { GarageStatusContextProvider } from "../context/GarageStatusContext";
import { Navigation } from "./Navigation";
import { Garage } from "./garage";
import { Hvac } from "./hvac";
import "./App.css";

const version = `v${process.env.REACT_APP_VERSION}`;

export const App = () => {
  return (
    <ApiEndpointContextProvider>
      <GarageStatusContextProvider>
        <BrowserRouter>
          <div className="app-container">
            <Navigation />
            <Routes>
              <Route path="/" element={<Navigate to="/garage" replace />} />
              <Route path="/garage" element={<Garage />} />
              <Route path="/hvac" element={<Hvac />} />
            </Routes>
            <div className="version">{version}</div>
          </div>
        </BrowserRouter>
      </GarageStatusContextProvider>
    </ApiEndpointContextProvider>
  );
};
