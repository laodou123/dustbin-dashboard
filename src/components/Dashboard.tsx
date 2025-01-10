// Dashboard.tsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from "chart.js";
import { Card, Container, Row, Col, Alert } from "react-bootstrap";

// Register necessary Chart.js components
ChartJS.register(Title, Tooltip, Legend, ArcElement);

// Define a type for each dustbin
interface Dustbin {
  name: string;
  fullness: number; // Fullness is a percentage, so it's a number from 0 to 100
  lastUpdated: string; // Last time someone threw trash, as a string
  notified: boolean; // To track if notification has been sent
}

// Constants
const FULLNESS_THRESHOLD = 90;
const COLORS = {
  high: "#FF5733",
  normal: "#36A2EB",
  empty: "#E6E6E6",
};

// Sample data for each dustbin's fullness (in percentage)
const initialDustbinData: Dustbin[] = [
  {
    name: "Plastic",
    fullness: 70,
    lastUpdated: "2023-12-26 14:30",
    notified: false,
  },
  {
    name: "Metal",
    fullness: 50,
    lastUpdated: "2023-12-26 15:00",
    notified: false,
  },
  {
    name: "Paper",
    fullness: 80,
    lastUpdated: "2023-12-26 16:45",
    notified: false,
  },
  {
    name: "General Waste",
    fullness: 30,
    lastUpdated: "2023-12-26 17:15",
    notified: false,
  },
];

// Notification Icon Path
const NOTIFICATION_ICON = "/path/to/icon.png"; // Update this path accordingly

// DustbinCard Component
interface DustbinCardProps {
  dustbin: Dustbin;
  index: number;
  onFullnessChange: (index: number, newFullness: number) => void;
}

const DustbinCard: React.FC<DustbinCardProps> = React.memo(
  ({ dustbin, index, onFullnessChange }) => {
    const chartData = useMemo(
      () => ({
        labels: ["Full", "Empty"],
        datasets: [
          {
            data: [dustbin.fullness, 100 - dustbin.fullness],
            backgroundColor: [
              dustbin.fullness > 75 ? COLORS.high : COLORS.normal,
              COLORS.empty,
            ],
            hoverBackgroundColor: [
              dustbin.fullness > 75 ? COLORS.high : COLORS.normal,
              COLORS.empty,
            ],
          },
        ],
      }),
      [dustbin.fullness]
    );

    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newFullness = parseInt(e.target.value, 10);
      onFullnessChange(index, newFullness);
    };

    return (
      <Col
        xs={12}
        sm={6}
        md={4}
        lg={3}
        className="d-flex align-items-stretch mb-4"
      >
        <Card className="w-100 bg-light">
          <Card.Body className="d-flex flex-column">
            <Card.Title>{dustbin.name}</Card.Title>
            <div className="mt-auto">
              <Doughnut data={chartData} />
              <p className="mt-2 text-center">{dustbin.fullness}% Full</p>
              <p className="mt-1 text-center text-muted">
                Last updated: {dustbin.lastUpdated}
              </p>
              <div className="mb-2">
                <label
                  htmlFor={`fullness-slider-${index}`}
                  className="form-label sr-only"
                >
                  Adjust fullness for {dustbin.name}
                </label>
                <input
                  id={`fullness-slider-${index}`}
                  type="range"
                  min="0"
                  max="100"
                  value={dustbin.fullness}
                  onChange={handleSliderChange}
                  className="form-range"
                  aria-label={`Fullness slider for ${dustbin.name}`}
                />
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>
    );
  }
);

// StatisticsCard Component
interface StatisticsCardProps {
  totalDustbins: number;
  averageFullness: number;
}

const StatisticsCard: React.FC<StatisticsCardProps> = React.memo(
  ({ totalDustbins, averageFullness }) => (
    <Col xs={12} md={6} className="mb-4">
      <Card className="bg-light h-100">
        <Card.Body>
          <Card.Title>Dashboard Statistics</Card.Title>
          <p>Total Dustbins: {totalDustbins}</p>
          <p>Average Fullness: {averageFullness.toFixed(2)}%</p>
        </Card.Body>
      </Card>
    </Col>
  )
);

// Main Dashboard Component
const Dashboard: React.FC = () => {
  const [dustbinData, setDustbinData] = useState<Dustbin[]>(initialDustbinData);
  const [notificationError, setNotificationError] = useState<string | null>(
    null
  );

  // Request permission for notifications on mount
  useEffect(() => {
    const requestNotificationPermission = async () => {
      if ("Notification" in window) {
        if (Notification.permission === "default") {
          try {
            const permission = await Notification.requestPermission();
            if (permission !== "granted") {
              setNotificationError("Notification permission denied.");
            }
          } catch (error) {
            setNotificationError("Error requesting notification permission.");
            console.error("Error requesting notification permission:", error);
          }
        }
      } else {
        setNotificationError("Browser does not support notifications.");
      }
    };

    requestNotificationPermission();
  }, []);

  // Function to send a notification
  const sendNotification = useCallback((dustbin: Dustbin) => {
    if ("Notification" in window && Notification.permission === "granted") {
      const title = `Dustbin ${dustbin.name} is almost full!`;
      const options = {
        body: `${dustbin.name} is ${dustbin.fullness}% full. Time to empty it!`,
        icon: NOTIFICATION_ICON,
      };
      new Notification(title, options);
    }
  }, []);

  // Function to handle fullness change dynamically
  const handleFullnessChange = useCallback(
    (index: number, newFullness: number) => {
      setDustbinData((prevData) => {
        const updatedData = [...prevData];
        updatedData[index] = {
          ...updatedData[index],
          fullness: newFullness,
          lastUpdated: new Date().toISOString().slice(0, 19).replace("T", " "),
          // Reset notification status if fullness goes below threshold
          notified:
            newFullness >= FULLNESS_THRESHOLD
              ? updatedData[index].notified
              : false,
        };

        // Send notification if necessary
        if (newFullness >= FULLNESS_THRESHOLD && !updatedData[index].notified) {
          sendNotification(updatedData[index]);
          updatedData[index].notified = true;
        }

        return updatedData;
      });
    },
    [sendNotification]
  );

  // Calculate statistics
  const statistics = useMemo(() => {
    const total = dustbinData.length;
    const average =
      dustbinData.reduce((acc, bin) => acc + bin.fullness, 0) / total;
    return { total, average };
  }, [dustbinData]);

  return (
    <Container fluid className="py-4">
      {notificationError && (
        <Alert variant="warning">{notificationError}</Alert>
      )}
      <Row>
        {/* Rendering Doughnut charts for each dustbin */}
        {dustbinData.map((dustbin, index) => (
          <DustbinCard
            key={index}
            dustbin={dustbin}
            index={index}
            onFullnessChange={handleFullnessChange}
          />
        ))}
      </Row>

      {/* Additional Statistics */}
      <Row>
        <StatisticsCard
          totalDustbins={statistics.total}
          averageFullness={statistics.average}
        />
      </Row>
    </Container>
  );
};

export default Dashboard;
