import { useState, useCallback, useEffect, useContext } from "react";

import { DoorState } from "../enums/DoorState";
import { ApiEndpointContext } from "../context/ApiEndpointcontext";
import { GarageStatusContext } from "../context/GarageStatusContext";
import "./Buttons.css";

const AUTH_TOKEN_KEY = "AUTH_TOKEN";

const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);

export const Buttons = () => {
  const [authToken, setAuthToken] = useState(storedToken);
  const [toggleButtonDisabled, setToggleButtonDisabled] = useState(true);
  const [toggleTimeoutActive, setToggleTimeoutActive] = useState(false);
  const [authButtonDisabled, setAuthButtonDisabled] = useState(false);
  const { toggleEndpoint, authenticateEndpoint } =
    useContext(ApiEndpointContext);
  const { doorStatusLeft, doorStatusRight } = useContext(GarageStatusContext);

  const tryToEnableToggleButton = useCallback(() => {
    if (
      (doorStatusLeft === DoorState.OPEN ||
        doorStatusRight === DoorState.OPEN) &&
      !toggleTimeoutActive
    ) {
      setToggleButtonDisabled(false);
    }
  }, [doorStatusLeft, doorStatusRight, toggleTimeoutActive]);

  useEffect(() => {
    if (
      doorStatusLeft === DoorState.CLOSED &&
      doorStatusRight === DoorState.CLOSED
    ) {
      setToggleButtonDisabled(true);
    } else {
      tryToEnableToggleButton();
    }
    if (
      doorStatusLeft === DoorState.LOADING &&
      doorStatusRight === DoorState.LOADING
    ) {
      setToggleButtonDisabled(true);
      setAuthButtonDisabled(true);
    } else {
      setAuthButtonDisabled(false);
    }
  }, [doorStatusLeft, doorStatusRight, tryToEnableToggleButton]);

  const getFetchOptions = (postBody) => {
    return {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postBody),
    };
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
        }, 20000);
      } else {
        setAuthToken(null);
        localStorage.removeItem(AUTH_TOKEN_KEY);
        tryToEnableToggleButton();
      }
    } catch (error) {
      console.error(`toggle button error: ${error}`);
      tryToEnableToggleButton();
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
        console.error(`authenticate button error: ${error}`);
      }
      setAuthButtonDisabled(false);
    }
  };

  return (
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
  );
};
