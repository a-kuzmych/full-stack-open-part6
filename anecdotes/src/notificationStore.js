import { create } from "zustand";

let notificationTimeout;

const useNotificationStore = create((set) => ({
  message: "",
  actions: {
    showNotification: (message) => {
      clearTimeout(notificationTimeout);
      set({ message });
      notificationTimeout = setTimeout(() => set({ message: "" }), 1500);
    },
  },
}));

export const useNotification = () =>
  useNotificationStore((state) => state.message);
export const useNotificationActions = () =>
  useNotificationStore((state) => state.actions);
