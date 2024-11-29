import React from "react"; // Add this line to explicitly make it a module

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard">
      <h1>Welcome to the Dustbin Dashboard</h1>
      <p>Here you can monitor and manage your dustbins effectively.</p>
    </div>
  );
};

export default Dashboard; // Ensure the component is exported
