import { Environment } from "./Environment";
import { Status } from "./Status";
import { Buttons } from "./Buttons";
import "./index.css";

export const Garage = () => {
  return (
    <div className="garage-container">
      <Status />
      <Environment />
      <Buttons />
    </div>
  );
};
