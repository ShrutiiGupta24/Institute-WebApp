import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import api from "../../services/api";

const AttendanceView = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [overallStats, setOverallStats] = useState({
    totalClasses: 0,
    totalAttended: 0,
    percentage: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        setLoading(true);
        const response = await api.get("/student/attendance");
        
        // Add colors to each subject
        const colors = ["#667eea", "#764ba2", "#f59e0b", "#10b981", "#06b6d4", "#8b5cf6"];
        const attendanceWithColors = response.data.attendance.map((item, index) => ({
          ...item,
          color: colors[index % colors.length]
        }));
        
        setAttendanceData(attendanceWithColors);
        setOverallStats(response.data.overall);
      } catch (err) {
        console.error("Error fetching attendance:", err);
        setError("Failed to load attendance data");
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <div style={{ color: "#fff", fontSize: "1.5rem" }}>Loading attendance...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: "1rem"
      }}>
        <div style={{ color: "#fff", fontSize: "1.5rem" }}>{error}</div>
        <Link to="/student/dashboard" style={{
          color: "#fff",
          textDecoration: "underline"
        }}>
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "calc(100vh - 160px)",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      paddingTop: "2rem",
      paddingBottom: "2rem"
    }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
        <Link to="/student/dashboard" style={{
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

        <h1 style={{
          textAlign: "center",
          color: "#fff",
          marginBottom: "1rem",
          fontSize: "2.5rem",
          textShadow: "2px 2px 4px rgba(0,0,0,0.3)"
        }}>
          Attendance Report
        </h1>

        {/* Bar Chart View */}
        <div style={{
            background: "#fff",
            borderRadius: "16px",
            padding: "2rem",
            marginBottom: "2rem",
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
          }}>
            <h3 style={{
              fontSize: "1.5rem",
              color: "#333",
              marginBottom: "2rem",
              textAlign: "center",
              fontWeight: "bold"
            }}>
              Subject-wise Attendance
            </h3>
            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem"
            }}>
              {attendanceData.map((item, index) => (
                <div key={index}>
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "0.5rem"
                  }}>
                    <span style={{ fontWeight: "600", color: "#333" }}>
                      {item.subject}
                    </span>
                    <span style={{
                      fontWeight: "bold",
                      color: item.color,
                      fontSize: "1.1rem"
                    }}>
                      {item.percentage}%
                    </span>
                  </div>
                  <div style={{
                    height: "40px",
                    background: "#f0f0f0",
                    borderRadius: "20px",
                    overflow: "hidden",
                    position: "relative"
                  }}>
                    <div style={{
                      height: "100%",
                      width: `${item.percentage}%`,
                      background: `linear-gradient(90deg, ${item.color}, ${item.color}dd)`,
                      borderRadius: "20px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-end",
                      paddingRight: "1rem",
                      color: "#fff",
                      fontWeight: "600",
                      transition: "width 1s ease",
                      boxShadow: `0 2px 10px ${item.color}40`
                    }}>
                      {item.attended}/{item.totalClasses}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        {/* Overall Summary */}
        <div style={{
          background: "#fff",
          borderRadius: "12px",
          padding: "1.5rem",
          boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
        }}>
          <h3 style={{
            fontSize: "1.2rem",
            color: "#333",
            marginBottom: "1rem",
            fontWeight: "bold",
            textAlign: "center"
          }}>
            Summary Statistics
          </h3>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1rem"
          }}>
            <div style={{
              textAlign: "center",
              padding: "1rem",
              background: "linear-gradient(135deg, #667eea20, #764ba220)",
              borderRadius: "12px"
            }}>
              <div style={{ fontSize: "1.8rem", fontWeight: "bold", color: "#667eea" }}>
                {overallStats.totalClasses}
              </div>
              <div style={{ fontSize: "0.9rem", color: "#666", marginTop: "0.3rem" }}>
                Total Classes
              </div>
            </div>
            <div style={{
              textAlign: "center",
              padding: "1rem",
              background: "linear-gradient(135deg, #06b6d420, #06b6d420)",
              borderRadius: "12px"
            }}>
              <div style={{ fontSize: "1.8rem", fontWeight: "bold", color: "#06b6d4" }}>
                {overallStats.totalAttended}
              </div>
              <div style={{ fontSize: "0.9rem", color: "#666", marginTop: "0.3rem" }}>
                Classes Attended
              </div>
            </div>
            <div style={{
              textAlign: "center",
              padding: "1rem",
              background: "linear-gradient(135deg, #764ba220, #667eea20)",
              borderRadius: "12px"
            }}>
              <div style={{ fontSize: "1.8rem", fontWeight: "bold", color: "#764ba2" }}>
                {overallStats.percentage.toFixed(1)}%
              </div>
              <div style={{ fontSize: "0.9rem", color: "#666", marginTop: "0.3rem" }}>
                Overall Attendance
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceView;
