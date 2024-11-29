import React from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import "./App.css";

const App: React.FC = () => {
  return (
    <div className="app">
      <Sidebar />
      <Dashboard />
    </div>
  );
};

export default App; // Ensure default export
