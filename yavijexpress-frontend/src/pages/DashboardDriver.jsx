import { useEffect, useState } from "react";
import api from "../api/axiosClient";
import { useAuth } from "../context/AuthContext.jsx";

const DashboardDriver = () => {
  const { user } = useAuth();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // Vehicle management state
  const [vehicles, setVehicles] = useState([]);
  const [vehicleForm, setVehicleForm] = useState({
    vehicleNumber: "",
    model: "",
    color: "",
    totalSeats: "",
    insuranceNumber: "",
    insuranceExpiry: "",
    vehicleType: "CAR",
  });
  const [vehicleSaving, setVehicleSaving] = useState(false);
  const [vehicleError, setVehicleError] = useState("");
  const [editingVehicleId, setEditingVehicleId] = useState(null);

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

  const loadVehicles = async (driverId) => {
    try {
      setVehicleError("");
      const res = await api.get(`/api/vehicles/user/${driverId}`);
      const data = res.data;
      const list = Array.isArray(data) ? data : data?.data || [];
      setVehicles(list);
    } catch (e) {
      setVehicleError(e.response?.data?.message || "Failed to load vehicles");
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
    loadVehicles(user.id);
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleVehicleChange = (e) => {
    const { name, value } = e.target;
    setVehicleForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleVehicleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.id) return;
    try {
      setVehicleSaving(true);
      setVehicleError("");
      const payload = {
        vehicleNumber: vehicleForm.vehicleNumber,
        model: vehicleForm.model,
        color: vehicleForm.color,
        totalSeats: Number(vehicleForm.totalSeats),
        insuranceNumber: vehicleForm.insuranceNumber,
        insuranceExpiry: vehicleForm.insuranceExpiry || null,
        vehicleType: vehicleForm.vehicleType,
      };

      if (editingVehicleId) {
        await api.put(`/api/vehicles/${editingVehicleId}`, payload);
      } else {
        await api.post("/api/vehicles", payload);
      }

      setVehicleForm({
        vehicleNumber: "",
        model: "",
        color: "",
        totalSeats: "",
        insuranceNumber: "",
        insuranceExpiry: "",
        vehicleType: "CAR",
      });
      setEditingVehicleId(null);

      await loadVehicles(user.id);
    } catch (e) {
      setVehicleError(e.response?.data?.message || "Failed to save vehicle");
    } finally {
      setVehicleSaving(false);
    }
  };

  const handleVehicleEdit = (vehicle) => {
    setVehicleForm({
      vehicleNumber: vehicle.vehicleNumber || "",
      model: vehicle.model || "",
      color: vehicle.color || "",
      totalSeats: vehicle.totalSeats?.toString() || "",
      insuranceNumber: vehicle.insuranceNumber || "",
      // Backend sends ISO; keep as-is for datetime-local input
      insuranceExpiry: vehicle.insuranceExpiry || "",
      vehicleType: vehicle.vehicleType || "CAR",
    });
    setEditingVehicleId(vehicle.id);
  };

  const handleVehicleDelete = async (vehicleId) => {
    if (!window.confirm("Delete this vehicle?")) return;
    try {
      setVehicleError("");
      await api.delete(`/api/vehicles/${vehicleId}`);
      // If we were editing this one, reset the form
      if (editingVehicleId === vehicleId) {
        setVehicleForm({
          vehicleNumber: "",
          model: "",
          color: "",
          totalSeats: "",
          insuranceNumber: "",
          insuranceExpiry: "",
          vehicleType: "CAR",
        });
        setEditingVehicleId(null);
      }
      await loadVehicles(user.id);
    } catch (e) {
      setVehicleError(e.response?.data?.message || "Failed to delete vehicle");
    }
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
        <h2>My Vehicle</h2>
        {vehicleError && <p style={{ color: "red" }}>{vehicleError}</p>}
        <form onSubmit={handleVehicleSubmit} style={{ marginBottom: 16 }}>
          <div style={{ marginBottom: 8 }}>
            <label>Vehicle Number:&nbsp;</label>
            <input
              name="vehicleNumber"
              value={vehicleForm.vehicleNumber}
              onChange={handleVehicleChange}
              required
            />
          </div>
          <div style={{ marginBottom: 8 }}>
            <label>Model:&nbsp;</label>
            <input
              name="model"
              value={vehicleForm.model}
              onChange={handleVehicleChange}
              required
            />
          </div>
          <div style={{ marginBottom: 8 }}>
            <label>Color:&nbsp;</label>
            <input
              name="color"
              value={vehicleForm.color}
              onChange={handleVehicleChange}
              required
            />
          </div>
          <div style={{ marginBottom: 8 }}>
            <label>Total Seats:&nbsp;</label>
            <input
              type="number"
              name="totalSeats"
              value={vehicleForm.totalSeats}
              onChange={handleVehicleChange}
              required
            />
          </div>
          <div style={{ marginBottom: 8 }}>
            <label>Insurance Number:&nbsp;</label>
            <input
              name="insuranceNumber"
              value={vehicleForm.insuranceNumber}
              onChange={handleVehicleChange}
              required
            />
          </div>
          <div style={{ marginBottom: 8 }}>
            <label>Insurance Expiry:&nbsp;</label>
            <input
              type="datetime-local"
              name="insuranceExpiry"
              value={vehicleForm.insuranceExpiry}
              onChange={handleVehicleChange}
            />
          </div>
          <div style={{ marginBottom: 8 }}>
            <label>Vehicle Type:&nbsp;</label>
            <select
              name="vehicleType"
              value={vehicleForm.vehicleType}
              onChange={handleVehicleChange}
              required
            >
              <option value="CAR">Car</option>
              <option value="BIKE">Bike</option>
              <option value="AUTO">Auto</option>
              <option value="SUV">SUV</option>
              <option value="VAN">Van</option>
            </select>
          </div>
          <button type="submit" disabled={vehicleSaving}>
            {vehicleSaving
              ? editingVehicleId
                ? "Updating..."
                : "Saving..."
              : editingVehicleId
              ? "Update Vehicle"
              : "Save Vehicle"}
          </button>
        </form>

        {Array.isArray(vehicles) && vehicles.length > 0 && (
          <div style={{ marginTop: 8 }}>
            <h3>Your Registered Vehicles</h3>
            <ul>
              {Array.isArray(vehicles) && vehicles.map((v) => (
                <li key={v.id}>
                  #{v.id} - {v.vehicleNumber} ({v.model}, {v.color}) - Seats: {v.totalSeats} - Type: {v.vehicleType}
                  <div style={{ marginTop: 4 }}>
                    <button
                      type="button"
                      onClick={() => handleVehicleEdit(v)}
                      style={{ marginRight: 8 }}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleVehicleDelete(v.id)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

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
            <label>Vehicle:&nbsp;</label>
            <select
              name="vehicleId"
              value={form.vehicleId}
              onChange={handleChange}
              required
            >
              <option value="">Select a vehicle</option>
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  #{v.id} - {v.vehicleNumber} ({v.model})
                </option>
              ))}
            </select>
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
