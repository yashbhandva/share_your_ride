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
  const [success, setSuccess] = useState("");

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
      
      console.log('Loaded bookings:', bookings);
      bookings.forEach(b => console.log(`Booking ${b.id}: status=${b.status}`));
      
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
      const res = await api.post("/api/bookings", {
        tripId: Number(tripId),
        seats: seats,
        specialRequests: specialRequests || null,
      });
      console.log('Booking response:', res.data);
      // Clear the booking form for this trip
      setBookingSeats(prev => ({ ...prev, [tripId]: "" }));
      setBookingNotes(prev => ({ ...prev, [tripId]: "" }));
      setSuccess("Booking created successfully!");
      setTimeout(() => setSuccess(""), 3000);
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
      const res = await api.post(`/api/bookings/${bookingId}/cancel`, null, {
        params: { reason },
      });
      console.log('Cancel response:', res.data);
      setSuccess("Booking cancelled successfully!");
      setTimeout(() => setSuccess(""), 3000);
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

  const TripCard = ({ trip, isSearchResult = false }) => (
    <div className="trip-card">
      <div className="trip-card-header">
        <h3 className="trip-route">
          <span className="from-location">{trip.fromLocation}</span>
          <span className="route-arrow">→</span>
          <span className="to-location">{trip.toLocation}</span>
        </h3>
        {isSearchResult && (
          <div className="trip-price">
            <span className="price-label">₹{trip.pricePerSeat}</span>
            <span className="price-unit">/seat</span>
          </div>
        )}
      </div>

      <div className="trip-details-grid">
        <div className="trip-detail">
          <span className="detail-icon">⏰</span>
          <span className="detail-label">Departure:</span>
          <span className="detail-value">{new Date(trip.departureTime).toLocaleString()}</span>
        </div>
        <div className="trip-detail">
          <span className="detail-icon">💺</span>
          <span className="detail-label">Seats:</span>
          <span className="detail-value">{trip.availableSeats}/{trip.totalSeats}</span>
        </div>
        <div className="trip-detail">
          <span className="detail-icon">🚗</span>
          <span className="detail-label">Driver:</span>
          <span className="detail-value">{trip.driverName}</span>
        </div>
        <div className="trip-detail">
          <span className="detail-icon">🚙</span>
          <span className="detail-label">Vehicle:</span>
          <span className="detail-value">{trip.vehicleModel} ({trip.vehicleNumber})</span>
        </div>
      </div>

      {trip.notes && (
        <div className="trip-notes">
          <span className="notes-icon">📝</span>
          <span className="notes-text">{trip.notes}</span>
        </div>
      )}

      {isSearchResult && (
        <div className="booking-form">
          <div className="booking-inputs">
            <input
              type="number"
              min="1"
              max={trip.availableSeats}
              placeholder="Seats"
              value={bookingSeats[trip.id] || ""}
              onChange={(e) =>
                setBookingSeats((prev) => ({
                  ...prev,
                  [trip.id]: e.target.value,
                }))
              }
              className="seats-input"
            />
            <input
              type="text"
              placeholder="Special requests (optional)"
              value={bookingNotes[trip.id] || ""}
              onChange={(e) =>
                setBookingNotes((prev) => ({
                  ...prev,
                  [trip.id]: e.target.value,
                }))
              }
              className="notes-input"
            />
          </div>
          <button
            onClick={() => handleBook(trip.id)}
            disabled={bookingSubmittingId === trip.id}
            className={`book-btn ${bookingSubmittingId === trip.id ? 'loading' : ''}`}
          >
            {bookingSubmittingId === trip.id ? "Booking..." : `Book for ₹${trip.pricePerSeat * (bookingSeats[trip.id] || 1)}`}
          </button>
        </div>
      )}
    </div>
  );

  const BookingCard = ({ booking }) => (
    <div className="booking-card">
      <div className="booking-header">
        <div>
          <h3 className="booking-route">
            <span className="from-location">{booking.tripFrom}</span>
            <span className="route-arrow">→</span>
            <span className="to-location">{booking.tripTo}</span>
          </h3>
          <div className="booking-meta">
            <span className="booking-date">{new Date(booking.departureTime).toLocaleString()}</span>
            <span className="booking-seats">💺 {booking.seatsBooked} seats</span>
          </div>
        </div>
        <div className="booking-status-container">
          <span className={`booking-status booking-status-${booking.status?.toLowerCase()}`}>
            {booking.status}
          </span>
          <span className={`payment-status payment-status-${booking.paymentStatus?.toLowerCase()}`}>
            {booking.paymentStatus}
          </span>
        </div>
      </div>

      {booking.status === 'CONFIRMED' && (
        <div className="confirmed-booking-details">
          <div className="driver-info">
            <h4 className="section-subtitle">🚗 Driver Details</h4>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Driver:</span>
                <span className="info-value">{booking.driverName}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Phone:</span>
                <span className="info-value phone-number">{booking.driverPhone}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Vehicle:</span>
                <span className="info-value">{booking.vehicleModel} ({booking.vehicleNumber})</span>
              </div>
            </div>
          </div>

          {booking.pickupOtp && (
            <div className="otp-section">
              <h4 className="otp-title">🔑 Your Pickup OTP</h4>
              <div className="otp-display">
                <div className="otp-code">{booking.pickupOtp}</div>
                <p className="otp-instruction">
                  📱 Give this 6-digit OTP to the driver during pickup to start your trip
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {booking.status === 'PENDING' && (
        <div className="pending-alert">
          <span className="alert-icon">⏳</span>
          <span className="alert-text">Waiting for driver approval...</span>
        </div>
      )}

      {booking.specialRequests && (
        <div className="special-requests">
          <h4 className="section-subtitle">💭 Your Notes</h4>
          <p className="requests-text">{booking.specialRequests}</p>
        </div>
      )}

      {booking.tripNotes && (
        <div className="trip-notes-section">
          <h4 className="section-subtitle">📝 Trip Notes</h4>
          <p className="notes-text">{booking.tripNotes}</p>
        </div>
      )}

      <div className="booking-actions">
        {booking.status !== "CANCELLED" && booking.status !== "COMPLETED" && (
          <button
            onClick={() => handleCancelBooking(booking.id)}
            disabled={cancelSubmittingId === booking.id}
            className={`cancel-btn ${cancelSubmittingId === booking.id ? 'loading' : ''}`}
          >
            {cancelSubmittingId === booking.id ? "Cancelling..." : "Cancel Booking"}
          </button>
        )}

        <button
          onClick={() => handleLoadPayment(booking.id)}
          disabled={paymentLoadingId === booking.id}
          className="payment-btn"
        >
          {paymentLoadingId === booking.id ? "Loading..." : "View Payment"}
        </button>

        {paymentDetails[booking.id] && (
          <div className="payment-details">
            <div className="payment-info">
              <span className="info-label">Amount:</span>
              <span className="info-value">₹{paymentDetails[booking.id].amount}</span>
              <span className="info-label">Method:</span>
              <span className="info-value">{paymentDetails[booking.id].method}</span>
              <span className="info-label">Status:</span>
              <span className={`info-value status-${paymentDetails[booking.id].status?.toLowerCase()}`}>
                {paymentDetails[booking.id].status}
              </span>
            </div>
          </div>
        )}

        {booking.status === "CONFIRMED" && (
          <button
            onClick={() => handleCashPayment(booking.id)}
            disabled={paymentProcessingId === booking.id}
            className={`cash-btn ${paymentProcessingId === booking.id ? 'loading' : ''}`}
          >
            {paymentProcessingId === booking.id ? "Processing..." : "Mark Cash Paid"}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="passenger-dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">👤 Passenger Dashboard</h1>
        <p className="dashboard-subtitle">Welcome, <span className="passenger-name">{user?.name}</span>!</p>
      </div>

      <div className="alert-container">
        {error && <div className="passenger-alert error-alert">{error}</div>}
        {success && <div className="passenger-alert success-alert">{success}</div>}
      </div>

      {/* Search Section */}
      <section className="search-section">
        <h2 className="section-title">
          <span className="section-icon">🔍</span>
          Search & Book Trips
        </h2>

        <form onSubmit={handleSearchTrips} className="search-form">
          <div className="search-grid">
            <div className="form-group">
              <label className="form-label">From Location</label>
              <input
                name="fromLocation"
                placeholder="Starting point"
                value={searchForm.fromLocation}
                onChange={handleSearchChange}
                className="search-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">To Location</label>
              <input
                name="toLocation"
                placeholder="Destination"
                value={searchForm.toLocation}
                onChange={handleSearchChange}
                className="search-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Departure Date</label>
              <input
                type="date"
                name="departureDate"
                value={searchForm.departureDate}
                onChange={handleSearchChange}
                className="search-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Required Seats</label>
              <input
                type="number"
                name="requiredSeats"
                min="1"
                value={searchForm.requiredSeats}
                onChange={handleSearchChange}
                className="search-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Max Price (₹)</label>
              <input
                type="number"
                name="maxPrice"
                placeholder="No limit"
                value={searchForm.maxPrice}
                onChange={handleSearchChange}
                className="search-input"
              />
            </div>

            <div className="form-group search-btn-group">
              <button
                type="submit"
                disabled={searchLoading}
                className={`search-btn ${searchLoading ? 'loading' : ''}`}
              >
                {searchLoading ? (
                  <>
                    <span className="spinner"></span>
                    Searching...
                  </>
                ) : (
                  "🔍 Search Trips"
                )}
              </button>
            </div>
          </div>
        </form>

        {searchLoading && (
          <div className="loading-placeholder">
            <div className="loading-spinner"></div>
            <p>Searching for available trips...</p>
          </div>
        )}

        {searchResults.length === 0 && !searchLoading && (
          <div className="empty-state">
            <div className="empty-icon">🚗</div>
            <p className="empty-text">No trips found. Try adjusting your search criteria.</p>
          </div>
        )}

        {searchResults.length > 0 && (
          <div className="search-results">
            <h3 className="results-title">
              Available Trips
              <span className="results-count"> ({searchResults.length})</span>
            </h3>
            <div className="trips-grid">
              {searchResults.map((trip) => (
                <TripCard key={trip.id} trip={trip} isSearchResult={true} />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Upcoming Trips Section */}
      <section className="upcoming-section">
        <h2 className="section-title">
          <span className="section-icon">📅</span>
          Upcoming Trips
        </h2>

        {loading ? (
          <div className="loading-placeholder">
            <div className="loading-spinner"></div>
            <p>Loading upcoming trips...</p>
          </div>
        ) : upcomingTrips.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <p className="empty-text">No upcoming trips available.</p>
          </div>
        ) : (
          <div className="trips-grid">
            {upcomingTrips.map((trip) => (
              <div key={trip.id} className="trip-card">
                <div className="trip-card-header">
                  <h3 className="trip-route">
                    <span className="from-location">{trip.fromLocation}</span>
                    <span className="route-arrow">→</span>
                    <span className="to-location">{trip.toLocation}</span>
                  </h3>
                  <div className="available-seats">
                    <span className="seats-count">{trip.availableSeats}</span>
                    <span className="seats-label">seats left</span>
                  </div>
                </div>

                <div className="trip-details-grid">
                  <div className="trip-detail">
                    <span className="detail-icon">⏰</span>
                    <span className="detail-label">Departure:</span>
                    <span className="detail-value">{new Date(trip.departureTime).toLocaleString()}</span>
                  </div>
                  <div className="trip-detail">
                    <span className="detail-icon">💰</span>
                    <span className="detail-label">Price:</span>
                    <span className="detail-value">₹{trip.pricePerSeat}/seat</span>
                  </div>
                </div>

                <div className="booking-form">
                  <div className="booking-inputs">
                    <input
                      type="number"
                      min="1"
                      max={trip.availableSeats}
                      placeholder="Seats"
                      value={bookingSeats[trip.id] || ""}
                      onChange={(e) =>
                        setBookingSeats((prev) => ({
                          ...prev,
                          [trip.id]: e.target.value,
                        }))
                      }
                      className="seats-input"
                    />
                    <input
                      type="text"
                      placeholder="Special requests (optional)"
                      value={bookingNotes[trip.id] || ""}
                      onChange={(e) =>
                        setBookingNotes((prev) => ({
                          ...prev,
                          [trip.id]: e.target.value,
                        }))
                      }
                      className="notes-input"
                    />
                  </div>
                  <button
                    onClick={() => handleBook(trip.id)}
                    disabled={bookingSubmittingId === trip.id}
                    className={`book-btn ${bookingSubmittingId === trip.id ? 'loading' : ''}`}
                  >
                    {bookingSubmittingId === trip.id ? "Booking..." : "Book Now"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Bookings Section */}
      <section className="bookings-section">
        <h2 className="section-title">
          <span className="section-icon">📋</span>
          Your Bookings
          <span className="bookings-count"> ({bookings.length})</span>
        </h2>

        {loading ? (
          <div className="loading-placeholder">
            <div className="loading-spinner"></div>
            <p>Loading your bookings...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📖</div>
            <p className="empty-text">No bookings yet. Search and book your first trip!</p>
          </div>
        ) : (
          <div className="bookings-list">
            {bookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default DashboardPassenger;