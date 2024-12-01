import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import useFirebaseChartData from "../useFirebaseChartData";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ChartComponent: React.FC = () => {
  const { chartData, loading } = useFirebaseChartData("sensorData"); // Replace "chartData" with your Firebase path

  if (loading) return <p>Loading...</p>;

  const data = {
    labels: chartData.labels, // X-axis labels
    datasets: [
      {
        label: "Weight",
        data: chartData.values, // Y-axis values
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Chart from Firebase Data",
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default ChartComponent;
