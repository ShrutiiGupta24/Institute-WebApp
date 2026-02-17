import { useContext } from "react";
import { NotificationContext } from "../store/notificationContext";
export const useNotification = () => useContext(NotificationContext);
