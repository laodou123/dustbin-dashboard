import React from "react";
import "../styles/Sidebar.css"; // Make sure the import path is correct

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2 className="sidebar-logo">Bin-e</h2>
      <ul className="sidebar-menu">
        <li className="menu-item active">Overview</li>
        <li className="menu-item">Logistics</li>
        <li className="menu-item">Marketing</li>
        <li className="menu-item">Settings</li>
      </ul>
    </div>
  );
};

export default Sidebar;
