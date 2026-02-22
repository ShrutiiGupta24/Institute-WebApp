import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaArrowLeft,FaBook, FaMoneyBillWave, FaUserGraduate, FaChalkboardTeacher, FaLayerGroup, FaChartBar, FaUserPlus } from "react-icons/fa";
import { useAdminData } from "../../store/adminDataContext";
import NotificationCenter from "../../components/notifications/NotificationCenter";

const AdminDashboard = () => {
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
  const adminName = location.state?.name || user.full_name || "Admin";
  const { stats, refreshStudents, refreshTeachers, refreshBatches, refreshCourses } = useAdminData();

  // Refresh data when component mounts to show real-time stats
  useEffect(() => {
    const refreshAllData = async () => {
      await Promise.all([
        refreshStudents(),
        refreshTeachers(),
        refreshBatches(),
        refreshCourses()
      ]);
    };
    refreshAllData();
  }, [refreshStudents, refreshTeachers, refreshBatches, refreshCourses]);

  const dashboardItems = [
    {
      id: 1,
      title: "Batches",
      description: "Manage class batches and schedules",
      icon: <FaLayerGroup />,
      color: "#667eea",
      path: "/admin/batches"
    },
    {
      id: 2,
      title: "Courses",
      description: "Manage courses and subjects",
      icon: <FaBook />,
      color: "#764ba2",
      path: "/admin/courses"
    },
    {
      id: 3,
      title: "Fees",
      description: "Fee structure and payment tracking",
      icon: <FaMoneyBillWave />,
      color: "#f59e0b",
      path: "/admin/fees"
    },
    {
      id: 4,
      title: "Student Management",
      description: "Add, edit and manage students",
      icon: <FaUserGraduate />,
      color: "#10b981",
      path: "/admin/students"
    },
    {
      id: 5,
      title: "Teacher Management",
      description: "Add, edit and manage teachers",
      icon: <FaChalkboardTeacher />,
      color: "#06b6d4",
      path: "/admin/teachers"
    },
    {
      id: 6,
      title: "Reports",
      description: "View analytics and generate reports",
      icon: <FaChartBar />,
      color: "#8b5cf6",
      path: "/admin/reports"
    },
    {
      id: 7,
      title: "Signup Requests",
      description: "Approve pending access",
      icon: <FaUserPlus />,
      color: "#f43f5e",
      path: "/admin/signup-requests"
    }
  ];

  return (
    <div style={{
      minHeight: "calc(100vh - 160px)",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      paddingTop: "2rem",
      paddingBottom: "2rem"
    }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "2rem 3rem" }}>
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
          marginBottom: "4rem"
        }}>
          <h1 style={{
            color: "#fff",
            fontSize: "2.5rem",
            marginBottom: "0.5rem",
            textShadow: "2px 2px 4px rgba(0,0,0,0.3)"
          }}>
            Admin Dashboard
          </h1>
          <p style={{
            color: "rgba(255,255,255,0.9)",
            fontSize: "1.2rem"
          }}>
            Welcome, {adminName}
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "8rem",
          rowGap: "8rem",
          marginBottom: "8rem"
        }}>
          {dashboardItems.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              state={{ name: adminName }}
              style={{
                textDecoration: "none",
                color: "inherit"
              }}
            >
              <div style={{
                background: "#fff",
                borderRadius: "14px",
                padding: "2rem",
                cursor: "pointer",
                transition: "all 0.3s",
                boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                minHeight: "240px"
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
                  width: "70px",
                  height: "70px",
                  background: `linear-gradient(135deg, ${item.color}, ${item.color}dd)`,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "1.3rem",
                  fontSize: "1.8rem",
                  color: "#fff",
                  boxShadow: `0 8px 20px ${item.color}40`
                }}>
                  {item.icon}
                </div>
                <h3 style={{
                  fontSize: "1.35rem",
                  color: "#333",
                  marginBottom: "0.7rem",
                  fontWeight: "bold"
                }}>
                  {item.title}
                </h3>
                <p style={{
                  color: "#666",
                  fontSize: "0.95rem",
                  lineHeight: "1.5"
                }}>
                  {item.description}
                </p>
              </div>
            </Link>
          ))}
          <div style={{ height: "100%" }}>
            <NotificationCenter canManage accentColor="#f97316" variant="card" />
          </div>
        </div>

        {/* Quick Stats Section */}
        <div style={{
          background: "rgba(255,255,255,0.15)",
          backdropFilter: "blur(10px)",
          borderRadius: "16px",
          padding: "2rem",
          border: "1px solid rgba(255,255,255,0.2)"
        }}>
          <h3 style={{
            color: "#fff",
            fontSize: "1.5rem",
            marginBottom: "1.5rem",
            textAlign: "center"
          }}>
            Quick Stats
          </h3>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: "1.5rem"
          }}>
            <div style={{
              background: "rgba(255,255,255,0.2)",
              padding: "1.5rem",
              borderRadius: "12px",
              textAlign: "center"
            }}>
              <div style={{
                fontSize: "2.5rem",
                fontWeight: "bold",
                color: "#fff",
                marginBottom: "0.5rem"
              }}>
                {stats.totalStudents}
              </div>
              <div style={{
                color: "rgba(255,255,255,0.9)",
                fontSize: "1rem"
              }}>
                Total Students
              </div>
            </div>
            <div style={{
              background: "rgba(255,255,255,0.2)",
              padding: "1.5rem",
              borderRadius: "12px",
              textAlign: "center"
            }}>
              <div style={{
                fontSize: "2.5rem",
                fontWeight: "bold",
                color: "#fff",
                marginBottom: "0.5rem"
              }}>
                {stats.totalTeachers}
              </div>
              <div style={{
                color: "rgba(255,255,255,0.9)",
                fontSize: "1rem"
              }}>
                Total Teachers
              </div>
            </div>
            <div style={{
              background: "rgba(255,255,255,0.2)",
              padding: "1.5rem",
              borderRadius: "12px",
              textAlign: "center"
            }}>
              <div style={{
                fontSize: "2.5rem",
                fontWeight: "bold",
                color: "#fff",
                marginBottom: "0.5rem"
              }}>
                {stats.activeBatches}
              </div>
              <div style={{
                color: "rgba(255,255,255,0.9)",
                fontSize: "1rem"
              }}>
                Active Batches
              </div>
            </div>
            <div style={{
              background: "rgba(255,255,255,0.2)",
              padding: "1.5rem",
              borderRadius: "12px",
              textAlign: "center"
            }}>
              <div style={{
                fontSize: "2.5rem",
                fontWeight: "bold",
                color: "#fff",
                marginBottom: "0.5rem"
              }}>
                {stats.totalCourses}
              </div>
              <div style={{
                color: "rgba(255,255,255,0.9)",
                fontSize: "1rem"
              }}>
                Courses
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
