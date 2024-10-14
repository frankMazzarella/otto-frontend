import { Environment } from "./Environment";
import { Status } from "./Status";
import { Buttons } from "./Buttons";
import "./App.css";

const version = `v${process.env.REACT_APP_VERSION}`;

// TODO: should not house entire application in App()
export const App = () => {
  return (
    <div className="app-container">
      <Status />
      <Environment />
      <Buttons />
      <div className="version">{version}</div>
    </div>
  );
};
