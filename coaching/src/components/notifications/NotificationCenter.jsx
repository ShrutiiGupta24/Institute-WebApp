import React, { useMemo, useState } from "react";
import { FaBell, FaTimes, FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { useNotification } from "../../hooks/useNotification";
import {
  createNotification,
  updateNotification,
  deleteNotification
} from "../../services/notificationService";
import NotificationToast from "./NotificationToast";

const formatDate = (value) => {
  if (!value) {
    return "";
  }
  const date = new Date(value);
  return date.toLocaleString();
};

const truncateText = (text, max = 110) => {
  if (!text) {
    return "";
  }
  return text.length > max ? `${text.slice(0, max)}...` : text;
};

const NotificationCenter = ({ canManage = false, accentColor = "#f97316", variant = "panel" }) => {
  const {
    notifications,
    loading,
    error,
    unreadCount,
    fetchNotifications,
    markAllAsRead
  } = useNotification();
  const [isOpen, setIsOpen] = useState(false);
  const [formState, setFormState] = useState({ title: "", message: "", expires_at: "" });
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [cardHovered, setCardHovered] = useState(false);
  const isCardLayout = variant === "card";

  const recentNotifications = useMemo(() => notifications.slice(0, 50), [notifications]);
  const latestNotification = recentNotifications[0];

  const handleOpen = () => {
    setIsOpen(true);
    markAllAsRead();
  };

  const handleClose = () => {
    setIsOpen(false);
    setFormError("");
    if (!editingId) {
      setFormState({ title: "", message: "", expires_at: "" });
    }
    setEditingId(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (notification) => {
    setEditingId(notification.id);
    setFormState({
      title: notification.title,
      message: notification.message,
      expires_at: notification.expires_at ? notification.expires_at.slice(0, 16) : ""
    });
    setIsOpen(true);
  };

  const handleDelete = async (notificationId) => {
    if (!window.confirm("Delete this notification?")) {
      return;
    }
    try {
      await deleteNotification(notificationId);
      await fetchNotifications();
    } catch (err) {
      const message = err.response?.data?.detail || err.message || "Failed to delete notification";
      alert(message);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formState.title.trim() || !formState.message.trim()) {
      setFormError("Title and message are required");
      return;
    }
    setSubmitting(true);
    setFormError("");
    try {
      const payload = {
        title: formState.title.trim(),
        message: formState.message.trim(),
        expires_at: formState.expires_at ? new Date(formState.expires_at).toISOString() : null,
        audience: "all",
        is_active: true
      };
      if (editingId) {
        await updateNotification(editingId, payload);
      } else {
        await createNotification(payload);
      }
      await fetchNotifications();
      setFormState({ title: "", message: "", expires_at: "" });
      setEditingId(null);
    } catch (err) {
      const message = err.response?.data?.detail || err.message || "Failed to save notification";
      setFormError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ position: "relative", height: isCardLayout ? "100%" : "auto" }}>
      <NotificationToast />
      {isCardLayout ? (
        <div
          style={{
            background: "#fff",
            borderRadius: "14px",
            padding: "2rem",
            boxShadow: cardHovered ? "0 15px 40px rgba(0,0,0,0.3)" : "0 10px 30px rgba(0,0,0,0.2)",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            transition: "all 0.3s",
            transform: cardHovered ? "translateY(-10px)" : "translateY(0)"
          }}
          onMouseEnter={() => setCardHovered(true)}
          onMouseLeave={() => setCardHovered(false)}
        >
          <div style={{
            width: "70px",
            height: "70px",
            background: `linear-gradient(135deg, ${accentColor}, ${accentColor}dd)`,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "1.3rem",
            fontSize: "1.8rem",
            color: "#fff",
            boxShadow: `0 8px 20px ${accentColor}40`
          }}>
            <FaBell />
          </div>
          <h3 style={{
            fontSize: "1.35rem",
            color: "#333",
            marginBottom: "0.4rem",
            fontWeight: "bold"
          }}>
            Notifications
          </h3>
          <p style={{
            color: "#666",
            fontSize: "0.95rem",
            lineHeight: 1.5,
            marginBottom: "1.2rem"
          }}>
            Broadcast announcements and review incoming contact queries.
          </p>
          <div style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            marginBottom: "1.2rem"
          }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "1rem",
              flexWrap: "wrap",
              width: "100%",
              textAlign: "left"
            }}>
              <div style={{ flex: "1 1 40%" }}>
                <p style={{
                  margin: 0,
                  color: "#6b7280",
                  fontSize: "0.95rem"
                }}>
                  Stay updated on institute-wide announcements.
                </p>
              </div>
              <div style={{
                flex: "1 1 45%",
                background: "#f9fafb",
                borderRadius: "12px",
                padding: "1rem",
                minHeight: "96px"
              }}>
                <p style={{
                  margin: 0,
                  color: "#6b7280",
                  fontSize: "0.85rem"
                }}>
                  Latest update
                </p>
                {loading ? (
                  <p style={{ color: "#6b7280", marginTop: "0.4rem" }}>Loading…</p>
                ) : error ? (
                  <p style={{ color: "#b91c1c", marginTop: "0.4rem" }}>{error}</p>
                ) : latestNotification ? (
                  <>
                    <strong
                      style={{
                        color: "#111827",
                        display: "block",
                        marginTop: "0.4rem"
                      }}
                    >
                      {truncateText(latestNotification.title, 60)}
                    </strong>
                    <small style={{ color: "#6b7280" }}>
                      {formatDate(latestNotification.created_at)}
                    </small>
                  </>
                ) : (
                  <p style={{ color: "#6b7280", marginTop: "0.4rem" }}>No notifications yet.</p>
                )}
              </div>
            </div>
            <div style={{
              display: "flex",
              gap: "0.6rem",
              flexWrap: "wrap",
              justifyContent: "center"
            }}>
              <span style={{
                background: "#f9fafb",
                borderRadius: "999px",
                padding: "0.4rem 1rem",
                fontWeight: 600,
                color: "#111827"
              }}>
                Unread · {unreadCount}
              </span>
              {latestNotification && (
                <span style={{
                  color: "#6b7280",
                  fontSize: "0.85rem"
                }}>
                  Updated {formatDate(latestNotification.created_at)}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={handleOpen}
            style={{
              border: "none",
              background: accentColor,
              color: "#fff",
              borderRadius: "999px",
              padding: "0.8rem 2rem",
              cursor: "pointer",
              fontWeight: 600,
              boxShadow: `0 8px 20px ${accentColor}55`
            }}
          >
            View center
            {unreadCount > 0 && (
              <span
                style={{
                  marginLeft: "0.6rem",
                  background: "#ef4444",
                  borderRadius: "999px",
                  padding: "0.15rem 0.65rem",
                  fontSize: "0.8rem"
                }}
              >
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      ) : (
        <div
          style={{
            background: "#fff",
            borderRadius: "16px",
            padding: "1.5rem",
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            position: "relative"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
              <div style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${accentColor}, ${accentColor}dd)`,
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.5rem"
              }}>
                <FaBell />
              </div>
              <div>
                <h3 style={{ margin: 0, color: "#1f2937" }}>Notifications</h3>
                <p style={{ margin: 0, color: "#6b7280" }}>Latest announcements from Admin</p>
              </div>
            </div>
            <button
              onClick={handleOpen}
              style={{
                position: "relative",
                border: "none",
                background: accentColor,
                color: "#fff",
                borderRadius: "999px",
                padding: "0.6rem 1.5rem",
                cursor: "pointer",
                fontWeight: 600,
                boxShadow: `0 8px 20px ${accentColor}55`
              }}
            >
              View
              {unreadCount > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "-8px",
                    right: "-8px",
                    background: "#ef4444",
                    color: "#fff",
                    borderRadius: "999px",
                    padding: "2px 8px",
                    fontSize: "0.75rem",
                    minWidth: "24px",
                    textAlign: "center"
                  }}
                >
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
          <div>
            {loading ? (
              <p style={{ color: "#6b7280", margin: 0 }}>Loading notifications...</p>
            ) : error ? (
              <p style={{ color: "#ef4444", margin: 0 }}>{error}</p>
            ) : recentNotifications.length === 0 ? (
              <p style={{ color: "#6b7280", margin: 0 }}>No notifications in the last year.</p>
            ) : (
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                {recentNotifications.slice(0, 3).map((notification) => (
                  <li
                    key={notification.id}
                    style={{
                      background: "#f9fafb",
                      borderRadius: "12px",
                      padding: "0.9rem 1rem"
                    }}
                  >
                    <strong style={{ display: "block", color: "#111827" }}>{notification.title}</strong>
                    <p style={{ margin: "0.3rem 0", color: "#4b5563" }}>
                      {truncateText(notification.message)}
                    </p>
                    <small style={{ color: "#9ca3af" }}>{formatDate(notification.created_at)}</small>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {isOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(15, 23, 42, 0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9998,
            padding: "1rem"
          }}
          onClick={handleClose}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "20px",
              padding: "2rem",
              width: "min(900px, 95vw)",
              maxHeight: "90vh",
              overflowY: "auto",
              position: "relative"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleClose}
              style={{
                position: "absolute",
                top: "18px",
                right: "18px",
                border: "none",
                background: "transparent",
                fontSize: "1.3rem",
                cursor: "pointer",
                color: "#6b7280"
              }}
            >
              <FaTimes />
            </button>
            <h2 style={{ marginTop: 0, color: "#111827" }}>Notifications</h2>

            {canManage && (
              <form onSubmit={handleSubmit} style={{ marginBottom: "1.5rem", display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                  <input
                    name="title"
                    type="text"
                    value={formState.title}
                    onChange={handleInputChange}
                    placeholder="Notification title"
                    style={{
                      flex: 1,
                      minWidth: "220px",
                      padding: "0.8rem",
                      borderRadius: "10px",
                      border: "1px solid #d1d5db"
                    }}
                  />
                  <input
                    name="expires_at"
                    type="datetime-local"
                    value={formState.expires_at}
                    onChange={handleInputChange}
                    style={{
                      width: "220px",
                      padding: "0.8rem",
                      borderRadius: "10px",
                      border: "1px solid #d1d5db"
                    }}
                  />
                </div>
                <textarea
                  name="message"
                  rows={3}
                  value={formState.message}
                  onChange={handleInputChange}
                  placeholder="Notification message"
                  style={{
                    width: "100%",
                    padding: "0.8rem",
                    borderRadius: "10px",
                    border: "1px solid #d1d5db",
                    resize: "vertical"
                  }}
                />
                {formError && <p style={{ color: "#ef4444", margin: 0 }}>{formError}</p>}
                <div style={{ display: "flex", gap: "0.8rem" }}>
                  <button
                    type="submit"
                    disabled={submitting}
                    style={{
                      border: "none",
                      background: accentColor,
                      color: "#fff",
                      borderRadius: "999px",
                      padding: "0.7rem 1.8rem",
                      cursor: "pointer",
                      fontWeight: 600
                    }}
                  >
                    <FaPlus style={{ marginRight: "0.4rem" }} /> {editingId ? "Update" : "Publish"}
                  </button>
                  {editingId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(null);
                        setFormState({ title: "", message: "", expires_at: "" });
                      }}
                      style={{
                        border: "none",
                        background: "#e5e7eb",
                        color: "#111827",
                        borderRadius: "999px",
                        padding: "0.7rem 1.8rem",
                        cursor: "pointer",
                        fontWeight: 600
                      }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {recentNotifications.length === 0 ? (
                <p style={{ color: "#6b7280" }}>No notifications shared in the past year.</p>
              ) : (
                recentNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    style={{
                      border: "1px solid #e5e7eb",
                      borderRadius: "12px",
                      padding: "1rem",
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "1rem",
                      flexWrap: "wrap"
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: "0 0 0.3rem", color: "#111827" }}>{notification.title}</h4>
                      <p style={{ margin: 0, color: "#374151", lineHeight: 1.5 }}>{notification.message}</p>
                      <small style={{ color: "#6b7280", display: "block", marginTop: "0.5rem" }}>
                        {formatDate(notification.created_at)} · Posted by {notification.creator_name || "Admin"}
                      </small>
                    </div>
                    {canManage && (
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button
                          onClick={() => handleEdit(notification)}
                          style={{
                            border: "none",
                            background: "#fef3c7",
                            color: "#92400e",
                            borderRadius: "8px",
                            padding: "0.5rem 0.8rem",
                            cursor: "pointer"
                          }}
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(notification.id)}
                          style={{
                            border: "none",
                            background: "#fee2e2",
                            color: "#b91c1c",
                            borderRadius: "8px",
                            padding: "0.5rem 0.8rem",
                            cursor: "pointer"
                          }}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
