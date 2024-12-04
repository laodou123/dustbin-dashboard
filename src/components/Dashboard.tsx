import React from "react";
import "../styles/Dashboard.css"; // Make sure the import path is correct
import ChartComponent from "./ChartComponent";

const Dashboard = () => {
  return (
    <div className="dashboard">
      <div className="card">
        <h3>Smart Recycling Bin</h3>
        <div className="stats">
          <p>
            Other: <strong>3851 pcs</strong>
          </p>
          <p>
            Lightbulb: <strong>3791 pcs</strong>
          </p>
        </div>
      </div>

      <div className="card">
        <h3>SmartB</h3>
        <div className="stats">
          <p>
            Beneficials: <strong>0.02 kg</strong>
          </p>
          <p>
            Non-beneficials: <strong>0.01 kg</strong>
          </p>
        </div>
      </div>

      <div className="card">
        <h3>Marketing</h3>
        <div className="marketing-image">Image Placeholder</div>
      </div>

      <div className="card">
        <h3>Logistics</h3>
        <div className="stats">
          <p>
            Collecting: <strong>39</strong>
          </p>
          <p>
            Almost full: <strong>1</strong>
          </p>
          <p>
            Full: <strong>1</strong>
          </p>
        </div>
      </div>
      <div className="card">
        <h3>Smart Recycling Bin</h3>
        <div className="stats">
          <p>
            Other: <strong>3851 pcs</strong>
          </p>
          <p>
            Lightbulb: <strong>3791 pcs</strong>
          </p>
        </div>
      </div>

      <div className="card">
        <h3>Smart Recycling Bin</h3>
        <div className="stats">
          <ChartComponent />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
