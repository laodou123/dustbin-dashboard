import React from "react";
import ChartComponent from "./ChartComponent";

const Dashboard = () => {
  return (
    <div className="container py-4">
      <div className="row g-4">
        {/* Smart Recycling Bin Card */}
        <div className="col-12 col-sm-6 col-md-4">
          <div className="card h-100 bg-light">
            <div className="card-body d-flex flex-column">
              <h5 className="card-title">Smart Recycling Bin</h5>
              <div className="stats mt-auto">
                <p>
                  Other: <strong>3851 pcs</strong>
                </p>
                <p>
                  Lightbulb: <strong>3791 pcs</strong>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* SmartB Card */}
        <div className="col-12 col-sm-6 col-md-4">
          <div className="card h-100 bg-light">
            <div className="card-body d-flex flex-column">
              <h5 className="card-title">SmartB</h5>
              <div className="stats mt-auto">
                <p>
                  Beneficials: <strong>0.02 kg</strong>
                </p>
                <p>
                  Non-beneficials: <strong>0.01 kg</strong>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Logistics Card */}
        <div className="col-12 col-sm-6 col-md-4">
          <div className="card h-100 bg-light">
            <div className="card-body d-flex flex-column">
              <h5 className="card-title">Logistics</h5>
              <div className="stats mt-auto">
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
          </div>
        </div>

        {/* Another Smart Recycling Bin Card */}
        <div className="col-12 col-sm-6 col-md-4">
          <div className="card h-100 bg-light">
            <div className="card-body d-flex flex-column">
              <h5 className="card-title">Smart Recycling Bin</h5>
              <div className="stats mt-auto">
                <p>
                  Other: <strong>3851 pcs</strong>
                </p>
                <p>
                  Lightbulb: <strong>3791 pcs</strong>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Chart Component Card */}
        <div className="col-12 col-sm-6 col-md-4">
          <div className="card h-100 bg-light">
            <div className="card-body d-flex flex-column">
              <h5 className="card-title">Smart Recycling Bin</h5>
              <div className="stats mt-auto">
                <ChartComponent />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
