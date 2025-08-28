import { useContext } from "react";
import {
  PiArrowFatLineDownFill,
  PiArrowFatLineUpFill,
  PiArrowsClockwiseBold,
} from "react-icons/pi";

import { GarageStatusContext } from "../../context/GarageStatusContext";
import { DoorState } from "../../enums/DoorState";
import "./Status.css";

export const Status = () => {
  const { doorStatusLeft, doorStatusRight } = useContext(GarageStatusContext);

  const renderStatusIcon = (status) => {
    switch (status) {
      case DoorState.LOADING:
        return <PiArrowsClockwiseBold className="status-icon" />;
      case DoorState.OPEN:
        return <PiArrowFatLineUpFill className="status-icon" />;
      case DoorState.CLOSED:
        return <PiArrowFatLineDownFill className="status-icon" />;
      default:
        return <PiArrowsClockwiseBold className="status-icon" />;
    }
  };

  return (
    <div className="status-container">
      <div className="status-item">{renderStatusIcon(doorStatusLeft)}</div>
      <div className="status-item">{renderStatusIcon(doorStatusRight)}</div>
    </div>
  );
};
