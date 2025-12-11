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
    try {
      await register(form); // ensure backend accepts this DTO
      setSuccess("Registration successful. Please login.");
      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Register</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
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
