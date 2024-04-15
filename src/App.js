import { useEffect, useState } from 'react';

import './App.css';

function App() {
  const UNICODE_UP = '↑';
  const UNICODE_DOWN = '↓';
  const UNICODE_LOADING = '⟳';
  const UNICODE_ERROR = '⊗';
  const DOMAIN_PROD = 'https://desired-mollusk-naturally.ngrok-free.app';
  const DOMAIN_LOCAL = 'http://localhost:4000';

  const version = `v${process.env.REACT_APP_VERSION}`;
  const statusEndpoint = process.env.NODE_ENV === 'production' ?
    `${DOMAIN_PROD}/api/v1/status` : 
    `${DOMAIN_LOCAL}/api/v1/status`;
  const toggleEndpoint = process.env.NODE_ENV === 'production' ?
    `${DOMAIN_PROD}/api/v1/toggle` : 
    `${DOMAIN_LOCAL}/api/v1/toggle`;
  const authenticateEndpoint = process.env.NODE_END === 'production' ?
    `${DOMAIN_PROD}/api/v1/authenticate` :
    `${DOMAIN_LOCAL}/api/v1/authenticate`;

  const [statusLeft, setStatusLeft] = useState(UNICODE_LOADING);
  const [statusRight, setStatusRight] = useState(UNICODE_LOADING);
  const [toggleButtonsDisabled, setToggleButtonsDisabled] = useState(true);

  async function handleToggleButton(side) {
    setToggleButtonsDisabled(true);
    try {
      const options = getFetchOptions({ side });
      const response = await fetch(toggleEndpoint, options);
      const data = await response.json();
      console.log(data);
      setToggleButtonsDisabled(false);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleAuthenticateButton() {
    const password = prompt('Password');
    if (password) {
      try {
        const options = getFetchOptions({ password });
        const response = await fetch(authenticateEndpoint, options);
        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    }
  }

  function getFetchOptions(postBody) {
    return {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postBody),
    };
  }

  useEffect(() => {
    async function queryStatus() {
      try {
        const response = await fetch(statusEndpoint);
        const status = await response.json();
        if (status.left === 'up') setStatusLeft(UNICODE_UP);
        if (status.left === 'down') setStatusLeft(UNICODE_DOWN);
        if (status.left === 'error') setStatusLeft(UNICODE_ERROR);
        if (status.right === 'up') setStatusRight(UNICODE_UP);
        if (status.right === 'down') setStatusRight(UNICODE_DOWN);
        if (status.right === 'error') setStatusRight(UNICODE_ERROR);
        setToggleButtonsDisabled(false);
      } catch (error) {
        console.error(error);
        setStatusLeft(UNICODE_ERROR);
        setStatusRight(UNICODE_ERROR);
      }
    }
    queryStatus();
  }, [statusEndpoint]);

  return (
    <div className="container">
      <div className="status-container">
        <div className="status-item">
          { statusLeft }
          {/* <button
            disabled={toggleButtonsDisabled}
            onClick={() => handleToggleButton('left')}
          >
            Toggle
          </button> */}
        </div>
        <div className="status-item">
          { statusRight }
          {/* <button
            disabled={toggleButtonsDisabled}
            onClick={() => handleToggleButton('right')}
          >
            Toggle
          </button> */}
        </div>
        <div className="authorize">
          {/* <button onClick={handleAuthenticateButton}>Authenticate</button> */}
        </div>
      </div>
      <div className="version">{version}</div>
    </div>
  );
}

export default App;
