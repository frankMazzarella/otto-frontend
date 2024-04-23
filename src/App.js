import { useEffect, useState } from "react";

import "./App.css";

const UNICODE_UP = "↑";
const UNICODE_DOWN = "↓";
const UNICODE_LOADING = "⟳";
const DOMAIN_PROD = "https://desired-mollusk-naturally.ngrok-free.app";
const DOMAIN_LOCAL = "http://localhost:4000";
const LEFT_BUTTON = "left";
const RIGHT_BUTTON = "right";
const AUTH_TOKEN_KEY = "auth_token";
const STATUS_UP = "OPEN";
const STATUS_DOWN = "CLOSED";

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
  const [statusLeft, setStatusLeft] = useState(UNICODE_LOADING);
  const [statusRight, setStatusRight] = useState(UNICODE_LOADING);
  const [environment, setEnvironment] = useState(null);
  const [authToken, setAuthToken] = useState(storedToken);
  const [leftButtonDisabled, setLeftButtonDisabled] = useState(true);
  const [rightButtonDisabled, setRightButtonDisabled] = useState(true);
  const [authenticateButtonDisabled, setAuthenticateButtonDisabled] =
    useState(true);

  useEffect(() => {
    async function queryStatus() {
      try {
        await updateStatus(statusEndpoint);
        setLeftButtonDisabled(false);
        setRightButtonDisabled(false);
      } catch (error) {
        handleFetchStatusError(error);
      }
    }
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") {
        queryStatus();
      }
    });
    queryStatus();
  }, []);

  useEffect(() => {
    async function startLongPoll() {
      try {
        await updateStatus(`${statusEndpoint}?longPoll=true`);
        startLongPoll();
      } catch (error) {
        handleFetchStatusError(error);
        setTimeout(startLongPoll, 5000);
      }
    }
    startLongPoll();
  }, []);

  function handleFetchStatusError(error) {
    console.error(error);
    setLeftButtonDisabled(true);
    setRightButtonDisabled(true);
    setAuthenticateButtonDisabled(true);
    setStatusLeft(UNICODE_LOADING);
    setStatusRight(UNICODE_LOADING);
    setEnvironment(null);
  }

  async function updateStatus(url) {
    const response = await fetch(url);
    const status = await response.json();
    if (status.left === STATUS_UP) setStatusLeft(UNICODE_UP);
    if (status.left === STATUS_DOWN) setStatusLeft(UNICODE_DOWN);
    if (status.right === STATUS_UP) setStatusRight(UNICODE_UP);
    if (status.right === STATUS_DOWN) setStatusRight(UNICODE_DOWN);
    setEnvironment(status.environment);
  }

  async function handleToggleButton(side) {
    if (side === LEFT_BUTTON) setLeftButtonDisabled(true);
    if (side === RIGHT_BUTTON) setRightButtonDisabled(true);
    try {
      const options = getFetchOptions({ token: authToken, side });
      const response = await fetch(toggleEndpoint, options);
      if (response.status !== 200) {
        setAuthToken(null);
        localStorage.removeItem(AUTH_TOKEN_KEY);
      }
      if (side === LEFT_BUTTON) setLeftButtonDisabled(false);
      if (side === RIGHT_BUTTON) setRightButtonDisabled(false);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleAuthenticateButton() {
    const password = prompt("Password");
    if (password) {
      setAuthenticateButtonDisabled(true);
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
      setAuthenticateButtonDisabled(false);
    }
  }

  function getFetchOptions(postBody) {
    return {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postBody),
    };
  }

  return (
    <div className="container">
      <div className="status-container">
        <div className="status-item">
          {statusLeft}
          {authToken ? (
            <button
              disabled={leftButtonDisabled}
              onClick={() => handleToggleButton(LEFT_BUTTON)}
            >
              Toggle
            </button>
          ) : null}
        </div>
        <div className="status-item">
          {statusRight}
          {authToken ? (
            <button
              disabled={rightButtonDisabled}
              onClick={() => handleToggleButton(RIGHT_BUTTON)}
            >
              Toggle
            </button>
          ) : null}
        </div>
        {environment?.temperature && environment?.humidity ? (
          <div className="environment-container">
            <div>🌡 {environment.temperature}°F</div>
            <div>🌢 {environment.humidity}%</div>
          </div>
        ) : null}
        <div className="authorize">
          {authToken ? null : (
            <button
              disabled={authenticateButtonDisabled}
              onClick={handleAuthenticateButton}
            >
              Authenticate
            </button>
          )}
        </div>
      </div>
      <div className="version">{version}</div>
    </div>
  );
}

export default App;
