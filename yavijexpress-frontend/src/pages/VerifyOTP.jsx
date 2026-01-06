import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { verifyOTP } from "../api/authApi";

const VerifyOTP = () => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const navigate = useNavigate();
  const location = useLocation();

  // Refs for digit inputs
  const inputRefs = useRef([]);

  const email = location.state?.email || "";

  // Timer Effect
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timerId);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft]);

  // Focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  // Format time as MM:SS
  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

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

    if (timeLeft <= 0) {
      setError("OTP has expired. Please request a new one.");
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

    // Focus first digit box if OTP is complete
    if (value.length === 6 && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  };

  const handleDigitChange = (index, value) => {
    const newValue = value.replace(/\D/g, '');
    if (newValue) {
      const newOtp = otp.split('');
      newOtp[index] = newValue;
      const updatedOtp = newOtp.join('');
      setOtp(updatedOtp);

      // Auto-focus next input
      if (index < 5 && newValue) {
        setTimeout(() => {
          if (inputRefs.current[index + 1]) {
            inputRefs.current[index + 1].focus();
          }
        }, 10);
      }
    }
  };

  const handleDigitKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      // Focus previous input on backspace if current is empty
      setTimeout(() => {
        if (inputRefs.current[index - 1]) {
          inputRefs.current[index - 1].focus();
        }
      }, 10);
    }

    // If backspace is pressed and current has value, clear it
    if (e.key === 'Backspace' && otp[index]) {
      const newOtp = otp.split('');
      newOtp[index] = '';
      setOtp(newOtp.join(''));
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pastedData.length === 6) {
      setOtp(pastedData);
      // Focus back to first input
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
    }
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
              onChange={(e) => handleDigitChange(index, e.target.value)}
              onKeyDown={(e) => handleDigitKeyDown(index, e)}
              onPaste={handlePaste}
              ref={(el) => (inputRefs.current[index] = el)}
              className={`otp-digit-input ${digits[index] ? 'filled' : ''}`}
              inputMode="numeric"
              autoComplete="one-time-code"
            />
          </div>
        ))}
      </div>
    );
  };

  const handleResendOTP = () => {
    // Add resend OTP logic here
    setTimeLeft(300); // Reset timer to 5 minutes
    setError("");
    setSuccess("New OTP sent to your email!");
    // You would call an API here to resend OTP
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
                onPaste={handlePaste}
                maxLength="6"
                placeholder="123456"
                className="otp-single-input"
                inputMode="numeric"
                autoComplete="one-time-code"
              />

              {/* OR Divider */}
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
                OTP expires in:
                <span className={`timer-value ${timeLeft < 60 ? 'expiring' : ''}`}>
                  {formatTime()}
                </span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || otp.length !== 6 || timeLeft <= 0}
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
              onClick={handleResendOTP}
              className="resend-btn"
              disabled={timeLeft > 0 && timeLeft < 300}
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