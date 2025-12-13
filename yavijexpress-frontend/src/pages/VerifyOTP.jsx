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

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(value);
  };

  const OTPDigitInput = () => {
    const digits = otp.split('');

    return (
      <div className="otp-input-container">
        {[0, 1, 2, 3, 4, 5].map((index) => (
          <div key={index} className="otp-digit-wrapper">
            <input
              type="text"
              maxLength="1"
              value={digits[index] || ""}
              onChange={(e) => {
                const newValue = e.target.value.replace(/\D/g, '');
                if (newValue) {
                  const newOtp = otp.split('');
                  newOtp[index] = newValue;
                  setOtp(newOtp.join(''));

                  // Auto-focus next input
                  if (index < 5) {
                    const nextInput = document.getElementById(`otp-digit-${index + 1}`);
                    if (nextInput) nextInput.focus();
                  }
                } else {
                  const newOtp = otp.split('');
                  newOtp[index] = '';
                  setOtp(newOtp.join(''));
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Backspace' && !digits[index] && index > 0) {
                  const prevInput = document.getElementById(`otp-digit-${index - 1}`);
                  if (prevInput) prevInput.focus();
                }
              }}
              id={`otp-digit-${index}`}
              className={`otp-digit-input ${digits[index] ? 'filled' : ''}`}
              autoFocus={index === 0}
              inputMode="numeric"
            />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="verify-otp-page">
      <div className="otp-container">
        <div className="otp-header">
          <div className="otp-icon">🔐</div>
          <h1 className="otp-title">Verify Your Email</h1>
          <p className="otp-subtitle">
            We've sent a 6-digit verification code to:
            <br />
            <span className="email-highlight">{email}</span>
          </p>
        </div>

        <div className="alert-container">
          {error && (
            <div className="otp-alert error-alert">
              <span className="alert-icon">⚠️</span>
              <span className="alert-text">{error}</span>
            </div>
          )}

          {success && (
            <div className="otp-alert success-alert">
              <span className="alert-icon">✅</span>
              <span className="alert-text">{success}</span>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="otp-form">
          <div className="form-group">
            <label className="form-label">
              Enter 6-digit OTP
              <small className="form-hint">(Type digits or use the input boxes below)</small>
            </label>

            <div className="otp-methods">
              {/* Single Input Method */}
              <input
                type="text"
                value={otp}
                onChange={handleOtpChange}
                maxLength="6"
                placeholder="123456"
                className="otp-single-input"
                inputMode="numeric"
              />

              <div className="method-divider">
                <span className="divider-text">OR</span>
              </div>

              {/* Individual Digit Boxes */}
              <div className="otp-boxes-method">
                <p className="method-label">Click and enter each digit:</p>
                <OTPDigitInput />
              </div>
            </div>

            <div className="otp-timer">
              <div className="timer-icon">⏰</div>
              <div className="timer-text">
                OTP expires in: <span className="timer-value">05:00</span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            className={`submit-btn ${loading ? 'loading' : ''}`}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Verifying...
              </>
            ) : (
              "✅ Verify & Continue"
            )}
          </button>
        </form>

        <div className="otp-footer">
          <div className="resend-section">
            <p className="resend-text">Didn't receive the code?</p>
            <button
              onClick={() => {/* Add resend logic here */}}
              className="resend-btn"
            >
              🔄 Resend OTP
            </button>
          </div>

          <div className="back-section">
            <p className="back-text">Wrong email address?</p>
            <button
              onClick={() => navigate("/login")}
              className="back-btn"
            >
              ↩️ Back to Login
            </button>
          </div>

          <div className="help-section">
            <details className="help-details">
              <summary className="help-summary">
                <span className="help-icon">❓</span>
                Need help?
              </summary>
              <div className="help-content">
                <ul className="help-list">
                  <li>Check your spam or junk folder</li>
                  <li>Make sure you entered the correct email address</li>
                  <li>Wait a few minutes and try again</li>
                  <li>Contact support if the issue persists</li>
                </ul>
              </div>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;