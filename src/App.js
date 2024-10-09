import { useState, useCallback, useContext, useEffect } from "react";
import { IoWater, IoThermometer } from "react-icons/io5";
import {
  PiArrowFatLineDownFill,
  PiArrowFatLineUpFill,
  PiArrowsClockwiseBold,
} from "react-icons/pi";

import { Status } from "./enums/Status";
import { GarageStatusContext } from "./context/GarageStatusContext";
import { ApiEndpointContext } from "./context/ApiEndpointcontext";
import "./App.css";

const AUTH_TOKEN_KEY = "AUTH_TOKEN";

const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);
const version = `v${process.env.REACT_APP_VERSION}`;

function App() {
  const [authToken, setAuthToken] = useState(storedToken);
  const [toggleButtonDisabled, setToggleButtonDisabled] = useState(true);
  const [toggleTimeoutActive, setToggleTimeoutActive] = useState(false);
  const [authButtonDisabled, setAuthButtonDisabled] = useState(false);
  const { toggleEndpoint, authenticateEndpoint } =
    useContext(ApiEndpointContext);
  const { doorStatusLeft, doorStatusRight, environment } =
    useContext(GarageStatusContext);

  const tryToEnableToggleButton = useCallback(() => {
    if (
      (doorStatusLeft === Status.OPEN || doorStatusRight === Status.OPEN) &&
      !toggleTimeoutActive
    ) {
      setToggleButtonDisabled(false);
    }
  }, [doorStatusLeft, doorStatusRight, toggleTimeoutActive]);

  useEffect(() => {
    if (doorStatusLeft === Status.CLOSED && doorStatusRight === Status.CLOSED) {
      setToggleButtonDisabled(true);
    } else {
      tryToEnableToggleButton();
    }
    if (
      doorStatusLeft === Status.LOADING &&
      doorStatusRight === Status.LOADING
    ) {
      setToggleButtonDisabled(true);
      setAuthButtonDisabled(true);
    }
  }, [doorStatusLeft, doorStatusRight, tryToEnableToggleButton]);

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
      case Status.LOADING:
        return <PiArrowsClockwiseBold className="status-icon" />;
      case Status.OPEN:
        return <PiArrowFatLineUpFill className="status-icon" />;
      case Status.CLOSED:
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
