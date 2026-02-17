import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaEye, FaPlus, FaSearch, FaTimes, FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAdminData } from "../../store/adminDataContext";
import { 
  createStudent, 
  updateStudent, 
  deleteStudent,
  enrollStudentInBatch,
  unenrollStudentFromBatch,
  getStudentBatches
} from "../../services/adminService";

const StudentManagement = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const { students, refreshStudents, batches, refreshBatches, teachers, refreshTeachers } = useAdminData();

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // add, edit, view
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [courseFilter, setCourseFilter] = useState("All");
  const [submitting, setSubmitting] = useState(false);
  const [selectedBatchInfo, setSelectedBatchInfo] = useState(null);
  const [enrolledBatches, setEnrolledBatches] = useState([]);
  const [selectedBatchToEnroll, setSelectedBatchToEnroll] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    enrollmentDate: "",
    course: "",
    batch: "",
    subjects: "",
    status: "Active"
  });

  const courses = ["9", "10", "11", "12", "JEE Main/Advance", "CUET", "B.COM(P/H)"];

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch batches and teachers when component mounts
  useEffect(() => {
    refreshBatches();
    refreshTeachers();
  }, [refreshBatches, refreshTeachers]);

  // Update selected batch info when batch changes
  useEffect(() => {
    if (formData.batch) {
      const batch = batches.find(b => b.code === formData.batch);
      if (batch) {
        const teacher = teachers.find(t => t.id === batch.teacher_id);
        setSelectedBatchInfo({
          ...batch,
          teacherName: teacher ? teacher.name : "Not Assigned",
          teacherSubject: teacher ? teacher.subject : ""
        });
      } else {
        setSelectedBatchInfo(null);
      }
    } else {
      setSelectedBatchInfo(null);
    }
  }, [formData.batch, batches, teachers]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const openAddModal = () => {
    setModalMode("add");
    setFormData({
      name: "",
      email: "",
      phone: "",
      password: "",
      enrollmentDate: "",
      course: "",
      batch: "",
      subjects: "",
      status: "Active"
    });
    setShowModal(true);
  };

  const openEditModal = async (student) => {
    setModalMode("edit");
    setSelectedStudent(student);
    setFormData(student);
    setShowModal(true);
    
    // Fetch enrolled batches for this student
    try {
      const response = await getStudentBatches(student.id);
      setEnrolledBatches(response.data);
    } catch (err) {
      console.error("Error fetching student batches:", err);
      setEnrolledBatches([]);
    }
  };

  const openViewModal = (student) => {
    setModalMode("view");
    setSelectedStudent(student);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedStudent(null);
    setEnrolledBatches([]);
    setSelectedBatchToEnroll("");
  };

  const handleEnrollBatch = async () => {
    if (!selectedBatchToEnroll || !selectedStudent) return;
    
    try {
      await enrollStudentInBatch(selectedStudent.id, selectedBatchToEnroll);
      alert("Student enrolled in batch successfully!");
      
      // Refresh enrolled batches
      const response = await getStudentBatches(selectedStudent.id);
      setEnrolledBatches(response.data);
      setSelectedBatchToEnroll("");
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to enroll student in batch");
    }
  };

  const handleUnenrollBatch = async (batchId) => {
    if (!window.confirm("Are you sure you want to remove this student from this batch?")) {
      return;
    }
    
    try {
      await unenrollStudentFromBatch(selectedStudent.id, batchId);
      alert("Student removed from batch successfully!");
      
      // Refresh enrolled batches
      const response = await getStudentBatches(selectedStudent.id);
      setEnrolledBatches(response.data);
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to remove student from batch");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      if (modalMode === "add") {
        await createStudent({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          enrollment_date: formData.enrollmentDate,
          course: formData.course,
          batch: formData.batch,
          subjects: formData.subjects,
          status: formData.status
        });
        await refreshStudents();
        alert("Student added successfully!");
      } else if (modalMode === "edit") {
        await updateStudent(selectedStudent.id, {
          name: formData.name,
          phone: formData.phone,
          course: formData.course,
          batch: formData.batch,
          subjects: formData.subjects,
          status: formData.status
        });
        await refreshStudents();
        alert("Student updated successfully!");
      }
      closeModal();
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to save student");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await deleteStudent(id);
        await refreshStudents();
        alert("Student deleted successfully!");
      } catch (err) {
        alert(err.response?.data?.detail || "Failed to delete student");
      }
    }
  };

  const filteredStudents = students.filter(student =>
    (student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.batch.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (courseFilter === "All" || student.course === courseFilter)
  );

  const modalStyles = {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
      padding: isMobile ? "1rem" : "0"
    },
    modal: {
      background: "#fff",
      padding: isMobile ? "1.5rem" : "2rem",
      borderRadius: "12px",
      maxWidth: "600px",
      width: isMobile ? "100%" : "90%",
      maxHeight: "90vh",
      overflowY: "auto",
      position: "relative",
      boxSizing: "border-box"
    },
    closeButton: {
      position: "absolute",
      top: "1rem",
      right: "1rem",
      background: "none",
      border: "none",
      fontSize: "1.5rem",
      cursor: "pointer",
      color: "#666"
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      paddingTop: "2rem",
      paddingBottom: "2rem",
      paddingLeft: isMobile ? "1rem" : "2rem",
      paddingRight: isMobile ? "1rem" : "2rem",
      width: "100%",
      overflowX: "hidden",
      boxSizing: "border-box"
    }}>
      <div style={{ 
        maxWidth: "1400px", 
        margin: "0 auto",
        width: "100%",
        boxSizing: "border-box"
      }}>
        <Link to="/admin/dashboard" style={{
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

        <div style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "space-between",
          alignItems: isMobile ? "stretch" : "center",
          marginBottom: "2rem",
          gap: "1rem"
        }}>
          <h1 style={{ 
            color: "#fff", 
            fontSize: isMobile ? "1.8rem" : "2.5rem", 
            margin: 0,
            textAlign: isMobile ? "center" : "left",
            wordBreak: "break-word"
          }}>
            Student Management
          </h1>
          <div style={{ 
            display: "flex", 
            flexDirection: isMobile ? "column" : "row",
            gap: "1rem", 
            alignItems: isMobile ? "stretch" : "center",
            width: isMobile ? "100%" : "auto"
          }}>
            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              style={{
                background: "#fff",
                color: "#333",
                border: "none",
                padding: "0.75rem 1rem",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "1rem",
                fontWeight: "600",
                width: isMobile ? "100%" : "auto",
                boxSizing: "border-box",
                appearance: "none",
                WebkitAppearance: "none"
              }}
            >
              <option value="All">All Classes</option>
              {courses.map(course => (
                <option key={course} value={course}>{course}</option>
              ))}
            </select>
            <button
              onClick={openAddModal}
              style={{
                background: "#10b981",
                color: "#fff",
                border: "none",
                padding: "0.75rem 1.5rem",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "1rem",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                transition: "all 0.3s",
                width: isMobile ? "100%" : "auto"
              }}
              onMouseOver={(e) => e.currentTarget.style.background = "#059669"}
              onMouseOut={(e) => e.currentTarget.style.background = "#10b981"}
            >
              <FaPlus /> Add Student
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div style={{
          background: "#fff",
          padding: isMobile ? "0.75rem" : "1rem",
          borderRadius: "12px",
          marginBottom: "1.5rem",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          width: "100%",
          boxSizing: "border-box"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <FaSearch style={{ color: "#666" }} />
            <input
              type="text"
              placeholder={isMobile ? "Search students..." : "Search by name, email, course, or batch..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                fontSize: isMobile ? "0.9rem" : "1rem",
                padding: "0.5rem",
                width: "100%",
                boxSizing: "border-box"
              }}
            />
          </div>
        </div>

        {/* Students Table */}
        <div style={{
          background: "#fff",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          width: "100%",
          boxSizing: "border-box"
        }}>
          <div style={{ overflowX: "auto", width: "100%" }}>
            <table style={{
              width: "100%",
              borderCollapse: "collapse",
              minWidth: isMobile ? "800px" : "auto"
            }}>
              <thead style={{ background: "#667eea", color: "#fff" }}>
                <tr>
                  <th style={{ padding: "1rem", textAlign: "left" }}>ID</th>
                  <th style={{ padding: "1rem", textAlign: "left" }}>Name</th>
                  <th style={{ padding: "1rem", textAlign: "left" }}>Email</th>
                  <th style={{ padding: "1rem", textAlign: "left" }}>Phone</th>
                  <th style={{ padding: "1rem", textAlign: "left" }}>Class</th>
                  <th style={{ padding: "1rem", textAlign: "left" }}>Batch</th>
                  <th style={{ padding: "1rem", textAlign: "left" }}>Subjects</th>
                  <th style={{ padding: "1rem", textAlign: "left" }}>Status</th>
                  <th style={{ padding: "1rem", textAlign: "left" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student, index) => (
                  <tr key={student.id} style={{
                    borderBottom: "1px solid #e5e7eb",
                    background: index % 2 === 0 ? "#f9fafb" : "#fff"
                  }}>
                    <td style={{ padding: "1rem" }}>{student.id}</td>
                    <td style={{ padding: "1rem", fontWeight: "600" }}>{student.name}</td>
                    <td style={{ padding: "1rem" }}>{student.email}</td>
                    <td style={{ padding: "1rem" }}>{student.phone}</td>
                    <td style={{ padding: "1rem" }}>{student.course}</td>
                    <td style={{ padding: "1rem" }}>{student.batch}</td>
                    <td style={{ padding: "1rem" }}>{student.subjects}</td>
                    <td style={{ padding: "1rem" }}>
                      <span style={{
                        padding: "0.25rem 0.75rem",
                        borderRadius: "12px",
                        fontSize: "0.875rem",
                        fontWeight: "600",
                        background: student.status?.toLowerCase() === "active" ? "#d1fae5" : "#fee2e2",
                        color: student.status?.toLowerCase() === "active" ? "#065f46" : "#991b1b"
                      }}>
                        {student.status?.charAt(0).toUpperCase() + student.status?.slice(1).toLowerCase()}
                      </span>
                    </td>
                    <td style={{ padding: "1rem" }}>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button
                          onClick={() => openViewModal(student)}
                          style={{
                            background: "#06b6d4",
                            color: "#fff",
                            border: "none",
                            padding: "0.5rem",
                            borderRadius: "6px",
                            cursor: "pointer"
                          }}
                          title="View Details"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => openEditModal(student)}
                          style={{
                            background: "#f59e0b",
                            color: "#fff",
                            border: "none",
                            padding: "0.5rem",
                            borderRadius: "6px",
                            cursor: "pointer"
                          }}
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(student.id)}
                          style={{
                            background: "#ef4444",
                            color: "#fff",
                            border: "none",
                            padding: "0.5rem",
                            borderRadius: "6px",
                            cursor: "pointer"
                          }}
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredStudents.length === 0 && (
            <div style={{
              padding: "3rem",
              textAlign: "center",
              color: "#666"
            }}>
              No students found
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div style={modalStyles.overlay} onClick={closeModal}>
          <div style={modalStyles.modal} onClick={(e) => e.stopPropagation()}>
            <button onClick={closeModal} style={modalStyles.closeButton}>
              <FaTimes />
            </button>
            
            <h2 style={{ marginBottom: "1.5rem", color: "#333" }}>
              {modalMode === "add" ? "Add New Student" : modalMode === "edit" ? "Edit Student" : "Student Details"}
            </h2>

            {modalMode === "view" ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div>
                  <strong>Name:</strong> {selectedStudent.name}
                </div>
                <div>
                  <strong>Email:</strong> {selectedStudent.email}
                </div>
                <div>
                  <strong>Phone:</strong> {selectedStudent.phone}
                </div>
                <div>
                  <strong>Enrollment Date:</strong> {selectedStudent.enrollmentDate}
                </div>
                <div>
                  <strong>Class:</strong> {selectedStudent.course}
                </div>
                <div>
                  <strong>Batch:</strong> {selectedStudent.batch}
                </div>
                <div>
                  <strong>Subjects:</strong> {selectedStudent.subjects}
                </div>
                <div>
                  <strong>Status:</strong> {selectedStudent.status}
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>
                      Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        border: "1px solid #d1d5db",
                        borderRadius: "6px",
                        fontSize: "1rem"
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        border: "1px solid #d1d5db",
                        borderRadius: "6px",
                        fontSize: "1rem"
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>
                      Phone *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        border: "1px solid #d1d5db",
                        borderRadius: "6px",
                        fontSize: "1rem"
                      }}
                    />
                  </div>

                  {modalMode === "add" && (
                    <div>
                      <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>
                        Password *
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        minLength="8"
                        style={{
                          width: "100%",
                          padding: "0.75rem",
                          border: "1px solid #d1d5db",
                          borderRadius: "6px",
                          fontSize: "1rem"
                        }}
                      />
                    </div>
                  )}

                  {modalMode === "add" && (
                    <div>
                      <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>
                        Enrollment Date *
                      </label>
                      <input
                        type="date"
                        name="enrollmentDate"
                        value={formData.enrollmentDate}
                        onChange={handleInputChange}
                        required
                        style={{
                          width: "100%",
                          padding: "0.75rem",
                          border: "1px solid #d1d5db",
                          borderRadius: "6px",
                          fontSize: "1rem"
                        }}
                      />
                    </div>
                  )}

                  <div>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>
                      Class *
                    </label>
                    <select
                      name="course"
                      value={formData.course}
                      onChange={handleInputChange}
                      required
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        border: "1px solid #d1d5db",
                        borderRadius: "6px",
                        fontSize: "1rem"
                      }}
                    >
                      <option value="">Select Class</option>
                      {courses.map(course => (
                        <option key={course} value={course}>{course}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>
                      Batch *
                    </label>
                    <select
                      name="batch"
                      value={formData.batch}
                      onChange={handleInputChange}
                      required
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        border: "1px solid #d1d5db",
                        borderRadius: "6px",
                        fontSize: "1rem"
                      }}
                    >
                      <option value="">Select Batch</option>
                      {batches.filter(b => b.code === formData.course).map(batch => (
                        <option key={batch.id} value={batch.code}>
                          {batch.name} - {batch.timing || "Time not set"}
                        </option>
                      ))}
                      {batches.filter(b => b.code === formData.course).length === 0 && (
                        <option value="" disabled>No batches available for this class</option>
                      )}
                    </select>
                    {selectedBatchInfo && (
                      <div style={{
                        marginTop: "0.5rem",
                        padding: "0.75rem",
                        background: "#f3f4f6",
                        borderRadius: "6px",
                        fontSize: "0.9rem"
                      }}>
                        <p style={{ margin: "0 0 0.25rem 0", fontWeight: "600" }}>
                          📚 Batch: {selectedBatchInfo.name}
                        </p>
                        <p style={{ margin: "0 0 0.25rem 0" }}>
                          👨‍🏫 Teacher: {selectedBatchInfo.teacherName}
                          {selectedBatchInfo.teacherSubject && ` (${selectedBatchInfo.teacherSubject})`}
                        </p>
                        <p style={{ margin: "0 0 0.25rem 0" }}>
                          🕐 Timing: {selectedBatchInfo.timing || "Not set"}
                        </p>
                        <p style={{ margin: "0" }}>
                          📅 Days: {selectedBatchInfo.days || "Not set"}
                        </p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>
                      Subjects *
                    </label>
                    <input
                      type="text"
                      name="subjects"
                      value={formData.subjects}
                      onChange={handleInputChange}
                      placeholder="e.g., Physics, Chemistry, Mathematics"
                      required
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        border: "1px solid #d1d5db",
                        borderRadius: "6px",
                        fontSize: "1rem"
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>
                      Status *
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      required
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        border: "1px solid #d1d5db",
                        borderRadius: "6px",
                        fontSize: "1rem"
                      }}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>

                  {modalMode === "edit" && (
                    <div style={{
                      gridColumn: "1 / -1",
                      marginTop: "1.5rem",
                      padding: "1.5rem",
                      background: "#f9fafb",
                      borderRadius: "8px",
                      border: "2px solid #e5e7eb"
                    }}>
                      <h4 style={{
                        margin: "0 0 1rem 0",
                        fontSize: "1.1rem",
                        color: "#374151",
                        fontWeight: "600"
                      }}>
                        📚 Enrolled Batches (Multiple Enrollments Allowed)
                      </h4>

                      {/* Currently Enrolled Batches */}
                      {enrolledBatches.length > 0 ? (
                        <div style={{ marginBottom: "1rem" }}>
                          {enrolledBatches.map(batch => (
                            <div key={batch.id} style={{
                              background: "#fff",
                              padding: "1rem",
                              borderRadius: "6px",
                              marginBottom: "0.75rem",
                              border: "1px solid #d1d5db",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center"
                            }}>
                              <div>
                                <p style={{ margin: "0 0 0.25rem 0", fontWeight: "600", color: "#374151" }}>
                                  {batch.name} ({batch.code})
                                </p>
                                <p style={{ margin: "0", fontSize: "0.9rem", color: "#6b7280" }}>
                                  📖 {batch.course_name} | 👨‍🏫 {batch.teacher_name || "No teacher"} | 
                                  🕐 {batch.timing || "No timing"} | 📅 {batch.days || "No days"}
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleUnenrollBatch(batch.id)}
                                style={{
                                  background: "#ef4444",
                                  color: "#fff",
                                  border: "none",
                                  padding: "0.5rem 1rem",
                                  borderRadius: "6px",
                                  cursor: "pointer",
                                  fontSize: "0.9rem"
                                }}
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p style={{ color: "#6b7280", fontSize: "0.9rem", marginBottom: "1rem" }}>
                          No batches enrolled yet
                        </p>
                      )}

                      {/* Enroll in New Batch */}
                      <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-end" }}>
                        <div style={{ flex: 1 }}>
                          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", fontSize: "0.9rem" }}>
                            Enroll in Additional Batch
                          </label>
                          <select
                            value={selectedBatchToEnroll}
                            onChange={(e) => setSelectedBatchToEnroll(e.target.value)}
                            style={{
                              width: "100%",
                              padding: "0.75rem",
                              border: "1px solid #d1d5db",
                              borderRadius: "6px",
                              fontSize: "0.9rem"
                            }}
                          >
                            <option value="">Select a batch to enroll</option>
                            {batches
                              .filter(b => !enrolledBatches.some(eb => eb.id === b.id))
                              .map(batch => {
                                const teacher = teachers.find(t => t.id === batch.teacher_id);
                                return (
                                  <option key={batch.id} value={batch.id}>
                                    {batch.name} - {batch.timing || "No timing"} ({teacher?.name || "No teacher"})
                                  </option>
                                );
                              })}
                          </select>
                        </div>
                        <button
                          type="button"
                          onClick={handleEnrollBatch}
                          disabled={!selectedBatchToEnroll}
                          style={{
                            background: selectedBatchToEnroll ? "#10b981" : "#9ca3af",
                            color: "#fff",
                            border: "none",
                            padding: "0.75rem 1.5rem",
                            borderRadius: "6px",
                            cursor: selectedBatchToEnroll ? "pointer" : "not-allowed",
                            fontSize: "0.9rem",
                            fontWeight: "600",
                            whiteSpace: "nowrap"
                          }}
                        >
                          + Enroll
                        </button>
                      </div>
                    </div>
                  )}

                  <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                    <button
                      type="submit"
                      disabled={submitting}
                      style={{
                        flex: 1,
                        background: submitting ? "#9ca3af" : "#667eea",
                        color: "#fff",
                        border: "none",
                        padding: "0.75rem",
                        borderRadius: "6px",
                        cursor: submitting ? "not-allowed" : "pointer",
                        fontSize: "1rem",
                        fontWeight: "600"
                      }}
                    >
                      {submitting ? "Saving..." : modalMode === "add" ? "Add Student" : "Update Student"}
                    </button>
                    <button
                      type="button"
                      onClick={closeModal}
                      disabled={submitting}
                      style={{
                        flex: 1,
                        background: "#6b7280",
                        color: "#fff",
                        border: "none",
                        padding: "0.75rem",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "1rem",
                        fontWeight: "600"
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentManagement;
