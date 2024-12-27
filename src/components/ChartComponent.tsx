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

// Register necessary Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ChartComponent: React.FC = () => {
  const { chartData, loading } = useFirebaseChartData("sensorData");

  if (loading) return <p>Loading...</p>;

  // Destructure chart data
  const { labels, values } = chartData;

  // Prepare chart data
  const chartDataConfig = {
    labels,
    datasets: [
      {
        label: "Weight",
        data: values,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.4, // Smooth line
        borderWidth: 2,
        pointRadius: 4, // Add points for better readability
      },
    ],
  };

  // Chart options
  const chartOptions: any = {
    responsive: true,
    maintainAspectRatio: false, // Allow dynamic resizing
    plugins: {
      legend: {
        position: "top", // Position of the legend
      },
      title: {
        display: true,
        text: "Chart from Firebase Data",
      },
    },
    scales: {
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 0,
          callback: function (
            value: number | string,
            index: number,
            ticks: any
          ) {
            const label = labels[index] as string;
            return label.length > 10 ? `${label.slice(0, 10)}...` : label; // Truncate long labels
          },
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value: number) {
            return value.toLocaleString(); // Format numbers with commas
          },
        },
      },
    },
  };

  return (
    <div style={{ height: "400px", width: "100%" }}>
      <Line data={chartDataConfig} options={chartOptions} />
    </div>
  );
};

export default ChartComponent;
