// Dashboard.tsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Doughnut, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
} from "chart.js";
import {
  Card,
  Container,
  Row,
  Col,
  Alert,
  Button,
  Modal,
  Badge,
  ListGroup,
  Form,
  InputGroup,
  Navbar,
  Nav,
  FormControl,
} from "react-bootstrap";
import {
  FaBell,
  FaInfoCircle,
  FaDownload,
  FaFilter,
  FaSearch,
  FaMoon,
  FaSun,
} from "react-icons/fa";
import { database } from "../firebase"; // Adjust the path if necessary
import { ref, onValue, off } from "firebase/database";

// Register necessary Chart.js components
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement,
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
  fullness: number; // Fullness is a percentage, so it's a number from 0 to 100
  lastUpdated: string; // Last time someone threw trash, as a string
  notified: boolean; // To track if notification has been sent
  history: number[]; // Historical fullness data
}

// Define a type for notifications
interface NotificationLog {
  id: number;
  dustbinName: string;
  message: string;
  timestamp: string;
}

// Constants
const FULLNESS_THRESHOLD = 90;
const COLORS = {
  high: "#FF5733",
  normal: "#36A2EB",
  empty: "#E6E6E6",
};

// Notification Icon Path
const NOTIFICATION_ICON = "/path/to/icon.png"; // Update this path accordingly

// Function to export notifications as CSV
const exportToCSV = (notifications: NotificationLog[]) => {
  const headers = ["Dustbin Name", "Message", "Timestamp"];
  const rows = notifications.map((notif) => [
    notif.dustbinName,
    notif.message,
    notif.timestamp,
  ]);

  let csvContent =
    "data:text/csv;charset=utf-8," +
    [headers, ...rows].map((e) => e.join(",")).join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "notifications_log.csv");
  document.body.appendChild(link); // Required for FF

  link.click();
  document.body.removeChild(link);
};

// DustbinCard Component
interface DustbinCardProps {
  dustbin: Dustbin;
  onViewDetails: (dustbin: Dustbin) => void;
}

const DustbinCard: React.FC<DustbinCardProps> = React.memo(
  ({ dustbin, onViewDetails }) => {
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

    return (
      <Col
        xs={12}
        sm={6}
        md={4}
        lg={3}
        className="d-flex align-items-stretch mb-4"
      >
        <Card
          className={`w-100 ${
            dustbin.fullness >= FULLNESS_THRESHOLD
              ? "border-danger"
              : "bg-light"
          } shadow-sm transition hover-shadow`}
        >
          <Card.Body className="d-flex flex-column">
            <div className="d-flex justify-content-between align-items-center">
              <Card.Title>
                <FaBell
                  className={`me-2 ${
                    dustbin.fullness >= FULLNESS_THRESHOLD
                      ? "text-danger"
                      : "text-secondary"
                  }`}
                />
                {dustbin.name}
              </Card.Title>
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => onViewDetails(dustbin)}
                aria-label={`View details for ${dustbin.name} dustbin`}
              >
                <FaInfoCircle />
              </Button>
            </div>
            <div className="mt-3">
              <Doughnut data={chartData} />
              <p className="mt-2 text-center">
                {dustbin.fullness}% Full
                {dustbin.fullness >= FULLNESS_THRESHOLD && (
                  <Badge bg="danger" className="ms-2">
                    High
                  </Badge>
                )}
              </p>
              <p className="mt-1 text-center text-muted">
                Last updated: {dustbin.lastUpdated}
              </p>
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
    <Card className="bg-light h-100 shadow-sm">
      <Card.Body>
        <Card.Title className="d-flex align-items-center">
          <FaFilter className="me-2" />
          Dashboard Statistics
        </Card.Title>
        <Row className="mt-3">
          <Col xs={6}>
            <h5>Total Dustbins</h5>
            <p>{totalDustbins}</p>
          </Col>
          <Col xs={6}>
            <h5>Average Fullness</h5>
            <p>{averageFullness.toFixed(2)}%</p>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  )
);

// NotificationsLog Component
interface NotificationsLogProps {
  notifications: NotificationLog[];
}

const NotificationsLog: React.FC<NotificationsLogProps> = React.memo(
  ({ notifications }) => (
    <Card className="bg-light shadow-sm">
      <Card.Body>
        <Card.Title className="d-flex align-items-center">
          <FaBell className="me-2" />
          Notifications Log
          <Button
            variant="outline-success"
            size="sm"
            className="ms-auto"
            onClick={() => exportToCSV(notifications)}
            aria-label="Export notifications log as CSV"
          >
            <FaDownload /> Export
          </Button>
        </Card.Title>
        {notifications.length === 0 ? (
          <p>No notifications sent.</p>
        ) : (
          <ListGroup variant="flush">
            {notifications.map((notif) => (
              <ListGroup.Item key={notif.id}>
                <strong>{notif.dustbinName}:</strong> {notif.message}
                <br />
                <small className="text-muted">{notif.timestamp}</small>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Card.Body>
    </Card>
  )
);

// DetailedModal Component
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

// Main Dashboard Component
const Dashboard: React.FC = () => {
  const [dustbinData, setDustbinData] = useState<Dustbin[]>([]);
  const [notificationError, setNotificationError] = useState<string | null>(
    null
  );
  const [notifications, setNotifications] = useState<NotificationLog[]>([]);
  const [modalDustbin, setModalDustbin] = useState<Dustbin | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterThreshold, setFilterThreshold] = useState<number>(0);
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // Define dustbin types
  const dustbinTypes = useMemo(
    () => [
      { key: "plasticStatus", name: "Plastic" },
      { key: "metalStatus", name: "Metal" },
      { key: "paperStatus", name: "Paper" },
      { key: "glassStatus", name: "Glass" },
      { key: "generalwasteStatus", name: "General Waste" },
    ],
    []
  );

  // Initialize dustbin data with empty or default values
  useEffect(() => {
    const initialDustbins: Dustbin[] = dustbinTypes.map((type, index) => ({
      id: index + 1,
      name: type.name,
      fullness: 0,
      lastUpdated: "",
      notified: false,
      history: [],
    }));
    setDustbinData(initialDustbins);
  }, [dustbinTypes]);

  // Set up Firebase listeners
  useEffect(() => {
    const listeners: (() => void)[] = [];

    dustbinTypes.forEach((type, index) => {
      const dustbinRef = ref(database, `/${type.key}/-OGStVeG9c4fuN8xTgfm`);
      const listener = onValue(
        dustbinRef,
        (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const binCapacity = data.binCapacity;
            const timestamp = data.timestamp;

            // Handle binCapacity being -1 or invalid
            const fullness =
              binCapacity >= 0 && binCapacity <= 100 ? binCapacity : 0;

            setDustbinData((prevData) => {
              const updatedData = [...prevData];
              const dustbin = { ...updatedData[index] };
              dustbin.fullness = fullness;
              dustbin.lastUpdated = timestamp;
              dustbin.history = [
                ...dustbin.history.slice(-9), // Keep last 9 entries
                fullness,
              ];
              // Send notification if necessary
              if (dustbin.fullness >= FULLNESS_THRESHOLD && !dustbin.notified) {
                sendNotification(dustbin);
                dustbin.notified = true;
              }
              // Reset notified if fullness drops below threshold
              if (dustbin.fullness < FULLNESS_THRESHOLD) {
                dustbin.notified = false;
              }
              updatedData[index] = dustbin;
              return updatedData;
            });
          }
        },
        (error) => {
          console.error(`Error fetching data for ${type.name}:`, error);
        }
      );

      listeners.push(() => off(dustbinRef, "value", listener));
    });

    // Cleanup listeners on unmount
    return () => {
      listeners.forEach((unsubscribe) => unsubscribe());
    };
  }, [database, dustbinTypes]);

  // Load notifications from localStorage on mount
  useEffect(() => {
    const storedNotifications = localStorage.getItem("notifications");
    if (storedNotifications) {
      setNotifications(JSON.parse(storedNotifications));
    }
  }, []);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("notifications", JSON.stringify(notifications));
  }, [notifications]);

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

      // Add to notifications log
      const newNotification: NotificationLog = {
        id: Date.now(),
        dustbinName: dustbin.name,
        message: `${dustbin.name} is ${dustbin.fullness}% full.`,
        timestamp: new Date().toLocaleString(),
      };
      setNotifications((prev) => [newNotification, ...prev]);
    }
  }, []);

  // Function to handle viewing details
  const handleViewDetails = useCallback((dustbin: Dustbin) => {
    setModalDustbin(dustbin);
    setShowModal(true);
  }, []);

  // Calculate statistics
  const statistics = useMemo(() => {
    const total = dustbinData.length;
    const average =
      dustbinData.reduce((acc, bin) => acc + bin.fullness, 0) / total || 0;
    return { total, average };
  }, [dustbinData]);

  // Filtered and searched dustbin data
  const filteredDustbins = useMemo(() => {
    return dustbinData.filter((bin) => {
      const matchesSearch = bin.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesFilter = bin.fullness >= filterThreshold;
      return matchesSearch && matchesFilter;
    });
  }, [dustbinData, searchTerm, filterThreshold]);

  // Toggle Dark Mode
  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <div
      className={
        darkMode
          ? "bg-dark text-light min-vh-100 transition-bg"
          : "bg-white text-dark min-vh-100 transition-bg"
      }
    >
      {/* Navbar */}
      <Navbar
        bg={darkMode ? "dark" : "primary"}
        variant={darkMode ? "dark" : "light"}
        expand="lg"
        className="shadow-sm"
      >
        <Container>
          <Navbar.Brand href="#">Smart Dustbins</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {/* Add more navigation links if needed */}
            </Nav>
            <Form className="d-flex align-items-center">
              <Button
                variant={darkMode ? "secondary" : "outline-light"}
                onClick={toggleDarkMode}
                className="me-2"
                aria-label="Toggle dark mode"
              >
                {darkMode ? <FaSun /> : <FaMoon />}
              </Button>
              <InputGroup>
                <InputGroup.Text>
                  <FaSearch />
                </InputGroup.Text>
                <FormControl
                  placeholder="Search Dustbins"
                  aria-label="Search Dustbins"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Form>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Main Container */}
      <Container fluid className="py-4">
        {notificationError && (
          <Alert variant="warning">{notificationError}</Alert>
        )}

        {/* Main Heading */}
        <Row className="mb-4">
          <Col>
            <h1 className="text-center">Smart Dustbin Dashboard</h1>
          </Col>
        </Row>

        {/* Statistics Card at the Top Center */}
        <Row className="justify-content-center mb-4">
          <Col xs={12} md={6}>
            <StatisticsCard
              totalDustbins={statistics.total}
              averageFullness={statistics.average}
            />
          </Col>
        </Row>

        {/* Search and Filter Section */}
        <Row className="mb-4">
          <Col xs={12} md={6}>
            <InputGroup>
              <InputGroup.Text>
                <FaFilter />
              </InputGroup.Text>
              <Form.Select
                aria-label="Filter dustbins by fullness threshold"
                value={filterThreshold}
                onChange={(e) =>
                  setFilterThreshold(parseInt(e.target.value, 10))
                }
              >
                <option value={0}>All Dustbins</option>
                <option value={50}>Fullness ≥ 50%</option>
                <option value={75}>Fullness ≥ 75%</option>
                <option value={90}>Fullness ≥ 90%</option>
              </Form.Select>
            </InputGroup>
          </Col>
        </Row>

        {/* Dustbin Cards */}
        <Row>
          {filteredDustbins.length > 0 ? (
            filteredDustbins.map((dustbin) => (
              <DustbinCard
                key={dustbin.id}
                dustbin={dustbin}
                onViewDetails={handleViewDetails}
              />
            ))
          ) : (
            <Col>
              <Alert variant="info">
                No dustbins match your search and filter criteria.
              </Alert>
            </Col>
          )}
        </Row>

        {/* Notifications Log */}
        <Row className="mt-4">
          <Col xs={12}>
            <NotificationsLog notifications={notifications} />
          </Col>
        </Row>

        {/* Detailed Modal View */}
        <DetailedModal
          show={showModal}
          onHide={() => setShowModal(false)}
          dustbin={modalDustbin}
        />
      </Container>

      {/* Footer */}
      <footer
        className={`text-center py-3 ${
          darkMode ? "bg-dark text-light" : "bg-light text-dark"
        }`}
      >
        <Container>
          <span>
            © {new Date().getFullYear()} Smart Dustbins. All rights reserved.
          </span>
          <div className="mt-2">{/* Example Social Media Links */}</div>
        </Container>
      </footer>
    </div>
  );
};

export default Dashboard;
