import { useState } from "react";
import api from "../api/axiosClient";

const BookingForm = ({ trip, onBookingComplete }) => {
  const [form, setForm] = useState({
    seatsBooked: 1,
    specialRequests: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const bookingData = {
        tripId: trip.id,
        seatsBooked: parseInt(form.seatsBooked),
        totalAmount: trip.pricePerSeat * form.seatsBooked,
        specialRequests: form.specialRequests || null
      };

      const res = await api.post("/api/bookings", bookingData);
      if (onBookingComplete) onBookingComplete(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create booking");
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = trip.pricePerSeat * form.seatsBooked;

  return (
    <div style={{ border: "1px solid #ccc", padding: "15px", borderRadius: "5px" }}>
      <h3>Book This Trip</h3>
      <div style={{ marginBottom: "15px" }}>
        <p><strong>Route:</strong> {trip.fromLocation} → {trip.toLocation}</p>
        <p><strong>Departure:</strong> {new Date(trip.departureTime).toLocaleString()}</p>
        <p><strong>Price per seat:</strong> ₹{trip.pricePerSeat}</p>
        <p><strong>Available seats:</strong> {trip.availableSeats}</p>
      </div>

      {error && <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 10 }}>
          <label>Number of seats:</label>
          <select
            name="seatsBooked"
            value={form.seatsBooked}
            onChange={handleChange}
            required
          >
            {[...Array(Math.min(trip.availableSeats, 4))].map((_, i) => (
              <option key={i + 1} value={i + 1}>{i + 1}</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: 10 }}>
          <label>Special requests (optional):</label>
          <textarea
            name="specialRequests"
            value={form.specialRequests}
            onChange={handleChange}
            placeholder="Any special requirements or requests..."
            rows="3"
            style={{ width: "100%" }}
          />
        </div>

        <div style={{ marginBottom: 15 }}>
          <strong>Total Amount: ₹{totalAmount}</strong>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Booking..." : `Book for ₹${totalAmount}`}
        </button>
      </form>
    </div>
  );
};

export default BookingForm;