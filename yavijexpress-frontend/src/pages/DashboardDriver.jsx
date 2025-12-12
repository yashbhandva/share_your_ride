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
      const message = res.data?.data?.message || "✅ OTP Verified Successfully! Trip can now start.";
      setSuccess(message);
      setOtpForm({ bookingId: null, otp: "" });
      setTimeout(() => setSuccess(""), 5000);
      
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

  return (
    <div>
      <h1>Driver Dashboard</h1>
      <div style={{ marginBottom: "20px", padding: "10px", backgroundColor: "#f5f5f5", borderRadius: "5px" }}>
        <h3>Statistics</h3>
        <p><strong>Total Trips:</strong> {Array.isArray(trips) ? trips.length : 0}</p>
        <p><strong>Active Trips:</strong> {Array.isArray(trips) ? trips.filter(t => t.isActive).length : 0}</p>
        <p><strong>Completed Trips:</strong> {Array.isArray(trips) ? trips.filter(t => t.status === 'COMPLETED').length : 0}</p>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      <section style={{ marginBottom: 24 }}>
        <h2>Booking Requests</h2>
        <button 
          onClick={async () => {
            try {
              const res = await api.get('/api/bookings/test');
              console.log('Test response:', res.data);
              setSuccess('API Test: ' + JSON.stringify(res.data));
            } catch (e) {
              console.error('Test failed:', e);
              setError('API Test Failed: ' + e.message);
            }
          }}
          style={{marginBottom: '10px', padding: '5px 10px'}}
        >
          Test API Connection
        </button>
        {bookingLoading && <p>Loading bookings...</p>}
        {bookings.length === 0 && !bookingLoading && <p>No booking requests.</p>}
        {bookings.length > 0 && (
          <div>
            {bookings.map((booking) => (
              <div key={booking.id} style={{ border: "1px solid #ddd", padding: "15px", marginBottom: "15px", borderRadius: "5px" }}>
                <h4>Booking #{booking.id}</h4>
                <p><strong>Passenger:</strong> {booking.passengerName}</p>
                <p><strong>Trip:</strong> {booking.tripFrom} → {booking.tripTo}</p>
                <p><strong>Departure:</strong> {new Date(booking.departureTime).toLocaleString()}</p>
                <p><strong>Seats:</strong> {booking.seatsBooked}</p>
                <p><strong>Amount:</strong> ₹{booking.totalAmount}</p>
                <p><strong>Status:</strong> <span style={{color: booking.status === 'CONFIRMED' ? 'green' : booking.status === 'PENDING' ? 'orange' : 'red'}}>{booking.status}</span></p>
                {booking.specialRequests && <p><strong>Special Requests:</strong> {booking.specialRequests}</p>}
                
                {booking.status === 'PENDING' && (
                  <button
                    onClick={() => handleConfirmBooking(booking.id)}
                    style={{ backgroundColor: "#4CAF50", color: "white", border: "none", padding: "8px 16px", borderRadius: "3px" }}
                  >
                    Approve Booking
                  </button>
                )}
                
                {booking.status === 'CONFIRMED' && (
                  <div style={{backgroundColor: '#e8f5e8', padding: '10px', marginTop: '10px', borderRadius: '5px'}}>
                    <h5>🔐 OTP Verification Required</h5>
                    <p style={{fontSize: '14px', margin: '5px 0'}}>Ask passenger for their 6-digit OTP</p>
                    <form onSubmit={handleVerifyOtp} style={{marginTop: '10px'}}>
                      <input
                        type="text"
                        placeholder="Enter 6-digit OTP from passenger"
                        value={otpForm.bookingId === booking.id ? otpForm.otp : ""}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, ''); // Only numbers
                          setOtpForm({bookingId: booking.id, otp: value});
                        }}
                        style={{marginRight: '8px', padding: '8px', fontSize: '16px', width: '200px'}}
                        maxLength="6"
                        autoComplete="off"
                      />
                      <button
                        type="submit"
                        disabled={otpVerifying || !otpForm.otp || otpForm.otp.length < 4}
                        style={{ 
                          backgroundColor: otpVerifying ? "#ccc" : "#2196F3", 
                          color: "white", 
                          border: "none", 
                          padding: "8px 16px", 
                          borderRadius: "3px", 
                          fontSize: '14px',
                          cursor: otpVerifying ? "not-allowed" : "pointer"
                        }}
                      >
                        {otpVerifying ? "Verifying..." : "Verify & Start Trip"}
                      </button>
                    </form>
                    <div style={{fontSize: '12px', color: '#666', marginTop: '5px'}}>
                      Debug: BookingId={booking.id}, OTP='{otpForm.bookingId === booking.id ? otpForm.otp : 'none'}'
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

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
        {success && <div style={{ color: "green", marginBottom: "10px" }}>{success}</div>}
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
            {trips.map((t) => {
              console.log('Trip data:', t);
              return (
              <li key={t.id}>
                {t.fromLocation} → {t.toLocation} on {t.departureTime} | Seats:
                {" "}
                {t.availableSeats}/{t.totalSeats} | Status: {t.status} | 
                <span style={{ color: t.isActive ? "green" : "red" }}>
                  {t.isActive ? "Active" : "Disabled"}
                </span>
                <br />
                <small>Debug: Status={t.status}, Active={String(t.isActive)}</small>
                <div style={{ marginTop: 4 }}>
                  <button
                    onClick={() => handleStartTrip(t.id)}
                    disabled={
                      actionLoadingId === t.id || t.status !== "SCHEDULED" || t.isActive === false
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
                      actionLoadingId === t.id || t.status !== "ONGOING" || t.isActive === false
                    }
                  >
                    {actionLoadingId === t.id && t.status === "ONGOING"
                      ? "Completing..."
                      : "Complete"}
                  </button>
                  <button
                    onClick={() => handleDeleteTrip(t.id)}
                    disabled={actionLoadingId === t.id}
                    style={{ 
                      marginLeft: 8, 
                      backgroundColor: "#f44336",
                      color: "white"
                    }}
                  >
                    {actionLoadingId === t.id ? "Deleting..." : "Delete"}
                  </button>
                  {(t.status === "COMPLETED" || t.status === "CANCELLED") && (
                    <button
                      onClick={() => handleRestartTrip(t.id)}
                      disabled={actionLoadingId === t.id}
                      style={{ 
                        marginLeft: 8, 
                        backgroundColor: "#4CAF50",
                        color: "white"
                      }}
                    >
                      {actionLoadingId === t.id ? "Restarting..." : "Restart"}
                    </button>
                  )}
                </div>
              </li>
            );
            })}
          </ul>
        )}
      </section>
    </div>
  );
};

export default DashboardDriver;
