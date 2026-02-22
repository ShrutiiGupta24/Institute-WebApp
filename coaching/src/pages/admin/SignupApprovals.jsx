import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaUserCheck, FaUserClock, FaUserTimes, FaUsers } from "react-icons/fa";
import {
  fetchSignupRequests,
  approveSignupRequest,
  rejectSignupRequest
} from "../../services/signupService";

const statusFilters = [
  { label: "All", value: "all", icon: <FaUsers /> },
  { label: "Pending", value: "pending", icon: <FaUserClock /> },
  { label: "Approved", value: "approved", icon: <FaUserCheck /> },
  { label: "Rejected", value: "rejected", icon: <FaUserTimes /> }
];

const statusColors = {
  pending: "#fbbf24",
  approved: "#34d399",
  rejected: "#f87171"
};

const statusGradients = {
  pending: "linear-gradient(135deg, #fde68a, #fbbf24)",
  approved: "linear-gradient(135deg, #6ee7b7, #34d399)",
  rejected: "linear-gradient(135deg, #fecdd3, #f87171)"
};

const statusIcons = {
  pending: <FaUserClock />,
  approved: <FaUserCheck />,
  rejected: <FaUserTimes />
};

const roleAccents = {
  admin: "#0ea5e9",
  teacher: "#f59e0b",
  student: "#8b5cf6"
};

const SignupApprovals = () => {
  const [allRequests, setAllRequests] = useState([]);
  const [filter, setFilter] = useState("pending");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  const loadRequests = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetchSignupRequests();
      setAllRequests(response.data || []);
    } catch (err) {
      const apiMessage = err.response?.data?.detail || err.message || "Unable to load requests";
      setError(apiMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const filteredRequests = useMemo(() => {
    if (filter === "all") {
      return allRequests;
    }
    return allRequests.filter((req) => req.status === filter);
  }, [allRequests, filter]);

  const pendingCount = useMemo(
    () => allRequests.filter((req) => req.status === "pending").length,
    [allRequests]
  );

  const handleApprove = async (requestId) => {
    try {
      await approveSignupRequest(requestId, {});
      setFeedback({ type: "success", message: "Signup request approved" });
      loadRequests();
    } catch (err) {
      const apiMessage = err.response?.data?.detail || err.message || "Unable to approve request";
      setFeedback({ type: "error", message: apiMessage });
    }
  };

  const handleReject = async (requestId) => {
    const note = window.prompt("Reason for rejection (optional)", "");
    try {
      await rejectSignupRequest(requestId, note ? { note } : {});
      setFeedback({ type: "success", message: "Signup request rejected" });
      loadRequests();
    } catch (err) {
      const apiMessage = err.response?.data?.detail || err.message || "Unable to reject request";
      setFeedback({ type: "error", message: apiMessage });
    }
  };

  return (
    <div
      style={{
        minHeight: "calc(100vh - 160px)",
        background: "linear-gradient(135deg, #0f172a, #1f2937 40%, #312e81)",
        padding: "3rem 1rem"
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <Link
          to="/admin/dashboard"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            color: "#f8fafc",
            textDecoration: "none",
            marginBottom: "1.5rem",
            fontWeight: 600
          }}
        >
          <FaArrowLeft /> Back to Dashboard
        </Link>

        <div
          style={{
            background: "rgba(255,255,255,0.08)",
            borderRadius: "24px",
            padding: "2rem",
            border: "1px solid rgba(255,255,255,0.15)",
            boxShadow: "0 25px 50px rgba(15,23,42,0.35)",
            color: "#f8fafc"
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "2rem" }}>
            <p style={{ letterSpacing: "0.35em", textTransform: "uppercase", fontSize: "0.75rem", color: "#c7d2fe" }}>
              Access Control
            </p>
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
              <div>
                <h1 style={{ fontFamily: "'Playfair Display', 'Georgia', serif", fontSize: "clamp(1.8rem, 4vw, 2.7rem)", margin: 0 }}>
                  Approve signup requests
                </h1>
                <p style={{ color: "rgba(248,250,252,0.75)", maxWidth: "620px", lineHeight: 1.7 }}>
                  Review every access request before activating a dashboard. Approved profiles receive immediate login capability with the credentials they submitted.
                </p>
              </div>
              <div
                style={{
                  minWidth: "220px",
                  background: "rgba(15,23,42,0.4)",
                  borderRadius: "18px",
                  padding: "1rem 1.2rem",
                  border: "1px solid rgba(255,255,255,0.12)",
                  textAlign: "center"
                }}
              >
                <p style={{ margin: 0, color: "#a5b4fc", textTransform: "uppercase", letterSpacing: "0.25em", fontSize: "0.75rem" }}>Pending</p>
                <p style={{ margin: 0, fontSize: "2.4rem", fontWeight: 700 }}>{pendingCount}</p>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
            {statusFilters.map((status) => (
              <button
                key={status.value}
                onClick={() => setFilter(status.value)}
                style={{
                  border: "none",
                  borderRadius: "999px",
                  padding: "0.55rem 1.1rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  cursor: "pointer",
                  background: filter === status.value ? "#f8fafc" : "rgba(255,255,255,0.15)",
                  color: filter === status.value ? "#111827" : "#f8fafc",
                  fontWeight: 600
                }}
              >
                {status.icon}
                {status.label}
              </button>
            ))}
          </div>

          {feedback.message && (
            <div
              style={{
                marginBottom: "1rem",
                padding: "0.9rem 1rem",
                borderRadius: "14px",
                background: feedback.type === "success" ? "#ecfdf5" : "#fef2f2",
                color: feedback.type === "success" ? "#065f46" : "#b91c1c",
                fontWeight: 600
              }}
            >
              {feedback.message}
            </div>
          )}

          {error && (
            <div style={{ color: "#fecdd3", marginBottom: "1rem", fontWeight: 600 }}>{error}</div>
          )}

          {loading ? (
            <p style={{ color: "rgba(248,250,252,0.7)" }}>Loading requests...</p>
          ) : filteredRequests.length === 0 ? (
            <p style={{ color: "rgba(248,250,252,0.7)" }}>No requests found for this filter.</p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
              {filteredRequests.map((request) => {
                const roleKey = request.desired_role ? request.desired_role.toLowerCase() : "";
                const roleColor = roleAccents[roleKey] || "#475569";

                return (
                  <div
                    key={request.id}
                    style={{
                    position: "relative",
                    overflow: "hidden",
                    background: "#fff",
                    borderRadius: "22px",
                    padding: "1.8rem",
                    color: "#0f172a",
                    boxShadow: "0 20px 45px rgba(15,23,42,0.18)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.75rem",
                    border: "1px solid rgba(15,23,42,0.06)"
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "6px",
                      background: statusGradients[request.status] || "#e2e8f0"
                    }}
                  />

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                      <div
                        style={{
                          width: "58px",
                          height: "58px",
                          borderRadius: "18px",
                          background: statusGradients[request.status] || "#e2e8f0",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "1.6rem",
                          color: "#0f172a",
                          boxShadow: "0 10px 20px rgba(15,23,42,0.15)"
                        }}
                      >
                        {statusIcons[request.status] || <FaUsers />}
                      </div>
                      <div>
                        <h3 style={{ margin: 0, fontSize: "1.35rem" }}>{request.full_name}</h3>
                        <p style={{ margin: 0, color: "#475569", fontWeight: 600 }}>{request.email}</p>
                        <p style={{ margin: 0, color: "#94a3b8", fontSize: "0.85rem" }}>
                          Submitted {new Date(request.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <span
                      style={{
                        borderRadius: "999px",
                        padding: "0.2rem 0.9rem",
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        color: "#111827",
                        background: statusColors[request.status] || "#e5e7eb"
                      }}
                    >
                      {request.status}
                    </span>
                  </div>

                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                    <span
                      style={{
                        borderRadius: "999px",
                        padding: "0.35rem 0.9rem",
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        background: roleColor + "22",
                        color: roleColor
                      }}
                    >
                      {request.desired_role} role
                    </span>
                    <span
                      style={{
                        borderRadius: "999px",
                        padding: "0.35rem 0.9rem",
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        background: "#e2e8f0",
                        color: "#334155"
                      }}
                    >
                      {request.phone}
                    </span>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "0.6rem" }}>
                    <div style={{ background: "#f8fafc", borderRadius: "12px", padding: "0.6rem 0.8rem" }}>
                      <p style={{ margin: 0, color: "#94a3b8", fontSize: "0.75rem", textTransform: "uppercase" }}>Username</p>
                      <p style={{ margin: 0, fontWeight: 600 }}>{request.username}</p>
                    </div>
                    <div style={{ background: "#f8fafc", borderRadius: "12px", padding: "0.6rem 0.8rem" }}>
                      <p style={{ margin: 0, color: "#94a3b8", fontSize: "0.75rem", textTransform: "uppercase" }}>Focus</p>
                      <p style={{ margin: 0, fontWeight: 600 }}>{request.academic_focus || "--"}</p>
                    </div>
                  </div>

                  {request.motivations && (
                    <div
                      style={{
                        background: "rgba(99,102,241,0.08)",
                        borderRadius: "14px",
                        padding: "0.8rem 1rem",
                        color: "#4c1d95",
                        lineHeight: 1.45,
                        fontWeight: 500
                      }}
                    >
                      "{request.motivations}"
                    </div>
                  )}
                  {request.admin_note && (
                    <p style={{ margin: 0, color: "#9333ea", lineHeight: 1.4 }}>Note: {request.admin_note}</p>
                  )}

                  {request.status === "pending" && (
                    <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.8rem" }}>
                      <button
                        onClick={() => handleApprove(request.id)}
                        style={{
                          flex: 1,
                          border: "none",
                          borderRadius: "12px",
                          padding: "0.7rem 1rem",
                          background: "linear-gradient(135deg, #34d399, #10b981)",
                          color: "#fff",
                          fontWeight: 600,
                          cursor: "pointer",
                          boxShadow: "0 10px 20px rgba(16,185,129,0.35)"
                        }}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(request.id)}
                        style={{
                          flex: 1,
                          border: "none",
                          borderRadius: "12px",
                          padding: "0.7rem 1rem",
                          background: "linear-gradient(135deg, #f87171, #ef4444)",
                          color: "#fff",
                          fontWeight: 600,
                          cursor: "pointer",
                          boxShadow: "0 10px 20px rgba(239,68,68,0.35)"
                        }}
                      >
                        Reject
                      </button>
                    </div>
                  )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignupApprovals;
