import React from "react";

const LoadingPage: React.FC = () => {
  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Connecting to MQTT Broker...</h1>
      <p>Please wait while we establish a connection.</p>
    </div>
  );
};

export default LoadingPage;
