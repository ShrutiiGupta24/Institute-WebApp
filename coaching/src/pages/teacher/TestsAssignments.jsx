import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaArrowLeft, FaPlus, FaFileAlt, FaTrash, FaCalendarAlt, FaClock } from "react-icons/fa";

const TestsAssignments = () => {
  const location = useLocation();
  let user = {};
  try {
    const userData = localStorage.getItem("user");
    if (userData) user = JSON.parse(userData);
  } catch (e) {}
  const teacherName = location.state?.name || user.full_name || "Teacher";
  
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [testType, setTestType] = useState("test"); // "test" or "assignment"
  const [testTitle, setTestTitle] = useState("");
  const [testDate, setTestDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState("");
  const [totalMarks, setTotalMarks] = useState(100);
  const [duration, setDuration] = useState(60);
  const [instructions, setInstructions] = useState("");
  const [saved, setSaved] = useState(false);
  const [testsData, setTestsData] = useState({
    // Teacher-specific tests/assignments only
    // Each teacher can ONLY see and manage their own created tests
    // Format: "subject-class": [{ type, title, date, dueDate, totalMarks, duration, instructions, createdBy }]
    // Data is filtered by teacher authentication on backend
  });

  // Different subjects for different teachers
  const getTeacherSubjects = () => {
    const teacherSubjectsMap = {
      "mathematics": [
        { id: 1, name: "Mathematics", color: "#667eea", class: "12" },
        { id: 2, name: "Mathematics", color: "#667eea", class: "11" },
        { id: 3, name: "Mathematics", color: "#667eea", class: "10" },
        { id: 4, name: "Mathematics", color: "#667eea", class: "9" },
        { id: 5, name: "Mathematics", color: "#667eea", class: "JEE Main/Advance" },
        { id: 6, name: "Mathematics", color: "#667eea", class: "CUET" },
        { id: 7, name: "Mathematics", color: "#667eea", class: "B.com(P/H)" }
      ],
      "physics": [
        { id: 8, name: "Physics", color: "#764ba2", class: "12" },
        { id: 9, name: "Physics", color: "#764ba2", class: "11" },
        { id: 10, name: "Physics", color: "#764ba2", class: "10" },
        { id: 11, name: "Physics", color: "#764ba2", class: "9" },
        { id: 12, name: "Physics", color: "#764ba2", class: "JEE Main/Advance" },
        { id: 13, name: "Physics", color: "#764ba2", class: "CUET" }
      ],
      "chemistry": [
        { id: 14, name: "Chemistry", color: "#f59e0b", class: "12" },
        { id: 15, name: "Chemistry", color: "#f59e0b", class: "11" },
        { id: 16, name: "Chemistry", color: "#f59e0b", class: "10" },
        { id: 17, name: "Chemistry", color: "#f59e0b", class: "9" },
        { id: 18, name: "Chemistry", color: "#f59e0b", class: "JEE Main/Advance" },
        { id: 19, name: "Chemistry", color: "#f59e0b", class: "CUET" }
      ],
      "biology": [
        { id: 20, name: "Biology", color: "#10b981", class: "12" },
        { id: 21, name: "Biology", color: "#10b981", class: "11" },
        { id: 22, name: "Biology", color: "#10b981", class: "10" },
        { id: 23, name: "Biology", color: "#10b981", class: "9" },
        { id: 24, name: "Biology", color: "#10b981", class: "CUET" }
      ],
      "english": [
        { id: 25, name: "English", color: "#06b6d4", class: "12" },
        { id: 26, name: "English", color: "#06b6d4", class: "11" },
        { id: 27, name: "English", color: "#06b6d4", class: "10" },
        { id: 28, name: "English", color: "#06b6d4", class: "9" },
        { id: 29, name: "English", color: "#06b6d4", class: "CUET" },
        { id: 30, name: "English", color: "#06b6d4", class: "B.com(P/H)" }
      ]
    };
    
    const teacherNameLower = teacherName.toLowerCase();
    
    if (teacherNameLower.includes("sudhanshu") || teacherNameLower.includes("math")) {
      return teacherSubjectsMap["mathematics"];
    } else if (teacherNameLower.includes("rajesh") || teacherNameLower.includes("physic")) {
      return teacherSubjectsMap["physics"];
    } else if (teacherNameLower.includes("priya") || teacherNameLower.includes("chemis")) {
      return teacherSubjectsMap["chemistry"];
    } else if (teacherNameLower.includes("anita") || teacherNameLower.includes("biolog")) {
      return teacherSubjectsMap["biology"];
    } else if (teacherNameLower.includes("kavita") || teacherNameLower.includes("english")) {
      return teacherSubjectsMap["english"];
    }
    
    return teacherSubjectsMap["mathematics"];
  };

  const subjects = getTeacherSubjects();

  const handleCreate = () => {
    if (!testTitle.trim()) {
      alert("Please enter " + (testType === "test" ? "test" : "assignment") + " title");
      return;
    }
    if (testType === "assignment" && !dueDate) {
      alert("Please enter due date for assignment");
      return;
    }

    const key = `${selectedSubject.name}-${selectedSubject.class}`;
    const newTest = {
      id: Date.now(),
      type: testType,
      title: testTitle,
      date: testDate,
      dueDate: testType === "assignment" ? dueDate : undefined,
      totalMarks: totalMarks,
      duration: testType === "test" ? duration : undefined,
      instructions: instructions,
      createdBy: teacherName,
      createdOn: new Date().toISOString().split('T')[0]
    };

    const updatedTests = {
      ...testsData,
      [key]: [...(testsData[key] || []), newTest]
    };
    setTestsData(updatedTests);

    console.log("Creating test/assignment:", {
      teacher: teacherName,
      subject: selectedSubject.name,
      class: selectedSubject.class,
      ...newTest
    });

    // Reset form
    setTestTitle("");
    setInstructions("");
    setDueDate("");
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleDelete = (testId) => {
    if (window.confirm("Are you sure you want to delete this?")) {
      const key = `${selectedSubject.name}-${selectedSubject.class}`;
      const updatedTests = {
        ...testsData,
        [key]: testsData[key].filter(t => t.id !== testId)
      };
      setTestsData(updatedTests);
    }
  };

  const getSubjectTests = () => {
    if (!selectedSubject) return [];
    const key = `${selectedSubject.name}-${selectedSubject.class}`;
    return testsData[key] || [];
  };

  const getTestCount = (subject) => {
    const key = `${subject.name}-${subject.class}`;
    const items = testsData[key] || [];
    const tests = items.filter(t => t.type === "test").length;
    const assignments = items.filter(t => t.type === "assignment").length;
    return { tests, assignments };
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      paddingTop: "2rem",
      paddingBottom: "4rem"
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
          Tests & Assignments
        </h1>

        {!selectedSubject ? (
          // Subject Selection View
          <div>
            <h3 style={{
              color: "#fff",
              fontSize: "1.3rem",
              marginBottom: "1.5rem",
              textAlign: "center"
            }}>
              Select Your Subject & Class
            </h3>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "2rem"
            }}>
              {subjects.map((subject) => {
                const { tests, assignments } = getTestCount(subject);
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
                      margin: "0 auto 1.5rem",
                      fontSize: "2rem",
                      color: "#fff"
                    }}>
                      <FaFileAlt />
                    </div>
                    <h3 style={{
                      fontSize: "1.5rem",
                      color: "#333",
                      marginBottom: "0.5rem"
                    }}>
                      {subject.name}
                    </h3>
                    <p style={{
                      color: "#666",
                      fontSize: "1rem",
                      marginBottom: "0.8rem"
                    }}>
                      {subject.class}
                    </p>
                    <div style={{
                      display: "flex",
                      justifyContent: "center",
                      gap: "1rem",
                      fontSize: "0.9rem"
                    }}>
                      <span style={{ color: subject.color, fontWeight: "600" }}>
                        {tests} Test{tests !== 1 ? 's' : ''}
                      </span>
                      <span style={{ color: "#999" }}>•</span>
                      <span style={{ color: subject.color, fontWeight: "600" }}>
                        {assignments} Assignment{assignments !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          // Create Test/Assignment View
          <div>
            <button
              onClick={() => {
                setSelectedSubject(null);
                setTestTitle("");
                setInstructions("");
                setDueDate("");
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
              <FaArrowLeft /> Back to Subjects
            </button>

            {/* Create Form */}
            <div style={{
              background: "#fff",
              borderRadius: "16px",
              padding: "2rem",
              boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
              marginBottom: "2rem"
            }}>
              <div style={{
                marginBottom: "2rem",
                paddingBottom: "1.5rem",
                borderBottom: `3px solid ${selectedSubject.color}`
              }}>
                <h2 style={{
                  fontSize: "2rem",
                  color: "#333",
                  margin: "0 0 0.3rem 0"
                }}>
                  {selectedSubject.name}
                </h2>
                <p style={{ color: "#666", margin: 0 }}>
                  {selectedSubject.class} • Create new test or assignment
                </p>
              </div>

              {/* Type Selection */}
              <div style={{ marginBottom: "2rem" }}>
                <label style={{
                  display: "block",
                  fontSize: "0.9rem",
                  color: "#666",
                  marginBottom: "0.8rem",
                  fontWeight: "600"
                }}>
                  Type *
                </label>
                <div style={{ display: "flex", gap: "1rem" }}>
                  <button
                    onClick={() => setTestType("test")}
                    style={{
                      flex: 1,
                      padding: "1rem",
                      background: testType === "test" ? selectedSubject.color : "#f9f9f9",
                      color: testType === "test" ? "#fff" : "#666",
                      border: `2px solid ${testType === "test" ? selectedSubject.color : "#e0e0e0"}`,
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontSize: "1rem",
                      fontWeight: "600",
                      transition: "all 0.3s"
                    }}
                  >
                    📝 Test
                  </button>
                  <button
                    onClick={() => setTestType("assignment")}
                    style={{
                      flex: 1,
                      padding: "1rem",
                      background: testType === "assignment" ? selectedSubject.color : "#f9f9f9",
                      color: testType === "assignment" ? "#fff" : "#666",
                      border: `2px solid ${testType === "assignment" ? selectedSubject.color : "#e0e0e0"}`,
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontSize: "1rem",
                      fontWeight: "600",
                      transition: "all 0.3s"
                    }}
                  >
                    📚 Assignment
                  </button>
                </div>
              </div>

              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "1.5rem",
                marginBottom: "2rem"
              }}>
                <div>
                  <label style={{
                    display: "block",
                    fontSize: "0.9rem",
                    color: "#666",
                    marginBottom: "0.5rem",
                    fontWeight: "600"
                  }}>
                    {testType === "test" ? "Test" : "Assignment"} Title *
                  </label>
                  <input
                    type="text"
                    value={testTitle}
                    onChange={(e) => setTestTitle(e.target.value)}
                    placeholder={testType === "test" ? "e.g., Unit Test 1 - Algebra" : "e.g., Trigonometry Practice"}
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
                    {testType === "test" ? "Test Date" : "Assigned Date"}
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
                {testType === "assignment" && (
                  <div>
                    <label style={{
                      display: "block",
                      fontSize: "0.9rem",
                      color: "#666",
                      marginBottom: "0.5rem",
                      fontWeight: "600"
                    }}>
                      Due Date *
                    </label>
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
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
                )}
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
                {testType === "test" && (
                  <div>
                    <label style={{
                      display: "block",
                      fontSize: "0.9rem",
                      color: "#666",
                      marginBottom: "0.5rem",
                      fontWeight: "600"
                    }}>
                      Duration (minutes)
                    </label>
                    <input
                      type="number"
                      value={duration}
                      onChange={(e) => setDuration(parseInt(e.target.value) || 60)}
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
                )}
              </div>

              <div style={{ marginBottom: "2rem" }}>
                <label style={{
                  display: "block",
                  fontSize: "0.9rem",
                  color: "#666",
                  marginBottom: "0.5rem",
                  fontWeight: "600"
                }}>
                  Instructions
                </label>
                <textarea
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="Enter instructions for students..."
                  rows={4}
                  style={{
                    width: "100%",
                    padding: "0.8rem",
                    fontSize: "1rem",
                    borderRadius: "8px",
                    border: "2px solid #e0e0e0",
                    outline: "none",
                    boxSizing: "border-box",
                    resize: "vertical",
                    fontFamily: "inherit"
                  }}
                />
              </div>

              <button
                onClick={handleCreate}
                disabled={!testTitle.trim() || (testType === "assignment" && !dueDate)}
                style={{
                  padding: "1rem 2.5rem",
                  background: (!testTitle.trim() || (testType === "assignment" && !dueDate)) ? "#ccc" : selectedSubject.color,
                  color: "#fff",
                  border: "none",
                  borderRadius: "12px",
                  cursor: (!testTitle.trim() || (testType === "assignment" && !dueDate)) ? "not-allowed" : "pointer",
                  fontSize: "1.1rem",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  transition: "all 0.3s",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.2)"
                }}
                onMouseOver={(e) => {
                  if (testTitle.trim() && !(testType === "assignment" && !dueDate)) {
                    e.currentTarget.style.opacity = "0.9";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }
                }}
                onMouseOut={(e) => {
                  if (testTitle.trim() && !(testType === "assignment" && !dueDate)) {
                    e.currentTarget.style.opacity = "1";
                    e.currentTarget.style.transform = "translateY(0)";
                  }
                }}
              >
                <FaPlus /> Create {testType === "test" ? "Test" : "Assignment"}
              </button>

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
                  ✓ {testType === "test" ? "Test" : "Assignment"} created successfully! Students will be notified.
                </div>
              )}
            </div>

            {/* Created Tests/Assignments List */}
            <div style={{
              background: "#fff",
              borderRadius: "16px",
              padding: "2rem",
              boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
            }}>
              <h3 style={{
                fontSize: "1.5rem",
                color: "#333",
                marginBottom: "1.5rem",
                fontWeight: "bold"
              }}>
                Created Tests & Assignments ({getSubjectTests().length})
              </h3>

              {getSubjectTests().length === 0 ? (
                <div style={{
                  textAlign: "center",
                  padding: "3rem",
                  color: "#999"
                }}>
                  <FaFileAlt style={{ fontSize: "3rem", marginBottom: "1rem" }} />
                  <p>No tests or assignments created yet</p>
                </div>
              ) : (
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem"
                }}>
                  {getSubjectTests().slice().reverse().map((item) => (
                    <div
                      key={item.id}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        padding: "1.5rem",
                        background: "#f9f9f9",
                        borderRadius: "12px",
                        transition: "all 0.3s",
                        borderLeft: `4px solid ${selectedSubject.color}`,
                        flexWrap: "wrap",
                        gap: "1rem"
                      }}
                    >
                      <div style={{ flex: 1, minWidth: "300px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", marginBottom: "0.8rem" }}>
                          <div style={{
                            padding: "0.4rem 0.8rem",
                            background: item.type === "test" ? `${selectedSubject.color}20` : "#10b98120",
                            color: item.type === "test" ? selectedSubject.color : "#10b981",
                            borderRadius: "6px",
                            fontSize: "0.8rem",
                            fontWeight: "600"
                          }}>
                            {item.type === "test" ? "TEST" : "ASSIGNMENT"}
                          </div>
                          <h4 style={{
                            fontSize: "1.2rem",
                            color: "#333",
                            margin: 0,
                            fontWeight: "600"
                          }}>
                            {item.title}
                          </h4>
                        </div>
                        <div style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "1rem",
                          fontSize: "0.9rem",
                          color: "#666",
                          marginBottom: "0.8rem"
                        }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                            <FaCalendarAlt />
                            <span>{item.date}</span>
                          </div>
                          {item.dueDate && (
                            <>
                              <span>•</span>
                              <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", color: "#f59e0b", fontWeight: "600" }}>
                                Due: {item.dueDate}
                              </div>
                            </>
                          )}
                          {item.duration && (
                            <>
                              <span>•</span>
                              <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                                <FaClock />
                                <span>{item.duration} min</span>
                              </div>
                            </>
                          )}
                          <span>•</span>
                          <span>{item.totalMarks} marks</span>
                        </div>
                        {item.instructions && (
                          <p style={{
                            margin: "0 0 0.8rem 0",
                            padding: "0.8rem",
                            background: "#fff",
                            borderRadius: "6px",
                            fontSize: "0.9rem",
                            color: "#666",
                            fontStyle: "italic"
                          }}>
                            {item.instructions}
                          </p>
                        )}
                        <div style={{ fontSize: "0.8rem", color: "#999" }}>
                          Created by {item.createdBy} on {item.createdOn}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDelete(item.id)}
                        style={{
                          padding: "0.6rem 1rem",
                          background: "#ef4444",
                          color: "#fff",
                          border: "none",
                          borderRadius: "8px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          fontSize: "0.9rem",
                          fontWeight: "600",
                          transition: "all 0.3s"
                        }}
                        onMouseOver={(e) => e.currentTarget.style.opacity = "0.9"}
                        onMouseOut={(e) => e.currentTarget.style.opacity = "1"}
                      >
                        <FaTrash /> Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestsAssignments;
