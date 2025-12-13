import { useEffect, useState } from "react";
import api from "../api/axiosClient";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdMessage, setPwdMessage] = useState("");

  useEffect(() => {
    const testAuth = async () => {
      try {
        console.log('Testing auth with token:', localStorage.getItem('accessToken'));
        const testRes = await api.get("/api/auth/test-auth");
        console.log('Auth test response:', testRes.data);
      } catch (e) {
        console.error('Auth test failed:', e.response);
      }
    };

    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");
        
        // Test auth first
        await testAuth();
        
        console.log('Loading profile with token:', localStorage.getItem('accessToken'));
        const res = await api.get("/api/auth/profile");
        console.log('Profile response:', res.data);
        // Backend wraps in ApiResponse
        setProfile(res.data?.data || res.data);
      } catch (e) {
        console.error('Profile error:', e.response);
        if (e.response?.status === 401) {
          setError("Please login again to access your profile.");
        } else {
          setError(e.response?.data?.message || e.response?.data || "Failed to load profile");
        }
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handlePwdChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePwdSubmit = async (e) => {
    e.preventDefault();
    try {
      setPwdLoading(true);
      setPwdMessage("");
      await api.post("/api/auth/change-password", passwordForm);
      setPwdMessage("Password changed successfully");
      setPasswordForm({ oldPassword: "", newPassword: "" });
    } catch (er) {
      setPwdMessage(er.response?.data?.message || "Failed to change password");
    } finally {
      setPwdLoading(false);
    }
  };

  const ProfileInfoItem = ({ icon, label, value, color }) => (
    <div className="profile-info-item">
      <div className="profile-info-icon" style={{ color }}>
        {icon}
      </div>
      <div className="profile-info-content">
        <span className="profile-info-label">{label}</span>
        <span className="profile-info-value">{value || 'Not provided'}</span>
      </div>
    </div>
  );

  const RatingDisplay = ({ rating }) => {
    const stars = [];
    const fullStars = Math.floor(rating || 0);
    const hasHalfStar = (rating || 0) % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<span key={i} className="star filled">★</span>);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<span key={i} className="star half">★</span>);
      } else {
        stars.push(<span key={i} className="star">★</span>);
      }
    }

    return (
      <div className="rating-display">
        {stars}
        <span className="rating-value">{rating || 0}/5</span>
      </div>
    );
  };

  const RoleBadge = ({ role }) => (
    <span className={`role-badge role-${role?.toLowerCase()}`}>
      {role}
    </span>
  );

  const StatusBadge = ({ status }) => (
    <span className={`status-badge status-${status?.toLowerCase()}`}>
      {status}
    </span>
  );

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1 className="page-title">
          <span className="page-icon">👤</span>
          My Profile
        </h1>
        <p className="page-subtitle">Manage your personal information and account settings</p>
      </div>

      <div className="alert-container">
        {error && <div className="profile-alert error-alert">{error}</div>}
        {pwdMessage && (
          <div className={`profile-alert ${pwdMessage.includes('success') ? 'success-alert' : 'info-alert'}`}>
            {pwdMessage}
          </div>
        )}
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading your profile...</p>
        </div>
      ) : profile ? (
        <>
          {/* Profile Overview Card */}
          <div className="profile-overview-card">
            <div className="profile-avatar-section">
              <div className="profile-avatar">
                <span className="avatar-icon">{profile.name?.charAt(0).toUpperCase()}</span>
              </div>
              <div className="profile-summary">
                <h2 className="profile-name">{profile.name}</h2>
                <div className="profile-meta">
                  <RoleBadge role={profile.role} />
                  <StatusBadge status={profile.verificationStatus} />
                </div>
                <div className="profile-stats">
                  <div className="stat-item">
                    <span className="stat-icon">🚗</span>
                    <span className="stat-label">Total Rides</span>
                    <span className="stat-value">{profile.totalRides || 0}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-icon">⭐</span>
                    <span className="stat-label">Rating</span>
                    <RatingDisplay rating={profile.avgRating} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="profile-sections">
            {/* Basic Information Section */}
            <section className="profile-section">
              <h2 className="section-title">
                <span className="section-icon">📋</span>
                Basic Information
              </h2>

              <div className="info-grid">
                <ProfileInfoItem
                  icon="📧"
                  label="Email"
                  value={profile.email}
                  color="#2196F3"
                />
                <ProfileInfoItem
                  icon="📱"
                  label="Mobile"
                  value={profile.mobile}
                  color="#4CAF50"
                />
                <ProfileInfoItem
                  icon="👑"
                  label="Role"
                  value={<RoleBadge role={profile.role} />}
                  color="#9C27B0"
                />
                <ProfileInfoItem
                  icon="🔄"
                  label="Status"
                  value={<StatusBadge status={profile.verificationStatus} />}
                  color="#FF9800"
                />
              </div>
            </section>

            {/* Emergency Contacts Section */}
            <section className="profile-section">
              <h2 className="section-title">
                <span className="section-icon">🚨</span>
                Emergency Contacts
              </h2>

              <div className="info-grid">
                <ProfileInfoItem
                  icon="📞"
                  label="Emergency Contact 1"
                  value={profile.emergencyContact1}
                  color="#F44336"
                />
                <ProfileInfoItem
                  icon="📞"
                  label="Emergency Contact 2"
                  value={profile.emergencyContact2}
                  color="#FF5722"
                />
              </div>

              <div className="update-form">
                <h3 className="form-title">Update Emergency Contacts</h3>
                <form className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Emergency Contact 1</label>
                    <input
                      type="tel"
                      placeholder="Emergency contact number"
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Emergency Contact 2</label>
                    <input
                      type="tel"
                      placeholder="Secondary emergency contact"
                      className="form-input"
                    />
                  </div>
                  <div className="form-group full-width">
                    <button type="submit" className="submit-btn update-btn">
                      📝 Update Contacts
                    </button>
                  </div>
                </form>
              </div>
            </section>

            {/* Driver Specific Information */}
            {profile.role === 'DRIVER' && (
              <section className="profile-section">
                <h2 className="section-title">
                  <span className="section-icon">🚗</span>
                  Driver Information
                </h2>

                <div className="info-grid">
                  <ProfileInfoItem
                    icon="🆔"
                    label="Aadhaar Number"
                    value={profile.aadhaarNumber}
                    color="#607D8B"
                  />
                  <ProfileInfoItem
                    icon="📄"
                    label="Driving License"
                    value={profile.drivingLicense}
                    color="#795548"
                  />
                </div>

                <div className="update-form">
                  <h3 className="form-title">Update Driver Information</h3>
                  <form className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Aadhaar Number</label>
                      <input
                        type="text"
                        placeholder="12-digit Aadhaar number"
                        maxLength="12"
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Driving License</label>
                      <input
                        type="text"
                        placeholder="Driving license number"
                        className="form-input"
                      />
                    </div>
                    <div className="form-group full-width">
                      <button type="submit" className="submit-btn update-btn">
                        📝 Update Driver Info
                      </button>
                    </div>
                  </form>
                </div>
              </section>
            )}

            {/* Change Password Section */}
            <section className="profile-section password-section">
              <h2 className="section-title">
                <span className="section-icon">🔒</span>
                Change Password
              </h2>

              <form onSubmit={handlePwdSubmit} className="password-form">
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Current Password</label>
                    <input
                      type="password"
                      name="oldPassword"
                      value={passwordForm.oldPassword}
                      onChange={handlePwdChange}
                      className="form-input"
                      placeholder="Enter current password"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">New Password</label>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordForm.newPassword}
                      onChange={handlePwdChange}
                      className="form-input"
                      placeholder="Enter new password"
                      required
                    />
                  </div>
                </div>

                <div className="password-strength">
                  <div className="strength-bar">
                    <div className="strength-fill" style={{ width: '60%' }}></div>
                  </div>
                  <span className="strength-text">Password strength: Medium</span>
                </div>

                <div className="password-tips">
                  <p className="tip-title">💡 Password Tips:</p>
                  <ul className="tip-list">
                    <li>Use at least 8 characters</li>
                    <li>Include uppercase and lowercase letters</li>
                    <li>Add numbers and special characters</li>
                  </ul>
                </div>

                <button
                  type="submit"
                  disabled={pwdLoading}
                  className={`submit-btn password-btn ${pwdLoading ? 'loading' : ''}`}
                >
                  {pwdLoading ? (
                    <>
                      <span className="spinner"></span>
                      Updating...
                    </>
                  ) : (
                    "🔐 Update Password"
                  )}
                </button>
              </form>
            </section>
          </div>
        </>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">👤</div>
          <h3 className="empty-title">Profile Not Found</h3>
          <p className="empty-text">Unable to load your profile. Please try again later.</p>
        </div>
      )}
    </div>
  );
};

export default Profile;