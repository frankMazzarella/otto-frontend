import { GarageStatusContextProvider } from "../../context/GarageStatusContext";
import { Environment } from "./Environment";
import { Status } from "./Status";
import { Buttons } from "./Buttons";

export const Garage = () => {
  return (
    <GarageStatusContextProvider>
      <Status />
      <Environment />
      <Buttons />
    </GarageStatusContextProvider>
  );
};
