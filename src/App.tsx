import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import DustbinHome from "./components/DustbinHome";
import DustbinDetail from "./components/DustbinDetail";
import Register from "./components/Register";
import Login from "./components/Login";
import UserProfile from "./components/UserProfile";
import PrivateRoute from "./components/PrivateRoute";
import ProtectedRoute from "./components/ProtectedRoute"; // Adjust the path
import AppLayout from "./components/AppLayout";
const Overview = () => <Dashboard />;
const Dustbin = () => <DustbinHome />;
const Marketing = () => <h1>Marketing Page</h1>;
const Settings = () => (
  <h1>
    <UserProfile />
  </h1>
);

const App: React.FC = () => {
  return (
    <Router>
      <div style={{ display: "flex" }}>
        <div style={{ flex: 1, padding: "20px" }}>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Overview />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/DustbinHome"
                element={
                  <ProtectedRoute>
                    <Dustbin />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/marketing"
                element={
                  <ProtectedRoute>
                    <Marketing />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/details/:binType"
                element={
                  <ProtectedRoute>
                    <DustbinDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <UserProfile />
                  </PrivateRoute>
                }
              />
            </Route>
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
