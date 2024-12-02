import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import mqtt, { MqttClient } from "mqtt";
import "../styles/DustbinDetail.css";

const DustbinDetail: React.FC = () => {
  const { binType } = useParams<{ binType: string }>();

  const [sensorData, setSensorData] = useState({
    fillLevel: 0,
    temperature: 0,
    status: "Normal",
  });
  const [isConnected, setIsConnected] = useState(false);
  const [messageLog, setMessageLog] = useState<string[]>([]);

  const brokerUrl = "wss://test.mosquitto.org:8081"; // Secure WebSocket URL
  const topic = binType ? `dustbin/${binType.toLowerCase()}/data` : "";

  const details: Record<string, string> = {
    plastic: "This is a plastic bin used for recycling plastic waste.",
    paper: "This bin is used for paper recycling.",
    metal: "Use this bin for metal waste recycling.",
    children: "This is a child-specific bin with safety features.",
  };

  const binDetail = binType
    ? details[binType.toLowerCase()] || "No details available."
    : "Dustbin type is not specified.";

  useEffect(() => {
    if (!binType) {
      console.warn("Bin type is not specified.");
      return;
    }

    const client: MqttClient = mqtt.connect(brokerUrl);

    client.on("connect", () => {
      console.log("Connected to MQTT broker");
      setIsConnected(true);

      // Subscribe to the topic
      client.subscribe(topic, (err) => {
        if (err) {
          console.error("Subscription error:", err);
        }
      });

      // Publish a message upon successful connection
      const message = `Connected to topic ${topic}`;
      client.publish(topic, JSON.stringify({ message }));
      console.log(`Published: ${message}`);
    });

    client.on("message", (topic, message) => {
      const receivedMessage = message.toString();
      setMessageLog((prevLog) => [...prevLog, receivedMessage]);

      try {
        const data = JSON.parse(receivedMessage);
        setSensorData({
          fillLevel: data.fillLevel || 0,
          temperature: data.temperature || 0,
          status: data.status || "Normal",
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
    };
  }, [binType]);

  return (
    <div className="dustbin-detail">
      <h1>
        {binType
          ? `${binType.charAt(0).toUpperCase() + binType.slice(1)} Bin`
          : "Error"}
      </h1>
      <p>{binDetail}</p>

      <div className="mqtt-info">
        <h3>MQTT Connection Info</h3>
        <p>Status: {isConnected ? "Connected" : "Disconnected"}</p>
        <p>Broker: {brokerUrl}</p>
        <p>Topic: {topic}</p>
      </div>

      <div className="sensor-data">
        <h2>Live Sensor Data</h2>
        {binType ? (
          <div className="sensor-card">
            <p>Fill Level: {sensorData.fillLevel}%</p>
            <p>Temperature: {sensorData.temperature}°C</p>
            <p>Status: {sensorData.status}</p>
          </div>
        ) : (
          <p>No live data available.</p>
        )}
      </div>

      <div className="message-log">
        <h2>Message Log</h2>
        {messageLog.length > 0 ? (
          <ul>
            {messageLog.map((msg, index) => (
              <li key={index}>{msg}</li>
            ))}
          </ul>
        ) : (
          <p>No messages received yet.</p>
        )}
      </div>
    </div>
  );
};

export default DustbinDetail;
