import React, { useContext } from "react";
import { NotificationContext } from "../store/notificationContext";
const Notification = () => {
  const { notification } = useContext(NotificationContext);
  return notification ? <div className="notification">{notification}</div> : null;
};
export default Notification;
