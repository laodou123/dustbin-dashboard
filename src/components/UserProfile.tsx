import React, { useEffect } from "react";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const UserProfile: React.FC = () => {
  const user = auth.currentUser;
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login if no user is logged in
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleLogout = async () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      await signOut(auth);
      alert("Logged out successfully");
      navigate("/"); // Redirect to login page
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>User Profile</h1>
      {user ? (
        <div style={{ marginTop: "20px" }}>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>UID:</strong> {user.uid}
          </p>
          <button
            onClick={handleLogout}
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              backgroundColor: "#ff4d4f",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>
      ) : (
        <p style={{ marginTop: "20px", color: "red" }}>
          No user is logged in. Redirecting to the login page...
        </p>
      )}
    </div>
  );
};

export default UserProfile;
