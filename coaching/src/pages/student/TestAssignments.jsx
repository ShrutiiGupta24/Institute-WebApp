import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaClipboardList, FaCheckCircle, FaClock, FaCalendarAlt } from "react-icons/fa";
import api from "../../services/api";

const TestAssignments = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all"); // all, completed, pending

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      setLoading(true);
      const response = await api.get("/student/available-tests");
      console.log("Tests:", response.data);
      setTests(response.data.tests || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching tests:", err);
      setError(err.response?.data?.detail || "Failed to load tests");
    } finally {
      setLoading(false);
    }
  };

  const filteredTests = tests.filter(test => {
    if (filter === "completed") return test.is_completed;
    if (filter === "pending") return !test.is_completed;
    return true;
  });

  const pendingCount = tests.filter(t => !t.is_completed).length;
  const completedCount = tests.filter(t => t.is_completed).length;

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
          marginBottom: "3rem",
          fontSize: "2.5rem",
          textShadow: "2px 2px 4px rgba(0,0,0,0.3)"
        }}>
          Tests & Assignments
        </h1>

        {/* Summary Cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1.5rem",
          marginBottom: "2rem"
        }}>
          <div style={{
            background: "#fff",
            borderRadius: "12px",
            padding: "1.5rem",
            textAlign: "center",
            boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
          }}>
            <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#667eea" }}>
              {tests.length}
            </div>
            <div style={{ fontSize: "0.9rem", color: "#666", marginTop: "0.5rem" }}>
              Total Tests
            </div>
          </div>
          <div style={{
            background: "#fff",
            borderRadius: "12px",
            padding: "1.5rem",
            textAlign: "center",
            boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
          }}>
            <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#f59e0b" }}>
              {pendingCount}
            </div>
            <div style={{ fontSize: "0.9rem", color: "#666", marginTop: "0.5rem" }}>
              Pending
            </div>
          </div>
          <div style={{
            background: "#fff",
            borderRadius: "12px",
            padding: "1.5rem",
            textAlign: "center",
            boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
          }}>
            <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#10b981" }}>
              {completedCount}
            </div>
            <div style={{ fontSize: "0.9rem", color: "#666", marginTop: "0.5rem" }}>
              Completed
            </div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div style={{
          display: "flex",
          gap: "1rem",
          marginBottom: "2rem",
          justifyContent: "center",
          flexWrap: "wrap"
        }}>
          {["all", "pending", "completed"].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: "0.7rem 1.5rem",
                background: filter === f ? "#fff" : "rgba(255,255,255,0.2)",
                color: filter === f ? "#667eea" : "#fff",
                border: "2px solid #fff",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "1rem",
                fontWeight: "600",
                textTransform: "capitalize",
                transition: "all 0.3s"
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div style={{
            textAlign: "center",
            color: "#fff",
            fontSize: "1.2rem",
            padding: "3rem"
          }}>
            Loading tests...
          </div>
        ) : error ? (
          <div style={{
            textAlign: "center",
            color: "#fff",
            fontSize: "1.2rem",
            padding: "3rem",
            background: "rgba(239, 68, 68, 0.2)",
            borderRadius: "12px"
          }}>
            {error}
          </div>
        ) : filteredTests.length === 0 ? (
          <div style={{
            textAlign: "center",
            color: "#fff",
            fontSize: "1.2rem",
            padding: "3rem",
            background: "rgba(255, 255, 255, 0.1)",
            borderRadius: "12px"
          }}>
            {filter === "all" ? "No tests available" : `No ${filter} tests`}
          </div>
        ) : (
          <div style={{
            display: "grid",
            gap: "1.5rem"
          }}>
            {filteredTests.map((test) => (
              <div
                key={test.id}
                style={{
                  background: "#fff",
                  borderRadius: "12px",
                  padding: "1.5rem",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                  borderLeft: `5px solid ${test.is_completed ? "#10b981" : "#f59e0b"}`
                }}
              >
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  flexWrap: "wrap",
                  gap: "1rem"
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      marginBottom: "0.5rem"
                    }}>
                      <h3 style={{
                        fontSize: "1.3rem",
                        color: "#333",
                        margin: 0
                      }}>
                        {test.title}
                      </h3>
                      {test.is_completed && (
                        <FaCheckCircle style={{ color: "#10b981", fontSize: "1.2rem" }} />
                      )}
                    </div>
                    
                    {test.description && (
                      <p style={{
                        color: "#666",
                        margin: "0.5rem 0",
                        fontSize: "0.95rem"
                      }}>
                        {test.description}
                      </p>
                    )}

                    <div style={{
                      display: "flex",
                      gap: "1.5rem",
                      flexWrap: "wrap",
                      marginTop: "1rem",
                      fontSize: "0.9rem",
                      color: "#666"
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                        <FaClipboardList />
                        <span>{test.course}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                        <FaCalendarAlt />
                        <span>{test.test_date ? new Date(test.test_date).toLocaleDateString() : "No date set"}</span>
                      </div>
                      {test.duration_minutes && (
                        <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                          <FaClock />
                          <span>{test.duration_minutes} minutes</span>
                        </div>
                      )}
                    </div>

                    <div style={{
                      marginTop: "0.7rem",
                      fontSize: "0.85rem",
                      color: "#999"
                    }}>
                      Teacher: {test.teacher_name}
                    </div>
                  </div>

                  <div style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    gap: "0.5rem"
                  }}>
                    <div style={{
                      padding: "0.5rem 1rem",
                      background: test.is_completed ? "#10b98120" : "#f59e0b20",
                      color: test.is_completed ? "#10b981" : "#f59e0b",
                      borderRadius: "8px",
                      fontWeight: "600",
                      fontSize: "0.9rem"
                    }}>
                      {test.is_completed ? "Completed" : "Pending"}
                    </div>
                    
                    <div style={{
                      textAlign: "right",
                      fontSize: "0.9rem",
                      color: "#666"
                    }}>
                      <div>Total Marks: {test.total_marks}</div>
                      {test.passing_marks && (
                        <div>Passing: {test.passing_marks}</div>
                      )}
                    </div>

                    {test.is_completed && test.marks_obtained !== null && (
                      <div style={{
                        marginTop: "0.5rem",
                        padding: "0.5rem 1rem",
                        background: test.percentage >= 40 ? "#10b98120" : "#ef444420",
                        borderRadius: "8px",
                        textAlign: "center"
                      }}>
                        <div style={{
                          fontSize: "1.3rem",
                          fontWeight: "bold",
                          color: test.percentage >= 40 ? "#10b981" : "#ef4444"
                        }}>
                          {test.marks_obtained}/{test.total_marks}
                        </div>
                        <div style={{ fontSize: "0.85rem", color: "#666" }}>
                          {test.percentage}%
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TestAssignments;
