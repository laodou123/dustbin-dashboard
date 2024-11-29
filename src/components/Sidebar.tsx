import React from "react";
import { FaTrash, FaHome, FaInfoCircle } from "react-icons/fa";
import "../styles/Sidebar.css";

const Sidebar: React.FC = () => {
  return (
    <div className="sidebar">
      <h2>Dustbin Dashboard</h2>
      <ul>
        <li>
          <FaHome /> Home
        </li>
        <li>
          <FaTrash /> Dustbins
        </li>
        <li>
          <FaInfoCircle /> About
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
