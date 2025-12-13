import { useEffect, useState } from "react";
import api from "../api/axiosClient";
import { useAuth } from "../context/AuthContext.jsx";

const DashboardAdmin = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [trips, setTrips] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [actionLoading, setActionLoading] = useState(null);
  const [userPage, setUserPage] = useState(0);
  const [tripPage, setTripPage] = useState(0);
  const [pageSize] = useState(10);
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationTarget, setNotificationTarget] = useState("ALL");
  const [notificationSubmitting, setNotificationSubmitting] = useState(false);
  const [messages, setMessages] = useState([]);
  const [messagePage, setMessagePage] = useState(0);
  const [messageStats, setMessageStats] = useState({});

  const loadDashboardStats = async () => {
    try {
      const res = await api.get('/api/admin/dashboard/stats');
      setStats(res.data?.data || {});
    } catch (e) {
      setError('Failed to load dashboard stats');
    }
  };

  const handleSendNotification = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!notificationTitle.trim() || !notificationMessage.trim()) {
      setError("Title and message are required");
      return;
    }

    try {
      setNotificationSubmitting(true);
      await api.post("/api/admin/notifications", {
        title: notificationTitle.trim(),
        message: notificationMessage.trim(),
        targetAudience: notificationTarget
      });
      setSuccess("Notification sent successfully");
      setNotificationTitle("");
      setNotificationMessage("");
      setNotificationTarget("ALL");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to send notification");
    } finally {
      setNotificationSubmitting(false);
    }
  };

  const loadUsers = async (page = userPage) => {
    try {
      const res = await api.get(`/api/admin/users?page=${page}&size=${pageSize}`);
      setUsers(res.data?.data || []);
    } catch (e) {
      setError('Failed to load users');
    }
  };

  const loadTrips = async (page = tripPage) => {
    try {
      const res = await api.get(`/api/admin/trips?page=${page}&size=${pageSize}`);
      console.log('🔍 DEBUG: Trip API Response:', res.data);
      const tripData = res.data?.data || [];
      console.log('🔍 DEBUG: Parsed trips:', tripData);
      setTrips(tripData);
    } catch (e) {
      console.error('🔴 ERROR loading trips:', e);
      setError('Failed to load trips');
    }
  };

  const loadMessages = async (page = messagePage) => {
    try {
      const res = await api.get(`/api/admin/contacts?page=${page}&size=${pageSize}`);
      setMessages(res.data?.data?.contacts || []);
    } catch (e) {
      setError('Failed to load messages');
    }
  };

  const loadMessageStats = async () => {
    try {
      const res = await api.get('/api/admin/contacts/stats');
      setMessageStats(res.data?.data || {});
    } catch (e) {
      setError('Failed to load message stats');
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([loadDashboardStats(), loadUsers(), loadTrips(), loadMessages(), loadMessageStats()]);
      setLoading(false);
    };
    loadData();
  }, []);

  const handleMessageStatusUpdate = async (messageId, status) => {
    try {
      console.log('Updating message status:', messageId, status);
      setActionLoading(messageId);
      const response = await api.put(`/api/admin/contacts/${messageId}/status`, { status });
      console.log('Status update response:', response.data);
      setSuccess('Message status updated successfully');
      setTimeout(() => setSuccess(''), 3000);
      await Promise.all([loadMessages(), loadMessageStats(), loadDashboardStats()]);
    } catch (e) {
      console.error('Status update error:', e);
      setError('Failed to update message status: ' + (e.response?.data?.message || e.message));
      setTimeout(() => setError(''), 5000);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    try {
      setActionLoading(messageId);
      await api.delete(`/api/admin/contacts/${messageId}`);
      setSuccess('Message deleted successfully');
      setTimeout(() => setSuccess(''), 3000);
      await Promise.all([loadMessages(), loadMessageStats(), loadDashboardStats()]);
    } catch (e) {
      setError('Failed to delete message');
    } finally {
      setActionLoading(null);
    }
  };

  const handleUserStatusToggle = async (userId, currentStatus) => {
    try {
      setActionLoading(userId);
      await api.put(`/api/admin/users/${userId}/status?isActive=${!currentStatus}`);
      setSuccess('User status updated successfully');
      setTimeout(() => setSuccess(''), 3000);
      await loadUsers();
      await loadDashboardStats();
    } catch (e) {
      setError('Failed to update user status');
    } finally {
      setActionLoading(null);
    }
  };

  const handleUserVerification = async (userId, status) => {
    try {
      setActionLoading(userId);
      await api.put(`/api/admin/users/${userId}/verification?status=${status}`);
      setSuccess('User verification updated successfully');
      setTimeout(() => setSuccess(''), 3000);
      await loadUsers();
    } catch (e) {
      setError('Failed to update verification');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      setActionLoading(userId);
      await api.delete(`/api/admin/users/${userId}`);
      setSuccess('User deleted successfully');
      setTimeout(() => setSuccess(''), 3000);
      await loadUsers();
      await loadDashboardStats();
    } catch (e) {
      setError('Failed to delete user');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteTrip = async (tripId) => {
    if (!confirm('Are you sure you want to delete this trip?')) return;
    try {
      setActionLoading(tripId);
      await api.delete(`/api/admin/trips/${tripId}`);
      setSuccess('Trip deleted successfully');
      setTimeout(() => setSuccess(''), 3000);
      await loadTrips();
      await loadDashboardStats();
    } catch (e) {
      setError('Failed to delete trip');
    } finally {
      setActionLoading(null);
    }
  };

  const StatCard = ({ title, value, color, icon }) => (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>
      <h3 className="stat-title">{title}</h3>
      <p className="stat-value">{value}</p>
    </div>
  );

  const TabButton = ({ id, label, active, onClick }) => (
    <button
      onClick={() => onClick(id)}
      className={`tab-button ${active ? 'active-tab' : ''}`}
    >
      {label}
    </button>
  );

  if (loading) return <div className="loading-container">Loading admin dashboard...</div>;

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Admin Dashboard</h1>
        <p className="dashboard-subtitle">Welcome, <span className="admin-name">{user?.name}</span>!</p>
      </div>

      <div className="alert-container">
        {error && <div className="alert error-alert">{error}</div>}
        {success && <div className="alert success-alert">{success}</div>}
      </div>

      <div className="tabs-container">
        <TabButton id="dashboard" label="📊 Dashboard" active={activeTab === 'dashboard'} onClick={setActiveTab} />
        <TabButton id="users" label="👥 Users" active={activeTab === 'users'} onClick={setActiveTab} />
        <TabButton id="trips" label="🚗 Trips" active={activeTab === 'trips'} onClick={setActiveTab} />
        <TabButton id="messages" label="💬 Messages" active={activeTab === 'messages'} onClick={setActiveTab} />
        <TabButton id="notifications" label="🔔 Notifications" active={activeTab === 'notifications'} onClick={setActiveTab} />
      </div>

      {activeTab === 'dashboard' && (
        <div className="dashboard-section">
          <h2 className="section-title">📊 Dashboard Overview</h2>
          <div className="stats-grid">
            <StatCard title="Total Users" value={stats.totalUsers || 0} color="#2196F3" icon="👥" />
            <StatCard title="Total Trips" value={stats.totalTrips || 0} color="#4CAF50" icon="🚗" />
            <StatCard title="Total Revenue" value={`₹${(stats.totalRevenue || 0).toFixed(2)}`} color="#FF9800" icon="💰" />
            <StatCard title="Active Drivers" value={stats.activeDrivers || 0} color="#9C27B0" icon="🚙" />
            <StatCard title="Total Bookings" value={stats.totalBookings || 0} color="#F44336" icon="📋" />
            <StatCard title="Pending Bookings" value={stats.pendingBookings || 0} color="#FF5722" icon="⏳" />
            <StatCard title="Total Messages" value={stats.totalMessages || 0} color="#607D8B" icon="💬" />
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="users-section">
          <h2 className="section-title">👥 User Management</h2>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr className="table-header">
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Verification</th>
                  <th>Rating</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="table-row">
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`role-badge role-${user.role?.toLowerCase()}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${user.isActive ? 'active' : 'inactive'}`}>
                        {user.isActive ? '✅ Active' : '❌ Inactive'}
                      </span>
                    </td>
                    <td>
                      <span className={`verification-badge verification-${user.verificationStatus?.toLowerCase()}`}>
                        {user.verificationStatus}
                      </span>
                    </td>
                    <td className="rating-cell">{user.avgRating?.toFixed(1) || 'N/A'}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          onClick={() => handleUserStatusToggle(user.id, user.isActive)}
                          disabled={actionLoading === user.id}
                          className={`action-btn status-btn ${user.isActive ? 'deactivate' : 'activate'}`}
                        >
                          {user.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        {user.verificationStatus !== 'VERIFIED' && (
                          <button
                            onClick={() => handleUserVerification(user.id, 'VERIFIED')}
                            disabled={actionLoading === user.id}
                            className="action-btn verify-btn"
                          >
                            Verify
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          disabled={actionLoading === user.id}
                          className="action-btn delete-btn"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="pagination-container">
            <button
              onClick={() => { setUserPage(p => Math.max(0, p - 1)); loadUsers(Math.max(0, userPage - 1)); }}
              disabled={userPage === 0}
              className={`pagination-btn ${userPage === 0 ? 'disabled' : ''}`}
            >
              Previous
            </button>
            <span className="page-indicator">Page {userPage + 1}</span>
            <button
              onClick={() => { setUserPage(p => p + 1); loadUsers(userPage + 1); }}
              disabled={users.length < pageSize}
              className={`pagination-btn ${users.length < pageSize ? 'disabled' : ''}`}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {activeTab === 'trips' && (
        <div className="trips-section">
          <h2 className="section-title">🚗 Trip Management</h2>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr className="table-header">
                  <th>ID</th>
                  <th>Route</th>
                  <th>Driver</th>
                  <th>Departure</th>
                  <th>Price</th>
                  <th>Seats</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {trips.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="no-data-cell">
                      📭 No trips found in database. Check console for debugging info.
                    </td>
                  </tr>
                ) : (
                  trips.map((trip) => (
                    <tr key={trip.id} className="table-row">
                      <td>{trip.id}</td>
                      <td>{trip.fromLocation} → {trip.toLocation}</td>
                      <td>{trip.driverName}</td>
                      <td>{new Date(trip.departureTime).toLocaleString()}</td>
                      <td className="price-cell">₹{trip.pricePerSeat}</td>
                      <td className="seats-cell">{trip.availableSeats}/{trip.totalSeats}</td>
                      <td>
                        <span className={`trip-status trip-status-${trip.status?.toLowerCase()}`}>
                          {trip.status}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => handleDeleteTrip(trip.id)}
                          disabled={actionLoading === trip.id}
                          className="action-btn delete-btn"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="pagination-container">
            <button
              onClick={() => { setTripPage(p => Math.max(0, p - 1)); loadTrips(Math.max(0, tripPage - 1)); }}
              disabled={tripPage === 0}
              className={`pagination-btn ${tripPage === 0 ? 'disabled' : ''}`}
            >
              Previous
            </button>
            <span className="page-indicator">Page {tripPage + 1}</span>
            <button
              onClick={() => { setTripPage(p => p + 1); loadTrips(tripPage + 1); }}
              disabled={trips.length < pageSize}
              className={`pagination-btn ${trips.length < pageSize ? 'disabled' : ''}`}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {activeTab === 'messages' && (
        <div className="messages-section">
          <h2 className="section-title">💬 Contact Messages</h2>

          <div className="message-stats-grid">
            <StatCard title="New" value={messageStats.new || 0} color="#2196F3" icon="🆕" />
            <StatCard title="In Progress" value={messageStats.inProgress || 0} color="#FF9800" icon="⏳" />
            <StatCard title="Resolved" value={messageStats.resolved || 0} color="#4CAF50" icon="✅" />
            <StatCard title="Closed" value={messageStats.closed || 0} color="#9E9E9E" icon="🔒" />
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr className="table-header">
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Subject</th>
                  <th>Message</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {messages.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="no-data-cell">
                      💭 No messages found.
                    </td>
                  </tr>
                ) : (
                  messages.map((message) => (
                    <tr key={message.id} className="table-row">
                      <td>{message.id}</td>
                      <td>{message.name}</td>
                      <td>{message.email}</td>
                      <td>{message.subject}</td>
                      <td className="message-cell">
                        <div className="message-preview" title={message.message}>
                          {message.message}
                        </div>
                      </td>
                      <td>
                        <select
                          value={message.status}
                          onChange={(e) => handleMessageStatusUpdate(message.id, e.target.value)}
                          disabled={actionLoading === message.id}
                          className={`status-select status-${message.status?.toLowerCase()}`}
                        >
                          <option value="NEW">New</option>
                          <option value="IN_PROGRESS">In Progress</option>
                          <option value="RESOLVED">Resolved</option>
                          <option value="CLOSED">Closed</option>
                        </select>
                      </td>
                      <td>{new Date(message.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button
                          onClick={() => handleDeleteMessage(message.id)}
                          disabled={actionLoading === message.id}
                          className="action-btn delete-btn"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="pagination-container">
            <button
              onClick={() => { setMessagePage(p => Math.max(0, p - 1)); loadMessages(Math.max(0, messagePage - 1)); }}
              disabled={messagePage === 0}
              className={`pagination-btn ${messagePage === 0 ? 'disabled' : ''}`}
            >
              Previous
            </button>
            <span className="page-indicator">Page {messagePage + 1}</span>
            <button
              onClick={() => { setMessagePage(p => p + 1); loadMessages(messagePage + 1); }}
              disabled={messages.length < pageSize}
              className={`pagination-btn ${messages.length < pageSize ? 'disabled' : ''}`}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {activeTab === 'notifications' && (
        <div className="notifications-section">
          <h2 className="section-title">🔔 Create Notification</h2>
          <div className="notification-form-container">
            <form onSubmit={handleSendNotification} className="notification-form">
              <div className="form-group">
                <label className="form-label">
                  Notification Title
                </label>
                <input
                  type="text"
                  value={notificationTitle}
                  onChange={(e) => setNotificationTitle(e.target.value)}
                  className="form-input"
                  placeholder="Enter title"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Notification Message
                </label>
                <textarea
                  value={notificationMessage}
                  onChange={(e) => setNotificationMessage(e.target.value)}
                  rows={4}
                  className="form-textarea"
                  placeholder="Enter detailed message"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Target Audience
                </label>
                <select
                  value={notificationTarget}
                  onChange={(e) => setNotificationTarget(e.target.value)}
                  className="form-select"
                >
                  <option value="ALL">All Users</option>
                  <option value="DRIVER">Drivers</option>
                  <option value="PASSENGER">Passengers</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={notificationSubmitting}
                className={`submit-btn ${notificationSubmitting ? 'disabled' : ''}`}
              >
                {notificationSubmitting ? 'Sending...' : 'Send Notification'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardAdmin;