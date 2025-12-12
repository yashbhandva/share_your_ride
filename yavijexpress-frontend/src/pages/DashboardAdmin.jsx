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

  const loadDashboardStats = async () => {
    try {
      const res = await api.get('/api/admin/dashboard/stats');
      setStats(res.data?.data || {});
    } catch (e) {
      setError('Failed to load dashboard stats');
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

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([loadDashboardStats(), loadUsers(), loadTrips()]);
      setLoading(false);
    };
    loadData();
  }, []);

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
    </div>
  );
};

export default DashboardAdmin;
