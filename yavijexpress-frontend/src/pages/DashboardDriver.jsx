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
  const [success, setSuccess] = useState("");
  const [bookings, setBookings] = useState([]);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [otpForm, setOtpForm] = useState({ bookingId: null, otp: "" });
  const [otpVerifying, setOtpVerifying] = useState(false);

  const loadTrips = async (driverId) => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get(`/api/trips/driver/${driverId}`);
      // Debug: log trips response
      if (res.data?.data?.length === 0 || (Array.isArray(res.data) && res.data.length === 0)) {
        console.log('No trips found for driver:', driverId);
      }
      const trips = res.data?.data || res.data || [];
      setTrips(trips);
      console.log('Loaded', trips.length, 'trips for driver');
    } catch (e) {
      console.error('Failed to load trips:', e);
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

  const loadBookings = async (driverId) => {
    try {
      setBookingLoading(true);
      const res = await api.get(`/api/bookings/driver/${driverId}`);
      const data = res.data?.data || res.data || [];
      setBookings(data);
    } catch (e) {
      setError(e.response?.data?.message || "Failed to load bookings");
    } finally {
      setBookingLoading(false);
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

  const handleDeleteTrip = async (tripId) => {
    if (!confirm('Are you sure you want to delete this trip?')) return;
    try {
      setActionLoadingId(tripId);
      setError("");
      await api.delete(`/api/trips/${tripId}/delete`);
      await loadTrips(user.id);
    } catch (e) {
      setError(e.response?.data?.message || "Failed to delete trip");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleRestartTrip = async (tripId) => {
    try {
      setActionLoadingId(tripId);
      setError("");
      await api.put(`/api/trips/${tripId}/restart`);
      await loadTrips(user.id);
    } catch (e) {
      setError(e.response?.data?.message || "Failed to restart trip");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleConfirmBooking = async (bookingId) => {
    try {
      setError("");
      const res = await api.post(`/api/bookings/${bookingId}/confirm`);
      console.log('Confirm response:', res.data);
      setSuccess("✅ Booking confirmed! OTP sent to passenger.");
      setTimeout(() => setSuccess(""), 5000);
      await loadBookings(user.id);
    } catch (e) {
      setError(e.response?.data?.message || "Failed to confirm booking");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    console.log('OTP verification started:', { bookingId: otpForm.bookingId, otp: otpForm.otp });
    
    if (!otpForm.bookingId || !otpForm.otp) {
      setError("Please enter OTP");
      return;
    }
    
    try {
      setOtpVerifying(true);
      setError("");
      setSuccess("");
      
      const cleanOtp = otpForm.otp.trim();
      console.log('Sending OTP verification request...', { bookingId: otpForm.bookingId, otp: cleanOtp });
      const res = await api.post("/api/bookings/verify-otp", {
        bookingId: otpForm.bookingId,
        otp: cleanOtp
      });
      
      console.log('OTP verification response:', res.data);
      const message = res.data?.data?.message || res.data?.message || "✅ OTP Verified Successfully! Trip can now start.";
      setSuccess(message);
      setOtpForm({ bookingId: null, otp: "" });
      setTimeout(() => setSuccess(""), 8000);
      
      // Reload data
      await loadTrips(user.id);
      await loadBookings(user.id);
    } catch (e) {
      console.error('OTP verification error:', e);
      const errorMsg = e.response?.data?.data?.message || e.response?.data?.message || "❌ Invalid OTP. Please check and try again.";
      setError(errorMsg);
      setTimeout(() => setError(""), 5000);
    } finally {
      setOtpVerifying(false);
    }
  };

  useEffect(() => {
    if (!user?.id) return;
    loadTrips(user.id);
    loadVehicles(user.id);
    loadBookings(user.id);
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
      setSuccess("");

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

      setSuccess("Trip created successfully!");
      // Reload trips to update statistics
      await loadTrips(user.id);
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (e) {
      setError(e.response?.data?.message || "Failed to create trip");
    } finally {
      setCreating(false);
    }
  };

  const StatCard = ({ title, value, icon, color }) => (
    <div className="driver-stat-card">
      <div className="driver-stat-icon" style={{ color }}>{icon}</div>
      <div className="driver-stat-content">
        <h3 className="driver-stat-title">{title}</h3>
        <p className="driver-stat-value">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="driver-dashboard">
      <div className="driver-header">
        <h1 className="driver-title">🚗 Driver Dashboard</h1>
        <p className="driver-welcome">Welcome back, <span className="driver-name">{user?.name}</span>!</p>
      </div>

      <div className="alert-container">
        {error && <div className="driver-alert error-alert">{error}</div>}
        {success && <div className="driver-alert success-alert">{success}</div>}
      </div>

      {/* Statistics Section */}
      <div className="driver-stats-grid">
        <StatCard
          title="Total Trips"
          value={Array.isArray(trips) ? trips.length : 0}
          icon="📊"
          color="#2196F3"
        />
        <StatCard
          title="Active Trips"
          value={Array.isArray(trips) ? trips.filter(t => t.isActive).length : 0}
          icon="🚗"
          color="#4CAF50"
        />
        <StatCard
          title="Completed Trips"
          value={Array.isArray(trips) ? trips.filter(t => t.status === 'COMPLETED').length : 0}
          icon="✅"
          color="#FF9800"
        />
        <StatCard
          title="Vehicles"
          value={Array.isArray(vehicles) ? vehicles.length : 0}
          icon="🚙"
          color="#9C27B0"
        />
      </div>

      {/* Booking Requests Section */}
      <section className="driver-section bookings-section">
        <h2 className="section-title">
          <span className="section-icon">📋</span>
          Booking Requests
        </h2>

{/*         <button */}
{/*           onClick={async () => { */}
{/*             try { */}
{/*               const res = await api.get('/api/bookings/test'); */}
{/*               console.log('Test response:', res.data); */}
{/*               setSuccess('API Test: ' + JSON.stringify(res.data)); */}
{/*             } catch (e) { */}
{/*               console.error('Test failed:', e); */}
{/*               setError('API Test Failed: ' + e.message); */}
{/*             } */}
{/*           }} */}
{/*           className="api-test-btn" */}
{/*         > */}
{/*           🔧 Test API Connection */}
{/*         </button> */}

        {bookingLoading && (
          <div className="loading-placeholder">
            <div className="loading-spinner"></div>
            <p>Loading bookings...</p>
          </div>
        )}

        {bookings.length === 0 && !bookingLoading && (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <p className="empty-text">No booking requests yet.</p>
          </div>
        )}

        {bookings.length > 0 && (
          <div className="booking-cards">
            {bookings.map((booking) => (
              <div key={booking.id} className="booking-card">
                <div className="booking-header">
                  <h3 className="booking-id">Booking #{booking.id}</h3>
                  <span className={`booking-status booking-status-${booking.status?.toLowerCase()}`}>
                    {booking.status}
                  </span>
                </div>

                <div className="booking-details">
                  <div className="detail-row">
                    <span className="detail-label">👤 Passenger:</span>
                    <span className="detail-value">{booking.passengerName}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">📍 Route:</span>
                    <span className="detail-value">{booking.tripFrom} → {booking.tripTo}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">⏰ Departure:</span>
                    <span className="detail-value">{new Date(booking.departureTime).toLocaleString()}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">💺 Seats:</span>
                    <span className="detail-value">{booking.seatsBooked}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">💰 Amount:</span>
                    <span className="detail-value">₹{booking.totalAmount}</span>
                  </div>
                  {booking.specialRequests && (
                    <div className="detail-row">
                      <span className="detail-label">💭 Special Requests:</span>
                      <span className="detail-value">{booking.specialRequests}</span>
                    </div>
                  )}
                </div>

                {booking.status === 'PENDING' && (
                  <button
                    onClick={() => handleConfirmBooking(booking.id)}
                    className="action-btn confirm-btn"
                  >
                    ✅ Approve Booking
                  </button>
                )}

                {booking.status === 'CONFIRMED' && (
                  <div className="otp-verification">
                    <h4 className="otp-title">🔐 OTP Verification Required</h4>
                    <p className="otp-subtitle">Ask passenger for their 6-digit OTP</p>
                    <form onSubmit={handleVerifyOtp} className="otp-form">
                      <input
                        type="text"
                        placeholder="Enter 6-digit OTP from passenger"
                        value={otpForm.bookingId === booking.id ? otpForm.otp : ""}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, '');
                          setOtpForm({bookingId: booking.id, otp: value});
                        }}
                        className="otp-input"
                        maxLength="6"
                        autoComplete="off"
                      />
                      <button
                        type="submit"
                        disabled={otpVerifying || !otpForm.otp || otpForm.otp.length < 4}
                        className={`otp-submit-btn ${otpVerifying ? 'loading' : ''}`}
                      >
                        {otpVerifying ? "Verifying..." : "Verify & Start Trip"}
                      </button>
                    </form>
                    <div className="debug-info">
                      Debug: BookingId={booking.id}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Vehicle Management Section */}
      <section className="driver-section vehicles-section">
        <h2 className="section-title">
          <span className="section-icon">🚙</span>
          My Vehicle
        </h2>

        {vehicleError && <div className="vehicle-error">{vehicleError}</div>}

        <form onSubmit={handleVehicleSubmit} className="vehicle-form">
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Vehicle Number *</label>
              <input
                name="vehicleNumber"
                value={vehicleForm.vehicleNumber}
                onChange={handleVehicleChange}
                className="form-input"
                required
                placeholder="e.g., MH01AB1234"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Model *</label>
              <input
                name="model"
                value={vehicleForm.model}
                onChange={handleVehicleChange}
                className="form-input"
                required
                placeholder="e.g., Honda City"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Color *</label>
              <input
                name="color"
                value={vehicleForm.color}
                onChange={handleVehicleChange}
                className="form-input"
                required
                placeholder="e.g., Red"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Total Seats *</label>
              <input
                type="number"
                name="totalSeats"
                value={vehicleForm.totalSeats}
                onChange={handleVehicleChange}
                className="form-input"
                required
                placeholder="e.g., 4"
                min="1"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Insurance Number *</label>
              <input
                name="insuranceNumber"
                value={vehicleForm.insuranceNumber}
                onChange={handleVehicleChange}
                className="form-input"
                required
                placeholder="Insurance policy number"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Insurance Expiry</label>
              <input
                type="datetime-local"
                name="insuranceExpiry"
                value={vehicleForm.insuranceExpiry}
                onChange={handleVehicleChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Vehicle Type *</label>
              <select
                name="vehicleType"
                value={vehicleForm.vehicleType}
                onChange={handleVehicleChange}
                className="form-select"
                required
              >
                <option value="CAR">Car</option>
                <option value="BIKE">Bike</option>
                <option value="AUTO">Auto</option>
                <option value="SUV">SUV</option>
                <option value="VAN">Van</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={vehicleSaving}
            className={`submit-btn ${vehicleSaving ? 'loading' : ''}`}
          >
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
          <div className="vehicles-list">
            <h3 className="vehicles-title">Your Registered Vehicles</h3>
            <div className="vehicle-cards">
              {vehicles.map((v) => (
                <div key={v.id} className="vehicle-card">
                  <div className="vehicle-info">
                    <h4 className="vehicle-number">
                      <span className="vehicle-icon">🚙</span>
                      {v.vehicleNumber}
                    </h4>
                    <div className="vehicle-details">
                      <span className="vehicle-detail">{v.model}</span>
                      <span className="vehicle-detail">{v.color}</span>
                      <span className="vehicle-detail">Seats: {v.totalSeats}</span>
                      <span className="vehicle-detail badge vehicle-type">{v.vehicleType}</span>
                    </div>
                    <div className="vehicle-actions">
                      <button
                        onClick={() => handleVehicleEdit(v)}
                        className="action-btn edit-btn"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleVehicleDelete(v.id)}
                        className="action-btn delete-btn"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Create Trip Section */}
      <section className="driver-section create-trip-section">
        <h2 className="section-title">
          <span className="section-icon">➕</span>
          Create New Trip
        </h2>

        <form onSubmit={handleCreateTrip} className="trip-form">
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">From Location *</label>
              <input
                name="fromLocation"
                value={form.fromLocation}
                onChange={handleChange}
                className="form-input"
                required
                placeholder="Starting point"
              />
            </div>

            <div className="form-group">
              <label className="form-label">To Location *</label>
              <input
                name="toLocation"
                value={form.toLocation}
                onChange={handleChange}
                className="form-input"
                required
                placeholder="Destination"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Departure Time *</label>
              <input
                type="datetime-local"
                name="departureTime"
                value={form.departureTime}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Price per seat (₹) *</label>
              <input
                type="number"
                name="pricePerSeat"
                value={form.pricePerSeat}
                onChange={handleChange}
                className="form-input"
                required
                placeholder="e.g., 150"
                min="1"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Total seats *</label>
              <input
                type="number"
                name="totalSeats"
                value={form.totalSeats}
                onChange={handleChange}
                className="form-input"
                required
                placeholder="e.g., 4"
                min="1"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Select Vehicle *</label>
              <select
                name="vehicleId"
                value={form.vehicleId}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="">Choose a vehicle</option>
                {vehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    #{v.id} - {v.vehicleNumber} ({v.model})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group full-width">
              <label className="form-label">Additional Notes</label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                className="form-textarea"
                placeholder="Any special instructions or details..."
                rows="3"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={creating}
            className={`submit-btn create-btn ${creating ? 'loading' : ''}`}
          >
            {creating ? "Creating Trip..." : "🚀 Create Trip"}
          </button>
        </form>
      </section>

      {/* Trips List Section */}
      <section className="driver-section trips-section">
        <h2 className="section-title">
          <span className="section-icon">📋</span>
          Your Trips
        </h2>

        {loading ? (
          <div className="loading-placeholder">
            <div className="loading-spinner"></div>
            <p>Loading trips...</p>
          </div>
        ) : trips.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🚗</div>
            <p className="empty-text">No trips found. Create your first trip!</p>
          </div>
        ) : (
          <div className="trip-cards">
            {trips.map((t) => (
              <div key={t.id} className="trip-card">
                <div className="trip-header">
                  <h3 className="trip-route">
                    <span className="trip-from">{t.fromLocation}</span>
                    <span className="trip-arrow">→</span>
                    <span className="trip-to">{t.toLocation}</span>
                  </h3>
                  <div className="trip-status-container">
                    <span className={`trip-status trip-status-${t.status?.toLowerCase()}`}>
                      {t.status}
                    </span>
                    <span className={`trip-active ${t.isActive ? 'active' : 'inactive'}`}>
                      {t.isActive ? "🟢 Active" : "🔴 Disabled"}
                    </span>
                  </div>
                </div>

                <div className="trip-details">
                  <div className="trip-detail">
                    <span className="detail-icon">⏰</span>
                    <span className="detail-label">Departure:</span>
                    <span className="detail-value">{new Date(t.departureTime).toLocaleString()}</span>
                  </div>
                  <div className="trip-detail">
                    <span className="detail-icon">💺</span>
                    <span className="detail-label">Seats:</span>
                    <span className="detail-value">{t.availableSeats}/{t.totalSeats}</span>
                  </div>
                  <div className="trip-detail">
                    <span className="detail-icon">💰</span>
                    <span className="detail-label">Price:</span>
                    <span className="detail-value">₹{t.pricePerSeat}</span>
                  </div>
                </div>

                <div className="trip-actions">
                  <button
                    onClick={() => handleStartTrip(t.id)}
                    disabled={
                      actionLoadingId === t.id || t.status !== "SCHEDULED" || t.isActive === false
                    }
                    className={`action-btn start-btn ${actionLoadingId === t.id ? 'loading' : ''}`}
                  >
                    {actionLoadingId === t.id && t.status === "SCHEDULED"
                      ? "⏳ Starting..."
                      : "▶️ Start Trip"}
                  </button>
                  <button
                    onClick={() => handleCompleteTrip(t.id)}
                    disabled={
                      actionLoadingId === t.id || t.status !== "ONGOING" || t.isActive === false
                    }
                    className={`action-btn complete-btn ${actionLoadingId === t.id ? 'loading' : ''}`}
                  >
                    {actionLoadingId === t.id && t.status === "ONGOING"
                      ? "⏳ Completing..."
                      : "✅ Complete"}
                  </button>
                  <button
                    onClick={() => handleDeleteTrip(t.id)}
                    disabled={actionLoadingId === t.id}
                    className={`action-btn delete-btn ${actionLoadingId === t.id ? 'loading' : ''}`}
                  >
                    {actionLoadingId === t.id ? "🗑️ Deleting..." : "🗑️ Delete"}
                  </button>
                  {(t.status === "COMPLETED" || t.status === "CANCELLED") && (
                    <button
                      onClick={() => handleRestartTrip(t.id)}
                      disabled={actionLoadingId === t.id}
                      className={`action-btn restart-btn ${actionLoadingId === t.id ? 'loading' : ''}`}
                    >
                      {actionLoadingId === t.id ? "⏳ Restarting..." : "🔄 Restart"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default DashboardDriver;