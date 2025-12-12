import { useState } from "react";
import api from "../api/axiosClient";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      setSuccess("");
      
      await api.post("/api/contact", form);
      
      setSuccess("✅ Message sent successfully! We'll get back to you soon.");
      setForm({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setSuccess(""), 5000);
    } catch (e) {
      setError(e.response?.data?.message || "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h1>Contact Us</h1>
      <p>Have a question or need help? Send us a message and we'll get back to you as soon as possible.</p>
      
      {error && <div style={{ color: "red", backgroundColor: "#ffebee", padding: "10px", borderRadius: "5px", marginBottom: "15px" }}>{error}</div>}
      {success && <div style={{ color: "green", backgroundColor: "#e8f5e8", padding: "15px", borderRadius: "5px", marginBottom: "15px", fontWeight: "bold" }}>{success}</div>}
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Name *</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "10px", border: "1px solid #ddd", borderRadius: "5px" }}
          />
        </div>
        
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Email *</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "10px", border: "1px solid #ddd", borderRadius: "5px" }}
          />
        </div>
        
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Subject *</label>
          <input
            type="text"
            name="subject"
            value={form.subject}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "10px", border: "1px solid #ddd", borderRadius: "5px" }}
          />
        </div>
        
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Message *</label>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            required
            rows="6"
            style={{ width: "100%", padding: "10px", border: "1px solid #ddd", borderRadius: "5px", resize: "vertical" }}
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          style={{
            backgroundColor: loading ? "#ccc" : "#4CAF50",
            color: "white",
            padding: "12px 30px",
            border: "none",
            borderRadius: "5px",
            fontSize: "16px",
            cursor: loading ? "not-allowed" : "pointer"
          }}
        >
          {loading ? "Sending..." : "Send Message"}
        </button>
      </form>
      
      <div style={{ marginTop: "40px", padding: "20px", backgroundColor: "#f5f5f5", borderRadius: "5px" }}>
        <h3>Other Ways to Reach Us</h3>
        <p><strong>Email:</strong> support@yavijexpress.com</p>
        <p><strong>Phone:</strong> +91 12345 67890</p>
        <p><strong>Address:</strong> 123 Express Street, City, State 12345</p>
        <p><strong>Business Hours:</strong> Monday - Friday, 9:00 AM - 6:00 PM</p>
      </div>
    </div>
  );
};

export default Contact;
