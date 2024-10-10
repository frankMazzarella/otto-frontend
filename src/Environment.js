import { useContext } from "react";
import { IoWater, IoThermometer } from "react-icons/io5";

import { GarageStatusContext } from "./context/GarageStatusContext";
import "./Environment.css";

export const Environment = () => {
  const { environment } = useContext(GarageStatusContext);

  return (
    <>
      {environment &&
      !Number.isNaN(environment?.temperature) &&
      !Number.isNaN(environment?.humidity) ? (
        <div className="environment-container">
          <div>
            <IoThermometer className="environment-icon" />
            {environment.temperature}°F
          </div>
          <div>
            <IoWater className="environment-icon" />
            {environment.humidity}%
          </div>
        </div>
      ) : null}
    </>
  );
};
