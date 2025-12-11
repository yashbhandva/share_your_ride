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

  return (
    <div>
      <h1>Notifications</h1>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ marginBottom: 12 }}>
        <button onClick={loadNotifications} style={{ marginRight: 8 }}>
          Refresh
        </button>
        <button onClick={handleMarkAllRead} style={{ marginRight: 8 }}>
          Mark all as read
        </button>
        <button onClick={handleDeleteAll}>Delete all</button>
      </div>

      {items.length === 0 && !loading && <p>No notifications.</p>}
      {items.length > 0 && (
        <ul>
          {items.map((n) => (
            <li
              key={n.id}
              style={{
                marginBottom: 10,
                padding: 8,
                border: "1px solid #eee",
                backgroundColor: n.isRead ? "#fafafa" : "#e8f4ff",
              }}
            >
              <div style={{ fontWeight: 600 }}>{n.title}</div>
              <div style={{ fontSize: 14 }}>{n.message}</div>
              <div style={{ fontSize: 12, marginTop: 4 }}>
                Type: {n.type} | Related: {n.relatedEntityType || "-"}
                {n.relatedEntityId ? ` #${n.relatedEntityId}` : ""}
              </div>
              <div style={{ marginTop: 4 }}>
                {!n.isRead && (
                  <button
                    onClick={() => handleMarkRead(n.id)}
                    style={{ marginRight: 8 }}
                  >
                    Mark read
                  </button>
                )}
                <button onClick={() => handleDelete(n.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;
