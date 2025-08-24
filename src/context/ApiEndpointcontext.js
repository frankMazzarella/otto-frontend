import { createContext } from "react";

export const ApiEndpointContext = createContext();

export const ApiEndpointContextProvider = ({ children }) => {
  const DOMAIN_PROD = "https://otto.frankmazz.com";
  const DOMAIN_LOCAL = "http://localhost:4000";

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

  return (
    <ApiEndpointContext.Provider
      value={{ statusEndpoint, toggleEndpoint, authenticateEndpoint }}
    >
      {children}
    </ApiEndpointContext.Provider>
  );
};
