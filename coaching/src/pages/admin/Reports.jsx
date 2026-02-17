import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft,FaCalendarCheck, FaFileAlt, FaClipboardList, FaDownload, FaPrint, FaSearch, FaIdCard } from "react-icons/fa";
import { useAdminData } from "../../store/adminDataContext";
import api from "../../services/api";

const Reports = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [activeTab, setActiveTab] = useState("individual");
  const { students } = useAdminData();
  
  // Individual student search states
  const [searchName, setSearchName] = useState("");
  const [searchClass, setSearchClass] = useState("");
  const [searchRoll, setSearchRoll] = useState("");
  const [selectedStudentDetails, setSelectedStudentDetails] = useState(null);

  // Data from backend
  const [feeReports, setFeeReports] = useState([]);
  const [attendanceReports, setAttendanceReports] = useState([]);
  const [testMarks, setTestMarks] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch reports data
  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const [feeRes, attendanceRes, marksRes, assignmentsRes] = await Promise.all([
          api.get("/admin/reports/fees").catch(() => ({ data: [] })),
          api.get("/admin/reports/attendance").catch(() => ({ data: [] })),
          api.get("/admin/reports/test-marks").catch(() => ({ data: [] })),
          api.get("/admin/reports/assignments").catch(() => ({ data: [] }))
        ]);
        setFeeReports(Array.isArray(feeRes.data) ? feeRes.data : []);
        setAttendanceReports(Array.isArray(attendanceRes.data) ? attendanceRes.data : []);
        setTestMarks(Array.isArray(marksRes.data) ? marksRes.data : []);
        setAssignments(Array.isArray(assignmentsRes.data) ? assignmentsRes.data : []);
      } catch (err) {
        console.error("Error fetching reports:", err);
        setFeeReports([]);
        setAttendanceReports([]);
        setTestMarks([]);
        setAssignments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    alert("Download functionality will be implemented with backend");
  };

  const handleStudentSearch = () => {
    // Find student by name, class, or roll number
    const found = students.find(s => 
      s.name.toLowerCase().includes(searchName.toLowerCase()) &&
      (searchClass === "" || s.course.includes(searchClass)) &&
      (searchRoll === "" || s.id.toString() === searchRoll)
    );

    if (found) {
      // Get all related data for this student
      const studentFee = feeReports.find(f => f.student_name === found.name || f.studentName === found.name) || null;
      const studentAttendance = attendanceReports.find(a => a.student_name === found.name || a.studentName === found.name) || null;
      const studentMarks = testMarks.filter(m => m.student_name === found.name || m.studentName === found.name);
      const studentAssignments = assignments.filter(a => a.class === found.course);

      setSelectedStudentDetails({
        student: found,
        fee: studentFee,
        attendance: studentAttendance,
        marks: studentMarks,
        assignments: studentAssignments
      });
    } else {
      alert("Student not found!");
      setSelectedStudentDetails(null);
    }
  };

  const tabStyle = (isActive) => ({
    padding: "1rem 1.5rem",
    background: isActive ? "#fff" : "transparent",
    color: isActive ? "#667eea" : "#fff", 
    border: "none",
    borderRadius: "8px 8px 0 0",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "600",
    transition: "all 0.3s"
  });

  return (
    <>
      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            .print-content, .print-content * {
              visibility: visible;
            }
            .print-content {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              padding: 20px;
            }
            .no-print {
              display: none !important;
            }
            .print-header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #667eea;
              padding-bottom: 15px;
            }
            .print-header h1 {
              color: #667eea;
              margin: 0;
              font-size: 28px;
            }
            .print-header p {
              margin: 5px 0 0 0;
              color: #666;
              font-size: 14px;
            }
          }
        `}
      </style>
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        paddingTop: "2rem",
        paddingBottom: "2rem",
        paddingLeft: isMobile ? "1rem" : "2rem",
        paddingRight: isMobile ? "1rem" : "2rem",
        overflowX: "hidden",
        width: "100%",
        boxSizing: "border-box"
      }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <Link to="/admin/dashboard" className="no-print" style={{
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

        <div className="no-print" style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "space-between",
          alignItems: isMobile ? "stretch" : "center",
          marginBottom: "2rem",
          gap: isMobile ? "1rem" : "0"
        }}>
          <h1 style={{ 
            color: "#fff", 
            fontSize: isMobile ? "1.8rem" : "2.5rem", 
            margin: 0,
            textAlign: isMobile ? "center" : "left"
          }}>
            Reports & Analytics
          </h1>
          <div style={{ 
            display: "flex", 
            gap: "1rem",
            flexDirection: isMobile ? "column" : "row",
            width: isMobile ? "100%" : "auto"
          }}>
            <button
              onClick={handlePrint}
              style={{
                background: "#10b981",
                color: "#fff",
                border: "none",
                padding: "0.75rem 1.5rem",
                borderRadius: "8px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                fontSize: "1rem",
                fontWeight: "600",
                width: isMobile ? "100%" : "auto"
              }}
            >
              <FaPrint /> Print
            </button>
            <button
              onClick={handleDownload}
              style={{
                background: "#06b6d4",
                color: "#fff",
                border: "none",
                padding: "0.75rem 1.5rem",
                borderRadius: "8px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                fontSize: "1rem",
                fontWeight: "600",
                width: isMobile ? "100%" : "auto"
              }}
            >
              <FaDownload /> Download
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="no-print" style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.5rem",
          marginBottom: "0"
        }}>
          <button onClick={() => setActiveTab("individual")} style={{
            ...tabStyle(activeTab === "individual"),
            padding: isMobile ? "0.75rem 1rem" : "1rem 1.5rem",
            fontSize: isMobile ? "0.875rem" : "1rem",
            flex: isMobile ? "1 1 45%" : "0 0 auto"
          }}>
            {!isMobile && <FaIdCard style={{ marginRight: "0.5rem" }} />}
            Student Details
          </button>
          <button onClick={() => setActiveTab("attendance")} style={{
            ...tabStyle(activeTab === "attendance"),
            padding: isMobile ? "0.75rem 1rem" : "1rem 1.5rem",
            fontSize: isMobile ? "0.875rem" : "1rem",
            flex: isMobile ? "1 1 45%" : "0 0 auto"
          }}>
            {!isMobile && <FaCalendarCheck style={{ marginRight: "0.5rem" }} />}
            Attendance
          </button>
          <button onClick={() => setActiveTab("marks")} style={{
            ...tabStyle(activeTab === "marks"),
            padding: isMobile ? "0.75rem 1rem" : "1rem 1.5rem",
            fontSize: isMobile ? "0.875rem" : "1rem",
            flex: isMobile ? "1 1 45%" : "0 0 auto"
          }}>
            {!isMobile && <FaClipboardList style={{ marginRight: "0.5rem" }} />}
            Test Marks
          </button>
          <button onClick={() => setActiveTab("assignments")} style={{
            ...tabStyle(activeTab === "assignments"),
            padding: isMobile ? "0.75rem 1rem" : "1rem 1.5rem",
            fontSize: isMobile ? "0.875rem" : "1rem",
            flex: isMobile ? "1 1 45%" : "0 0 auto"
          }}>
            {!isMobile && <FaFileAlt style={{ marginRight: "0.5rem" }} />}
            Assignments
          </button>
        </div>

        {/* Content Area */}
        <div className="print-content" style={{
          background: "#fff",
          borderRadius: "0 12px 12px 12px",
          padding: isMobile ? "1rem" : "2rem",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          width: "100%",
          boxSizing: "border-box",
          overflowX: "hidden"
        }}>
          {/* Print-only header */}
          <div className="print-header" style={{ display: "none" }}>
            <h1>Your Institute Name</h1>
            <p>Address Line 1, Address Line 2 | Phone: +91-XXXXXXXXXX | Email: info@institute.com</p>
          </div>

          {/* Individual Student Details Tab */}
          {activeTab === "individual" && (
            <div>
              <h2 style={{ marginBottom: "1.5rem", color: "#333" }}>Individual Student Details</h2>
              
              {/* Search Form */}
              <div style={{
                background: "#f9fafb",
                padding: isMobile ? "1rem" : "1.5rem",
                borderRadius: "12px",
                marginBottom: "2rem",
                boxSizing: "border-box"
              }}>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "1rem",
                  marginBottom: "1rem"
                }}>
                  <div>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", color: "#333" }}>
                      Student Name
                    </label>
                    <input
                      type="text"
                      value={searchName}
                      onChange={(e) => setSearchName(e.target.value)}
                      placeholder="Enter student name"
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        border: "1px solid #d1d5db",
                        borderRadius: "6px",
                        fontSize: "1rem",
                        boxSizing: "border-box"
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", color: "#333" }}>
                      Class
                    </label>
                    <input
                      type="text"
                      value={searchClass}
                      onChange={(e) => setSearchClass(e.target.value)}
                      placeholder="Enter class (optional)"
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        border: "1px solid #d1d5db",
                        borderRadius: "6px",
                        fontSize: "1rem",
                        boxSizing: "border-box"
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", color: "#333" }}>
                      Roll No. / ID
                    </label>
                    <input
                      type="text"
                      value={searchRoll}
                      onChange={(e) => setSearchRoll(e.target.value)}
                      placeholder="Enter ID (optional)"
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        border: "1px solid #d1d5db",
                        borderRadius: "6px",
                        fontSize: "1rem",
                        boxSizing: "border-box"
                      }}
                    />
                  </div>
                </div>
                <button
                  onClick={handleStudentSearch}
                  style={{
                    background: "#667eea",
                    color: "#fff",
                    border: "none",
                    padding: "0.75rem 2rem",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "1rem",
                    fontWeight: "600",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    width: isMobile ? "100%" : "auto"
                  }}
                >
                  <FaSearch /> Search Student
                </button>
              </div>

              {/* Student Details Display */}
              {selectedStudentDetails && (
                <div>
                  {/* Basic Info Card */}
                  <div style={{
                    background: "linear-gradient(135deg, #667eea, #764ba2)",
                    color: "#fff",
                    padding: isMobile ? "1.5rem" : "2rem",
                    borderRadius: "12px",
                    marginBottom: "1.5rem"
                  }}>
                    <h3 style={{ fontSize: isMobile ? "1.5rem" : "1.8rem", marginBottom: "1rem" }}>
                      {selectedStudentDetails.student.name}
                    </h3>
                    <div style={{
                      display: "grid",
                      gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(200px, 1fr))",
                      gap: "1rem"
                    }}>
                      <div>
                        <div style={{ opacity: 0.8, fontSize: "0.9rem" }}>Student ID</div>
                        <div style={{ fontSize: "1.1rem", fontWeight: "600" }}>{selectedStudentDetails.student.id}</div>
                      </div>
                      <div>
                        <div style={{ opacity: 0.8, fontSize: "0.9rem" }}>Email</div>
                        <div style={{ fontSize: "1.1rem", fontWeight: "600" }}>{selectedStudentDetails.student.email}</div>
                      </div>
                      <div>
                        <div style={{ opacity: 0.8, fontSize: "0.9rem" }}>Phone</div>
                        <div style={{ fontSize: "1.1rem", fontWeight: "600" }}>{selectedStudentDetails.student.phone}</div>
                      </div>
                      <div>
                        <div style={{ opacity: 0.8, fontSize: "0.9rem" }}>Status</div>
                        <div style={{ fontSize: "1.1rem", fontWeight: "600" }}>{selectedStudentDetails.student.status}</div>
                      </div>
                    </div>
                  </div>

                  {/* Course & Batch Info */}
                  <div style={{
                    background: "#f9fafb",
                    padding: isMobile ? "1rem" : "1.5rem",
                    borderRadius: "12px",
                    marginBottom: "1.5rem",
                    boxSizing: "border-box"
                  }}>
                    <h4 style={{ color: "#333", marginBottom: "1rem", fontSize: isMobile ? "1.1rem" : "1.3rem" }}>
                      Enrollment Details
                    </h4>
                    <div style={{
                      display: "grid",
                      gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(200px, 1fr))",
                      gap: "1rem"
                    }}>
                      <div>
                        <div style={{ color: "#666", fontSize: "0.9rem", marginBottom: "0.3rem" }}>Course/Class</div>
                        <div style={{ color: "#333", fontSize: "1.1rem", fontWeight: "600" }}>{selectedStudentDetails.student.course}</div>
                      </div>
                      <div>
                        <div style={{ color: "#666", fontSize: "0.9rem", marginBottom: "0.3rem" }}>Batch & Timing</div>
                        <div style={{ color: "#333", fontSize: "1.1rem", fontWeight: "600" }}>{selectedStudentDetails.student.batch}</div>
                      </div>
                      <div>
                        <div style={{ color: "#666", fontSize: "0.9rem", marginBottom: "0.3rem" }}>Subjects Enrolled</div>
                        <div style={{ color: "#333", fontSize: "1.1rem", fontWeight: "600" }}>{selectedStudentDetails.student.subjects}</div>
                      </div>
                      <div>
                        <div style={{ color: "#666", fontSize: "0.9rem", marginBottom: "0.3rem" }}>Enrollment Date</div>
                        <div style={{ color: "#333", fontSize: "1.1rem", fontWeight: "600" }}>{selectedStudentDetails.student.enrollmentDate}</div>
                      </div>
                    </div>
                  </div>

                  {/* Fee Status */}
                  {selectedStudentDetails.fee && (
                    <div style={{
                      background: "#f0fdf4",
                      border: "2px solid #10b981",
                      padding: isMobile ? "1rem" : "1.5rem",
                      borderRadius: "12px",
                      marginBottom: "1.5rem",
                      boxSizing: "border-box"
                    }}>
                      <h4 style={{ color: "#333", marginBottom: "1rem", fontSize: isMobile ? "1.1rem" : "1.3rem" }}>
                        Fee Status
                      </h4>
                      <div style={{
                        display: "grid",
                        gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(150px, 1fr))",
                        gap: "1rem"
                      }}>
                        <div>
                          <div style={{ color: "#666", fontSize: "0.9rem", marginBottom: "0.3rem" }}>Total Fee</div>
                          <div style={{ color: "#333", fontSize: "1.3rem", fontWeight: "700" }}>₹{selectedStudentDetails.fee.totalFee.toLocaleString()}</div>
                        </div>
                        <div>
                          <div style={{ color: "#666", fontSize: "0.9rem", marginBottom: "0.3rem" }}>Paid Amount</div>
                          <div style={{ color: "#10b981", fontSize: "1.3rem", fontWeight: "700" }}>₹{selectedStudentDetails.fee.paid.toLocaleString()}</div>
                        </div>
                        <div>
                          <div style={{ color: "#666", fontSize: "0.9rem", marginBottom: "0.3rem" }}>Pending Amount</div>
                          <div style={{ color: "#ef4444", fontSize: "1.3rem", fontWeight: "700" }}>₹{selectedStudentDetails.fee.pending.toLocaleString()}</div>
                        </div>
                        <div>
                          <div style={{ color: "#666", fontSize: "0.9rem", marginBottom: "0.3rem" }}>Payment Status</div>
                          <div style={{
                            display: "inline-block",
                            padding: "0.5rem 1rem",
                            borderRadius: "20px",
                            background: selectedStudentDetails.fee.status === "Paid" ? "#d1fae5" : "#fef3c7",
                            color: selectedStudentDetails.fee.status === "Paid" ? "#065f46" : "#92400e",
                            fontSize: "1rem",
                            fontWeight: "600"
                          }}>
                            {selectedStudentDetails.fee.status}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Attendance */}
                  {selectedStudentDetails.attendance && (
                    <div style={{
                      background: "#fef3c7",
                      border: "2px solid #f59e0b",
                      padding: isMobile ? "1rem" : "1.5rem",
                      borderRadius: "12px",
                      marginBottom: "1.5rem",
                      boxSizing: "border-box"
                    }}>
                      <h4 style={{ color: "#333", marginBottom: "1rem", fontSize: isMobile ? "1.1rem" : "1.3rem" }}>
                        Attendance Report
                      </h4>
                      <div style={{
                        display: "grid",
                        gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(150px, 1fr))",
                        gap: "1rem"
                      }}>
                        <div>
                          <div style={{ color: "#666", fontSize: "0.9rem", marginBottom: "0.3rem" }}>Total Classes</div>
                          <div style={{ color: "#333", fontSize: "1.3rem", fontWeight: "700" }}>{selectedStudentDetails.attendance.totalClasses}</div>
                        </div>
                        <div>
                          <div style={{ color: "#666", fontSize: "0.9rem", marginBottom: "0.3rem" }}>Attended</div>
                          <div style={{ color: "#10b981", fontSize: "1.3rem", fontWeight: "700" }}>{selectedStudentDetails.attendance.attended}</div>
                        </div>
                        <div>
                          <div style={{ color: "#666", fontSize: "0.9rem", marginBottom: "0.3rem" }}>Percentage</div>
                          <div style={{ color: "#667eea", fontSize: "1.3rem", fontWeight: "700" }}>{selectedStudentDetails.attendance.percentage}%</div>
                        </div>
                        <div>
                          <div style={{ color: "#666", fontSize: "0.9rem", marginBottom: "0.3rem" }}>Status</div>
                          <div style={{
                            display: "inline-block",
                            padding: "0.5rem 1rem",
                            borderRadius: "20px",
                            background: selectedStudentDetails.attendance.percentage >= 85 ? "#d1fae5" : "#fee2e2",
                            color: selectedStudentDetails.attendance.percentage >= 85 ? "#065f46" : "#991b1b",
                            fontSize: "1rem",
                            fontWeight: "600"
                          }}>
                            {selectedStudentDetails.attendance.status}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Test Marks */}
                  {selectedStudentDetails.marks.length > 0 && (
                    <div style={{
                      background: "#fff",
                      border: "2px solid #667eea",
                      padding: isMobile ? "1rem" : "1.5rem",
                      borderRadius: "12px",
                      marginBottom: "1.5rem",
                      boxSizing: "border-box"
                    }}>
                      <h4 style={{ color: "#333", marginBottom: "1rem", fontSize: isMobile ? "1.1rem" : "1.3rem" }}>
                        Test Marks History
                      </h4>
                      <div style={{ 
                        overflowX: "auto",
                        width: "100%",
                        boxSizing: "border-box"
                      }}>
                        <table style={{ 
                          width: "100%", 
                          borderCollapse: "collapse",
                          minWidth: isMobile ? "600px" : "100%"
                        }}>
                        <thead style={{ background: "#667eea", color: "#fff" }}>
                          <tr>
                            <th style={{ padding: "0.75rem", textAlign: "left" }}>Subject</th>
                            <th style={{ padding: "0.75rem", textAlign: "left" }}>Test Name</th>
                            <th style={{ padding: "0.75rem", textAlign: "left" }}>Marks</th>
                            <th style={{ padding: "0.75rem", textAlign: "left" }}>Percentage</th>
                            <th style={{ padding: "0.75rem", textAlign: "left" }}>Uploaded By</th>
                            <th style={{ padding: "0.75rem", textAlign: "left" }}>Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedStudentDetails.marks.map((mark, index) => (
                            <tr key={index} style={{
                              borderBottom: "1px solid #e5e7eb",
                              background: index % 2 === 0 ? "#f9fafb" : "#fff"
                            }}>
                              <td style={{ padding: "0.75rem" }}>{mark.subject}</td>
                              <td style={{ padding: "0.75rem" }}>{mark.testName}</td>
                              <td style={{ padding: "0.75rem", fontWeight: "600" }}>{mark.obtained}/{mark.maxMarks}</td>
                              <td style={{ padding: "0.75rem", fontWeight: "600", color: "#667eea" }}>
                                {((mark.obtained / mark.maxMarks) * 100).toFixed(1)}%
                              </td>
                              <td style={{ padding: "0.75rem" }}>{mark.uploadedBy}</td>
                              <td style={{ padding: "0.75rem" }}>{mark.date}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      </div>
                    </div>
                  )}

                  {/* Assignments */}
                  {selectedStudentDetails.assignments.length > 0 && (
                    <div style={{
                      background: "#fff",
                      border: "2px solid #06b6d4",
                      padding: isMobile ? "1rem" : "1.5rem",
                      borderRadius: "12px",
                      boxSizing: "border-box"
                    }}>
                      <h4 style={{ color: "#333", marginBottom: "1rem", fontSize: isMobile ? "1.1rem" : "1.3rem" }}>
                        Assigned Tests & Assignments
                      </h4>
                      <div style={{ 
                        overflowX: "auto",
                        width: "100%",
                        boxSizing: "border-box"
                      }}>
                        <table style={{ 
                          width: "100%", 
                          borderCollapse: "collapse",
                          minWidth: isMobile ? "600px" : "100%"
                        }}>
                        <thead style={{ background: "#06b6d4", color: "#fff" }}>
                          <tr>
                            <th style={{ padding: "0.75rem", textAlign: "left" }}>Assignment Name</th>
                            <th style={{ padding: "0.75rem", textAlign: "left" }}>Subject</th>
                            <th style={{ padding: "0.75rem", textAlign: "left" }}>Uploaded By</th>
                            <th style={{ padding: "0.75rem", textAlign: "left" }}>Due Date</th>
                            <th style={{ padding: "0.75rem", textAlign: "left" }}>Submission Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedStudentDetails.assignments.map((assignment, index) => (
                            <tr key={index} style={{
                              borderBottom: "1px solid #e5e7eb",
                              background: index % 2 === 0 ? "#f9fafb" : "#fff"
                            }}>
                              <td style={{ padding: "0.75rem", fontWeight: "600" }}>{assignment.testName}</td>
                              <td style={{ padding: "0.75rem" }}>{assignment.subject}</td>
                              <td style={{ padding: "0.75rem" }}>{assignment.uploadedBy}</td>
                              <td style={{ padding: "0.75rem" }}>{assignment.dueDate}</td>
                              <td style={{ padding: "0.75rem" }}>
                                <span style={{
                                  padding: "0.25rem 0.75rem",
                                  borderRadius: "12px",
                                  background: "#d1fae5",
                                  color: "#065f46",
                                  fontSize: "0.875rem",
                                  fontWeight: "600"
                                }}>
                                  {assignment.submissions}/{assignment.totalStudents} Submitted
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {!selectedStudentDetails && (
                <div style={{
                  textAlign: "center",
                  padding: "3rem",
                  color: "#666"
                }}>
                  <FaSearch style={{ fontSize: "3rem", marginBottom: "1rem", opacity: 0.3 }} />
                  <p>Search for a student to view their complete details</p>
                </div>
              )}
            </div>
          )}

          {/* Attendance Report Tab */}
          {activeTab === "attendance" && (
            <div>
              <h2 style={{ marginBottom: "1.5rem", color: "#333" }}>Attendance Report</h2>
              <div style={{ 
                overflowX: "auto",
                width: "100%",
                boxSizing: "border-box"
              }}>
                <table style={{ 
                  width: "100%", 
                  borderCollapse: "collapse",
                  minWidth: isMobile ? "700px" : "100%"
                }}>
                  <thead style={{ background: "#667eea", color: "#fff" }}>
                    <tr>
                      <th style={{ padding: "1rem", textAlign: "left" }}>ID</th>
                      <th style={{ padding: "1rem", textAlign: "left" }}>Student Name</th>
                      <th style={{ padding: "1rem", textAlign: "left" }}>Class</th>
                      <th style={{ padding: "1rem", textAlign: "left" }}>Total Classes</th>
                      <th style={{ padding: "1rem", textAlign: "left" }}>Attended</th>
                      <th style={{ padding: "1rem", textAlign: "left" }}>Percentage</th>
                      <th style={{ padding: "1rem", textAlign: "left" }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="7" style={{ padding: "2rem", textAlign: "center" }}>
                          Loading attendance reports...
                        </td>
                      </tr>
                    ) : attendanceReports.length === 0 ? (
                      <tr>
                        <td colSpan="7" style={{ padding: "2rem", textAlign: "center" }}>
                          No attendance records found
                        </td>
                      </tr>
                    ) : (
                      attendanceReports.map((att, index) => {
                        const studentName = att.student_name || att.studentName || "N/A";
                        const className = att.course || att.class || "N/A";
                        const totalClasses = att.total_classes || att.totalClasses || 0;
                        const attended = att.present_count || att.attended || 0;
                        const percentage = att.attendance_percentage || att.percentage || 0;
                        const status = percentage >= 85 ? "Excellent" : percentage >= 75 ? "Good" : "Average";
                        
                        return (
                          <tr key={att.id || index} style={{
                            borderBottom: "1px solid #e5e7eb",
                            background: index % 2 === 0 ? "#f9fafb" : "#fff"
                          }}>
                            <td style={{ padding: "1rem" }}>{att.student_id || att.id}</td>
                            <td style={{ padding: "1rem", fontWeight: "600" }}>{studentName}</td>
                            <td style={{ padding: "1rem" }}>{className}</td>
                            <td style={{ padding: "1rem" }}>{totalClasses}</td>
                            <td style={{ padding: "1rem" }}>{attended}</td>
                            <td style={{ padding: "1rem", fontWeight: "600" }}>{percentage.toFixed(1)}%</td>
                            <td style={{ padding: "1rem" }}>
                              <span style={{
                                padding: "0.25rem 0.75rem",
                                borderRadius: "12px",
                                fontSize: "0.875rem",
                                fontWeight: "600",
                                background: percentage >= 85 ? "#d1fae5" : percentage >= 75 ? "#fef3c7" : "#fee2e2",
                                color: percentage >= 85 ? "#065f46" : percentage >= 75 ? "#92400e" : "#991b1b"
                              }}>
                                {status}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
              <div style={{ marginTop: "1.5rem", padding: "1rem", background: "#f3f4f6", borderRadius: "8px" }}>
                <strong>Average Attendance:</strong> {attendanceReports.length > 0 ? (attendanceReports.reduce((sum, a) => sum + (a.attendance_percentage || a.percentage || 0), 0) / attendanceReports.length).toFixed(1) : 0}%
              </div>
            </div>
          )}

          {/* Test Marks Tab */}
          {activeTab === "marks" && (
            <div>
              <h2 style={{ marginBottom: "1.5rem", color: "#333" }}>Test Marks Report</h2>
              <div style={{ 
                overflowX: "auto",
                width: "100%",
                boxSizing: "border-box"
              }}>
                <table style={{ 
                  width: "100%", 
                  borderCollapse: "collapse",
                  minWidth: isMobile ? "900px" : "100%"
                }}>
                  <thead style={{ background: "#667eea", color: "#fff" }}>
                    <tr>
                      <th style={{ padding: "1rem", textAlign: "left" }}>ID</th>
                      <th style={{ padding: "1rem", textAlign: "left" }}>Student Name</th>
                      <th style={{ padding: "1rem", textAlign: "left" }}>Class</th>
                      <th style={{ padding: "1rem", textAlign: "left" }}>Subject</th>
                      <th style={{ padding: "1rem", textAlign: "left" }}>Test Name</th>
                      <th style={{ padding: "1rem", textAlign: "left" }}>Max Marks</th>
                      <th style={{ padding: "1rem", textAlign: "left" }}>Obtained</th>
                      <th style={{ padding: "1rem", textAlign: "left" }}>Percentage</th>
                      <th style={{ padding: "1rem", textAlign: "left" }}>Uploaded By</th>
                      <th style={{ padding: "1rem", textAlign: "left" }}>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {testMarks.map((mark, index) => (
                      <tr key={mark.id} style={{
                        borderBottom: "1px solid #e5e7eb",
                        background: index % 2 === 0 ? "#f9fafb" : "#fff"
                      }}>
                        <td style={{ padding: "1rem" }}>{mark.id}</td>
                        <td style={{ padding: "1rem", fontWeight: "600" }}>{mark.studentName}</td>
                        <td style={{ padding: "1rem" }}>{mark.class}</td>
                        <td style={{ padding: "1rem" }}>{mark.subject}</td>
                        <td style={{ padding: "1rem" }}>{mark.testName}</td>
                        <td style={{ padding: "1rem" }}>{mark.maxMarks}</td>
                        <td style={{ padding: "1rem", fontWeight: "600", color: "#667eea" }}>{mark.obtained}</td>
                        <td style={{ padding: "1rem" }}>{((mark.obtained / mark.maxMarks) * 100).toFixed(1)}%</td>
                        <td style={{ padding: "1rem" }}>{mark.uploadedBy}</td>
                        <td style={{ padding: "1rem" }}>{mark.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ marginTop: "1.5rem", padding: "1rem", background: "#f3f4f6", borderRadius: "8px" }}>
                <strong>Average Score:</strong> {(testMarks.reduce((sum, m) => sum + (m.obtained / m.maxMarks) * 100, 0) / testMarks.length).toFixed(1)}%
              </div>
            </div>
          )}

          {/* Assignments Tab */}
          {activeTab === "assignments" && (
            <div>
              <h2 style={{ marginBottom: "1.5rem", color: "#333" }}>Assignments & Tests Report</h2>
              <div style={{ 
                overflowX: "auto",
                width: "100%",
                boxSizing: "border-box"
              }}>
                <table style={{ 
                  width: "100%", 
                  borderCollapse: "collapse",
                  minWidth: isMobile ? "900px" : "100%"
                }}>
                  <thead style={{ background: "#667eea", color: "#fff" }}>
                    <tr>
                      <th style={{ padding: "1rem", textAlign: "left" }}>ID</th>
                      <th style={{ padding: "1rem", textAlign: "left" }}>Assignment/Test Name</th>
                      <th style={{ padding: "1rem", textAlign: "left" }}>Class</th>
                      <th style={{ padding: "1rem", textAlign: "left" }}>Subject</th>
                      <th style={{ padding: "1rem", textAlign: "left" }}>Uploaded By</th>
                      <th style={{ padding: "1rem", textAlign: "left" }}>Due Date</th>
                      <th style={{ padding: "1rem", textAlign: "left" }}>Submissions</th>
                      <th style={{ padding: "1rem", textAlign: "left" }}>Total Students</th>
                      <th style={{ padding: "1rem", textAlign: "left" }}>Progress</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assignments.map((assignment, index) => (
                      <tr key={assignment.id} style={{
                        borderBottom: "1px solid #e5e7eb",
                        background: index % 2 === 0 ? "#f9fafb" : "#fff"
                      }}>
                        <td style={{ padding: "1rem" }}>{assignment.id}</td>
                        <td style={{ padding: "1rem", fontWeight: "600" }}>{assignment.testName}</td>
                        <td style={{ padding: "1rem" }}>{assignment.class}</td>
                        <td style={{ padding: "1rem" }}>{assignment.subject}</td>
                        <td style={{ padding: "1rem" }}>{assignment.uploadedBy}</td>
                        <td style={{ padding: "1rem" }}>{assignment.dueDate}</td>
                        <td style={{ padding: "1rem", color: "#10b981", fontWeight: "600" }}>{assignment.submissions}</td>
                        <td style={{ padding: "1rem" }}>{assignment.totalStudents}</td>
                        <td style={{ padding: "1rem" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <div style={{
                              flex: 1,
                              height: "8px",
                              background: "#e5e7eb",
                              borderRadius: "4px",
                              overflow: "hidden"
                            }}>
                              <div style={{
                                height: "100%",
                                width: `${(assignment.submissions / assignment.totalStudents) * 100}%`,
                                background: "#10b981",
                                borderRadius: "4px"
                              }}></div>
                            </div>
                            <span style={{ fontSize: "0.875rem", fontWeight: "600" }}>
                              {Math.round((assignment.submissions / assignment.totalStudents) * 100)}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ marginTop: "1.5rem", padding: "1rem", background: "#f3f4f6", borderRadius: "8px" }}>
                <strong>Total Assignments:</strong> {assignments.length} | 
                <strong style={{ marginLeft: "1rem" }}>Average Submission Rate:</strong> {(assignments.reduce((sum, a) => sum + (a.submissions / a.totalStudents) * 100, 0) / assignments.length).toFixed(1)}%
              </div>
            </div>
          )}
        </div>
        </div>
      </div>
    </>
  );
};

export default Reports;
