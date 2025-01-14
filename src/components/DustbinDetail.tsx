// src/components/DustbinDetail.tsx

import React, { useEffect, useState, useRef, useMemo } from "react";
import { useParams } from "react-router-dom";
import mqtt, { MqttClient, IClientOptions } from "mqtt";
import { ref, onValue, onChildAdded } from "firebase/database";
import { database } from "../firebase";
import LoadingPage from "./LoadingPage";
import {
  styled,
  Switch,
  FormControlLabel,
  Snackbar,
  Alert,
} from "@mui/material";
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
} from "recharts";

// Define the SensorData interface
interface SensorData {
  binCapacity: number;
  cover: string;
  lock: string;
  timestamp: number; // Changed to number for consistency
  uid: string;
  upDn: string;
  weightInGrams?: string; // Optional field for weight
}

// Styled Switch component
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

  // State to hold the latest sensor data
  const [sensorData, setSensorData] = useState<SensorData | null>(null);

  // State to handle loading and errors
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // MQTT connection state
  const [isConnected, setIsConnected] = useState(false);
  const clientRef = useRef<MqttClient | null>(null);

  // Message log for MQTT messages
  const [messageLog, setMessageLog] = useState<string[]>([]);

  // Construct MQTT topics based on binType
  const commandTopic = binType ? `srb/${binType.toLowerCase()}/commands` : "";
  const dataTopic = binType ? `srb/${binType.toLowerCase()}/data` : "";

  // Define MQTT options using environment variables for security
  const options: IClientOptions = useMemo(
    () => ({
      protocol: "wss",
      host:
        process.env.REACT_APP_MQTT_HOST ||
        "21be7b7891f540b79302d07822b51558.s1.eu.hivemq.cloud",
      port: Number(process.env.REACT_APP_MQTT_PORT) || 8884,
      path: "/mqtt",
      username: process.env.REACT_APP_MQTT_USERNAME || "dllmhgc",
      password: process.env.REACT_APP_MQTT_PASSWORD || "@Dllm12345",
      reconnectPeriod: 1000, // Attempt reconnection every 1 second
    }),
    []
  );

  // Details for each bin type
  const details: Record<string, string> = {
    plastic: "This is a plastic bin used for recycling plastic waste.",
    paper: "This bin is used for paper recycling.",
    metal: "Use this bin for metal waste recycling.",
    generalwaste: "This bin is for general waste.",
  };

  // Handle actions (e.g., cover, position, lock)
  const handleSwitchChange = (action: string) => {
    if (clientRef.current && binType) {
      const message = { command: action };
      clientRef.current.publish(commandTopic, JSON.stringify(message));
      console.log(`Published command message: ${JSON.stringify(message)}`);
    }
  };

  // Get bin details based on binType
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

  // Reset switch states after 30 seconds of inactivity
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
   * Firebase Data Fetching for Bin Status
   */
  useEffect(() => {
    if (!binType) {
      console.warn("Bin type is not specified.");
      setError("Bin type is not specified.");
      setLoading(false);
      return;
    }

    // Construct the Firebase path based on binType
    const binStatusPath = `${binType.toLowerCase()}Status`;

    // Reference to the bin status in Firebase
    const binRef = ref(database, binStatusPath);

    // Listen for value changes
    const unsubscribe = onValue(
      binRef,
      (snapshot) => {
        const data = snapshot.val();

        if (data) {
          const keys = Object.keys(data);
          const latestKey = keys[keys.length - 1];
          const latestData = data[latestKey] as SensorData;

          // Validate the data structure
          if (
            typeof latestData.binCapacity === "number" &&
            typeof latestData.cover === "string" &&
            typeof latestData.lock === "string" &&
            typeof latestData.timestamp === "string" && // Initially string in Firebase
            typeof latestData.uid === "string" &&
            typeof latestData.upDn === "string"
          ) {
            // Convert timestamp to number
            const timestampNumber = new Date(latestData.timestamp).getTime();

            setSensorData({
              binCapacity: latestData.binCapacity,
              cover: latestData.cover,
              lock: latestData.lock,
              timestamp: timestampNumber, // Assign number
              uid: latestData.uid,
              upDn: latestData.upDn,
              weightInGrams: latestData.weightInGrams || "", // Initialize if not present
            });
            setLoading(false);
          } else {
            console.error("Invalid data structure:", latestData);
            setError("Received data has an unexpected format.");
            setLoading(false);
          }
        } else {
          setError(`No sensor data available for ${binStatusPath}.`);
          setLoading(false);
        }
      },
      (error) => {
        console.error("Error fetching sensor data:", error);
        setError("Failed to fetch sensor data.");
        setLoading(false);
      }
    );

    // Cleanup listener on unmount
    return () => {
      unsubscribe();
    };
  }, [binType]);

  /**
   * Firebase Listener for Thrown Items
   */
  useEffect(() => {
    if (!binType) {
      console.warn("Bin type is not specified.");
      return;
    }

    const thrownPath = `thrown`; // Path to the thrown items
    const thrownRef = ref(database, thrownPath);

    // Listen for new thrown items
    const unsubscribe = onChildAdded(thrownRef, (snapshot) => {
      const thrownData = snapshot.val();

      if (thrownData) {
        const { material, weightInGrams } = thrownData;

        // Validate the presence of required fields
        if (material && weightInGrams) {
          // Check if the material matches the current binType
          if (material.toLowerCase() === binType.toLowerCase()) {
            // Update sensorData with the new weight without adjusting binCapacity
            setSensorData((prevData) => {
              if (prevData) {
                return {
                  ...prevData,
                  weightInGrams,
                  timestamp: Date.now(), // Update timestamp
                };
              }
              return prevData;
            });

            // Show a snackbar notification
            setSnackbarMessage(
              `Added ${weightInGrams}g to the ${material} bin.`
            );
            setSnackbarSeverity("success");
            setOpenSnackbar(true);
          }
        } else {
          console.warn("Thrown data is missing 'material' or 'weightInGrams'.");
        }
      }
    });

    // Cleanup listener on unmount
    return () => {
      unsubscribe();
    };
  }, [binType]);

  /**
   * Centralized Historical Data Update based on sensorData
   */
  useEffect(() => {
    if (sensorData) {
      setHistoricalData((prevHistorical) => {
        const updatedHistorical = [...prevHistorical, { ...sensorData }];

        // Optional: Limit the size to 100 entries
        if (updatedHistorical.length > 100) {
          updatedHistorical.shift(); // Remove the oldest entry
        }

        return updatedHistorical;
      });

      // Check for threshold exceedance
      const capacityThreshold = -0.5; // Example threshold
      if (sensorData.binCapacity < capacityThreshold) {
        setSnackbarMessage(
          `Bin capacity below threshold: ${sensorData.binCapacity}`
        );
        setSnackbarSeverity("warning");
        setOpenSnackbar(true);
      }
    }
  }, [sensorData]);

  /**
   * MQTT Connection Setup with Message Filtering
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

      // Subscribe only to the dataTopic to receive sensor data
      client.subscribe(dataTopic, (err) => {
        if (err) {
          console.error("Subscription error:", err);
          setSnackbarMessage("Subscription error.");
          setSnackbarSeverity("error");
          setOpenSnackbar(true);
        } else {
          console.log(`Subscribed to topic: ${dataTopic}`);
        }
      });
    });

    client.on("message", (receivedTopic, message) => {
      if (receivedTopic !== dataTopic) return; // Ignore messages not from dataTopic

      const receivedMessage = message.toString();
      setMessageLog((prevLog) => [...prevLog, receivedMessage]);

      try {
        const data = JSON.parse(receivedMessage) as Partial<SensorData> & {
          command?: string;
        };

        // Check if the message is a command
        if (data.command) {
          console.log(
            "Received a command message. Ignoring sensor data update."
          );
          return; // Do not process command messages
        }

        // Validate that the message contains all required SensorData fields
        if (
          typeof data.binCapacity === "number" &&
          typeof data.cover === "string" &&
          typeof data.lock === "string" &&
          typeof data.timestamp === "number" &&
          typeof data.uid === "string" &&
          typeof data.upDn === "string"
        ) {
          // Update sensorData without modifying timestamp unless it's genuinely new data
          setSensorData(data as SensorData);

          // The centralized useEffect will handle historicalData

          // Check for threshold exceedance
          const capacityThreshold = -0.5; // Example threshold
          if (data.binCapacity < capacityThreshold) {
            setSnackbarMessage(
              `Bin capacity below threshold: ${data.binCapacity}`
            );
            setSnackbarSeverity("warning");
            setOpenSnackbar(true);
          }
        } else {
          console.log("Received a non-sensor data message. Ignoring.");
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
  }, [binType, options, dataTopic]);

  /**
   * Early Loading State for MQTT
   */
  if (!isConnected && loading) {
    return <LoadingPage />; // Ensure LoadingPage shows a spinner or loading indicator
  }

  return (
    <div className="container my-5 p-4 bg-light rounded shadow">
      <h1 className="text-center mb-4 text-primary">
        {binType
          ? `${binType.charAt(0).toUpperCase() + binType.slice(1)} Bin`
          : "Error"}
      </h1>
      <p className="text-center lead">{binDetail}</p>

      {/* MQTT Connection Info */}
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
            Data Topic: <span className="text-muted">{dataTopic}</span>
          </p>
        </div>
      </div>

      {/* Live Sensor Data */}
      <div className="card mb-4 shadow-sm">
        <div className="card-body text-center">
          <h2 className="card-title mb-3">Live Sensor Data</h2>
          <p className="fs-5 mb-1">
            <strong>Cover:</strong> {sensorData?.cover}
          </p>
          <p className="fs-5 mb-1">
            <strong>Bin Capacity:</strong> {sensorData?.binCapacity}
          </p>
          <p className="fs-5 mb-1">
            <strong>Lock:</strong> {sensorData?.lock}
          </p>
          <p className="fs-5 mb-1">
            <strong>Position:</strong> {sensorData?.upDn}
          </p>
          {sensorData?.weightInGrams && (
            <p className="fs-5 mb-3">
              <strong>Weight:</strong> {sensorData.weightInGrams} grams
            </p>
          )}
          <p className="fs-5 mb-3">
            <strong>Timestamp:</strong>{" "}
            {sensorData
              ? new Date(sensorData.timestamp).toLocaleString()
              : "N/A"}
          </p>
        </div>

        {/* Switches */}
        <div className="d-flex flex-wrap justify-content-center gap-3">
          {/* Cover Switch */}
          <FormControlLabel
            control={
              <CustomSwitch
                checked={coverState === "open"}
                onChange={(e) => {
                  const newState = e.target.checked ? "open" : "close";
                  setCoverState(newState);
                  handleSwitchChange(newState); // Sends { "command": "open" } or { "command": "close" }
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
                  const newState = e.target.checked ? "up" : "down";
                  setPositionState(newState);
                  handleSwitchChange(newState); // Sends { "command": "up" } or { "command": "down" }
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
                  const newState = e.target.checked ? "unlock" : "lock";
                  setLockState(newState);
                  handleSwitchChange(newState); // Sends { "command": "unlock" } or { "command": "lock" }
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
                  binCapacity: data.binCapacity,
                  weightInGrams: parseFloat(data.weightInGrams || "0"), // Convert to number for charting
                  // Add other fields as needed
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
                <Line
                  type="monotone"
                  dataKey="binCapacity"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
                <Line
                  type="monotone"
                  dataKey="weightInGrams"
                  stroke="#82ca9d"
                  activeDot={{ r: 8 }}
                />
                {/* Add other lines as needed */}
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-muted">No historical data available.</p>
          )}
        </div>
      </div>

      {/* Message Log */}
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
