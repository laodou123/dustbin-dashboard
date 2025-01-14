import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import DustbinHome from "./components/DustbinHome";
import DustbinDetail from "./components/DustbinDetail";
import Register from "./components/Register";
import Login from "./components/Login";
import "bootstrap/dist/css/bootstrap.min.css";
import UserProfile from "./components/UserProfile";
import SensorData from "./components/SensorData";
import PrivateRoute from "./components/PrivateRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./components/AppLayout";
import { User } from "firebase/auth";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import NotificationComponent from "./components/NotificationComponent"; // Import NotificationComponent

const Overview = () => <Dashboard />;
const Dustbin = () => <DustbinHome />;
const Marketing = () => <h1>Marketing Page</h1>;
const Settings = () => (
  <h1>
    <SensorData />
  </h1>
);

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <NotificationComponent /> {/* Include Notification Component */}
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
                path="/SensorData"
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
