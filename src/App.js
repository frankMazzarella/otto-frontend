import { useEffect, useState } from "react";

import "./App.css";

const UNICODE_UP = "↑";
const UNICODE_DOWN = "↓";
const UNICODE_LOADING = "⟳";
const UNICODE_ERROR = "⊗";
const DOMAIN_PROD = "https://desired-mollusk-naturally.ngrok-free.app";
const DOMAIN_LOCAL = "http://localhost:4000";
const AUTH_TOKEN_KEY = "auth_token";

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
  const [toggleButtonsDisabled, setToggleButtonsDisabled] = useState(true);
  const [authToken, setAuthToken] = useState(storedToken);

  async function handleToggleButton(side) {
    setToggleButtonsDisabled(true);
    try {
      const options = getFetchOptions({ token: authToken, side });
      const response = await fetch(toggleEndpoint, options);
      if (response.status !== 200) {
        setAuthToken(null);
        localStorage.setItem(AUTH_TOKEN_KEY, null);
      }
      setToggleButtonsDisabled(false);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleAuthenticateButton() {
    const password = prompt("Password");
    if (password) {
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

  useEffect(() => {
    async function queryStatus() {
      try {
        const response = await fetch(statusEndpoint);
        const status = await response.json();
        if (status.left === "up") setStatusLeft(UNICODE_UP);
        if (status.left === "down") setStatusLeft(UNICODE_DOWN);
        if (status.left === "error") setStatusLeft(UNICODE_ERROR);
        if (status.right === "up") setStatusRight(UNICODE_UP);
        if (status.right === "down") setStatusRight(UNICODE_DOWN);
        if (status.right === "error") setStatusRight(UNICODE_ERROR);
        setToggleButtonsDisabled(false);
      } catch (error) {
        console.error(error);
        setStatusLeft(UNICODE_ERROR);
        setStatusRight(UNICODE_ERROR);
      }
    }
    queryStatus();
  }, []);

  return (
    <div className="container">
      <div className="status-container">
        <div className="status-item">
          {statusLeft}
          {authToken ? (
            <button
              disabled={toggleButtonsDisabled}
              onClick={() => handleToggleButton("left")}
            >
              Toggle
            </button>
          ) : null}
        </div>
        <div className="status-item">
          {statusRight}
          {authToken ? (
            <button
              disabled={toggleButtonsDisabled}
              onClick={() => handleToggleButton("right")}
            >
              Toggle
            </button>
          ) : null}
        </div>
        <div className="authorize">
          {authToken ? null : (
            <button onClick={handleAuthenticateButton}>Authenticate</button>
          )}
        </div>
      </div>
      <div className="version">{version}</div>
    </div>
  );
}

export default App;
