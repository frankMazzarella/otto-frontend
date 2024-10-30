import { createContext, useEffect, useState, useContext } from "react";

import { DoorState } from "../enums/DoorState";
import { ApiEndpointContext } from "./ApiEndpointcontext";

export const GarageStatusContext = createContext();

export const GarageStatusContextProvider = ({ children }) => {
  const [lastUpdateTime, setLastUpdateTime] = useState(new Date().getTime());
  const [doorStatusLeft, setDoorStatusLeft] = useState(DoorState.LOADING);
  const [doorStatusRight, setDoorStatusRight] = useState(DoorState.LOADING);
  const [environment, setEnvironment] = useState(null);
  const { statusEndpoint } = useContext(ApiEndpointContext);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date().getTime();
      const dataAgeMs = Math.round(now - lastUpdateTime);
      if (dataAgeMs > 40000) {
        setDoorStatusLeft(DoorState.LOADING);
        setDoorStatusRight(DoorState.LOADING);
        setEnvironment(null);
      }
    }, 1000);
    return () => clearInterval(intervalId);
  }, [lastUpdateTime]);

  useEffect(() => {
    async function queryGarageStatus() {
      try {
        const response = await fetch(statusEndpoint);
        const status = await response.json();
        updateGarageStatus(status);
      } catch (error) {
        handleFetchStatusError(error);
      }
    }
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") {
        queryGarageStatus();
      }
    });
    queryGarageStatus();
  }, [statusEndpoint]);

  useEffect(() => {
    async function startLongPoll() {
      try {
        const response = await fetch(`${statusEndpoint}?longPoll=true`);
        const status = await response.json();
        updateGarageStatus(status);
        startLongPoll();
      } catch (error) {
        handleFetchStatusError(error);
        setTimeout(startLongPoll, 5000);
      }
    }
    startLongPoll();
  }, [statusEndpoint]);

  const updateGarageStatus = (status) => {
    if (status.left === DoorState.OPEN) setDoorStatusLeft(DoorState.OPEN);
    if (status.left === DoorState.CLOSED) setDoorStatusLeft(DoorState.CLOSED);
    if (status.right === DoorState.OPEN) setDoorStatusRight(DoorState.OPEN);
    if (status.right === DoorState.CLOSED) setDoorStatusRight(DoorState.CLOSED);
    setEnvironment(status.environment);
    setLastUpdateTime(new Date().getTime());
  };

  const handleFetchStatusError = (error) => {
    console.error(`fetch status error: ${error}`);
    setDoorStatusLeft(DoorState.LOADING);
    setDoorStatusRight(DoorState.LOADING);
    setEnvironment(null);
  };

  return (
    <GarageStatusContext.Provider
      value={{
        doorStatusLeft,
        doorStatusRight,
        environment,
      }}
    >
      {children}
    </GarageStatusContext.Provider>
  );
};
