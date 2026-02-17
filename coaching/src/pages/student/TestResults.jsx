import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaClipboardList, FaTrophy, FaChartLine } from "react-icons/fa";
import api from "../../services/api";

const TestResults = () => {
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTestResults = async () => {
      try {
        setLoading(true);
        const response = await api.get("/student/tests");
        console.log("Test Results API Response:", response.data);
        setSubjects(response.data.subjects || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching test results:", err);
        setError(err.response?.data?.detail || "Failed to load test results");
      } finally {
        setLoading(false);
      }
    };

    fetchTestResults();
  }, []);

  const getGradeColor = (percentage) => {
    if (percentage >= 90) return "#10b981";
    if (percentage >= 80) return "#06b6d4";
    if (percentage >= 70) return "#f59e0b";
    if (percentage >= 60) return "#f97316";
    return "#ef4444";
  };

  const calculateAverage = (tests) => {
    const total = tests.reduce((sum, test) => sum + test.percentage, 0);
    return (total / tests.length).toFixed(1);
  };

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
          Test Results
        </h1>
        <p style={{
          textAlign: "center",
          color: "#fff",
          marginBottom: "3rem",
          fontSize: "1.1rem",
          opacity: 0.9
        }}>
          Academic Year 2025-26
        </p>

        {loading ? (
          <div style={{
            textAlign: "center",
            color: "#fff",
            fontSize: "1.2rem",
            padding: "3rem"
          }}>
            Loading test results...
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
        ) : subjects.length === 0 ? (
          <div style={{
            textAlign: "center",
            color: "#fff",
            fontSize: "1.2rem",
            padding: "3rem",
            background: "rgba(255, 255, 255, 0.1)",
            borderRadius: "12px"
          }}>
            No test results available yet
          </div>
        ) : !selectedSubject ? (
          // Subject Selection View
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "2rem"
          }}>
            {subjects.map((subject) => {
              const average = calculateAverage(subject.tests);
              return (
                <div
                  key={subject.id}
                  onClick={() => setSelectedSubject(subject)}
                  style={{
                    background: "#fff",
                    borderRadius: "16px",
                    padding: "2rem",
                    cursor: "pointer",
                    transition: "all 0.3s",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
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
                    width: "80px",
                    height: "80px",
                    background: `linear-gradient(135deg, ${subject.color}, ${subject.color}dd)`,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 1.5rem"
                  }}>
                    <FaClipboardList style={{ fontSize: "2rem", color: "#fff" }} />
                  </div>
                  <h3 style={{
                    fontSize: "1.5rem",
                    color: "#333",
                    marginBottom: "0.5rem"
                  }}>
                    {subject.name}
                  </h3>
                  <div style={{
                    fontSize: "2rem",
                    fontWeight: "bold",
                    color: subject.color,
                    marginBottom: "0.3rem"
                  }}>
                    {average}%
                  </div>
                  <p style={{
                    color: "#666",
                    fontSize: "0.95rem"
                  }}>
                    Average Score • {subject.tests.length} tests
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          // Test Results List View
          <div>
            <button
              onClick={() => setSelectedSubject(null)}
              style={{
                background: "rgba(255,255,255,0.2)",
                color: "#fff",
                border: "none",
                padding: "0.8rem 1.5rem",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "1rem",
                marginBottom: "2rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                transition: "all 0.3s"
              }}
              onMouseOver={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.3)"}
              onMouseOut={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
            >
              <FaArrowLeft /> Back to Subjects
            </button>

            <div style={{
              background: "#fff",
              borderRadius: "16px",
              padding: "2rem",
              boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
              marginBottom: "2rem"
            }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "2rem",
                paddingBottom: "1.5rem",
                borderBottom: `3px solid ${selectedSubject.color}`,
                flexWrap: "wrap",
                gap: "1rem"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <div style={{
                    width: "60px",
                    height: "60px",
                    background: `linear-gradient(135deg, ${selectedSubject.color}, ${selectedSubject.color}dd)`,
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    <FaClipboardList style={{ fontSize: "1.5rem", color: "#fff" }} />
                  </div>
                  <div>
                    <h2 style={{
                      fontSize: "2rem",
                      color: "#333",
                      margin: 0
                    }}>
                      {selectedSubject.name}
                    </h2>
                    <p style={{ color: "#666", margin: "0.3rem 0 0 0" }}>
                      {selectedSubject.tests.length} tests conducted
                    </p>
                  </div>
                </div>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  background: `${selectedSubject.color}10`,
                  padding: "1rem 1.5rem",
                  borderRadius: "12px"
                }}>
                  <FaChartLine style={{ fontSize: "1.5rem", color: selectedSubject.color }} />
                  <div>
                    <div style={{ fontSize: "0.85rem", color: "#666" }}>Average Score</div>
                    <div style={{ fontSize: "1.8rem", fontWeight: "bold", color: selectedSubject.color }}>
                      {calculateAverage(selectedSubject.tests)}%
                    </div>
                  </div>
                </div>
              </div>

              <div style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem"
              }}>
                {selectedSubject.tests.map((test, index) => (
                  <div
                    key={test.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "1.5rem",
                      background: "#f9f9f9",
                      borderRadius: "12px",
                      transition: "all 0.3s",
                      borderLeft: `4px solid ${selectedSubject.color}`,
                      flexWrap: "wrap",
                      gap: "1rem"
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = "#f0f0f0";
                      e.currentTarget.style.transform = "translateX(5px)";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = "#f9f9f9";
                      e.currentTarget.style.transform = "translateX(0)";
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem", flex: 1, minWidth: "250px" }}>
                      <div style={{
                        width: "50px",
                        height: "50px",
                        background: `${selectedSubject.color}20`,
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "bold",
                        color: selectedSubject.color,
                        fontSize: "1.2rem"
                      }}>
                        #{index + 1}
                      </div>
                      <div style={{ flex: 1 }}>
                        <h4 style={{
                          fontSize: "1.1rem",
                          color: "#333",
                          margin: "0 0 0.3rem 0",
                          fontWeight: "600"
                        }}>
                          {test.testName}
                        </h4>
                        <div style={{
                          fontSize: "0.85rem",
                          color: "#666",
                          marginBottom: "0.2rem"
                        }}>
                          Test Date: {test.date}
                        </div>
                        <div style={{
                          fontSize: "0.8rem",
                          color: "#999",
                          fontStyle: "italic"
                        }}>
                          Uploaded by {test.uploadedBy} on {test.uploadDate}
                        </div>
                      </div>
                    </div>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "2rem",
                      flexWrap: "wrap"
                    }}>
                      <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: "0.8rem", color: "#666", marginBottom: "0.3rem" }}>
                          Marks
                        </div>
                        <div style={{
                          fontSize: "1.5rem",
                          fontWeight: "bold",
                          color: "#333"
                        }}>
                          {test.marksObtained}/{test.totalMarks}
                        </div>
                      </div>
                      <div style={{
                        padding: "0.8rem 1.5rem",
                        background: getGradeColor(test.percentage),
                        borderRadius: "12px",
                        textAlign: "center",
                        minWidth: "100px"
                      }}>
                        <div style={{ fontSize: "0.8rem", color: "#fff", marginBottom: "0.2rem" }}>
                          Percentage
                        </div>
                        <div style={{
                          fontSize: "1.5rem",
                          fontWeight: "bold",
                          color: "#fff"
                        }}>
                          {test.percentage}%
                        </div>
                      </div>
                      <div style={{
                        width: "60px",
                        height: "60px",
                        background: `linear-gradient(135deg, ${getGradeColor(test.percentage)}, ${getGradeColor(test.percentage)}dd)`,
                        borderRadius: "12px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                        boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
                      }}>
                        <FaTrophy style={{ fontSize: "1.2rem", color: "#fff", marginBottom: "0.2rem" }} />
                        <div style={{
                          fontSize: "1.1rem",
                          fontWeight: "bold",
                          color: "#fff"
                        }}>
                          {test.grade}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Summary */}
            <div style={{
              background: "#fff",
              borderRadius: "16px",
              padding: "2rem",
              boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
            }}>
              <h3 style={{
                fontSize: "1.3rem",
                color: "#333",
                marginBottom: "1.5rem",
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem"
              }}>
                <FaChartLine style={{ color: selectedSubject.color }} />
                Performance Summary
              </h3>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "1rem"
              }}>
                <div style={{
                  textAlign: "center",
                  padding: "1.5rem",
                  background: `${selectedSubject.color}10`,
                  borderRadius: "12px"
                }}>
                  <div style={{ fontSize: "2rem", fontWeight: "bold", color: selectedSubject.color }}>
                    {calculateAverage(selectedSubject.tests)}%
                  </div>
                  <div style={{ fontSize: "0.9rem", color: "#666", marginTop: "0.5rem" }}>
                    Average Score
                  </div>
                </div>
                <div style={{
                  textAlign: "center",
                  padding: "1.5rem",
                  background: "#10b98110",
                  borderRadius: "12px"
                }}>
                  <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#10b981" }}>
                    {Math.max(...selectedSubject.tests.map(t => t.percentage))}%
                  </div>
                  <div style={{ fontSize: "0.9rem", color: "#666", marginTop: "0.5rem" }}>
                    Highest Score
                  </div>
                </div>
                <div style={{
                  textAlign: "center",
                  padding: "1.5rem",
                  background: "#ef444410",
                  borderRadius: "12px"
                }}>
                  <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#ef4444" }}>
                    {Math.min(...selectedSubject.tests.map(t => t.percentage))}%
                  </div>
                  <div style={{ fontSize: "0.9rem", color: "#666", marginTop: "0.5rem" }}>
                    Lowest Score
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestResults;
