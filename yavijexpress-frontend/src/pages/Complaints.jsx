import { useState, useEffect } from "react";
import api from "../api/axiosClient";
import { useAuth } from "../context/AuthContext";
import "../assets/complaints.scss";

const Complaints = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "OTHER",
    reportedUserId: "",
    tripId: ""
  });

  const [replyData, setReplyData] = useState({});

  const complaintTypes = [
    { value: "DRIVER_BEHAVIOR", label: "Driver Behavior" },
    { value: "PASSENGER_BEHAVIOR", label: "Passenger Behavior" },
    { value: "VEHICLE_ISSUE", label: "Vehicle Issue" },
    { value: "PAYMENT_ISSUE", label: "Payment Issue" },
    { value: "SAFETY_ISSUE", label: "Safety Issue" },
    { value: "OTHER", label: "Other" }
  ];

  useEffect(() => {
    if (user) loadComplaints();
  }, [user]);

  const loadComplaints = async () => {
    try {
      setLoading(true);
      const endpoint = user?.role === "ADMIN" ? "/api/complaints" : "/api/complaints/my-complaints";
      const res = await api.get(endpoint);
      const data = res.data?.data || res.data || [];
      setComplaints(data);
    } catch (e) {
      setError("Failed to load complaints");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setSuccess("");

      const payload = {
        ...formData,
        reportedUserId: formData.reportedUserId ? Number(formData.reportedUserId) : null,
        tripId: formData.tripId ? Number(formData.tripId) : null
      };

      await api.post("/api/complaints", payload);

      setSuccess("Complaint submitted successfully");
      setShowForm(false);
      setFormData({
        title: "",
        description: "",
        type: "OTHER",
        reportedUserId: "",
        tripId: ""
      });
      loadComplaints();
    } catch (e) {
      setError(e.response?.data?.message || "Failed to submit complaint");
    }
  };

  const handleReply = async (complaintId) => {
    try {
      setError("");
      await api.put(`/api/complaints/${complaintId}/status`, {
        status: "RESOLVED",
        adminResponse: replyData[complaintId]
      });
      setSuccess("Reply sent successfully!");
      setReplyData({ ...replyData, [complaintId]: "" });
      loadComplaints();
      setTimeout(() => setSuccess(""), 3000);
    } catch (e) {
      setError(e.response?.data?.message || "Failed to send reply");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="complaints-page container">
      <div className="page-header">
        <h1>📝 {user?.role === "ADMIN" ? "All Complaints" : "My Complaints"}</h1>
        {user?.role !== "ADMIN" && (
          <button
            className="btn-primary"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "Cancel" : "New Complaint"}
          </button>
        )}
      </div>

      {error && <div className="alert error">{error}</div>}
      {success && <div className="alert success">{success}</div>}

      {showForm && (
        <div className="complaint-form-container card">
          <h2>Submit a Complaint</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Complaint Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
              >
                {complaintTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Brief summary of the issue"
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="5"
                placeholder="Please provide detailed information..."
              />
            </div>

            <div className="form-group">
              <label>Trip ID (Optional)</label>
              <input
                type="number"
                name="tripId"
                value={formData.tripId}
                onChange={handleChange}
                placeholder="Related trip ID"
              />
            </div>

            <div className="form-group">
              <label>Reported User ID (Optional)</label>
              <input
                type="number"
                name="reportedUserId"
                value={formData.reportedUserId}
                onChange={handleChange}
                placeholder="ID of the user you are reporting (if applicable)"
              />
            </div>

            <button type="submit" className="btn-submit">Submit Complaint</button>
          </form>
        </div>
      )}

      <div className="complaints-list">
        {loading ? (
          <p>Loading...</p>
        ) : complaints.length === 0 ? (
          <div className="empty-state">
            <p>No complaints found.</p>
          </div>
        ) : (
          complaints.map(complaint => (
            <div key={complaint.id} className="complaint-card card">
              <div className="complaint-header">
                <span className={`status-badge ${complaint.status.toLowerCase()}`}>
                  {complaint.status}
                </span>
                <span className="complaint-date">
                  {new Date(complaint.createdAt).toLocaleDateString()}
                </span>
              </div>
              <h3>{complaint.title}</h3>
              <p className="complaint-type">Type: {complaint.type}</p>
              <p className="complaint-desc">{complaint.description}</p>
              {user?.role === "ADMIN" && (
                <>
                  <p className="complaint-by">Reported by: {complaint.reportedByName}</p>
                  {complaint.reportedUser && (
                    <p className="complaint-by">Against: {complaint.reportedUserName}</p>
                  )}
                </>
              )}

              {complaint.adminResponse && (
                <div className="admin-response">
                  <h4>Admin Response:</h4>
                  <p>{complaint.adminResponse}</p>
                </div>
              )}

              {user?.role === "ADMIN" && (complaint.status === "PENDING" || complaint.status === "OPEN") && (
                <div className="reply-section">
                  <textarea
                    placeholder="Type your response..."
                    value={replyData[complaint.id] || ""}
                    onChange={(e) => setReplyData({ ...replyData, [complaint.id]: e.target.value })}
                    rows="3"
                  />
                  <button onClick={() => handleReply(complaint.id)} className="btn-reply">
                    Send Reply
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Complaints;
