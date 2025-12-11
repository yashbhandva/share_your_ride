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
      setSuccess("Registration successful! Redirecting to OTP verification...");
      setTimeout(() => navigate("/verify-otp", { state: { email: form.email } }), 2000);
    } catch (err) {
      console.log('Error response:', err.response);
      const status = err.response?.status;
      const respData = err.response?.data;
      
      let errorMessage = "Registration failed. Please try again.";
      
      // Handle different response formats
      if (typeof respData === "string") {
        // Extract the actual error message from string response
        const lines = respData.split('\n');
        const actualMessage = lines[lines.length - 1].trim() || lines[lines.length - 2]?.trim();
        
        if (actualMessage && actualMessage !== '') {
          if (actualMessage.includes("Email already registered")) {
            errorMessage = "Email already exists";
          } else if (actualMessage.includes("Mobile number already registered")) {
            errorMessage = "Mobile number already exists";
          } else if (actualMessage.includes("password")) {
            errorMessage = "Password must be at least 8 characters";
          } else {
            errorMessage = actualMessage;
          }
        }
      } else if (respData && typeof respData === "object") {
        // Handle object responses (validation errors)
        if (respData.message) {
          errorMessage = respData.message;
        } else {
          // Handle validation error object
          const messages = Object.values(respData).filter(msg => msg && typeof msg === 'string');
          if (messages.length > 0) {
            errorMessage = messages.join("\n");
          }
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Register</h1>
      {error && (
        <div style={{ 
          color: "red", 
          backgroundColor: "#fee", 
          padding: "10px", 
          borderRadius: "4px", 
          border: "1px solid #fcc",
          marginBottom: "15px",
          whiteSpace: "pre-line"
        }}>
          {error}
        </div>
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
