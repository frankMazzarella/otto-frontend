import { useEffect, useState } from "react";
import { IoWater, IoThermometer } from "react-icons/io5";
import {
  PiArrowFatLineDownFill,
  PiArrowFatLineUpFill,
  PiArrowsClockwiseBold,
} from "react-icons/pi";

import "./App.css";

// TODO: change before master branch
// const DOMAIN_PROD = "https://desired-mollusk-naturally.ngrok-free.app";
const DOMAIN_PROD = "174.178.77.104:4000";
const DOMAIN_LOCAL = "http://localhost:4000";
const AUTH_TOKEN_KEY = "AUTH_TOKEN";
const STATUS_OPEN = "OPEN";
const STATUS_CLOSED = "CLOSED";
const STATUS_LOADING = "LOADING";

const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);
const version = `v${process.env.REACT_APP_VERSION}`;
let statusEndpoint;
let toggleEndpoint;
let authenticateEndpoint;

if (process.env.NODE_ENV === "production") {
  statusEndpoint = `${DOMAIN_PROD}/api/v1/status`;
  toggleEndpoint = `${DOMAIN_PROD}/api/v1/toggle`;
  authenticateEndpoint = `${DOMAIN_PROD}/api/v1/authenticate`;
} else {
  statusEndpoint = `${DOMAIN_LOCAL}/api/v1/status`;
  toggleEndpoint = `${DOMAIN_LOCAL}/api/v1/toggle`;
  authenticateEndpoint = `${DOMAIN_LOCAL}/api/v1/authenticate`;
}

function App() {
  const [lastUpdateTime, setLastUpdateTime] = useState(new Date().getTime());
  const [doorStatusLeft, setDoorStatusLeft] = useState(STATUS_LOADING);
  const [doorStatusRight, setDoorStatusRight] = useState(STATUS_LOADING);
  const [environment, setEnvironment] = useState(null);
  const [authToken, setAuthToken] = useState(storedToken);
  const [toggleButtonDisabled, setToggleButtonDisabled] = useState(true);
  const [toggleTimeoutActive, setToggleTimeoutActive] = useState(false);
  const [authButtonDisabled, setAuthButtonDisabled] = useState(false);

  useEffect(() => {
    console.log("USE EFFECT - TIMER");
    const intervalId = setInterval(() => {
      const now = new Date().getTime();
      const dataAgeMs = Math.round(now - lastUpdateTime);
      if (dataAgeMs > 30000) {
        setDoorStatusLeft(STATUS_LOADING);
        setDoorStatusRight(STATUS_LOADING);
        setEnvironment(null);
      }
    }, 5000);
    return () => clearInterval(intervalId);
  }, [lastUpdateTime]);

  useEffect(() => {
    console.log("USE EFFECT - STATUS");
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
  }, []);

  useEffect(() => {
    console.log("USE EFFECT - STATUS LONG POLL");
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
  }, []);

  const handleFetchStatusError = (error) => {
    console.error(error);
    setToggleButtonDisabled(true);
    setAuthButtonDisabled(true);
    setDoorStatusLeft(STATUS_LOADING);
    setDoorStatusRight(STATUS_LOADING);
    setEnvironment(null);
  };

  // TODO: required as a dependency for the useeffects
  const updateGarageStatus = (status) => {
    if (status.left === STATUS_OPEN) setDoorStatusLeft(STATUS_OPEN);
    if (status.left === STATUS_CLOSED) setDoorStatusLeft(STATUS_CLOSED);
    if (status.right === STATUS_OPEN) setDoorStatusRight(STATUS_OPEN);
    if (status.right === STATUS_CLOSED) setDoorStatusRight(STATUS_CLOSED);
    if (status.left === STATUS_CLOSED && status.right === STATUS_CLOSED) {
      setToggleButtonDisabled(true);
    } else {
      tryToEnableToggleButton();
    }
    setEnvironment(status.environment);
    setLastUpdateTime(new Date().getTime());
  };

  const handleToggleButton = async () => {
    setToggleButtonDisabled(true);
    try {
      const options = getFetchOptions({ token: authToken });
      const response = await fetch(toggleEndpoint, options);
      if (response.status === 200) {
        setToggleTimeoutActive(true);
        setTimeout(() => {
          setToggleTimeoutActive(false);
          tryToEnableToggleButton();
        }, 15000);
      } else {
        setAuthToken(null);
        localStorage.removeItem(AUTH_TOKEN_KEY);
        tryToEnableToggleButton();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const tryToEnableToggleButton = () => {
    if (
      (doorStatusLeft === STATUS_OPEN || doorStatusRight === STATUS_OPEN) &&
      !toggleTimeoutActive
    ) {
      setToggleButtonDisabled(false);
    }
  };

  const handleAuthenticateButton = async () => {
    const password = prompt("Password");
    if (password) {
      setAuthButtonDisabled(true);
      try {
        const options = getFetchOptions({ password });
        const response = await fetch(authenticateEndpoint, options);
        const data = await response.json();
        if (data.token) {
          setAuthToken(data.token);
          localStorage.setItem(AUTH_TOKEN_KEY, data.token);
        }
      } catch (error) {
        console.error(error);
      }
      setAuthButtonDisabled(false);
    }
  };

  const getFetchOptions = (postBody) => {
    return {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postBody),
    };
  };

  const renderStatusIcon = (status) => {
    switch (status) {
      case STATUS_LOADING:
        return <PiArrowsClockwiseBold className="status-icon" />;
      case STATUS_OPEN:
        return <PiArrowFatLineUpFill className="status-icon" />;
      case STATUS_CLOSED:
        return <PiArrowFatLineDownFill className="status-icon" />;
      default:
        return <PiArrowsClockwiseBold className="status-icon" />;
    }
  };

  return (
    <div className="container">
      <div className="status-container">
        <div className="status-item">{renderStatusIcon(doorStatusLeft)}</div>
        <div className="status-item">{renderStatusIcon(doorStatusRight)}</div>
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
        <div className="button-container">
          {authToken ? null : (
            <button
              disabled={authButtonDisabled}
              onClick={handleAuthenticateButton}
            >
              Authenticate
            </button>
          )}
          {authToken ? (
            <button
              disabled={toggleButtonDisabled}
              onClick={() => handleToggleButton()}
            >
              Toggle
            </button>
          ) : null}
        </div>
      </div>
      <div className="version">{version}</div>
    </div>
  );
}

export default App;
