import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { verifyOTP } from "../api/authApi";

const VerifyOTP = () => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const email = location.state?.email || "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      setLoading(false);
      return;
    }

    try {
      await verifyOTP({ email, otp });
      setSuccess("Email verified successfully!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      const respData = err.response?.data;
      let errorMessage = "OTP verification failed. Please try again.";
      
      if (typeof respData === "string") {
        const cleanMessage = respData.split('\n').pop().trim();
        if (cleanMessage) {
          errorMessage = cleanMessage;
        }
      } else if (respData?.message) {
        errorMessage = respData.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Verify Email</h1>
      <p>Please enter the 6-digit OTP sent to: <strong>{email}</strong></p>
      
      {error && (
        <div style={{ 
          color: "red", 
          backgroundColor: "#fee", 
          padding: "10px", 
          borderRadius: "4px", 
          border: "1px solid #fcc",
          marginBottom: "15px"
        }}>
          {error}
        </div>
      )}
      
      {success && (
        <div style={{ 
          color: "green", 
          backgroundColor: "#efe", 
          padding: "10px", 
          borderRadius: "4px", 
          border: "1px solid #cfc",
          marginBottom: "15px"
        }}>
          {success}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 15 }}>
          <label>Enter OTP:&nbsp;</label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength="6"
            placeholder="123456"
            required
            style={{ fontSize: "18px", padding: "8px", letterSpacing: "2px" }}
          />
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
      </form>
      
      <p style={{ marginTop: "20px" }}>
        Didn't receive OTP? <button onClick={() => navigate("/login")}>Go to Login</button>
      </p>
    </div>
  );
};

export default VerifyOTP;