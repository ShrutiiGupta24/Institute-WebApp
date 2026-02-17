import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaCheckCircle, FaTimesCircle, FaSave } from "react-icons/fa";
import api from "../../services/api";

const AttendanceMarking = () => {
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState({});
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Fetch teacher's batches
  useEffect(() => {
    const fetchBatches = async () => {
      try {
        setLoading(true);
        const response = await api.get("/teacher/batches");
        console.log("Teacher Batches:", response.data);
        setBatches(response.data || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching batches:", err);
        setError(err.response?.data?.detail || "Failed to load batches");
      } finally {
        setLoading(false);
      }
    };

    fetchBatches();
  }, []);

  const handleAttendanceChange = (studentId, status) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: status === 'present'
    }));
    setSaved(false);
  };

  const handleMarkAll = (status) => {
    const newAttendance = {};
    if (selectedBatch && selectedBatch.students) {
      selectedBatch.students.forEach(student => {
        newAttendance[student.id] = status === 'present';
      });
    }
    setAttendance(newAttendance);
    setSaved(false);
  };

  const handleSave = async () => {
    if (!selectedBatch) return;

    try {
      setSaving(true);
      
      // Convert attendance object to API format
      const records = Object.entries(attendance).map(([studentId, isPresent]) => ({
        student_id: parseInt(studentId),
        is_present: isPresent,
        remarks: null
      }));

      const attendanceData = {
        batch_id: selectedBatch.id,
        date: selectedDate,
        records: records
      };

      console.log("Saving attendance:", attendanceData);
      
      const response = await api.post("/teacher/attendance", attendanceData);
      console.log("Attendance saved:", response.data);
      
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error("Error saving attendance:", err);
      alert(err.response?.data?.detail || "Failed to save attendance");
    } finally {
      setSaving(false);
    }
  };

  const getPresentCount = () => {
    return Object.values(attendance).filter(status => status === true).length;
  };

  const getAbsentCount = () => {
    return Object.values(attendance).filter(status => status === false).length;
  };

  const students = selectedBatch?.students || [];

  return (
    <div style={{
      minHeight: "calc(100vh - 160px)",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      paddingTop: "2rem",
      paddingBottom: "2rem"
    }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
        <Link to="/teacher/dashboard" style={{
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
          Mark Attendance
        </h1>

        {loading ? (
          <div style={{
            textAlign: "center",
            color: "#fff",
            fontSize: "1.2rem",
            padding: "3rem"
          }}>
            Loading batches...
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
        ) : !selectedBatch ? (
          // Batch Selection View
          <div>
            <h3 style={{
              color: "#fff",
              fontSize: "1.3rem",
              marginBottom: "1.5rem",
              textAlign: "center"
            }}>
              Select Your Batch
            </h3>
            {batches.length === 0 ? (
              <div style={{
                textAlign: "center",
                color: "#fff",
                fontSize: "1.2rem",
                padding: "3rem",
                background: "rgba(255, 255, 255, 0.1)",
                borderRadius: "12px"
              }}>
                No batches assigned to you
              </div>
            ) : (
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "2rem"
              }}>
                {batches.map((batch) => (
                  <div
                    key={batch.id}
                    onClick={() => {
                      setSelectedBatch(batch);
                      setAttendance({});
                    }}
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
                      background: `linear-gradient(135deg, #667eea, #764ba2)`,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 1rem",
                      fontSize: "2rem",
                      color: "#fff"
                    }}>
                      {batch.code}
                    </div>
                    <h3 style={{ marginBottom: "0.5rem", color: "#1f2937" }}>
                      {batch.name}
                    </h3>
                    <p style={{ color: "#6b7280", marginBottom: "0.5rem" }}>
                      Code: {batch.code}
                    </p>
                    <p style={{ color: "#6b7280", marginBottom: "0.5rem" }}>
                      Students: {batch.students?.length || 0}
                    </p>
                    {batch.timing && (
                      <p style={{ color: "#6b7280", fontSize: "0.9rem" }}>
                        Timing: {batch.timing}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          // Attendance Marking View
          <div>
            <button
              onClick={() => {
                setSelectedBatch(null);
                setAttendance({});
                setSaved(false);
              }}
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
              <FaArrowLeft /> Back to Batches
            </button>

            <div style={{
              background: "#fff",
              borderRadius: "16px",
              padding: "2rem",
              boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
              marginBottom: "2rem"
            }}>
              {/* Header */}
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "2rem",
                paddingBottom: "1.5rem",
                borderBottom: `3px solid #667eea`,
                flexWrap: "wrap",
                gap: "1rem"
              }}>
                <div>
                  <h2 style={{
                    fontSize: "2rem",
                    color: "#333",
                    margin: "0 0 0.3rem 0"
                  }}>
                    {selectedBatch.name}
                  </h2>
                  <p style={{ color: "#666", margin: 0 }}>
                    Code: {selectedBatch.code} • {students.length} Students
                  </p>
                </div>
                <div>
                  <label style={{
                    display: "block",
                    fontSize: "0.9rem",
                    color: "#666",
                    marginBottom: "0.5rem"
                  }}>
                    Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                    style={{
                      padding: "0.8rem",
                      fontSize: "1rem",
                      borderRadius: "8px",
                      border: "2px solid #e0e0e0",
                      outline: "none"
                    }}
                  />
                </div>
              </div>

              {/* Quick Actions */}
              <div style={{
                display: "flex",
                gap: "1rem",
                marginBottom: "2rem",
                flexWrap: "wrap"
              }}>
                <button
                  onClick={() => handleMarkAll('present')}
                  style={{
                    padding: "0.8rem 1.5rem",
                    background: "#10b981",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "1rem",
                    fontWeight: "600",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    transition: "all 0.3s"
                  }}
                  onMouseOver={(e) => e.currentTarget.style.opacity = "0.9"}
                  onMouseOut={(e) => e.currentTarget.style.opacity = "1"}
                >
                  <FaCheckCircle /> Mark All Present
                </button>
                <button
                  onClick={() => handleMarkAll('absent')}
                  style={{
                    padding: "0.8rem 1.5rem",
                    background: "#ef4444",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "1rem",
                    fontWeight: "600",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    transition: "all 0.3s"
                  }}
                  onMouseOver={(e) => e.currentTarget.style.opacity = "0.9"}
                  onMouseOut={(e) => e.currentTarget.style.opacity = "1"}
                >
                  <FaTimesCircle /> Mark All Absent
                </button>
              </div>

              {/* Students List */}
              <div style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem"
              }}>
                {students.map((student) => {
                  const status = attendance[student.id];
                  return (
                    <div
                      key={student.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "1.5rem",
                        background: status === 'present' ? "#10b98110" : status === 'absent' ? "#ef444410" : "#f9f9f9",
                        borderRadius: "12px",
                        transition: "all 0.3s",
                        borderLeft: `4px solid ${status === 'present' ? "#10b981" : status === 'absent' ? "#ef4444" : "#e0e0e0"}`,
                        flexWrap: "wrap",
                        gap: "1rem"
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "1rem", flex: 1, minWidth: "200px" }}>
                        <div style={{
                          width: "50px",
                          height: "50px",
                          background: `#667eea20`,
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: "bold",
                          color: "#667eea",
                          fontSize: "0.9rem"
                        }}>
                          {student.id}
                        </div>
                        <div>
                          <h4 style={{
                            fontSize: "1.1rem",
                            color: "#333",
                            margin: "0 0 0.2rem 0",
                            fontWeight: "600"
                          }}>
                            {student.user?.full_name || student.name || 'Student'}
                          </h4>
                          <div style={{
                            fontSize: "0.85rem",
                            color: "#666"
                          }}>
                            Student ID: {student.id}
                          </div>
                        </div>
                      </div>
                      <div style={{
                        display: "flex",
                        gap: "0.8rem"
                      }}>
                        <button
                          onClick={() => handleAttendanceChange(student.id, 'present')}
                          style={{
                            padding: "0.8rem 1.5rem",
                            background: status === true ? "#10b981" : "#fff",
                            color: status === true ? "#fff" : "#10b981",
                            border: `2px solid #10b981`,
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontSize: "0.95rem",
                            fontWeight: "600",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            transition: "all 0.3s",
                            minWidth: "110px",
                            justifyContent: "center"
                          }}
                          onMouseOver={(e) => {
                            if (status !== true) {
                              e.currentTarget.style.background = "#10b98120";
                            }
                          }}
                          onMouseOut={(e) => {
                            if (status !== true) {
                              e.currentTarget.style.background = "#fff";
                            }
                          }}
                        >
                          <FaCheckCircle /> Present
                        </button>
                        <button
                          onClick={() => handleAttendanceChange(student.id, 'absent')}
                          style={{
                            padding: "0.8rem 1.5rem",
                            background: status === false ? "#ef4444" : "#fff",
                            color: status === false ? "#fff" : "#ef4444",
                            border: `2px solid #ef4444`,
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontSize: "0.95rem",
                            fontWeight: "600",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            transition: "all 0.3s",
                            minWidth: "110px",
                            justifyContent: "center"
                          }}
                          onMouseOver={(e) => {
                            if (status !== false) {
                              e.currentTarget.style.background = "#ef444410";
                            }
                          }}
                          onMouseOut={(e) => {
                            if (status !== false) {
                              e.currentTarget.style.background = "#fff";
                            }
                          }}
                        >
                          <FaTimesCircle /> Absent
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Summary & Save */}
              <div style={{
                marginTop: "2rem",
                paddingTop: "2rem",
                borderTop: "2px solid #f0f0f0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "1.5rem"
              }}>
                <div style={{
                  display: "flex",
                  gap: "2rem",
                  flexWrap: "wrap"
                }}>
                  <div style={{
                    padding: "1rem 1.5rem",
                    background: "#10b98110",
                    borderRadius: "8px",
                    textAlign: "center"
                  }}>
                    <div style={{ fontSize: "1.8rem", fontWeight: "bold", color: "#10b981" }}>
                      {getPresentCount()}
                    </div>
                    <div style={{ fontSize: "0.9rem", color: "#666", marginTop: "0.3rem" }}>
                      Present
                    </div>
                  </div>
                  <div style={{
                    padding: "1rem 1.5rem",
                    background: "#ef444410",
                    borderRadius: "8px",
                    textAlign: "center"
                  }}>
                    <div style={{ fontSize: "1.8rem", fontWeight: "bold", color: "#ef4444" }}>
                      {getAbsentCount()}
                    </div>
                    <div style={{ fontSize: "0.9rem", color: "#666", marginTop: "0.3rem" }}>
                      Absent
                    </div>
                  </div>
                  <div style={{
                    padding: "1rem 1.5rem",
                    background: "#667eea10",
                    borderRadius: "8px",
                    textAlign: "center"
                  }}>
                    <div style={{ fontSize: "1.8rem", fontWeight: "bold", color: "#667eea" }}>
                      {students.length - getPresentCount() - getAbsentCount()}
                    </div>
                    <div style={{ fontSize: "0.9rem", color: "#666", marginTop: "0.3rem" }}>
                      Unmarked
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleSave}
                  disabled={Object.keys(attendance).length === 0 || saving}
                  style={{
                    padding: "1rem 2.5rem",
                    background: (Object.keys(attendance).length === 0 || saving) ? "#ccc" : "#667eea",
                    color: "#fff",
                    border: "none",
                    borderRadius: "12px",
                    cursor: (Object.keys(attendance).length === 0 || saving) ? "not-allowed" : "pointer",
                    fontSize: "1.1rem",
                    fontWeight: "600",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    transition: "all 0.3s",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.2)"
                  }}
                  onMouseOver={(e) => {
                    if (Object.keys(attendance).length > 0 && !saving) {
                      e.currentTarget.style.opacity = "0.9";
                      e.currentTarget.style.transform = "translateY(-2px)";
                    }
                  }}
                  onMouseOut={(e) => {
                    if (Object.keys(attendance).length > 0 && !saving) {
                      e.currentTarget.style.opacity = "1";
                      e.currentTarget.style.transform = "translateY(0)";
                    }
                  }}
                >
                  <FaSave /> {saving ? "Saving..." : "Save Attendance"}
                </button>
              </div>

              {saved && (
                <div style={{
                  marginTop: "1rem",
                  padding: "1rem",
                  background: "#10b98120",
                  border: "2px solid #10b981",
                  borderRadius: "8px",
                  color: "#10b981",
                  textAlign: "center",
                  fontWeight: "600",
                  fontSize: "1rem"
                }}>
                  ✓ Attendance saved successfully!
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceMarking;
