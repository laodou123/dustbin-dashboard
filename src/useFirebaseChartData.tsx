import { useState, useEffect } from "react";
import { database } from "./firebase"; // Your Firebase config
import { ref, onValue } from "firebase/database";

interface ChartData {
  labels: string[]; // X-axis labels (e.g., unique keys or identifiers)
  values: number[]; // Y-axis values (e.g., weights)
}

const useFirebaseChartData = (path: string) => {
  const [chartData, setChartData] = useState<ChartData>({ labels: [], values: [] });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const dataRef = ref(database, path);

    const unsubscribe = onValue(dataRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Convert the Firebase object into chart-friendly format
        const labels = Object.keys(data); // Extract keys (unique IDs)
        const values = Object.values(data).map(
          (item: any) => item.weight // Extract weight values
        );
        setChartData({ labels, values });
      }
      setLoading(false);
    });

    return () => unsubscribe(); // Clean up the listener
  }, [path]);

  return { chartData, loading };
};

export default useFirebaseChartData;
