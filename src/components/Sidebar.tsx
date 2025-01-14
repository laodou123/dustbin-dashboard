import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaTachometerAlt, FaHome, FaCog, FaBars } from "react-icons/fa";

const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Menu items with icons
  const menuItems = [
    { name: "Overview", path: "/dashboard", icon: <FaTachometerAlt /> },
    { name: "DustbinHome", path: "/DustbinHome", icon: <FaHome /> },
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
        className={`d-flex flex-column position-fixed top-0 start-0 bg-dark text-white ${
          isCollapsed ? "collapsed" : ""
        }`}
        style={{
          width: isCollapsed ? "80px" : "240px",
          height: "100vh", // Full height of the viewport
          transition: "width 0.3s ease",
          overflowY: "auto", // Prevent overflow issues
          zIndex: 1000,
        }}
      >
        <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
          {!isCollapsed && <h4 className="mb-0">SRB</h4>}
          <FaBars
            className="text-white cursor-pointer"
            onClick={toggleSidebar}
            style={{ fontSize: "1.5rem" }}
          />
        </div>
        <nav className="nav flex-column mt-3">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `nav-link text-white d-flex align-items-center p-2 ${
                  isActive ? "bg-secondary" : ""
                }`
              }
              style={{
                justifyContent: isCollapsed ? "center" : "flex-start",
                transition: "justify-content 0.3s ease",
              }}
            >
              <span className="me-2" style={{ fontSize: "1.2rem" }}>
                {item.icon}
              </span>
              {!isCollapsed && item.name}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Main Content Area */}
      <div
        className="flex-grow-1 p-4"
        style={{
          marginLeft: isCollapsed ? "80px" : "240px",
          transition: "margin-left 0.3s ease",
          width: "100%",
        }}
      ></div>
    </div>
  );
};

export default Sidebar;
