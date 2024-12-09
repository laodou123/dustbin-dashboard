import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import DustbinHome from "./components/DustbinHome";
import DustbinDetail from "./components/DustbinDetail";
import Register from "./components/Register";
import Login from "./components/Login";
import UserProfile from "./components/UserProfile";
import SensorData from "./components/SensorData";
import PrivateRoute from "./components/PrivateRoute";
import ProtectedRoute from "./components/ProtectedRoute"; // Adjust the path
import AppLayout from "./components/AppLayout";
import { User } from "firebase/auth";
import { auth } from "./firebase"; // Ensure this points to your Firebase configuration file
import { onAuthStateChanged } from "firebase/auth";
const Overview = () => <Dashboard />;
const Dustbin = () => <DustbinHome />;
const Marketing = () => <h1>Marketing Page</h1>;
const Settings = () => (
  <h1>
    <UserProfile />
  </h1>
);

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false); // Stop loading state
    });
    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Show a loading spinner while checking auth state
  }
  return (
    <Router>
      <div style={{ display: "flex" }}>
        <div style={{ flex: 1, padding: "20px" }}>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<SensorData />} />
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
