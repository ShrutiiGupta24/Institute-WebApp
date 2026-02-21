import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaArrowLeft, FaCalendarCheck, FaBook, FaChartLine, FaMoneyBillWave, FaClipboardList } from "react-icons/fa";
import NotificationCenter from "../../components/notifications/NotificationCenter";

const StudentDashboard = () => {
  const location = useLocation();
  let user = {};
  try {
    const userData = localStorage.getItem("user");
    if (userData) {
      user = JSON.parse(userData);
    }
  } catch (e) {
    console.error("Error parsing user data:", e);
  }
  const studentName = location.state?.name || user.full_name || "Student";
  const dashboardItems = [
    {
      title: "View Attendance",
      icon: <FaCalendarCheck />,
      path: "/student/attendance",
      description: "Check your attendance records",
      color: "#667eea"
    },
    {
      title: "Study Material",
      icon: <FaBook />,
      path: "/student/study-material",
      description: "Access your study materials",
      color: "#764ba2"
    },
    {
      title: "Tests & Assignments",
      icon: <FaClipboardList />,
      path: "/student/test-assignments",
      description: "View available tests and assignments",
      color: "#f59e0b"
    },
    {
      title: "Test Results",
      icon: <FaChartLine />,
      path: "/student/test-results",
      description: "View your test scores",
      color: "#10b981"
    },
    {
      title: "Fees Status",
      icon: <FaMoneyBillWave />,
      path: "/student/fees-status",
      description: "Check your fee payment status",
      color: "#06b6d4"
    }
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      paddingTop: "2rem",
      paddingBottom: "4rem"
    }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
        <Link to="/" style={{
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
          Logout
        </Link>

        <h1 style={{
          textAlign: "center",
          color: "#fff",
          marginBottom: "1rem",
          fontSize: "2.5rem",
          textShadow: "2px 2px 4px rgba(0,0,0,0.3)"
        }}>
          Student Dashboard
        </h1>
        <p style={{
          textAlign: "center",
          color: "#fff",
          marginBottom: "3rem",
          fontSize: "1.1rem",
          opacity: 0.9
        }}>
          Welcome {studentName}! Manage your academic activities
        </p>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "2rem",
          padding: "1rem"
        }}>
          {dashboardItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              style={{
                textDecoration: "none",
                color: "inherit"
              }}
            >
              <div
                style={{
                  background: "#fff",
                  borderRadius: "16px",
                  padding: "2rem",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  height: "200px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center"
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-10px)";
                  e.currentTarget.style.boxShadow = "0 15px 40px rgba(0,0,0,0.3)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.2)";
                }}
              >
                <div style={{
                  fontSize: "3rem",
                  color: item.color,
                  marginBottom: "1rem"
                }}>
                  {item.icon}
                </div>
                <h3 style={{
                  fontSize: "1.5rem",
                  color: "#333",
                  marginBottom: "0.5rem",
                  fontWeight: "bold"
                }}>
                  {item.title}
                </h3>
                <p style={{
                  fontSize: "0.9rem",
                  color: "#666",
                  lineHeight: "1.5"
                }}>
                  {item.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div style={{ marginTop: "3rem" }}>
          <NotificationCenter accentColor="#06b6d4" />
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
