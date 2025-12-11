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

  return (
    <div>
      <h1>Profile</h1>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {profile && (
        <section style={{ marginBottom: 24 }}>
          <h2>Profile Details</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <h3>Basic Information</h3>
              <p><strong>Name:</strong> {profile.name}</p>
              <p><strong>Email:</strong> {profile.email}</p>
              <p><strong>Mobile:</strong> {profile.mobile}</p>
              <p><strong>Role:</strong> {profile.role}</p>
              <p><strong>Status:</strong> {profile.verificationStatus}</p>
              <p><strong>Total Rides:</strong> {profile.totalRides || 0}</p>
              <p><strong>Rating:</strong> {profile.avgRating || 0}/5</p>
            </div>
            <div>
              <h3>Additional Information</h3>
              <p><strong>Emergency Contact 1:</strong> {profile.emergencyContact1 || 'Not provided'}</p>
              <p><strong>Emergency Contact 2:</strong> {profile.emergencyContact2 || 'Not provided'}</p>
              {profile.role === 'DRIVER' && (
                <>
                  <p><strong>Aadhaar Number:</strong> {profile.aadhaarNumber || 'Not provided'}</p>
                  <p><strong>Driving License:</strong> {profile.drivingLicense || 'Not provided'}</p>
                </>
              )}
            </div>
          </div>
        </section>
      )}

      <section style={{ marginBottom: 24 }}>
        <h2>Update Profile</h2>
        <form style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div>
            <label>Emergency Contact 1:</label>
            <input type="tel" placeholder="Emergency contact number" />
          </div>
          <div>
            <label>Emergency Contact 2:</label>
            <input type="tel" placeholder="Secondary emergency contact" />
          </div>
          {profile?.role === 'DRIVER' && (
            <>
              <div>
                <label>Aadhaar Number:</label>
                <input type="text" placeholder="12-digit Aadhaar number" maxLength="12" />
              </div>
              <div>
                <label>Driving License:</label>
                <input type="text" placeholder="Driving license number" />
              </div>
            </>
          )}
          <div style={{ gridColumn: 'span 2' }}>
            <button type="submit" style={{ padding: '10px 20px' }}>Update Profile</button>
          </div>
        </form>
      </section>

      <section>
        <h2>Change Password</h2>
        {pwdMessage && <p>{pwdMessage}</p>}
        <form onSubmit={handlePwdSubmit}>
          <div style={{ marginBottom: 8 }}>
            <label>Old Password:&nbsp;</label>
            <input
              type="password"
              name="oldPassword"
              value={passwordForm.oldPassword}
              onChange={handlePwdChange}
              required
            />
          </div>
          <div style={{ marginBottom: 8 }}>
            <label>New Password:&nbsp;</label>
            <input
              type="password"
              name="newPassword"
              value={passwordForm.newPassword}
              onChange={handlePwdChange}
              required
            />
          </div>
          <button type="submit" disabled={pwdLoading}>
            {pwdLoading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </section>
    </div>
  );
};

export default Profile;
