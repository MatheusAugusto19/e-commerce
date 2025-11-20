import React from "react";
import { useNotification } from "../context/useNotification";
import "./NotificationContainer.scss";

export default function NotificationContainer() {
  const { notifications, removeNotification } = useNotification();

  return (
    <div className="notification-container">
      {notifications.map((notif) => (
        <div key={notif.id} className={`notification notification-${notif.type}`}>
          <div className="notification-content">
            <span className="notification-icon">
              {notif.type === "success" && "✓"}
              {notif.type === "error" && "✕"}
              {notif.type === "warning" && "⚠"}
              {notif.type === "info" && "ℹ"}
            </span>
            <span className="notification-message">{notif.message}</span>
          </div>
          <button
            className="notification-close"
            onClick={() => removeNotification(notif.id)}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
