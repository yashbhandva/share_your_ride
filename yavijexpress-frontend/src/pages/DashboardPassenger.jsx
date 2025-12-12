import { useEffect, useState } from "react";
import api from "../api/axiosClient";
import { useAuth } from "../context/AuthContext.jsx";

const DashboardPassenger = () => {
  const { user } = useAuth();
  const [upcomingTrips, setUpcomingTrips] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bookingSeats, setBookingSeats] = useState({});
  const [bookingNotes, setBookingNotes] = useState({});
  const [bookingSubmittingId, setBookingSubmittingId] = useState(null);
  const [cancelReason, setCancelReason] = useState({});
  const [cancelSubmittingId, setCancelSubmittingId] = useState(null);

  const [paymentDetails, setPaymentDetails] = useState({});
  const [paymentLoadingId, setPaymentLoadingId] = useState(null);
  const [paymentProcessingId, setPaymentProcessingId] = useState(null);
  const [searchForm, setSearchForm] = useState({
    fromLocation: "",
    toLocation: "",
    departureDate: "",
    requiredSeats: 1,
    maxPrice: "",
  });
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const loadData = async (userId) => {
    try {
      setLoading(true);
      setError("");

      const [tripsRes, bookingsRes] = await Promise.all([
        api.get("/api/trips/upcoming"),
        api.get(`/api/bookings/passenger/${userId}`),
      ]);

      // Handle ApiResponse format: { success: true, data: [...], message: "..." }
      const trips = tripsRes.data?.data || tripsRes.data || [];
      const bookings = bookingsRes.data?.data || bookingsRes.data || [];
      
      setUpcomingTrips(trips);
      setBookings(bookings);
    } catch (e) {
      setError(e.response?.data?.message || "Failed to load passenger data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user?.id) return;
    loadData(user.id);
  }, [user]);

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearchTrips = async (e) => {
    e.preventDefault();
    try {
      setSearchLoading(true);
      setError("");
      const departureIso = searchForm.departureDate
        ? new Date(searchForm.departureDate).toISOString()
        : null;
      const payload = {
        fromLocation: searchForm.fromLocation?.trim() || null,
        toLocation: searchForm.toLocation?.trim() || null,
        departureDate: departureIso,
        requiredSeats: Number(searchForm.requiredSeats) || 1,
        maxPrice: searchForm.maxPrice ? Number(searchForm.maxPrice) : null,
      };
      const res = await api.post("/api/trips/search", payload);
      
      // Handle ApiResponse format from backend
      const results = res.data?.data || res.data || [];
      setSearchResults(results);
    } catch (e) {
      setError(e.response?.data?.message || "Failed to search trips");
    } finally {
      setSearchLoading(false);
    }
  };

  const handleBook = async (tripId) => {
    if (!user?.id) return;
    const seats = Number(bookingSeats[tripId] || 1);
    const specialRequests = bookingNotes[tripId] || "";
    if (!seats || seats <= 0) return;

    try {
      setBookingSubmittingId(tripId);
      setError("");
      await api.post("/api/bookings", {
        tripId,
        seats,
        specialRequests,
      });
      await loadData(user.id);
    } catch (e) {
      setError(e.response?.data?.message || "Failed to create booking");
    } finally {
      setBookingSubmittingId(null);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!user?.id) return;
    const reason = cancelReason[bookingId] || "Cancelled by user";
    try {
      setCancelSubmittingId(bookingId);
      setError("");
      await api.post(`/api/bookings/${bookingId}/cancel`, null, {
        params: { reason },
      });
      await loadData(user.id);
    } catch (e) {
      setError(e.response?.data?.message || "Failed to cancel booking");
    } finally {
      setCancelSubmittingId(null);
    }
  };



  const handleLoadPayment = async (bookingId) => {
    if (!user?.id) return;
    try {
      setPaymentLoadingId(bookingId);
      setError("");
      const res = await api.get(`/api/payments/booking/${bookingId}`);
      setPaymentDetails((prev) => ({ ...prev, [bookingId]: res.data }));
    } catch (e) {
      setError(e.response?.data?.message || "Failed to load payment details");
    } finally {
      setPaymentLoadingId(null);
    }
  };

  const handleCashPayment = async (bookingId) => {
    if (!user?.id) return;
    try {
      setPaymentProcessingId(bookingId);
      setError("");
      await api.post(`/api/payments/cash/${bookingId}`);
      await loadData(user.id);
    } catch (e) {
      setError(e.response?.data?.message || "Failed to process cash payment");
    } finally {
      setPaymentProcessingId(null);
    }
  };

  return (
    <div>
      <h1>Passenger Dashboard</h1>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <section style={{ marginBottom: 24 }}>
        <h2>Search Trips</h2>
        <form onSubmit={handleSearchTrips} style={{ marginBottom: 12 }}>
          <input
            name="fromLocation"
            placeholder="From"
            value={searchForm.fromLocation}
            onChange={handleSearchChange}
            style={{ marginRight: 8 }}
          />
          <input
            name="toLocation"
            placeholder="To"
            value={searchForm.toLocation}
            onChange={handleSearchChange}
            style={{ marginRight: 8 }}
          />
          <input
            type="date"
            name="departureDate"
            value={searchForm.departureDate}
            onChange={handleSearchChange}
            style={{ marginRight: 8 }}
          />
          <input
            type="number"
            name="requiredSeats"
            min="1"
            value={searchForm.requiredSeats}
            onChange={handleSearchChange}
            style={{ width: 80, marginRight: 8 }}
          />
          <input
            type="number"
            name="maxPrice"
            placeholder="Max price"
            value={searchForm.maxPrice}
            onChange={handleSearchChange}
            style={{ width: 100, marginRight: 8 }}
          />
          <button type="submit" disabled={searchLoading}>
            {searchLoading ? "Searching..." : "Search"}
          </button>
        </form>
        {searchResults.length === 0 && !searchLoading && (
          <p>No trips found. Try adjusting your search criteria.</p>
        )}
        {searchResults.length > 0 && (
          <div>
            <h3>Available Trips ({searchResults.length})</h3>
            {searchResults.map((t) => (
              <div key={t.id} style={{ 
                border: "1px solid #ddd", 
                padding: "15px", 
                marginBottom: "15px", 
                borderRadius: "5px" 
              }}>
                <h4>{t.fromLocation} → {t.toLocation}</h4>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "10px" }}>
                  <div>
                    <p><strong>Departure:</strong> {new Date(t.departureTime).toLocaleString()}</p>
                    <p><strong>Price per seat:</strong> ₹{t.pricePerSeat}</p>
                    <p><strong>Available seats:</strong> {t.availableSeats}/{t.totalSeats}</p>
                  </div>
                  <div>
                    <p><strong>Driver:</strong> {t.driverName}</p>
                    <p><strong>Vehicle:</strong> {t.vehicleModel} ({t.vehicleNumber})</p>
                    <p><strong>Distance:</strong> {t.distanceKm ? `${t.distanceKm} km` : 'Not specified'}</p>
                  </div>
                </div>
                {t.notes && <p><strong>Notes:</strong> {t.notes}</p>}
                <div style={{ marginTop: 10 }}>
                  <input
                    type="number"
                    min="1"
                    max={t.availableSeats}
                    placeholder="Seats"
                    value={bookingSeats[t.id] || ""}
                    onChange={(e) =>
                      setBookingSeats((prev) => ({
                        ...prev,
                        [t.id]: e.target.value,
                      }))
                    }
                    style={{ marginRight: 8, width: 80 }}
                  />
                  <input
                    type="text"
                    placeholder="Special requests (optional)"
                    value={bookingNotes[t.id] || ""}
                    onChange={(e) =>
                      setBookingNotes((prev) => ({
                        ...prev,
                        [t.id]: e.target.value,
                      }))
                    }
                    style={{ marginRight: 8, width: 200 }}
                  />
                  <button
                    onClick={() => handleBook(t.id)}
                    disabled={bookingSubmittingId === t.id}
                    style={{ padding: "8px 16px", backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: "3px" }}
                  >
                    {bookingSubmittingId === t.id ? "Booking..." : `Book for ₹${t.pricePerSeat * (bookingSeats[t.id] || 1)}`}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2>Upcoming Trips</h2>
        {upcomingTrips.length === 0 && !loading && <p>No upcoming trips.</p>}
        {upcomingTrips.length > 0 && (
          <ul>
            {upcomingTrips.map((t) => (
              <li key={t.id} style={{ marginBottom: 12 }}>
                <div>
                  {t.fromLocation} → {t.toLocation} on {t.departureTime} | Seats
                  available: {t.availableSeats}
                </div>
                <div style={{ marginTop: 4 }}>
                  <input
                    type="number"
                    min="1"
                    max={t.availableSeats}
                    placeholder="Seats"
                    value={bookingSeats[t.id] || ""}
                    onChange={(e) =>
                      setBookingSeats((prev) => ({
                        ...prev,
                        [t.id]: e.target.value,
                      }))
                    }
                    style={{ marginRight: 8 }}
                  />
                  <input
                    type="text"
                    placeholder="Special requests (optional)"
                    value={bookingNotes[t.id] || ""}
                    onChange={(e) =>
                      setBookingNotes((prev) => ({
                        ...prev,
                        [t.id]: e.target.value,
                      }))
                    }
                    style={{ marginRight: 8, width: 260 }}
                  />
                  <button
                    onClick={() => handleBook(t.id)}
                    disabled={bookingSubmittingId === t.id}
                  >
                    {bookingSubmittingId === t.id ? "Booking..." : "Book"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2>Your Bookings ({bookings.length})</h2>
        {loading && <p>Loading...</p>}
        {bookings.length === 0 && !loading && <p>No bookings yet.</p>}
        {bookings.length > 0 && (
          <ul>
            {bookings.map((b) => (
              <li key={b.id} style={{ marginBottom: 10 }}>
                <div style={{ border: "1px solid #ddd", padding: "10px", borderRadius: "5px" }}>
                  <h4>{b.tripFrom} → {b.tripTo}</h4>
                  <p><strong>Departure:</strong> {new Date(b.departureTime).toLocaleString()}</p>
                  <p><strong>Seats Booked:</strong> {b.seatsBooked}</p>
                  <p><strong>Status:</strong> {b.status}</p>
                  <p><strong>Payment:</strong> {b.paymentStatus}</p>
                  {b.specialRequests && <p><strong>Your Notes:</strong> {b.specialRequests}</p>}
                  {b.tripNotes && <p><strong>Trip Notes:</strong> {b.tripNotes}</p>}
                </div>
                <div style={{ marginTop: 4 }}>
                  <button
                    onClick={() => handleLoadPayment(b.id)}
                    disabled={paymentLoadingId === b.id}
                    style={{ marginBottom: 4 }}
                  >
                    {paymentLoadingId === b.id
                      ? "Loading payment..."
                      : "View Payment Details"}
                  </button>
                  {paymentDetails[b.id] && (
                    <div style={{ fontSize: 14 }}>
                      Amount: {paymentDetails[b.id].amount} | Method:
                      {" "}
                      {paymentDetails[b.id].method} | Status:
                      {" "}
                      {paymentDetails[b.id].status}
                    </div>
                  )}
                  {b.status === "CONFIRMED" && (
                    <button
                      onClick={() => handleCashPayment(b.id)}
                      disabled={paymentProcessingId === b.id}
                      style={{ marginLeft: 8 }}
                    >
                      {paymentProcessingId === b.id
                        ? "Processing cash..."
                        : "Mark Cash Paid"}
                    </button>
                  )}
                </div>
                {b.status === "CONFIRMED" && (
                  <div style={{ marginTop: 4 }}>
                    <input
                      type="text"
                      placeholder="Cancel reason (optional)"
                      value={cancelReason[b.id] || ""}
                      onChange={(e) =>
                        setCancelReason((prev) => ({
                          ...prev,
                          [b.id]: e.target.value,
                        }))
                      }
                      style={{ marginRight: 8, width: 260 }}
                    />
                    <button
                      onClick={() => handleCancelBooking(b.id)}
                      disabled={cancelSubmittingId === b.id}
                    >
                      {cancelSubmittingId === b.id
                        ? "Cancelling..."
                        : "Cancel Booking"}
                    </button>
                  </div>
                )}

              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default DashboardPassenger;
