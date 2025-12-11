import { useEffect, useState } from "react";
import api from "../api/axiosClient";
import { useAuth } from "../context/AuthContext.jsx";

const PaymentHistory = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      if (!user?.id) return;
      try {
        setLoading(true);
        setError("");
        const [bookingsRes, paymentsRes] = await Promise.all([
          api.get(`/api/bookings/passenger/${user.id}`),
          api.get(`/api/payments/user/${user.id}`),
        ]);
        setBookings(bookingsRes.data || []);
        setPayments(paymentsRes.data || []);
      } catch (e) {
        setError(e.response?.data?.message || "Failed to load payment history");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user]);

  const paymentsByBooking = payments.reduce((acc, p) => {
    const key = p.bookingId || p.bookingId?.id || p.bookingId?.toString?.();
    if (!key) return acc;
    if (!acc[key]) acc[key] = [];
    acc[key].push(p);
    return acc;
  }, {});

  return (
    <div>
      <h1>Payment History</h1>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {bookings.length === 0 && !loading && <p>No bookings found.</p>}

      {bookings.length > 0 && (
        <ul>
          {bookings.map((b) => {
            const bId = String(b.id);
            const related = paymentsByBooking[bId] || [];
            return (
              <li key={b.id} style={{ marginBottom: 12 }}>
                <div>
                  {b.tripFrom} → {b.tripTo} on {b.departureTime} | Seats: {b.seatsBooked}
                </div>
                <div style={{ fontSize: 14 }}>
                  Booking status: {b.status} | Payment: {b.paymentStatus}
                </div>
                {related.length > 0 ? (
                  <ul style={{ fontSize: 13, marginTop: 4 }}>
                    {related.map((p) => (
                      <li key={p.id}>
                        Txn: {p.transactionId} | Amount: {p.amount} | Method: {p.method} |
                        Status: {p.status} | Created: {p.createdAt}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div style={{ fontSize: 13, marginTop: 4 }}>
                    No payment records yet.
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default PaymentHistory;
