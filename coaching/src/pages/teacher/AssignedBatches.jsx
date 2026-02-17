import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { FaArrowLeft, FaLayerGroup, FaBook, FaClock, FaCalendar, FaUsers } from "react-icons/fa";
import api from "../../services/api";

const AssignedBatches = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const location = useLocation();
  let user = {};
  try {
    const userData = localStorage.getItem("user");
    if (userData) user = JSON.parse(userData);
  } catch (e) {}
  const teacherName = location.state?.name || user.full_name || "Teacher";
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetchAssignedBatches();
  }, []);

  const fetchAssignedBatches = async () => {
    try {
      setLoading(true);
      const response = await api.get("/teacher/batches");
      setBatches(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching assigned batches:", err);
      setError("Failed to load assigned batches");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "calc(100vh - 160px)",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      paddingTop: "2rem",
      paddingBottom: "2rem",
      width: "100%",
      overflowX: "hidden"
    }}>
      <div style={{ 
        maxWidth: "1400px", 
        margin: "0 auto", 
        padding: isMobile ? "1rem" : "2rem 3rem",
        width: "100%",
        boxSizing: "border-box"
      }}>
        <Link
          to="/teacher/dashboard"
          state={{ name: teacherName }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            color: "#fff",
            textDecoration: "none",
            marginBottom: "2rem",
            fontSize: "1rem",
            transition: "opacity 0.3s"
          }}
          onMouseOver={(e) => e.currentTarget.style.opacity = "0.8"}
          onMouseOut={(e) => e.currentTarget.style.opacity = "1"}
        >
          <FaArrowLeft style={{ marginRight: "0.5rem" }} />
          Back to Dashboard
        </Link>

        <div style={{
          textAlign: "center",
          marginBottom: "3rem"
        }}>
          <h1 style={{
            color: "#fff",
            fontSize: isMobile ? "1.8rem" : "2.5rem",
            marginBottom: "0.5rem",
            textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
            wordBreak: "break-word"
          }}>
            My Assigned Batches
          </h1>
          <p style={{
            color: "rgba(255,255,255,0.9)",
            fontSize: isMobile ? "0.95rem" : "1.1rem"
          }}>
            View all batches assigned to you
          </p>
        </div>

        {loading && (
          <div style={{
            textAlign: "center",
            color: "#fff",
            fontSize: "1.2rem",
            padding: "2rem"
          }}>
            Loading assigned batches...
          </div>
        )}

        {error && (
          <div style={{
            background: "rgba(239, 68, 68, 0.2)",
            border: "1px solid rgba(239, 68, 68, 0.5)",
            color: "#fff",
            padding: "1rem",
            borderRadius: "8px",
            marginBottom: "2rem",
            textAlign: "center"
          }}>
            {error}
          </div>
        )}

        {!loading && !error && batches.length === 0 && (
          <div style={{
            background: "rgba(255,255,255,0.15)",
            backdropFilter: "blur(10px)",
            borderRadius: "16px",
            padding: "3rem",
            textAlign: "center",
            border: "1px solid rgba(255,255,255,0.2)"
          }}>
            <FaLayerGroup style={{ fontSize: "4rem", color: "#fff", marginBottom: "1rem", opacity: 0.5 }} />
            <h3 style={{ color: "#fff", fontSize: "1.5rem", marginBottom: "0.5rem" }}>
              No Batches Assigned
            </h3>
            <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "1rem" }}>
              You don't have any batches assigned to you yet. Please contact the admin.
            </p>
          </div>
        )}

        {!loading && !error && batches.length > 0 && (
          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(350px, 1fr))",
            gap: isMobile ? "1.5rem" : "2rem",
            width: "100%",
            boxSizing: "border-box"
          }}>
            {batches.map((batch) => (
              <div
                key={batch.id}
                style={{
                  background: "rgba(255,255,255,0.15)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "16px",
                  padding: isMobile ? "1.5rem" : "2rem",
                  border: "1px solid rgba(255,255,255,0.2)",
                  transition: "all 0.3s",
                  cursor: "default",
                  width: "100%",
                  maxWidth: "100%",
                  boxSizing: "border-box"
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.3)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "1.5rem",
                  width: "100%",
                  boxSizing: "border-box"
                }}>
                  <div style={{
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    width: isMobile ? "45px" : "50px",
                    height: isMobile ? "45px" : "50px",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: "1rem",
                    flexShrink: 0
                  }}>
                    <FaLayerGroup style={{ fontSize: "1.5rem", color: "#fff" }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      color: "#fff",
                      fontSize: isMobile ? "1.1rem" : "1.3rem",
                      marginBottom: "0.25rem",
                      fontWeight: "600",
                      wordBreak: "break-word"
                    }}>
                      {batch.name}
                    </h3>
                    <p style={{
                      color: "rgba(255,255,255,0.7)",
                      fontSize: "0.9rem",
                      margin: 0,
                      wordBreak: "break-word"
                    }}>
                      Code: {batch.code}
                    </p>
                  </div>
                </div>

                <div style={{ marginBottom: "1rem" }}>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "0.75rem",
                    color: "rgba(255,255,255,0.9)"
                  }}>
                    <FaBook style={{ marginRight: "0.75rem", fontSize: "1rem" }} />
                    <span style={{ fontSize: "0.95rem" }}>
                      <strong>Course:</strong> {batch.course_name || "N/A"}
                    </span>
                  </div>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "0.75rem",
                    color: "rgba(255,255,255,0.9)"
                  }}>
                    <FaClock style={{ marginRight: "0.75rem", fontSize: "1rem" }} />
                    <span style={{ fontSize: "0.95rem" }}>
                      <strong>Timing:</strong> {batch.timing || "Not set"}
                    </span>
                  </div>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "0.75rem",
                    color: "rgba(255,255,255,0.9)"
                  }}>
                    <FaCalendar style={{ marginRight: "0.75rem", fontSize: "1rem" }} />
                    <span style={{ fontSize: "0.95rem" }}>
                      <strong>Days:</strong> {batch.days || "Not set"}
                    </span>
                  </div>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    color: "rgba(255,255,255,0.9)"
                  }}>
                    <FaUsers style={{ marginRight: "0.75rem", fontSize: "1rem" }} />
                    <span style={{ fontSize: "0.95rem" }}>
                      <strong>Students:</strong> {batch.student_count || 0}
                    </span>
                  </div>
                </div>

                {batch.description && (
                  <div style={{
                    background: "rgba(255,255,255,0.1)",
                    padding: "0.75rem",
                    borderRadius: "8px",
                    marginTop: "1rem"
                  }}>
                    <p style={{
                      color: "rgba(255,255,255,0.8)",
                      fontSize: "0.9rem",
                      margin: 0,
                      lineHeight: "1.4"
                    }}>
                      {batch.description}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignedBatches;
