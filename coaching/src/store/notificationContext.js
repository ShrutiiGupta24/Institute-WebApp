import React, { createContext, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getNotifications } from "../services/notificationService";

export const NotificationContext = createContext({
  notifications: [],
  loading: false,
  error: null,
  unreadCount: 0,
  toastNotification: null,
  fetchNotifications: () => {},
  markAllAsRead: () => {},
  dismissToast: () => {}
});

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toastNotification, setToastNotification] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const toastTimerRef = useRef(null);

  const rawStoredUser = typeof window !== "undefined" ? localStorage.getItem("user") : null;

  const currentUser = useMemo(() => {
    if (!rawStoredUser) {
      return null;
    }
    try {
      return JSON.parse(rawStoredUser);
    } catch (err) {
      console.error("Failed to parse user from storage", err);
      return null;
    }
  }, [rawStoredUser]);

  const authToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const isAuthenticated = Boolean(authToken && currentUser?.role);

  const normalizedRole = currentUser?.role ? currentUser.role.toLowerCase() : null;
  const isAdmin = normalizedRole === "admin";

  const lastSeenKey = useMemo(() => {
    const role = currentUser?.role ? currentUser.role.toLowerCase() : "guest";
    return `notifications:lastSeen:${role}`;
  }, [currentUser?.role]);

  const dismissToast = useCallback(() => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
      toastTimerRef.current = null;
    }
    setToastNotification(null);
  }, []);

  const computeUnreadCount = useCallback((items) => {
    const lastSeenAt = localStorage.getItem(lastSeenKey);
    const lastSeenTime = lastSeenAt ? Date.parse(lastSeenAt) : 0;
    const unread = items.filter((item) => Date.parse(item.created_at) > lastSeenTime).length;
    setUnreadCount(unread);
    return unread;
  }, [lastSeenKey]);

  const maybeShowToast = useCallback((items, unread) => {
    if (!items.length || unread === 0) {
      dismissToast();
      return;
    }
    const latest = items[0];
    setToastNotification(latest);
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = setTimeout(() => {
      setToastNotification(null);
      toastTimerRef.current = null;
    }, 5000);
  }, [dismissToast]);

  const filterByAudience = useCallback((items) => {
    if (isAdmin) {
      return items;
    }
    const allowedAudiences = new Set(["all"]);
    if (normalizedRole) {
      allowedAudiences.add(normalizedRole);
    }
    return items.filter((item) => allowedAudiences.has((item.audience || "all").toLowerCase()));
  }, [isAdmin, normalizedRole]);

  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) {
      setNotifications([]);
      setUnreadCount(0);
      setError(null);
      dismissToast();
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await getNotifications();
      const items = response.data || [];
      const scopedItems = filterByAudience(items);
      setNotifications(scopedItems);
      const unread = computeUnreadCount(scopedItems);
      maybeShowToast(scopedItems, unread);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
      setError(err.response?.data?.detail || "Unable to load notifications");
    } finally {
      setLoading(false);
    }
  }, [computeUnreadCount, filterByAudience, maybeShowToast, dismissToast, isAuthenticated]);

  const markAllAsRead = useCallback(() => {
    const timestamp = new Date().toISOString();
    localStorage.setItem(lastSeenKey, timestamp);
    setUnreadCount(0);
    dismissToast();
  }, [dismissToast, lastSeenKey]);

  useEffect(() => {
    if (!isAuthenticated) {
      return () => {
        if (toastTimerRef.current) {
          clearTimeout(toastTimerRef.current);
        }
      };
    }

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => {
      clearInterval(interval);
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, [fetchNotifications, isAuthenticated]);

  const value = useMemo(() => ({
    notifications,
    loading,
    error,
    unreadCount,
    toastNotification,
    fetchNotifications,
    markAllAsRead,
    dismissToast
  }), [notifications, loading, error, unreadCount, toastNotification, fetchNotifications, markAllAsRead, dismissToast]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
