import React from "react";
import { FaBell, FaTimes } from "react-icons/fa";
import { useNotification } from "../../hooks/useNotification";

const toastStyle = {
  position: "fixed",
  top: "90px",
  right: "20px",
  zIndex: 9999,
  padding: "1rem 1.2rem",
  borderRadius: "12px",
  background: "#fff",
  boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
  display: "flex",
  alignItems: "flex-start",
  gap: "0.8rem",
  maxWidth: "360px",
  borderLeft: "5px solid #f97316"
};

const NotificationToast = () => {
  const { toastNotification, dismissToast } = useNotification();

  if (!toastNotification) {
    return null;
  }

  return (
    <div style={toastStyle}>
      <div style={{ fontSize: "1.3rem", color: "#f97316", marginTop: "0.2rem" }}>
        <FaBell />
      </div>
      <div style={{ flex: 1 }}>
        <strong style={{ display: "block", color: "#111", marginBottom: "0.4rem" }}>
          {toastNotification.title}
        </strong>
        <p style={{ margin: 0, color: "#444", lineHeight: 1.5 }}>
          {toastNotification.message}
        </p>
        <small style={{ color: "#888" }}>New notification from Admin</small>
      </div>
      <button
        aria-label="Close notification"
        onClick={dismissToast}
        style={{
          border: "none",
          background: "none",
          color: "#666",
          cursor: "pointer",
          fontSize: "1rem"
        }}
      >
        <FaTimes />
      </button>
    </div>
  );
};

export default NotificationToast;
