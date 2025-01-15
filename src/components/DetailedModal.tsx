// DetailedModal.tsx
import React from "react";
import { Modal, Button } from "react-bootstrap";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
} from "chart.js";

// Register necessary Chart.js components
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler
);

// Define a type for each dustbin
interface Dustbin {
  id: number;
  name: string;
  fullness: number;
  lastUpdated: string;
  notified: boolean;
  history: number[];
}

interface DetailedModalProps {
  show: boolean;
  onHide: () => void;
  dustbin: Dustbin | null;
}

const DetailedModal: React.FC<DetailedModalProps> = ({
  show,
  onHide,
  dustbin,
}) => {
  if (!dustbin) return null;

  const lineData = {
    labels: dustbin.history.map((_, index) => `Update ${index + 1}`),
    datasets: [
      {
        label: "Fullness (%)",
        data: dustbin.history,
        fill: true,
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        tension: 0.4,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: `${dustbin.name} Fullness History`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" aria-labelledby="modal-title">
      <Modal.Header closeButton>
        <Modal.Title id="modal-title">{dustbin.name} Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          <strong>Current Fullness:</strong> {dustbin.fullness}%
        </p>
        <p>
          <strong>Last Updated:</strong> {dustbin.lastUpdated}
        </p>
        <h5>Fullness History:</h5>
        <Line data={lineData} options={lineOptions} />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DetailedModal;
