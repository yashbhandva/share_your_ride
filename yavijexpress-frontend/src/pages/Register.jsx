import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../api/authApi";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
    role: "PASSENGER", // default
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // Basic client-side validation to avoid ugly backend validation messages
    if (!form.password || form.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      setLoading(false);
      return;
    }

    try {
      await register(form); // ensure backend accepts this DTO
      setSuccess("Registration successful. Please login.");
      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      const respData = err.response?.data;

      if (typeof respData === "string") {
        const lower = respData.toLowerCase();
        const messages = [];

        if (
          lower.includes("password") &&
          lower.includes("size") &&
          lower.includes("between")
        ) {
          messages.push("Password must be at least 8 characters long.");
        }
        if (lower.includes("email already registered")) {
          messages.push("Email already registered.");
        }
        if (lower.includes("mobile number already registered")) {
          messages.push("Mobile number already registered.");
        }

        if (messages.length > 0) {
          setError(messages.join("\n"));
        } else {
          setError("Registration failed. Please check your inputs.");
        }
      } else if (respData && typeof respData === "object") {
        // GlobalExceptionHandler: validation errors are returned as a map field->message
        const messages = Object.values(respData).filter(Boolean);
        if (messages.length > 0) {
          setError(messages.join("\n"));
        } else if (respData.message) {
          setError(respData.message);
        } else {
          setError("Registration failed. Please check your inputs.");
        }
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Register</h1>
      {error && (
        <p style={{ color: "red", whiteSpace: "pre-line" }}>{error}</p>
      )}
      {success && <p style={{ color: "green" }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 8 }}>
          <label>Name:&nbsp;</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>Email:&nbsp;</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>Password:&nbsp;</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>Mobile:&nbsp;</label>
          <input
            name="mobile"
            value={form.mobile}
            onChange={handleChange}
          />
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>Role:&nbsp;</label>
          <select name="role" value={form.role} onChange={handleChange}>
            <option value="PASSENGER">Passenger</option>
            <option value="DRIVER">Driver</option>
          </select>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default Register;
