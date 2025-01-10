import React, { useEffect, useState, useRef, useMemo } from "react";
import { useParams } from "react-router-dom";
import mqtt, { MqttClient, IClientOptions } from "mqtt";
import { ref, onValue, limitToLast, query } from "firebase/database"; // Corrected imports
import { database } from "../firebase";
import LoadingPage from "./LoadingPage";
import {
  styled,
  Switch,
  FormControlLabel,
  Snackbar,
  Alert,
} from "@mui/material"; // Snackbar and Alert
import WbSunnyIcon from "@mui/icons-material/WbSunny"; // Day icon
import NightlightRoundIcon from "@mui/icons-material/NightlightRound"; // Night icon
import "bootstrap/dist/css/bootstrap.min.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"; // Recharts components

interface SensorData {
  cover: string;
  volumn: number;
  weight: number;
  timestamp?: number; // Timestamp for historical data
}

const CustomSwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  "& .MuiSwitch-switchBase": {
    margin: 1,
    padding: 0,
    transform: "translateX(6px)",
    "&.Mui-checked": {
      color: "#fff",
      transform: "translateX(22px)",
      "& .MuiSwitch-thumb:before": {
        content: '""',
        position: "absolute",
        width: "100%",
        height: "100%",
        left: 0,
        top: 0,
        backgroundImage: `url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="white"><path d="M10 0a10 10 0 100 20 10 10 0 000-20z"/></svg>')`,
      },
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: theme.palette.mode === "dark" ? "#8796A5" : "#65C466",
      },
    },
  },
  "& .MuiSwitch-thumb": {
    backgroundColor: theme.palette.mode === "dark" ? "#003892" : "#001e3c",
    width: 32,
    height: 32,
    "&:before": {
      content: '""',
      position: "absolute",
      width: "100%",
      height: "100%",
      left: 0,
      top: 0,
      backgroundImage: `url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="white"><path d="M10 0a10 10 0 100 20 10 10 0 000-20z"/></svg>')`,
    },
  },
  "& .MuiSwitch-track": {
    opacity: 1,
    backgroundColor: theme.palette.mode === "dark" ? "#8796A5" : "#aab4be",
    borderRadius: 20 / 2,
  },
}));

const DustbinDetail: React.FC = () => {
  const { binType } = useParams<{ binType: string }>();

  const [sensorData, setSensorData] = useState<SensorData>({
    cover: "open",
    volumn: 0,
    weight: 0,
  });

  const [isConnected, setIsConnected] = useState(false);
  const clientRef = useRef<MqttClient | null>(null);
  const [messageLog, setMessageLog] = useState<string[]>([]);
  const topic = binType ? `srb/${binType.toLowerCase()}/motor` : "";

  // Memoize options to prevent unnecessary re-renders
  const options: IClientOptions = useMemo(
    () => ({
      protocol: "wss",
      host: "21be7b7891f540b79302d07822b51558.s1.eu.hivemq.cloud",
      port: 8884,
      path: "/mqtt",
      username: "dllmhgc",
      password: "@Dllm12345",
      reconnectPeriod: 1000, // Attempt reconnection every 1 second
    }),
    []
  );

  const details: Record<string, string> = {
    plastic: "This is a plastic bin used for recycling plastic waste.",
    paper: "This bin is used for paper recycling.",
    metal: "Use this bin for metal waste recycling.",
    generalwaste: "This bin is for general waste",
  };

  const handleSwitchChange = (action: string) => {
    if (clientRef.current && binType) {
      const message = { cover: action };
      clientRef.current.publish(topic, JSON.stringify(message));
      console.log(`Published action message: ${JSON.stringify(message)}`);
    }
  };

  const binDetail = binType
    ? details[binType.toLowerCase()] || "No details available."
    : "Dustbin type is not specified.";

  // Default states for switches
  const defaultState = {
    cover: "close", // Default cover state
    position: "down", // Default position (up/down)
    lock: "lock", // Default lock state
  };

  const [coverState, setCoverState] = useState(defaultState.cover);
  const [positionState, setPositionState] = useState(defaultState.position);
  const [lockState, setLockState] = useState(defaultState.lock);

  const resetToDefault = () => {
    setCoverState(defaultState.cover);
    setPositionState(defaultState.position);
    setLockState(defaultState.lock);
  };

  // Reset states after 30 seconds of inactivity
  useEffect(() => {
    const timer = setTimeout(() => {
      resetToDefault();
    }, 30000); // 30 seconds

    return () => clearTimeout(timer); // Clean up the timer on component unmount
  }, [coverState, positionState, lockState]);

  // State for historical data
  const [historicalData, setHistoricalData] = useState<SensorData[]>([]);

  // States for notifications
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "error" | "warning" | "info" | "success"
  >("info");

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  /**
   * Firebase Data Fetching
   */
  useEffect(() => {
    if (!binType) {
      console.warn("Bin type is not specified.");
      return;
    }

    // Fetch latest sensor data from Firebase with optimization
    const binRef = ref(database, "sensorData");
    const binQuery = query(binRef, limitToLast(100)); // Correctly create a query with limitToLast

    let latestData: { cover: any; volumn: any; weight: any; timestamp?: any };
    const unsubscribe = onValue(
      binQuery, // Use the query instead of options object
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const keys = Object.keys(data);
          const newestKey = keys[keys.length - 1];
          latestData = data[newestKey];
          setSensorData({
            cover: latestData.cover || "close",
            volumn: latestData.volumn || 0,
            weight: latestData.weight || 0,
            timestamp: latestData.timestamp || Date.now(),
          });

          // Update historical data
          setHistoricalData((prevData) => [
            ...prevData,
            {
              cover: latestData.cover || "close",
              volumn: latestData.volumn || 0,
              weight: latestData.weight || 0,
              timestamp: latestData.timestamp || Date.now(),
            },
          ]);

          // Check for threshold exceedance
          const volumeThreshold = 8000000000; // Example threshold
          const weightThreshold = 5000000000; // Example threshold

          if (latestData.volumn > volumeThreshold) {
            setSnackbarMessage(
              `Volume exceeded threshold: ${latestData.volumn}`
            );
            setSnackbarSeverity("warning");
            setOpenSnackbar(true);
          }

          if (latestData.weight > weightThreshold) {
            setSnackbarMessage(
              `Weight exceeded threshold: ${latestData.weight}`
            );
            setSnackbarSeverity("warning");
            setOpenSnackbar(true);
          }
        }
      },
      (error) => {
        console.error("Failed to fetch data:", error);
        setSnackbarMessage("Failed to fetch sensor data.");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [binType]);

  /**
   * MQTT Connection Setup
   */
  useEffect(() => {
    if (!binType) {
      console.warn("Bin type is not specified.");
      return;
    }

    // Initialize MQTT client
    const client: MqttClient = mqtt.connect(options);
    clientRef.current = client;

    client.on("connect", () => {
      console.log("Connected to MQTT broker");
      setIsConnected(true);

      client.subscribe(topic, (err) => {
        if (err) {
          console.error("Subscription error:", err);
          setSnackbarMessage("Subscription error.");
          setSnackbarSeverity("error");
          setOpenSnackbar(true);
        } else {
          console.log(`Subscribed to topic: ${topic}`);
        }
      });
    });

    client.on("message", (topic, message) => {
      const receivedMessage = message.toString();
      setMessageLog((prevLog) => [...prevLog, receivedMessage]);

      try {
        const data = JSON.parse(receivedMessage);
        setSensorData((prevData) => ({
          ...prevData,
          cover: data.cover || prevData.cover,
          volumn: data.volumn || prevData.volumn,
          weight: data.weight || prevData.weight,
          timestamp: Date.now(),
        }));

        // Update historical data
        setHistoricalData((prevData) => [
          ...prevData,
          {
            cover: data.cover || "close",
            volumn: data.volumn || 0,
            weight: data.weight || 0,
            timestamp: Date.now(),
          },
        ]);

        // Check for threshold exceedance
        const volumeThreshold = 80; // Example threshold
        const weightThreshold = 50; // Example threshold

        if (data.volumn && data.volumn > volumeThreshold) {
          setSnackbarMessage(`Volume exceeded threshold: ${data.volumn}`);
          setSnackbarSeverity("warning");
          setOpenSnackbar(true);
        }

        if (data.weight && data.weight > weightThreshold) {
          setSnackbarMessage(`Weight exceeded threshold: ${data.weight}`);
          setSnackbarSeverity("warning");
          setOpenSnackbar(true);
        }
      } catch (error) {
        console.error("Error parsing MQTT message:", error);
      }
    });

    client.on("error", (error) => {
      console.error("MQTT Connection error:", error);
      setIsConnected(false);
      setSnackbarMessage("MQTT connection error.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      client.end(); // End the client on error to prevent multiple attempts
    });

    client.on("reconnect", () => {
      console.log("Reconnecting to MQTT broker...");
      setSnackbarMessage("Reconnecting to MQTT broker...");
      setSnackbarSeverity("info");
      setOpenSnackbar(true);
    });

    client.on("close", () => {
      console.log("MQTT connection closed");
      setIsConnected(false);
      setSnackbarMessage("MQTT connection closed.");
      setSnackbarSeverity("info");
      setOpenSnackbar(true);
    });

    // Cleanup on component unmount
    return () => {
      if (clientRef.current) {
        clientRef.current.end(true, () => {
          console.log("MQTT client disconnected");
        });
      }
    };
  }, [binType, options, topic]); // Updated dependencies

  if (!isConnected) {
    return <LoadingPage />;
  }

  return (
    <div className="container my-5 p-4 bg-light rounded shadow">
      <h1 className="text-center mb-4 text-primary">
        {binType
          ? `${binType.charAt(0).toUpperCase() + binType.slice(1)} Bin`
          : "Error"}
      </h1>
      <p className="text-center lead">{binDetail}</p>
      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <h3 className="card-title">MQTT Connection Info</h3>
          <p>
            Status:{" "}
            <span className="fw-bold">
              {isConnected ? "Connected" : "Disconnected"}
            </span>
          </p>
          <p>
            Broker: <span className="text-muted">{options.host}</span>
          </p>
          <p>
            Topic: <span className="text-muted">{topic}</span>
          </p>
        </div>
      </div>

      <div className="card mb-4 shadow-sm">
        <div className="card-body text-center">
          <h2 className="card-title mb-3">Live Sensor Data</h2>
          <p className="fs-5 mb-1">
            Cover: <span className="fw-bold">{sensorData.cover}</span>
          </p>
          <p className="fs-5 mb-1">
            Volume: <span className="fw-bold">{sensorData.volumn}</span>
          </p>
          <p className="fs-5 mb-3">
            Weight: <span className="fw-bold">{sensorData.weight}</span>
          </p>
        </div>

        <div className="d-flex flex-wrap justify-content-center gap-3">
          {/* Cover Switch */}
          <FormControlLabel
            control={
              <CustomSwitch
                checked={coverState === "open"}
                onChange={(e) => {
                  setCoverState(e.target.checked ? "open" : "close");
                  handleSwitchChange(e.target.checked ? "open" : "close");
                }}
              />
            }
            label="Cover"
          />

          {/* Position Switch */}
          <FormControlLabel
            control={
              <CustomSwitch
                checked={positionState === "up"}
                onChange={(e) => {
                  setPositionState(e.target.checked ? "up" : "down");
                  handleSwitchChange(e.target.checked ? "up" : "down");
                }}
              />
            }
            label="Position"
          />

          {/* Lock Switch */}
          <FormControlLabel
            control={
              <CustomSwitch
                checked={lockState === "unlock"}
                onChange={(e) => {
                  setLockState(e.target.checked ? "unlock" : "lock");
                  handleSwitchChange(e.target.checked ? "unlock" : "lock");
                }}
              />
            }
            label="Lock"
          />
        </div>
      </div>

      {/* Historical Data Chart */}
      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <h2 className="card-title">Historical Sensor Data</h2>
          {historicalData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={historicalData.map((data) => ({
                  time: new Date(
                    data.timestamp || Date.now()
                  ).toLocaleTimeString(),
                  volume: data.volumn,
                  weight: data.weight,
                }))}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="volume" stroke="#8884d8" />
                <Line type="monotone" dataKey="weight" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-muted">No historical data available.</p>
          )}
        </div>
      </div>

      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <h2 className="card-title">Message Log</h2>
          {messageLog.length > 0 ? (
            <ul className="list-group">
              {messageLog
                .slice()
                .reverse()
                .map((msg, index) => (
                  <li className="list-group-item" key={index}>
                    {msg}
                  </li>
                ))}
            </ul>
          ) : (
            <p className="text-muted">No messages received yet.</p>
          )}
        </div>
      </div>

      {/* Snackbar for notifications */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default DustbinDetail;
