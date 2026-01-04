const notificationSlice = (set, get) => ({
  notifications: [],

  addNotification: (message, type = "success", duration = 3000) => {
    const id = Date.now();
    const notification = { id, message, type };

    set((state) => ({ notifications: [...state.notifications, notification] }));

    if (duration > 0) {
      setTimeout(() => {
        get().removeNotification(id);
      }, duration);
    }
    return id;
  },

  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((notif) => notif.id !== id),
    }));
  },
});

export default notificationSlice;
