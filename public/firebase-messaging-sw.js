importScripts('https://www.gstatic.com/firebasejs/10.11.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.11.0/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyDJtpa9XI9oLDZdRwpP9rWH8ioFCe0k4WI",
    authDomain: "esp32-iot-c8229.firebaseapp.com",
    projectId: "esp32-iot-c8229",
    storageBucket: "esp32-iot-c8229.firebasestorage.app",
    messagingSenderId: "908317446676",
    appId: "1:908317446676:web:828a3007f3d053eb370d01",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
