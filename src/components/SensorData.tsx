// src/components/SensorData.tsx

import React, { useEffect, useState } from "react";
import { database } from "../firebase";
import { ref, onValue } from "firebase/database";
import "bootstrap/dist/css/bootstrap.min.css";

interface SensorDataItem {
  id: string;
  value: any; // Adjust the type according to your data structure
}

const SensorData: React.FC = () => {
  const [latestSensorData, setLatestSensorData] =
    useState<SensorDataItem | null>(null);

  useEffect(() => {
    const sensorDataRef = ref(database, "sensorData");

    const unsubscribe = onValue(sensorDataRef, (snapshot) => {
      const data = snapshot.val();

      if (data) {
        const keys = Object.keys(data);
        const newestKey = keys[keys.length - 1]; // Get the latest key
        setLatestSensorData({ id: newestKey, value: data[newestKey] });
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="container my-4 p-4 bg-light rounded shadow">
      <h2 className="text-center mb-4 text-primary">Latest Sensor Data</h2>

      {latestSensorData ? (
        <div className="card text-white bg-success mb-3 shadow-sm">
          <div className="card-body">
            <h5 className="card-title">ID: {latestSensorData.id}</h5>
            <p className="card-text">
              <pre className="bg-dark p-3 rounded">
                {JSON.stringify(latestSensorData.value, null, 2)}
              </pre>
            </p>
          </div>
        </div>
      ) : (
        <div className="alert alert-warning text-center" role="alert">
          No sensor data available.
        </div>
      )}
    </div>
  );
};

export default SensorData;
