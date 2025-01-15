// src/components/Sidebar.tsx

import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaHome,
  FaCog,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { Tooltip, IconButton, useTheme, useMediaQuery } from "@mui/material"; // Ensure @mui/material is installed

const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Theme and responsive breakpoints
  const theme = useTheme();
  const isSmDown = useMediaQuery(theme.breakpoints.down("sm"));

  // Menu items with icons
  const menuItems = [
    { name: "Overview", path: "/dashboard", icon: <FaTachometerAlt /> },
    { name: "Dustbin Home", path: "/DustbinHome", icon: <FaHome /> },
    { name: "Settings", path: "/Setting", icon: <FaCog /> },
  ];

  // Toggle sidebar collapse state
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div
        className={`d-flex flex-column position-fixed top-0 start-0 bg-primary text-white ${
          isCollapsed ? "sidebar-collapsed" : "sidebar-expanded"
        }`}
        style={{
          width: isCollapsed ? "60px" : "200px", // Reduced expanded width
          height: "100vh",
          transition: "width 0.3s ease",
          overflowY: "auto",
          zIndex: 1000,
        }}
      >
        {/* Sidebar Header */}
        <div
          className="d-flex align-items-center justify-content-between p-3 border-bottom"
          style={{
            minHeight: "60px",
          }}
        >
          {!isCollapsed && (
            <h4 className="mb-0" style={{ fontWeight: "bold" }}>
              SRB
            </h4>
          )}
          <Tooltip title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}>
            <IconButton
              onClick={toggleSidebar}
              className="text-white"
              aria-label="toggle sidebar"
            >
              {isCollapsed ? <FaBars /> : <FaTimes />}
            </IconButton>
          </Tooltip>
        </div>

        {/* Navigation Menu */}
        <nav className="nav flex-column mt-3">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `nav-link text-white d-flex align-items-center p-2 ${
                  isActive ? "bg-secondary" : ""
                } sidebar-link`
              }
              style={{
                justifyContent: isCollapsed ? "center" : "flex-start",
                transition: "justify-content 0.3s ease",
                fontSize: "1rem",
              }}
            >
              <Tooltip
                title={isCollapsed ? item.name : ""}
                placement="right"
                arrow
                disableHoverListener={!isCollapsed}
              >
                <span className="me-2" style={{ fontSize: "1.2rem" }}>
                  {item.icon}
                </span>
              </Tooltip>
              {!isCollapsed && <span>{item.name}</span>}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Overlay for Mobile View when Sidebar is Expanded */}
      {isCollapsed === false && isSmDown && (
        <div
          className="position-fixed top-0 start-0 bg-dark"
          style={{
            width: "100vw",
            height: "100vh",
            opacity: 0.3,
            zIndex: 999,
          }}
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Main Content Area */}
      <div
        className="flex-grow-1 p-4"
        style={{
          marginLeft: isCollapsed ? "60px" : "200px",
          transition: "margin-left 0.3s ease",
          width: "100%",
        }}
      >
        {/* Your main content goes here */}
      </div>
    </div>
  );
};

export default Sidebar;
