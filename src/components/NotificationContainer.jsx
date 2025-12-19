import useStore from '../store/useStore';
import styles from "./NotificationContainer.module.scss";

export default function NotificationContainer() {
  const { notifications, removeNotification } = useStore();

  return (
    <div className={styles.notificationContainer}>
      {notifications.map((notif) => (
        <div key={notif.id} className={`${styles.notification} ${styles[`notification-${notif.type}`]}`}>
          <div className={styles.notificationContent}>
            <span className={styles.notificationIcon}>
              {notif.type === "success" && "✓"}
              {notif.type === "error" && "✕"}
              {notif.type === "warning" && "⚠"}
              {notif.type === "info" && "ℹ"}
            </span>
            <span className={styles.notificationMessage}>{notif.message}</span>
          </div>
          <button
            className={styles.notificationClose}
            onClick={() => removeNotification(notif.id)}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
