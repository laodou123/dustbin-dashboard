import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import DustbinHome from "./components/DustbinHome";
import DustbinDetail from "./components/DustbinDetail";

const Overview = () => <Dashboard />;
const Dustbin = () => <DustbinHome />;
const Marketing = () => <h1>Marketing Page</h1>;
const Settings = () => <h1>Settings Page</h1>;

const App: React.FC = () => {
  return (
    <Router>
      <div style={{ display: "flex" }}>
        <Sidebar />
        <div style={{ flex: 1, padding: "20px" }}>
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/DustbinHome" element={<Dustbin />} />
            <Route path="/marketing" element={<Marketing />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/details/:binType" element={<DustbinDetail />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
