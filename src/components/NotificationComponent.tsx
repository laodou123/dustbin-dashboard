import React, { useEffect } from "react";
import {
  requestNotificationPermission,
  onMessageListener,
} from "../notifications";
import { MessagePayload } from "firebase/messaging";

const NotificationComponent: React.FC = () => {
  useEffect(() => {
    requestNotificationPermission();

    // Listen for foreground notifications
    onMessageListener().then((payload) => {
      const message = payload as MessagePayload;
      console.log(`Notification: ${message.notification?.title}`);
    });
  }, []);

  return null; // No visible output
};

export default NotificationComponent;
