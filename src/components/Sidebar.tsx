import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/Sidebar.css"; // Make sure the import path is correct

const Sidebar: React.FC = () => {
  const location = useLocation();

  const menuItems = [
    { name: "Overview", path: "/" },
    { name: "DustbinHome", path: "/DustbinHome" },
    { name: "Marketing", path: "/marketing" },
    { name: "Settings", path: "/settings" },
  ];

  return (
    <div className="sidebar">
      <h2 className="sidebar-logo">SRB</h2>
      <ul className="sidebar-menu">
        {menuItems.map((item) => (
          <li
            key={item.name}
            className={`menu-item ${
              location.pathname === item.path ? "active" : ""
            }`}
          >
            <Link to={item.path}>{item.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
