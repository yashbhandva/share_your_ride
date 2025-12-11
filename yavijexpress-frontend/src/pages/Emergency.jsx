import { useState } from "react";
import api from "../api/axiosClient";

const Emergency = () => {
  const [form, setForm] = useState({ tripId: "", message: "", latitude: "", longitude: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);
    try {
      setLoading(true);
      const payload = {
        tripId: Number(form.tripId),
        message: form.message,
        latitude: form.latitude ? Number(form.latitude) : null,
        longitude: form.longitude ? Number(form.longitude) : null,
      };
      const res = await api.post("/api/emergency/sos", payload);
      setResult(res.data || null);
    } catch (e) {
      setError(e.response?.data?.message || "Failed to send SOS");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Emergency SOS</h1>
      <p>Use this form to send an SOS alert linked to a trip.</p>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {result && <p style={{ color: "green" }}>SOS sent successfully.</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 8 }}>
          <label>Trip ID:&nbsp;</label>
          <input
            name="tripId"
            value={form.tripId}
            onChange={handleChange}
            required
          />
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>Message:&nbsp;</label>
          <input
            name="message"
            value={form.message}
            onChange={handleChange}
            required
          />
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>Latitude:&nbsp;</label>
          <input
            name="latitude"
            value={form.latitude}
            onChange={handleChange}
          />
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>Longitude:&nbsp;</label>
          <input
            name="longitude"
            value={form.longitude}
            onChange={handleChange}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send SOS"}
        </button>
      </form>
    </div>
  );
};

export default Emergency;
