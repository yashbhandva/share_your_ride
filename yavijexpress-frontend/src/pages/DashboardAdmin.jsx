import { useEffect, useState } from "react";
import api from "../api/axiosClient";

const DashboardAdmin = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userActionId, setUserActionId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const [statsRes, usersRes] = await Promise.all([
          api.get("/api/admin/dashboard/stats"),
          api.get("/api/admin/users"),
        ]);

        setStats(statsRes.data);
        setUsers(usersRes.data || []);
      } catch (e) {
        setError(e.response?.data?.message || "Failed to load admin data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleToggleUserActive = async (userId, currentActive) => {
    try {
      setUserActionId(userId);
      setError("");
      await api.post(`/api/admin/users/${userId}/status`, null, {
        params: { isActive: !currentActive },
      });
      const [statsRes, usersRes] = await Promise.all([
        api.get("/api/admin/dashboard/stats"),
        api.get("/api/admin/users"),
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data || []);
    } catch (e) {
      setError(e.response?.data?.message || "Failed to update user status");
    } finally {
      setUserActionId(null);
    }
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {stats && (
        <section style={{ marginBottom: 24 }}>
          <h2>Platform Stats</h2>
          <ul>
            <li>Total Users: {stats.totalUsers}</li>
            <li>Total Trips: {stats.totalTrips}</li>
            <li>Total Revenue: ₹{stats.totalRevenue}</li>
            <li>Active Drivers: {stats.activeDrivers}</li>
          </ul>
        </section>
      )}

      <section>
        <h2>Users</h2>
        {users.length === 0 && !loading && <p>No users found.</p>}
        {users.length > 0 && (
          <table border="1" cellPadding="6" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>{u.isActive ? "Yes" : "No"}</td>
                  <td>
                    <button
                      onClick={() => handleToggleUserActive(u.id, u.isActive)}
                      disabled={userActionId === u.id}
                    >
                      {userActionId === u.id
                        ? "Updating..."
                        : u.isActive
                        ? "Deactivate"
                        : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
};

export default DashboardAdmin;
