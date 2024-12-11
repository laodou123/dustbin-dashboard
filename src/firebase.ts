// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDJtpa9XI9oLDZdRwpP9rWH8ioFCe0k4WI",
  authDomain: "esp32-iot-c8229.firebaseapp.com",
  databaseURL: "https://esp32-iot-c8229-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "esp32-iot-c8229",
  storageBucket: "esp32-iot-c8229.firebasestorage.app",
  messagingSenderId: "908317446676",
  appId: "1:908317446676:web:828a3007f3d053eb370d01",
  measurementId: "G-HE7TR2W43Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const database = getDatabase(app);
export const auth = getAuth(app);
export const messaging = getMessaging(app);