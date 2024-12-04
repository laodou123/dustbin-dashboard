import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar"; // Your Sidebar component

const AppLayout: React.FC = () => {
  const location = useLocation();

  // Hide the sidebar for login and registration pages
  const hideSidebar =
    location.pathname === "/" || location.pathname === "/register";

  return (
    <div style={{ display: "flex" }}>
      {!hideSidebar && <Sidebar />} {/* Conditionally render the sidebar */}
      <div style={{ flex: 1, padding: "20px" }}>
        <Outlet /> {/* Render child routes */}
      </div>
    </div>
  );
};

export default AppLayout;
