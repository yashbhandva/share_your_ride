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
    <div style={{
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      border: `3px solid ${color}`,
      textAlign: 'center'
    }}>
      <div style={{ fontSize: '24px', marginBottom: '8px' }}>{icon}</div>
      <h3 style={{ margin: '0 0 8px 0', color: color }}>{title}</h3>
      <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, color: '#333' }}>{value}</p>
    </div>
  );

  const TabButton = ({ id, label, active, onClick }) => (
    <button
      onClick={() => onClick(id)}
      style={{
        padding: '10px 20px',
        border: 'none',
        backgroundColor: active ? '#4CAF50' : '#f5f5f5',
        color: active ? 'white' : '#333',
        borderRadius: '5px',
        cursor: 'pointer',
        marginRight: '10px',
        fontWeight: active ? 'bold' : 'normal'
      }}
    >
      {label}
    </button>
  );

  if (loading) return <div style={{ padding: '20px' }}>Loading admin dashboard...</div>;

  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <h1 style={{ marginBottom: '20px', color: '#333' }}>Admin Dashboard</h1>
      <p style={{ marginBottom: '30px', color: '#666' }}>Welcome, {user?.name}!</p>

      {error && <div style={{ color: 'red', backgroundColor: '#ffebee', padding: '10px', borderRadius: '5px', marginBottom: '15px' }}>{error}</div>}
      {success && <div style={{ color: 'green', backgroundColor: '#e8f5e8', padding: '15px', borderRadius: '5px', marginBottom: '15px', fontWeight: 'bold' }}>{success}</div>}

      <div style={{ marginBottom: '30px' }}>
        <TabButton id="dashboard" label="📊 Dashboard" active={activeTab === 'dashboard'} onClick={setActiveTab} />
        <TabButton id="users" label="👥 Users" active={activeTab === 'users'} onClick={setActiveTab} />
        <TabButton id="trips" label="🚗 Trips" active={activeTab === 'trips'} onClick={setActiveTab} />
        <TabButton id="messages" label="💬 Messages" active={activeTab === 'messages'} onClick={setActiveTab} />
        <TabButton id="notifications" label="🔔 Notifications" active={activeTab === 'notifications'} onClick={setActiveTab} />
      </div>

      {activeTab === 'dashboard' && (
        <div>
          <h2 style={{ marginBottom: '20px' }}>📊 Dashboard Overview</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
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
        <div>
          <h2 style={{ marginBottom: '20px' }}>👥 User Management</h2>
          <div style={{ backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f5f5f5' }}>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>ID</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Name</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Email</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Role</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Status</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Verification</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Rating</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '12px' }}>{user.id}</td>
                    <td style={{ padding: '12px' }}>{user.name}</td>
                    <td style={{ padding: '12px' }}>{user.email}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        backgroundColor: user.role === 'ADMIN' ? '#f44336' : user.role === 'DRIVER' ? '#4CAF50' : '#2196F3',
                        color: 'white'
                      }}>
                        {user.role}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ color: user.isActive ? 'green' : 'red' }}>
                        {user.isActive ? '✅ Active' : '❌ Inactive'}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        color: user.verificationStatus === 'VERIFIED' ? 'green' :
                               user.verificationStatus === 'PENDING' ? 'orange' : 'red'
                      }}>
                        {user.verificationStatus}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>{user.avgRating?.toFixed(1) || 'N/A'}</td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                        <button
                          onClick={() => handleUserStatusToggle(user.id, user.isActive)}
                          disabled={actionLoading === user.id}
                          style={{
                            padding: '4px 8px',
                            border: 'none',
                            borderRadius: '3px',
                            fontSize: '12px',
                            cursor: 'pointer',
                            backgroundColor: user.isActive ? '#f44336' : '#4CAF50',
                            color: 'white'
                          }}
                        >
                          {user.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        {user.verificationStatus !== 'VERIFIED' && (
                          <button
                            onClick={() => handleUserVerification(user.id, 'VERIFIED')}
                            disabled={actionLoading === user.id}
                            style={{
                              padding: '4px 8px',
                              border: 'none',
                              borderRadius: '3px',
                              fontSize: '12px',
                              cursor: 'pointer',
                              backgroundColor: '#4CAF50',
                              color: 'white'
                            }}
                          >
                            Verify
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          disabled={actionLoading === user.id}
                          style={{
                            padding: '4px 8px',
                            border: 'none',
                            borderRadius: '3px',
                            fontSize: '12px',
                            cursor: 'pointer',
                            backgroundColor: '#f44336',
                            color: 'white'
                          }}
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
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <button
              onClick={() => { setUserPage(p => Math.max(0, p - 1)); loadUsers(Math.max(0, userPage - 1)); }}
              disabled={userPage === 0}
              style={{ padding: '8px 16px', margin: '0 5px', border: 'none', borderRadius: '4px', backgroundColor: userPage === 0 ? '#ccc' : '#4CAF50', color: 'white', cursor: userPage === 0 ? 'not-allowed' : 'pointer' }}
            >
              Previous
            </button>
            <span style={{ margin: '0 15px', fontWeight: 'bold' }}>Page {userPage + 1}</span>
            <button
              onClick={() => { setUserPage(p => p + 1); loadUsers(userPage + 1); }}
              disabled={users.length < pageSize}
              style={{ padding: '8px 16px', margin: '0 5px', border: 'none', borderRadius: '4px', backgroundColor: users.length < pageSize ? '#ccc' : '#4CAF50', color: 'white', cursor: users.length < pageSize ? 'not-allowed' : 'pointer' }}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {activeTab === 'trips' && (
        <div>
          <h2 style={{ marginBottom: '20px' }}>🚗 Trip Management</h2>
          <div style={{ backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f5f5f5' }}>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>ID</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Route</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Driver</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Departure</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Price</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Seats</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Status</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {trips.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                      📭 No trips found in database. Check console for debugging info.
                    </td>
                  </tr>
                ) : (
                  trips.map((trip) => (
                    <tr key={trip.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '12px' }}>{trip.id}</td>
                      <td style={{ padding: '12px' }}>{trip.fromLocation} → {trip.toLocation}</td>
                      <td style={{ padding: '12px' }}>{trip.driverName}</td>
                      <td style={{ padding: '12px' }}>{new Date(trip.departureTime).toLocaleString()}</td>
                      <td style={{ padding: '12px' }}>₹{trip.pricePerSeat}</td>
                      <td style={{ padding: '12px' }}>{trip.availableSeats}/{trip.totalSeats}</td>
                      <td style={{ padding: '12px' }}>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          backgroundColor:
                            trip.status === 'SCHEDULED' ? '#4CAF50' :
                            trip.status === 'ONGOING' ? '#FF9800' :
                            trip.status === 'COMPLETED' ? '#2196F3' : '#f44336',
                          color: 'white'
                        }}>
                          {trip.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <button
                          onClick={() => handleDeleteTrip(trip.id)}
                          disabled={actionLoading === trip.id}
                          style={{
                            padding: '4px 8px',
                            border: 'none',
                            borderRadius: '3px',
                            fontSize: '12px',
                            cursor: 'pointer',
                            backgroundColor: '#f44336',
                            color: 'white'
                          }}
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
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <button
              onClick={() => { setTripPage(p => Math.max(0, p - 1)); loadTrips(Math.max(0, tripPage - 1)); }}
              disabled={tripPage === 0}
              style={{ padding: '8px 16px', margin: '0 5px', border: 'none', borderRadius: '4px', backgroundColor: tripPage === 0 ? '#ccc' : '#4CAF50', color: 'white', cursor: tripPage === 0 ? 'not-allowed' : 'pointer' }}
            >
              Previous
            </button>
            <span style={{ margin: '0 15px', fontWeight: 'bold' }}>Page {tripPage + 1}</span>
            <button
              onClick={() => { setTripPage(p => p + 1); loadTrips(tripPage + 1); }}
              disabled={trips.length < pageSize}
              style={{ padding: '8px 16px', margin: '0 5px', border: 'none', borderRadius: '4px', backgroundColor: trips.length < pageSize ? '#ccc' : '#4CAF50', color: 'white', cursor: trips.length < pageSize ? 'not-allowed' : 'pointer' }}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {activeTab === 'messages' && (
        <div>
          <h2 style={{ marginBottom: '20px' }}>💬 Contact Messages</h2>
          
          {/* Message Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '20px' }}>
            <StatCard title="New" value={messageStats.new || 0} color="#2196F3" icon="🆕" />
            <StatCard title="In Progress" value={messageStats.inProgress || 0} color="#FF9800" icon="⏳" />
            <StatCard title="Resolved" value={messageStats.resolved || 0} color="#4CAF50" icon="✅" />
            <StatCard title="Closed" value={messageStats.closed || 0} color="#9E9E9E" icon="🔒" />
          </div>

          <div style={{ backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f5f5f5' }}>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>ID</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Name</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Email</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Subject</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Message</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Status</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Date</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {messages.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                      💭 No messages found.
                    </td>
                  </tr>
                ) : (
                  messages.map((message) => (
                    <tr key={message.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '12px' }}>{message.id}</td>
                      <td style={{ padding: '12px' }}>{message.name}</td>
                      <td style={{ padding: '12px' }}>{message.email}</td>
                      <td style={{ padding: '12px' }}>{message.subject}</td>
                      <td style={{ padding: '12px', maxWidth: '200px' }}>
                        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={message.message}>
                          {message.message}
                        </div>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <select
                          value={message.status}
                          onChange={(e) => handleMessageStatusUpdate(message.id, e.target.value)}
                          disabled={actionLoading === message.id}
                          style={{
                            padding: '4px 8px',
                            borderRadius: '4px',
                            border: '1px solid #ccc',
                            backgroundColor:
                              message.status === 'NEW' ? '#e3f2fd' :
                              message.status === 'IN_PROGRESS' ? '#fff3e0' :
                              message.status === 'RESOLVED' ? '#e8f5e8' : '#f5f5f5'
                          }}
                        >
                          <option value="NEW">New</option>
                          <option value="IN_PROGRESS">In Progress</option>
                          <option value="RESOLVED">Resolved</option>
                          <option value="CLOSED">Closed</option>
                        </select>
                      </td>
                      <td style={{ padding: '12px' }}>{new Date(message.createdAt).toLocaleDateString()}</td>
                      <td style={{ padding: '12px' }}>
                        <button
                          onClick={() => handleDeleteMessage(message.id)}
                          disabled={actionLoading === message.id}
                          style={{
                            padding: '4px 8px',
                            border: 'none',
                            borderRadius: '3px',
                            fontSize: '12px',
                            cursor: 'pointer',
                            backgroundColor: '#f44336',
                            color: 'white'
                          }}
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
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <button
              onClick={() => { setMessagePage(p => Math.max(0, p - 1)); loadMessages(Math.max(0, messagePage - 1)); }}
              disabled={messagePage === 0}
              style={{ padding: '8px 16px', margin: '0 5px', border: 'none', borderRadius: '4px', backgroundColor: messagePage === 0 ? '#ccc' : '#4CAF50', color: 'white', cursor: messagePage === 0 ? 'not-allowed' : 'pointer' }}
            >
              Previous
            </button>
            <span style={{ margin: '0 15px', fontWeight: 'bold' }}>Page {messagePage + 1}</span>
            <button
              onClick={() => { setMessagePage(p => p + 1); loadMessages(messagePage + 1); }}
              disabled={messages.length < pageSize}
              style={{ padding: '8px 16px', margin: '0 5px', border: 'none', borderRadius: '4px', backgroundColor: messages.length < pageSize ? '#ccc' : '#4CAF50', color: 'white', cursor: messages.length < pageSize ? 'not-allowed' : 'pointer' }}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {activeTab === 'notifications' && (
        <div>
          <h2 style={{ marginBottom: '20px' }}>🔔 Create Notification</h2>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '20px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            maxWidth: '600px'
          }}>
            <form onSubmit={handleSendNotification}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Notification Title
                </label>
                <input
                  type="text"
                  value={notificationTitle}
                  onChange={(e) => setNotificationTitle(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '4px',
                    border: '1px solid #ccc'
                  }}
                  placeholder="Enter title"
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Notification Message
                </label>
                <textarea
                  value={notificationMessage}
                  onChange={(e) => setNotificationMessage(e.target.value)}
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                    resize: 'vertical'
                  }}
                  placeholder="Enter detailed message"
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Target Audience
                </label>
                <select
                  value={notificationTarget}
                  onChange={(e) => setNotificationTarget(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '4px',
                    border: '1px solid #ccc'
                  }}
                >
                  <option value="ALL">All Users</option>
                  <option value="DRIVER">Drivers</option>
                  <option value="PASSENGER">Passengers</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={notificationSubmitting}
                style={{
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '4px',
                  backgroundColor: notificationSubmitting ? '#ccc' : '#4CAF50',
                  color: 'white',
                  cursor: notificationSubmitting ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold'
                }}
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