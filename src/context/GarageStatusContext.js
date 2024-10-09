import { createContext, useEffect, useState, useContext } from "react";

import { Status } from "../enums/Status";
import { ApiEndpointContext } from "./ApiEndpointcontext";

export const GarageStatusContext = createContext();

export const GarageStatusContextProvider = ({ children }) => {
  const [lastUpdateTime, setLastUpdateTime] = useState(new Date().getTime());
  const [doorStatusLeft, setDoorStatusLeft] = useState(Status.LOADING);
  const [doorStatusRight, setDoorStatusRight] = useState(Status.LOADING);
  const [environment, setEnvironment] = useState(null);
  // TODO: context depending on another context feels like an anti pattern
  const { statusEndpoint } = useContext(ApiEndpointContext);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date().getTime();
      const dataAgeMs = Math.round(now - lastUpdateTime);
      if (dataAgeMs > 30000) {
        setDoorStatusLeft(Status.LOADING);
        setDoorStatusRight(Status.LOADING);
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
    if (status.left === Status.OPEN) setDoorStatusLeft(Status.OPEN);
    if (status.left === Status.CLOSED) setDoorStatusLeft(Status.CLOSED);
    if (status.right === Status.OPEN) setDoorStatusRight(Status.OPEN);
    if (status.right === Status.CLOSED) setDoorStatusRight(Status.CLOSED);
    setEnvironment(status.environment);
    setLastUpdateTime(new Date().getTime());
  };

  const handleFetchStatusError = (error) => {
    console.error(`fetch status error: ${error}`);
    setDoorStatusLeft(Status.LOADING);
    setDoorStatusRight(Status.LOADING);
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
