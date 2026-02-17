import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaArrowLeft, FaCalendarCheck, FaClipboardList, FaBook, FaFileAlt, FaLayerGroup } from "react-icons/fa";

const TeacherDashboard = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
  const teacherName = location.state?.name || user.full_name || "Teacher";

  const dashboardItems = [
    {
      id: 1,
      title: "Assigned Batches",
      description: "View your assigned batches",
      icon: <FaLayerGroup />,
      path: "/teacher/assigned-batches",
      color: "#10b981"
    },
    {
      id: 2,
      title: "Attendance",
      description: "Mark student attendance",
      icon: <FaCalendarCheck />,
      path: "/teacher/attendance",
      color: "#667eea"
    },
    {
      id: 3,
      title: "Students Marks",
      description: "Upload and manage test marks",
      icon: <FaClipboardList />,
      path: "/teacher/marks",
      color: "#764ba2"
    },
    {
      id: 4,
      title: "Materials",
      description: "Upload study materials",
      icon: <FaBook />,
      path: "/teacher/materials",
      color: "#f59e0b"
    },
    {
      id: 5,
      title: "Tests",
      description: "Create and manage tests",
      icon: <FaFileAlt />,
      path: "/teacher/tests",
      color: "#06b6d4"
    }
  ];

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
        maxWidth: "1200px", 
        margin: "0 auto", 
        padding: isMobile ? "1rem" : "2rem",
        width: "100%",
        boxSizing: "border-box"
      }}>
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
            Welcome, {teacherName}
          </h1>
          <p style={{
            color: "#fff",
            fontSize: isMobile ? "1rem" : "1.2rem",
            opacity: 0.9
          }}>
            Teacher Dashboard
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(280px, 1fr))",
          gap: isMobile ? "2rem" : "6rem",
          padding: "2rem 0",
          width: "100%",
          boxSizing: "border-box"
        }}>
          {dashboardItems.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              state={{ name: teacherName }}
              style={{
                textDecoration: "none",
                color: "inherit",
                position: "relative"
              }}
            >
              <div
                style={{
                  background: "#fff",
                  borderRadius: "16px",
                  padding: isMobile ? "1.5rem" : "2rem",
                  cursor: "pointer",
                  transition: "all 0.3s",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  position: "relative",
                  zIndex: 1,
                  width: "100%",
                  maxWidth: "100%",
                  boxSizing: "border-box"
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
                  width: isMobile ? "60px" : "80px",
                  height: isMobile ? "60px" : "80px",
                  background: `linear-gradient(135deg, ${item.color}, ${item.color}dd)`,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: isMobile ? "1.5rem" : "2rem",
                  color: "#fff",
                  marginBottom: "1.5rem",
                  boxShadow: `0 8px 20px ${item.color}40`
                }}>
                  {item.icon}
                </div>
                <h3 style={{
                  fontSize: isMobile ? "1.2rem" : "1.5rem",
                  color: "#333",
                  marginBottom: "0.5rem",
                  fontWeight: "bold",
                  wordBreak: "break-word"
                }}>
                  {item.title}
                </h3>
                <p style={{
                  color: "#666",
                  fontSize: "0.95rem",
                  margin: 0
                }}>
                  {item.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
