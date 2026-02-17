import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaSave, FaClipboardList } from "react-icons/fa";
import api from "../../services/api";

const StudentPerformance = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [batches, setBatches] = useState([]);
  const [tests, setTests] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [selectedTest, setSelectedTest] = useState(null);
  const [testName, setTestName] = useState("");
  const [totalMarks, setTotalMarks] = useState(100);
  const [testDate, setTestDate] = useState(new Date().toISOString().split('T')[0]);
  const [marks, setMarks] = useState({});
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [showCreateTest, setShowCreateTest] = useState(false);
  const [teacherInfo, setTeacherInfo] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch batches and tests
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [batchesRes, testsRes, dashboardRes] = await Promise.all([
          api.get("/teacher/batches"),
          api.get("/teacher/tests"),
          api.get("/teacher/dashboard")
        ]);
        console.log("Batches:", batchesRes.data);
        console.log("Tests:", testsRes.data);
        console.log("Teacher Info:", dashboardRes.data);
        setBatches(batchesRes.data || []);
        setTests(testsRes.data || []);
        setTeacherInfo(dashboardRes.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.response?.data?.detail || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleMarksChange = (studentId, value) => {
    const numValue = parseInt(value) || 0;
    const maxMarks = selectedTest ? selectedTest.total_marks : totalMarks;
    if (numValue > maxMarks) {
      alert(`Marks cannot exceed ${maxMarks}`);
      return;
    }
    setMarks(prev => ({
      ...prev,
      [studentId]: numValue
    }));
    setSaved(false);
  };

  const handleCreateTest = async () => {
    if (!testName.trim()) {
      alert("Please enter test name");
      return;
    }
    if (!selectedBatch) {
      alert("Please select a batch");
      return;
    }

    try {
      setSaving(true);
      const testData = {
        title: testName,
        description: null,
        course_id: selectedBatch.course_id,
        total_marks: totalMarks,
        passing_marks: Math.floor(totalMarks * 0.4),
        duration_minutes: null,
        test_date: new Date(testDate).toISOString()
      };

      const response = await api.post("/teacher/tests", testData);
      console.log("Test created:", response.data);
      
      // Add to tests list and select it
      setTests([...tests, response.data]);
      setSelectedTest(response.data);
      setShowCreateTest(false);
      setMarks({});
      alert("Test created successfully! Now enter marks for students.");
    } catch (err) {
      console.error("Error creating test:", err);
      alert(err.response?.data?.detail || "Failed to create test");
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    if (!selectedTest) {
      alert("Please select or create a test first");
      return;
    }
    
    if (!selectedBatch || !selectedBatch.students || selectedBatch.students.length === 0) {
      alert("No students in selected batch");
      return;
    }

    try {
      setSaving(true);
      
      // Convert marks object to API format
      const results = Object.entries(marks).map(([studentId, marksObtained]) => ({
        student_id: parseInt(studentId),
        marks_obtained: marksObtained,
        remarks: null
      }));

      if (results.length === 0) {
        alert("Please enter marks for at least one student");
        return;
      }

      const payload = {
        test_id: selectedTest.id,
        results: results
      };

      console.log("Uploading marks:", payload);
      
      const response = await api.post(`/teacher/tests/${selectedTest.id}/results`, payload);
      console.log("Marks saved:", response.data);
      
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error("Error saving marks:", err);
      alert(err.response?.data?.detail || "Failed to save marks");
    } finally {
      setSaving(false);
    }
  };

  // Get students based on selected test's course - from ALL matching batches
  const students = selectedTest
    ? batches
        .filter(batch => batch.course_id === selectedTest.course_id)
        .flatMap(batch => 
          (batch.students || []).map(student => ({
            ...student,
            batchName: batch.name,
            batchCode: batch.code
          }))
        )
        .filter((student, index, self) => 
          // Remove duplicates if a student is in multiple batches
          index === self.findIndex(s => s.id === student.id)
        )
    : selectedBatch?.students || [];

  const getUploadedCount = () => {
    return Object.keys(marks).length;
  };

  const getAverage = () => {
    const values = Object.values(marks);
    if (values.length === 0) return 0;
    const sum = values.reduce((acc, val) => acc + val, 0);
    return (sum / values.length).toFixed(1);
  };

  const getHighest = () => {
    const values = Object.values(marks);
    return values.length > 0 ? Math.max(...values) : 0;
  };

  const getLowest = () => {
    const values = Object.values(marks);
    return values.length > 0 ? Math.min(...values) : 0;
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
        maxWidth: "1200px", 
        margin: "0 auto", 
        padding: isMobile ? "1rem" : "2rem",
        width: "100%",
        boxSizing: "border-box"
      }}>
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
          fontSize: isMobile ? "1.8rem" : "2.5rem",
          textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
          wordBreak: "break-word"
        }}>
          Upload Student Marks
        </h1>

        {loading ? (
          <div style={{
            textAlign: "center",
            color: "#fff",
            fontSize: "1.2rem",
            padding: "3rem"
          }}>
            Loading...
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
            <div style={{ marginBottom: "2rem" }}>
              <h3 style={{
                color: "#fff",
                fontSize: "1.3rem",
                marginBottom: "0.5rem",
                textAlign: "center"
              }}>
                Select Your Batch
              </h3>
              {teacherInfo && (
                <p style={{
                  color: "rgba(255,255,255,0.9)",
                  fontSize: "1rem",
                  textAlign: "center",
                  margin: 0
                }}>
                  Showing batches you teach • Subject: {teacherInfo.subject || 'N/A'}
                </p>
              )}
            </div>
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
                gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(300px, 1fr))",
                gap: isMobile ? "1.5rem" : "2rem",
                width: "100%",
                boxSizing: "border-box"
              }}>
                {batches.map((batch) => (
                  <div
                    key={batch.id}
                    onClick={() => {
                      setSelectedBatch(batch);
                      setMarks({});
                    }}
                    style={{
                      background: "#fff",
                      borderRadius: "16px",
                      padding: isMobile ? "1.5rem" : "2rem",
                      cursor: "pointer",
                      transition: "all 0.3s",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                      textAlign: "center",
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
                      width: "80px",
                      height: "80px",
                      background: `linear-gradient(135deg, #667eea, #764ba2)`,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 1.5rem",
                      fontSize: "2rem",
                      color: "#fff"
                    }}>
                      <FaClipboardList />
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
          // Marks Upload View
          <div>
            <button
              onClick={() => {
                setSelectedBatch(null);
                setSelectedTest(null);
                setTestName("");
                setMarks({});
                setSaved(false);
                setShowCreateTest(false);
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
              <FaArrowLeft /> Back to Subjects
            </button>

            <div style={{
              background: "#fff",
              borderRadius: "16px",
              padding: isMobile ? "1.5rem" : "2rem",
              boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
              marginBottom: "2rem",
              width: "100%",
              maxWidth: "100%",
              boxSizing: "border-box"
            }}>
              {/* Header */}
              <div style={{
                marginBottom: "2rem",
                paddingBottom: "1.5rem",
                borderBottom: `3px solid #667eea`
              }}>
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

              {/* Test Selection/Creation */}
              <div style={{
                display: "grid",
                gridTemplateColumns: showCreateTest ? "1fr" : isMobile ? "1fr" : "1fr auto",
                gap: "1.5rem",
                marginBottom: "2rem",
                padding: isMobile ? "1rem" : "1.5rem",
                background: "#f9f9f9",
                borderRadius: "12px",
                width: "100%",
                boxSizing: "border-box"
              }}>
                {showCreateTest ? (
                  <>
                    <div>
                      <label style={{
                        display: "block",
                        fontSize: "0.9rem",
                        color: "#666",
                        marginBottom: "0.5rem",
                        fontWeight: "600"
                      }}>
                        Test Name *
                      </label>
                      <input
                        type="text"
                        value={testName}
                        onChange={(e) => setTestName(e.target.value)}
                        placeholder="e.g., Unit Test 1"
                        style={{
                          width: "100%",
                          padding: "0.8rem",
                          fontSize: "1rem",
                          borderRadius: "8px",
                          border: "2px solid #e0e0e0",
                          outline: "none",
                          boxSizing: "border-box"
                        }}
                      />
                    </div>
                    <div>
                      <label style={{
                        display: "block",
                        fontSize: "0.9rem",
                        color: "#666",
                        marginBottom: "0.5rem",
                        fontWeight: "600"
                      }}>
                        Total Marks
                      </label>
                      <input
                        type="number"
                        value={totalMarks}
                        onChange={(e) => setTotalMarks(parseInt(e.target.value) || 100)}
                        style={{
                          width: "100%",
                          padding: "0.8rem",
                          fontSize: "1rem",
                          borderRadius: "8px",
                          border: "2px solid #e0e0e0",
                          outline: "none",
                          boxSizing: "border-box"
                        }}
                      />
                    </div>
                    <div>
                      <label style={{
                        display: "block",
                        fontSize: "0.9rem",
                        color: "#666",
                        marginBottom: "0.5rem",
                        fontWeight: "600"
                      }}>
                        Test Date
                      </label>
                      <input
                        type="date"
                        value={testDate}
                        onChange={(e) => setTestDate(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "0.8rem",
                          fontSize: "1rem",
                          borderRadius: "8px",
                          border: "2px solid #e0e0e0",
                          outline: "none",
                          boxSizing: "border-box"
                        }}
                      />
                    </div>
                    <div style={{ gridColumn: "1 / -1", display: "flex", gap: "1rem" }}>
                      <button
                        onClick={handleCreateTest}
                        disabled={saving}
                        style={{
                          padding: "0.8rem 1.5rem",
                          background: "linear-gradient(135deg, #667eea, #764ba2)",
                          color: "#fff",
                          border: "none",
                          borderRadius: "8px",
                          cursor: saving ? "not-allowed" : "pointer",
                          fontWeight: "600"
                        }}
                      >
                        {saving ? "Creating..." : "Create Test"}
                      </button>
                      <button
                        onClick={() => {
                          setShowCreateTest(false);
                          setTestName("");
                        }}
                        style={{
                          padding: "0.8rem 1.5rem",
                          background: "#6b7280",
                          color: "#fff",
                          border: "none",
                          borderRadius: "8px",
                          cursor: "pointer",
                          fontWeight: "600"
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{
                      width: "100%",
                      maxWidth: "100%",
                      boxSizing: "border-box"
                    }}>
                      <label style={{
                        display: "block",
                        fontSize: "0.9rem",
                        color: "#666",
                        marginBottom: "0.5rem",
                        fontWeight: "600"
                      }}>
                        Select Test
                      </label>
                      <select
                        value={selectedTest?.id || ""}
                        onChange={(e) => {
                          const test = tests.find(t => t.id === parseInt(e.target.value));
                          setSelectedTest(test || null);
                          setMarks({});
                        }}
                        style={{
                          width: "100%",
                          maxWidth: "100%",
                          padding: "0.8rem",
                          fontSize: "1rem",
                          borderRadius: "8px",
                          border: "2px solid #e0e0e0",
                          outline: "none",
                          boxSizing: "border-box",
                          appearance: "none",
                          WebkitAppearance: "none",
                          minWidth: 0
                        }}
                      >
                        <option value="">-- Select a Test --</option>
                        {tests.map(test => (
                          <option key={test.id} value={test.id}>
                            {test.title} ({test.total_marks} marks) - {test.test_date ? new Date(test.test_date).toLocaleDateString() : 'No date'}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div style={{ display: "flex", alignItems: "flex-end" }}>
                      <button
                        onClick={() => setShowCreateTest(true)}
                        style={{
                          padding: "0.8rem 1.5rem",
                          background: "#10b981",
                          color: "#fff",
                          border: "none",
                          borderRadius: "8px",
                          cursor: "pointer",
                          fontWeight: "600",
                          whiteSpace: "nowrap"
                        }}
                      >
                        + Create New Test
                      </button>
                    </div>
                  </>
                )}
              </div>

              {selectedTest && (
                <>
                  <div style={{
                    padding: "1rem",
                    background: "#10b98120",
                    border: "2px solid #10b981",
                    borderRadius: "8px",
                    marginBottom: "1.5rem"
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
                      <div>
                        <strong style={{ color: "#10b981" }}>Selected Test:</strong> {selectedTest.title}
                      </div>
                      <div style={{ color: "#666" }}>
                        Total Marks: {selectedTest.total_marks}
                      </div>
                      <div style={{ color: "#666" }}>
                        Students: {students.length} (from all batches with matching course)
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Students List */}
              {selectedTest && (
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem"
                }}>
                  {students.length === 0 ? (
                    <div style={{
                      padding: "2rem",
                      background: "#f9f9f9",
                      borderRadius: "12px",
                      textAlign: "center",
                      color: "#666"
                    }}>
                      No students found for this test. There are no students enrolled in batches that match this test's course.
                    </div>
                  ) : (
                    students.map((student) => {
                      const studentMarks = marks[student.id] || "";
                      const percentage = studentMarks ? ((studentMarks / selectedTest.total_marks) * 100).toFixed(1) : 0;
                      return (
                        <div
                          key={student.id}
                          style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "1.5rem",
                          background: "#f9f9f9",
                          borderRadius: "12px",
                          gap: "1rem",
                          flexWrap: "wrap"
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem", flex: "1", minWidth: "200px" }}>
                          <div style={{
                            width: "50px",
                            height: "50px",
                            background: "#667eea20",
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
                              {student.user?.full_name || `Student ${student.id}`}
                            </h4>
                            <div style={{ fontSize: "0.85rem", color: "#666" }}>
                              Student ID: {student.id} • Batch: {student.batchName || 'N/A'}
                            </div>
                          </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                          <div>
                            <label style={{
                              display: "block",
                              fontSize: "0.85rem",
                              color: "#666",
                              marginBottom: "0.3rem"
                            }}>
                              Marks (out of {selectedTest.total_marks})
                            </label>
                            <input
                              type="number"
                              value={studentMarks}
                              onChange={(e) => handleMarksChange(student.id, e.target.value)}
                              min="0"
                              max={selectedTest.total_marks}
                              style={{
                                width: "100px",
                                padding: "0.6rem",
                                fontSize: "1rem",
                                borderRadius: "8px",
                                border: "2px solid #e0e0e0",
                                outline: "none",
                                textAlign: "center",
                                fontWeight: "600"
                              }}
                            />
                          </div>
                          {studentMarks && (
                            <div style={{
                              padding: "0.6rem 1rem",
                              background: percentage >= 40 ? "#10b98120" : "#ef444420",
                              borderRadius: "8px",
                              fontWeight: "600",
                              color: percentage >= 40 ? "#10b981" : "#ef4444"
                            }}>
                              {percentage}%
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                  )}
                </div>
              )}

              {/* Statistics */}
              {selectedTest && Object.keys(marks).length > 0 && (
                <div style={{
                  marginTop: "2rem",
                  padding: "1.5rem",
                  background: "#f9f9f9",
                  borderRadius: "12px"
                }}>
                  <h3 style={{ marginBottom: "1rem", color: "#333" }}>Statistics</h3>
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                    gap: "1rem"
                  }}>
                    <div style={{
                      padding: "1rem",
                      background: "#667eea10",
                      borderRadius: "8px",
                      textAlign: "center"
                    }}>
                      <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#667eea" }}>
                        {getUploadedCount()}
                      </div>
                      <div style={{ fontSize: "0.9rem", color: "#666", marginTop: "0.3rem" }}>
                        Uploaded
                      </div>
                    </div>
                    <div style={{
                      padding: "1rem",
                      background: "#f59e0b10",
                      borderRadius: "8px",
                      textAlign: "center"
                    }}>
                      <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#f59e0b" }}>
                        {getAverage()}
                      </div>
                      <div style={{ fontSize: "0.9rem", color: "#666", marginTop: "0.3rem" }}>
                        Average
                      </div>
                    </div>
                    <div style={{
                      padding: "1rem",
                      background: "#10b98110",
                      borderRadius: "8px",
                      textAlign: "center"
                    }}>
                      <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#10b981" }}>
                        {getHighest()}
                      </div>
                      <div style={{ fontSize: "0.9rem", color: "#666", marginTop: "0.3rem" }}>
                        Highest
                      </div>
                    </div>
                    <div style={{
                      padding: "1rem",
                      background: "#ef444410",
                      borderRadius: "8px",
                      textAlign: "center"
                    }}>
                      <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#ef4444" }}>
                        {getLowest()}
                      </div>
                      <div style={{ fontSize: "0.9rem", color: "#666", marginTop: "0.3rem" }}>
                        Lowest
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Save Button */}
              {selectedTest && (
                <div style={{
                  marginTop: "2rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "1rem",
                  flexWrap: "wrap"
                }}>
                  <button
                    onClick={handleSave}
                    disabled={!selectedTest || saving}
                    style={{
                      padding: "1rem 2.5rem",
                      background: (!selectedTest || saving) ? "#ccc" : "linear-gradient(135deg, #667eea, #764ba2)",
                      color: "#fff",
                      border: "none",
                      borderRadius: "12px",
                      cursor: (!selectedTest || saving) ? "not-allowed" : "pointer",
                      fontSize: "1.1rem",
                      fontWeight: "600",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      transition: "all 0.3s",
                      boxShadow: "0 4px 15px rgba(0,0,0,0.2)"
                    }}
                  >
                    <FaSave /> {saving ? "Saving..." : "Upload Marks"}
                  </button>

                  {saved && (
                    <div style={{
                      padding: "1rem",
                      background: "#10b98120",
                      border: "2px solid #10b981",
                      borderRadius: "8px",
                      color: "#10b981",
                      fontWeight: "600",
                      fontSize: "1rem"
                    }}>
                      ✓ Marks uploaded successfully!
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentPerformance;
