import { GarageStatusContextProvider } from "../context/GarageStatusContext";
import { ApiEndpointContextProvider } from "../context/ApiEndpointcontext";
import { Environment } from "./Environment";
import { Status } from "./Status";
import { Buttons } from "./Buttons";
import "./App.css";

const version = `v${process.env.REACT_APP_VERSION}`;

export const App = () => {
  return (
    <ApiEndpointContextProvider>
      <GarageStatusContextProvider>
        <div className="app-container">
          <Status />
          <Environment />
          <Buttons />
          <div className="version">{version}</div>
        </div>
      </GarageStatusContextProvider>
    </ApiEndpointContextProvider>
  );
};
