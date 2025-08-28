import { NavLink } from "react-router";
import "./Navigation.css";

export const Navigation = () => {
  return (
    <div className="navigation-container">
      <NavLink className="link" to="/garage">
        Garage
      </NavLink>
      <NavLink className="link" to="/hvac">
        HVAC
      </NavLink>
    </div>
  );
};
