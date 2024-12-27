import React, { useState } from "react";
import ChartComponent from "./ChartComponent";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

// Register necessary Chart.js components
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale
);

// Define a type for each dustbin
interface Dustbin {
  name: string;
  fullness: number; // Fullness is a percentage, so it's a number from 0 to 100
  lastUpdated: string; // Last time someone threw trash, as a string
}

// Sample data for each dustbin's fullness (in percentage)
const initialDustbinData: Dustbin[] = [
  { name: "Plastic", fullness: 70, lastUpdated: "2023-12-26 14:30" },
  { name: "Metal", fullness: 50, lastUpdated: "2023-12-26 15:00" },
  { name: "Paper", fullness: 80, lastUpdated: "2023-12-26 16:45" },
  { name: "General Waste", fullness: 30, lastUpdated: "2023-12-26 17:15" },
];

const Dashboard: React.FC = () => {
  // State to manage the fullness of each dustbin
  const [dustbinData, setDustbinData] = useState<Dustbin[]>(initialDustbinData);

  // Function to handle fullness change dynamically
  const handleFullnessChange = (index: number, newFullness: number) => {
    const updatedData = [...dustbinData];
    updatedData[index].fullness = newFullness;

    // Update the lastUpdated timestamp to the current time
    const now = new Date();
    updatedData[index].lastUpdated = now
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    setDustbinData(updatedData);
  };

  // Function to generate chart data based on the fullness of a dustbin
  const getChartData = (fullness: number) => ({
    labels: ["Full", "Empty"],
    datasets: [
      {
        data: [fullness, 100 - fullness],
        backgroundColor: [fullness > 75 ? "#FF5733" : "#36A2EB", "#E6E6E6"],
        hoverBackgroundColor: [
          fullness > 75 ? "#FF5733" : "#36A2EB",
          "#E6E6E6",
        ],
      },
    ],
  });

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Rendering Doughnut charts for each dustbin */}
        {dustbinData.map((dustbin, index) => (
          <div
            key={index}
            className="col-12 col-sm-6 col-md-4 col-lg-3 d-flex align-items-stretch mb-4"
          >
            <div className="card w-100 h-100 bg-light">
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{dustbin.name}</h5>
                <div className="stats mt-auto">
                  <Doughnut data={getChartData(dustbin.fullness)} />
                  <p className="mt-2 text-center">{dustbin.fullness}% Full</p>
                  <p className="mt-1 text-center text-muted">
                    Last updated: {dustbin.lastUpdated}
                  </p>
                  <div className="mb-2">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={dustbin.fullness}
                      onChange={(e) =>
                        handleFullnessChange(index, parseInt(e.target.value))
                      }
                      className="form-range"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Adding the ChartComponent (for Smart Recycling Bin or other charts) */}
        <div className="col-12 col-md-6 col-lg-4 d-flex align-items-stretch mb-4">
          <div className="card w-100 h-100 bg-light">
            <div className="card-body d-flex flex-column">
              <h5 className="card-title">Smart Recycling Bin</h5>
              <div className="stats mt-auto">
                <ChartComponent /> {/* Ensure this is a valid component */}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Statistics */}
      <div className="row mt-4">
        <div className="col-12 col-md-6">
          <div className="card bg-light">
            <div className="card-body">
              <h5 className="card-title">Dashboard Statistics</h5>
              <p>Total Dustbins: {dustbinData.length}</p>
              <p>
                Average Fullness:{" "}
                {(
                  dustbinData.reduce((acc, bin) => acc + bin.fullness, 0) /
                  dustbinData.length
                ).toFixed(2)}{" "}
                %
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
