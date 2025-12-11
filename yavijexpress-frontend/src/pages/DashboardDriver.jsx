import { useEffect, useState } from "react";
import api from "../api/axiosClient";
import { useAuth } from "../context/AuthContext.jsx";

const DashboardDriver = () => {
  const { user } = useAuth();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const [form, setForm] = useState({
    fromLocation: "",
    toLocation: "",
    departureTime: "",
    pricePerSeat: "",
    totalSeats: "",
    vehicleId: "",
    notes: "",
  });
  const [creating, setCreating] = useState(false);

  const loadTrips = async (driverId) => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get(`/api/trips/driver/${driverId}`);
      setTrips(res.data || []);
    } catch (e) {
      setError(e.response?.data?.message || "Failed to load driver trips");
    } finally {
      setLoading(false);
    }
  };

  const handleStartTrip = async (tripId) => {
    if (!user?.id) return;
    try {
      setActionLoadingId(tripId);
      setError("");
      await api.post(`/api/trips/${tripId}/start`, {
        soberDeclaration: true,
        otp: "123456", // TODO: replace with real OTP flow/UI if implemented
      });
      await loadTrips(user.id);
    } catch (e) {
      setError(e.response?.data?.message || "Failed to start trip");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleCompleteTrip = async (tripId) => {
    if (!user?.id) return;
    try {
      setActionLoadingId(tripId);
      setError("");
      await api.post(`/api/trips/${tripId}/complete`);
      await loadTrips(user.id);
    } catch (e) {
      setError(e.response?.data?.message || "Failed to complete trip");
    } finally {
      setActionLoadingId(null);
    }
  };

  useEffect(() => {
    if (!user?.id) return;
    loadTrips(user.id);
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateTrip = async (e) => {
    e.preventDefault();
    if (!user?.id) return;
    try {
      setCreating(true);
      setError("");

      // departureTime from input datetime-local to ISO string
      const departureIso = form.departureTime
        ? new Date(form.departureTime).toISOString()
        : null;

      await api.post("/api/trips", {
        fromLocation: form.fromLocation,
        toLocation: form.toLocation,
        departureTime: departureIso,
        pricePerSeat: Number(form.pricePerSeat),
        totalSeats: Number(form.totalSeats),
        vehicleId: Number(form.vehicleId),
        notes: form.notes || null,
        routePolyline: null,
        distanceKm: null,
        isFlexible: false,
      });

      setForm({
        fromLocation: "",
        toLocation: "",
        departureTime: "",
        pricePerSeat: "",
        totalSeats: "",
        vehicleId: "",
        notes: "",
      });

      await loadTrips(user.id);
    } catch (e) {
      setError(e.response?.data?.message || "Failed to create trip");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div>
      <h1>Driver Dashboard</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <section style={{ marginBottom: 24 }}>
        <h2>Create Trip</h2>
        <form onSubmit={handleCreateTrip}>
          <div style={{ marginBottom: 8 }}>
            <label>From:&nbsp;</label>
            <input
              name="fromLocation"
              value={form.fromLocation}
              onChange={handleChange}
              required
            />
          </div>
          <div style={{ marginBottom: 8 }}>
            <label>To:&nbsp;</label>
            <input
              name="toLocation"
              value={form.toLocation}
              onChange={handleChange}
              required
            />
          </div>
          <div style={{ marginBottom: 8 }}>
            <label>Departure:&nbsp;</label>
            <input
              type="datetime-local"
              name="departureTime"
              value={form.departureTime}
              onChange={handleChange}
              required
            />
          </div>
          <div style={{ marginBottom: 8 }}>
            <label>Price per seat (₹):&nbsp;</label>
            <input
              type="number"
              name="pricePerSeat"
              value={form.pricePerSeat}
              onChange={handleChange}
              required
            />
          </div>
          <div style={{ marginBottom: 8 }}>
            <label>Total seats:&nbsp;</label>
            <input
              type="number"
              name="totalSeats"
              value={form.totalSeats}
              onChange={handleChange}
              required
            />
          </div>
          <div style={{ marginBottom: 8 }}>
            <label>Vehicle ID:&nbsp;</label>
            <input
              type="number"
              name="vehicleId"
              value={form.vehicleId}
              onChange={handleChange}
              required
            />
          </div>
          <div style={{ marginBottom: 8 }}>
            <label>Notes:&nbsp;</label>
            <input
              name="notes"
              value={form.notes}
              onChange={handleChange}
            />
          </div>
          <button type="submit" disabled={creating}>
            {creating ? "Creating..." : "Create Trip"}
          </button>
        </form>
      </section>

      <section>
        <h2>Your Trips</h2>
        {loading && <p>Loading trips...</p>}
        {trips.length === 0 && !loading && <p>No trips found.</p>}
        {trips.length > 0 && (
          <ul>
            {trips.map((t) => (
              <li key={t.id}>
                {t.fromLocation} → {t.toLocation} on {t.departureTime} | Seats:
                {" "}
                {t.availableSeats}/{t.totalSeats} | Status: {t.status}
                <div style={{ marginTop: 4 }}>
                  <button
                    onClick={() => handleStartTrip(t.id)}
                    disabled={
                      actionLoadingId === t.id || t.status !== "SCHEDULED"
                    }
                    style={{ marginRight: 8 }}
                  >
                    {actionLoadingId === t.id && t.status === "SCHEDULED"
                      ? "Starting..."
                      : "Start"}
                  </button>
                  <button
                    onClick={() => handleCompleteTrip(t.id)}
                    disabled={
                      actionLoadingId === t.id || t.status !== "ONGOING"
                    }
                  >
                    {actionLoadingId === t.id && t.status === "ONGOING"
                      ? "Completing..."
                      : "Complete"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default DashboardDriver;
