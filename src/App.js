import { useEffect, useState } from 'react';

import './App.css';

function App() {
  const UNICODE_UP = '↑';
  const UNICODE_DOWN = '↓';
  const UNICODE_LOADING = '⟳';
  const UNICODE_ERROR = '⊗';

  const version = `v${process.env.REACT_APP_VERSION}`;
  const statusEndpoint = process.env.NODE_ENV === 'production' ?
    'https://desired-mollusk-naturally.ngrok-free.app/api/v1/status' : 
    'http://localhost:4000/api/v1/status'

  const [statusLeft, setStatusLeft] = useState(UNICODE_LOADING);
  const [statusRight, setStatusRight] = useState(UNICODE_LOADING);

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
          <button>toggle</button>
        </div>
        <div className="status-item">
          { statusRight }
          <button>toggle</button>
        </div>
      </div>
      <div className="version">{version}</div>
    </div>
  );
}

export default App;
