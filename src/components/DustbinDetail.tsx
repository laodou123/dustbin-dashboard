import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import mqtt, { MqttClient, IClientOptions } from "mqtt";
import { ref, onValue } from "firebase/database";
import { database } from "../firebase";
import LoadingPage from "./LoadingPage";
import "bootstrap/dist/css/bootstrap.min.css";

interface SensorData {
  cover: string;
  volumn: number;
  weight: number;
}

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
  const topic = binType ? `dustbin/${binType.toLowerCase()}/data` : "";

  const options: IClientOptions = {
    protocol: "wss",
    host: "82d0b298bf0c4c38aec3e46bed030a55.s1.eu.hivemq.cloud",
    port: 8884,
    path: "/mqtt",
    username: "dllmhgc",
    password: "@Dllm12345",
  };
  const details: Record<string, string> = {
    plastic: "This is a plastic bin used for recycling plastic waste.",
    paper: "This bin is used for paper recycling.",
    metal: "Use this bin for metal waste recycling.",
    children: "This is a child-specific bin with safety features.",
  };

  const handleButtonClick = (action: string) => {
    if (clientRef.current && binType) {
      const message = { cover: action };
      clientRef.current.publish(topic, JSON.stringify(message));
      console.log(`Published action message: ${JSON.stringify(message)}`);
    }
  };

  const binDetail = binType
    ? details[binType.toLowerCase()] || "No details available."
    : "Dustbin type is not specified.";
  useEffect(() => {
    if (!binType) {
      console.warn("Bin type is not specified.");
      return;
    }

    // Fetch latest sensor data from Firebase
    const binRef = ref(database, "sensorData");
    let latestData: { cover: any; volumn: any; weight: any };
    const unsubscribe = onValue(binRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const keys = Object.keys(data);
        const newestKey = keys[keys.length - 1];
        latestData = data[newestKey];
        setSensorData({
          cover: latestData.cover || "close",
          volumn: latestData.volumn || 0,
          weight: latestData.weight || 0,
        });
      }
    });

    // MQTT Connection
    const client: MqttClient = mqtt.connect(options);
    clientRef.current = client;

    client.on("connect", () => {
      console.log("Connected to MQTT broker");
      setIsConnected(true);

      client.subscribe(topic, (err) => {
        if (err) {
          console.error("Subscription error:", err);
        }
      });
    });

    client.on("message", (topic, message) => {
      const receivedMessage = message.toString();
      setMessageLog((prevLog) => [...prevLog, receivedMessage]);

      try {
        const data = JSON.parse(receivedMessage);
        setSensorData({
          cover: data.cover || "close",
          volumn: latestData.volumn || 0,
          weight: latestData.weight || 0,
        });
      } catch (error) {
        console.error("Error parsing MQTT message:", error);
      }
    });

    client.on("error", () => {
      setIsConnected(false);
    });

    return () => {
      client.end();
      unsubscribe();
    };
  }, [binType]);

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
        <div className="d-flex flex-wrap justify-content-center gap-2">
          <button
            className="btn btn-success"
            onClick={() => handleButtonClick("open")}
          >
            Open Bin
          </button>
          <button
            className="btn btn-danger"
            onClick={() => handleButtonClick("close")}
          >
            Close Bin
          </button>
          <button
            className="btn btn-warning"
            onClick={() => handleButtonClick("up")}
          >
            Up Bin
          </button>
          <button
            className="btn btn-info"
            onClick={() => handleButtonClick("down")}
          >
            Down Bin
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => handleButtonClick("lock")}
          >
            Lock Bin
          </button>
          <button
            className="btn btn-primary"
            onClick={() => handleButtonClick("unlock")}
          >
            Unlock Bin
          </button>
        </div>
      </div>

      <div className="card shadow-sm">
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
    </div>
  );
};

export default DustbinDetail;
