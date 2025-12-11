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
  const [ratingStars, setRatingStars] = useState({});
  const [ratingComment, setRatingComment] = useState({});
  const [ratingSubmittingId, setRatingSubmittingId] = useState(null);
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

      setUpcomingTrips(tripsRes.data || []);
      setBookings(bookingsRes.data || []);
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
        fromLocation: searchForm.fromLocation || null,
        toLocation: searchForm.toLocation || null,
        departureDate: departureIso,
        requiredSeats: Number(searchForm.requiredSeats) || 1,
        maxPrice: searchForm.maxPrice ? Number(searchForm.maxPrice) : null,
      };
      const res = await api.post("/api/trips/search", payload);
      console.log('Search response:', res.data);
      setSearchResults(res.data?.data || res.data || []);
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

  const handleSubmitRating = async (bookingId, type) => {
    if (!user?.id) return;
    const stars = Number(ratingStars[bookingId] || 0);
    const comment = ratingComment[bookingId] || "";
    if (!stars || stars < 1 || stars > 5) return;

    try {
      setRatingSubmittingId(bookingId);
      setError("");
      await api.post("/api/ratings", {
        bookingId,
        stars,
        comment,
        type,
      });
      await loadData(user.id);
    } catch (e) {
      setError(e.response?.data?.message || "Failed to submit rating");
    } finally {
      setRatingSubmittingId(null);
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
        {searchResults.length > 0 && (
          <ul>
            {searchResults.map((t) => (
              <li key={t.id} style={{ marginBottom: 10 }}>
                <div>
                  {t.fromLocation} → {t.toLocation} on {t.departureTime} | Seats
                  available: {t.availableSeats}
                </div>
                <div style={{ marginTop: 4 }}>
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
        <h2>Your Bookings</h2>
        {bookings.length === 0 && !loading && <p>No bookings yet.</p>}
        {bookings.length > 0 && (
          <ul>
            {bookings.map((b) => (
              <li key={b.id} style={{ marginBottom: 10 }}>
                <div>
                  {b.tripFrom} → {b.tripTo} on {b.departureTime} | Seats:
                  {" "}
                  {b.seatsBooked} | Status: {b.status} | Payment:
                  {" "}
                  {b.paymentStatus}
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
                {b.status === "COMPLETED" && (
                  <div style={{ marginTop: 4 }}>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      placeholder="Stars (1-5)"
                      value={ratingStars[b.id] || ""}
                      onChange={(e) =>
                        setRatingStars((prev) => ({
                          ...prev,
                          [b.id]: e.target.value,
                        }))
                      }
                      style={{ marginRight: 8, width: 80 }}
                    />
                    <input
                      type="text"
                      placeholder="Comment (optional)"
                      value={ratingComment[b.id] || ""}
                      onChange={(e) =>
                        setRatingComment((prev) => ({
                          ...prev,
                          [b.id]: e.target.value,
                        }))
                      }
                      style={{ marginRight: 8, width: 260 }}
                    />
                    <button
                      onClick={() =>
                        handleSubmitRating(b.id, "PASSENGER_TO_DRIVER")
                      }
                      disabled={ratingSubmittingId === b.id}
                    >
                      {ratingSubmittingId === b.id
                        ? "Submitting..."
                        : "Rate Driver"}
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
