import { useEffect, useState } from "react";
import api from "../api/axiosClient";

const Notifications = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/api/notifications");
      const data = res.data?.data || res.data || [];
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.response?.data?.message || "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await api.post(`/api/notifications/${id}/read`);
      await loadNotifications();
    } catch (e) {
      setError(e.response?.data?.message || "Failed to mark as read");
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.post("/api/notifications/read-all");
      await loadNotifications();
    } catch (e) {
      setError(e.response?.data?.message || "Failed to mark all as read");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/notifications/${id}`);
      await loadNotifications();
    } catch (e) {
      setError(e.response?.data?.message || "Failed to delete notification");
    }
  };

  const handleDeleteAll = async () => {
    if (!window.confirm("Delete all notifications?")) return;
    try {
      await api.delete("/api/notifications");
      await loadNotifications();
    } catch (e) {
      setError(e.response?.data?.message || "Failed to delete all notifications");
    }
  };

  const NotificationIcon = ({ type }) => {
    switch(type) {
      case 'BOOKING':
        return '📋';
      case 'TRIP':
        return '🚗';
      case 'PAYMENT':
        return '💰';
      case 'SYSTEM':
        return '⚙️';
      case 'ALERT':
        return '⚠️';
      case 'INFO':
        return 'ℹ️';
      default:
        return '🔔';
    }
  };

  const NotificationCard = ({ notification }) => (
    <div className={`notification-card ${notification.isRead ? 'read' : 'unread'}`}>
      <div className="notification-header">
        <div className="notification-icon-container">
          <span className="notification-icon">
            <NotificationIcon type={notification.type} />
          </span>
        </div>
        <div className="notification-title-container">
          <h3 className="notification-title">{notification.title}</h3>
          <div className="notification-meta">
            <span className={`notification-type notification-type-${notification.type?.toLowerCase()}`}>
              {notification.type}
            </span>
            {notification.createdAt && (
              <span className="notification-time">
                {new Date(notification.createdAt).toLocaleString()}
              </span>
            )}
          </div>
        </div>
        <div className="notification-badge">
          {!notification.isRead && <span className="unread-badge">NEW</span>}
        </div>
      </div>

      <div className="notification-body">
        <p className="notification-message">{notification.message}</p>

        {(notification.relatedEntityType || notification.relatedEntityId) && (
          <div className="notification-related">
            <span className="related-label">Related to:</span>
            <span className="related-type">{notification.relatedEntityType || 'General'}</span>
            {notification.relatedEntityId && (
              <span className="related-id">#{notification.relatedEntityId}</span>
            )}
          </div>
        )}
      </div>

      <div className="notification-actions">
        {!notification.isRead && (
          <button
            onClick={() => handleMarkRead(notification.id)}
            className="action-btn mark-read-btn"
          >
            ✅ Mark as Read
          </button>
        )}
        <button
          onClick={() => handleDelete(notification.id)}
          className="action-btn delete-btn"
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  );

  return (
    <div className="notifications-page">
      <div className="notifications-header">
        <h1 className="page-title">
          <span className="page-icon">🔔</span>
          Notifications
        </h1>
        <p className="page-subtitle">Stay updated with your latest activity</p>
      </div>

      <div className="alert-container">
        {error && <div className="error-alert">{error}</div>}
      </div>

      <div className="actions-bar">
        <button
          onClick={loadNotifications}
          className="action-btn refresh-btn"
        >
          🔄 Refresh
        </button>
        <button
          onClick={handleMarkAllRead}
          className="action-btn mark-all-btn"
        >
          📭 Mark All as Read
        </button>
        <button
          onClick={handleDeleteAll}
          className="action-btn delete-all-btn"
        >
          🗑️ Delete All
        </button>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading notifications...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h3 className="empty-title">No Notifications</h3>
          <p className="empty-text">You're all caught up! New notifications will appear here.</p>
        </div>
      ) : (
        <div className="notifications-container">
          <div className="notifications-stats">
            <div className="stat-card">
              <span className="stat-icon">📨</span>
              <div className="stat-content">
                <span className="stat-label">Total</span>
                <span className="stat-value">{items.length}</span>
              </div>
            </div>
            <div className="stat-card">
              <span className="stat-icon">📖</span>
              <div className="stat-content">
                <span className="stat-label">Read</span>
                <span className="stat-value">{items.filter(n => n.isRead).length}</span>
              </div>
            </div>
            <div className="stat-card">
              <span className="stat-icon">📬</span>
              <div className="stat-content">
                <span className="stat-label">Unread</span>
                <span className="stat-value">{items.filter(n => !n.isRead).length}</span>
              </div>
            </div>
          </div>

          <div className="notifications-list">
            {items.map((notification) => (
              <NotificationCard key={notification.id} notification={notification} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;