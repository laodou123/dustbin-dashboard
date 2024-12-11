import { messaging } from './firebase';
import { getToken, onMessage } from 'firebase/messaging';

export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const token = await getToken(messaging, {
        vapidKey: 'BBadQ2wQJ-LvGERNQN5Yq43mnGg8gpTJOf1pi7UdWfchdc4a7dqG6yF5q84cSJ5FoHPHoO4ZZkN0WUpnUwzG80U', // Replace with your Web Push certificate key
      });
      console.log('FCM Token:', token);
    } else {
      console.error('Notification permission denied');
    }
  } catch (error) {
    console.error('Error getting notification permission:', error);
  }
};

// Listen for incoming messages while the app is in the foreground
export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log('Message received:', payload);
      resolve(payload);
    });
  });
