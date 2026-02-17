import React, { useState, useEffect, useCallback } from "react";
import { FaEdit, FaTrash, FaEye, FaPlus, FaSearch, FaTimes, FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import { getAllTeachers, createTeacher, updateTeacher, deleteTeacher } from "../../services/adminService";

const TeacherManagement = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // add, edit, view
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    subject: "",
    qualification: "",
    experience: "",
    assignedBatches: [],
    status: "Active"
  });

  // Fetch teachers from API
  const fetchTeachers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllTeachers();
      setTeachers(response.data);
    } catch (err) {
      console.error("Error fetching teachers:", err);
      setError("Failed to load teachers. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const subjects = ["Mathematics", "Physics", "Chemistry", "Biology", "English", "Hindi", "Social Science", "Computer Science"];
  const availableBatches = [
    "9 - Batch A", "9 - Batch B",
    "10 - Batch A", "10 - Batch B",
    "11 - Batch A", "11 - Batch B", "11 - Batch C",
    "12 - Batch A", "12 - Batch B", "12 - Batch C",
    "JEE Main/Advance - Morning", "JEE Main/Advance - Evening",
    "CUET - Batch A", "CUET - Batch B",
    "B.COM(P/H) - Batch A"
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleBatchSelection = (batch) => {
    const currentBatches = formData.assignedBatches;
    if (currentBatches.includes(batch)) {
      setFormData({ ...formData, assignedBatches: currentBatches.filter(b => b !== batch) });
    } else {
      setFormData({ ...formData, assignedBatches: [...currentBatches, batch] });
    }
  };

  const openAddModal = () => {
    setModalMode("add");
    setFormData({
      name: "",
      email: "",
      phone: "",
      password: "",
      subject: "",
      qualification: "",
      experience: "",
      assignedBatches: [],
      status: "Active"
    });
    setShowModal(true);
  };

  const openEditModal = (teacher) => {
    setModalMode("edit");
    setSelectedTeacher(teacher);
    setFormData(teacher);
    setShowModal(true);
  };

  const openViewModal = (teacher) => {
    setModalMode("view");
    setSelectedTeacher(teacher);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedTeacher(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      if (modalMode === "add") {
        await createTeacher({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          subject: formData.subject,
          qualification: formData.qualification,
          experience: formData.experience
        });
        alert("Teacher added successfully!");
      } else if (modalMode === "edit") {
        await updateTeacher(selectedTeacher.id, {
          name: formData.name,
          phone: formData.phone,
          subject: formData.subject,
          qualification: formData.qualification,
          experience: formData.experience
        });
        alert("Teacher updated successfully!");
      }
      
      // Refetch data
      await fetchTeachers();
      closeModal();
    } catch (err) {
      console.error("Error saving teacher:", err);
      alert(err.response?.data?.detail || "Failed to save teacher");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this teacher?")) {
      try {
        await deleteTeacher(id);
        alert("Teacher deleted successfully!");
        await fetchTeachers();
      } catch (err) {
        console.error("Error deleting teacher:", err);
        alert(err.response?.data?.detail || "Failed to delete teacher");
      }
    }
  };

  const filteredTeachers = teachers.filter(teacher =>
    teacher?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher?.subject?.toLowerCase().includes(searchTerm.toLowerCase())
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
      maxWidth: "700px",
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
      overflowX: "hidden",
      width: "100%",
      boxSizing: "border-box"
    }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
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
          gap: isMobile ? "1rem" : "0"
        }}>
          <h1 style={{ 
            color: "#fff", 
            fontSize: isMobile ? "1.8rem" : "2.5rem", 
            margin: 0,
            textAlign: isMobile ? "center" : "left"
          }}>
            Teacher Management
          </h1>
          <button
            onClick={openAddModal}
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
              width: isMobile ? "100%" : "auto",
              boxSizing: "border-box"
            }}
          >
            <FaPlus /> Add Teacher
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div style={{ textAlign: "center", padding: "3rem", color: "#fff" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⏳</div>
            <div style={{ fontSize: "1.2rem" }}>Loading teachers...</div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div style={{ textAlign: "center", padding: "3rem" }}>
            <div style={{ background: "#fff", borderRadius: "16px", padding: "2rem", boxShadow: "0 10px 30px rgba(0,0,0,0.2)" }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem", color: "#ef4444" }}>⚠️</div>
              <div style={{ fontSize: "1.2rem", color: "#ef4444", marginBottom: "1rem" }}>{error}</div>
              <button
                onClick={fetchTeachers}
                style={{
                  padding: "0.75rem 2rem",
                  fontSize: "1rem",
                  background: "#667eea",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer"
                }}
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {!loading && !error && (
          <>
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
              placeholder={isMobile ? "Search teachers..." : "Search by name, email, or subject..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                fontSize: "1rem",
                padding: "0.5rem",
                width: "100%",
                boxSizing: "border-box"
              }}
            />
          </div>
        </div>

        {/* Teachers Table */}
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
              minWidth: isMobile ? "900px" : "100%"
            }}>
              <thead style={{ background: "#667eea", color: "#fff" }}>
                <tr>
                  <th style={{ padding: "1rem", textAlign: "left" }}>ID</th>
                  <th style={{ padding: "1rem", textAlign: "left" }}>Name</th>
                  <th style={{ padding: "1rem", textAlign: "left" }}>Email</th>
                  <th style={{ padding: "1rem", textAlign: "left" }}>Phone</th>
                  <th style={{ padding: "1rem", textAlign: "left" }}>Subject</th>
                  <th style={{ padding: "1rem", textAlign: "left" }}>Experience</th>
                  <th style={{ padding: "1rem", textAlign: "left" }}>Assigned Batches</th>
                  <th style={{ padding: "1rem", textAlign: "left" }}>Status</th>
                  <th style={{ padding: "1rem", textAlign: "left" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTeachers.map((teacher, index) => (
                  <tr key={teacher.id} style={{
                    borderBottom: "1px solid #e5e7eb",
                    background: index % 2 === 0 ? "#f9fafb" : "#fff"
                  }}>
                    <td style={{ padding: "1rem" }}>{teacher.id}</td>
                    <td style={{ padding: "1rem", fontWeight: "600" }}>{teacher.name}</td>
                    <td style={{ padding: "1rem" }}>{teacher.email}</td>
                    <td style={{ padding: "1rem" }}>{teacher.phone}</td>
                    <td style={{ padding: "1rem" }}>{teacher.subject}</td>
                    <td style={{ padding: "1rem" }}>{teacher.experience}</td>
                    <td style={{ padding: "1rem" }}>
                      <span style={{ fontSize: "0.875rem" }}>
                        {teacher.assignedBatches?.length > 0 
                          ? teacher.assignedBatches.join(", ") 
                          : "None"}
                      </span>
                    </td>
                    <td style={{ padding: "1rem" }}>
                      <span style={{
                        padding: "0.25rem 0.75rem",
                        borderRadius: "12px",
                        fontSize: "0.875rem",
                        fontWeight: "600",
                        background: teacher.status?.toLowerCase() === "active" ? "#d1fae5" : "#fee2e2",
                        color: teacher.status?.toLowerCase() === "active" ? "#065f46" : "#991b1b"
                      }}>
                        {teacher.status ? teacher.status.charAt(0).toUpperCase() + teacher.status.slice(1).toLowerCase() : 'N/A'}
                      </span>
                    </td>
                    <td style={{ padding: "1rem" }}>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button
                          onClick={() => openViewModal(teacher)}
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
                          onClick={() => openEditModal(teacher)}
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
                          onClick={() => handleDelete(teacher.id)}
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
          
          {filteredTeachers.length === 0 && (
            <div style={{
              padding: "3rem",
              textAlign: "center",
              color: "#666"
            }}>
              No teachers found
            </div>
          )}
        </div>
        </>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div style={modalStyles.overlay} onClick={closeModal}>
          <div style={modalStyles.modal} onClick={(e) => e.stopPropagation()}>
            <button onClick={closeModal} style={modalStyles.closeButton}>
              <FaTimes />
            </button>
            
            <h2 style={{ marginBottom: "1.5rem", color: "#333" }}>
              {modalMode === "add" ? "Add New Teacher" : modalMode === "edit" ? "Edit Teacher" : "Teacher Details"}
            </h2>

            {modalMode === "view" ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div>
                  <strong>Name:</strong> {selectedTeacher.name}
                </div>
                <div>
                  <strong>Email:</strong> {selectedTeacher.email}
                </div>
                <div>
                  <strong>Phone:</strong> {selectedTeacher.phone}
                </div>
                <div>
                  <strong>Subject:</strong> {selectedTeacher.subject}
                </div>
                <div>
                  <strong>Qualification:</strong> {selectedTeacher.qualification}
                </div>
                <div>
                  <strong>Experience:</strong> {selectedTeacher.experience}
                </div>
                <div>
                  <strong>Assigned Batches:</strong> {selectedTeacher.assignedBatches?.length > 0 ? selectedTeacher.assignedBatches.join(", ") : "None"}
                </div>
                <div>
                  <strong>Status:</strong> {selectedTeacher.status}
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
                        fontSize: "1rem",
                        boxSizing: "border-box"
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
                        fontSize: "1rem",
                        boxSizing: "border-box"
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
                        fontSize: "1rem",
                        boxSizing: "border-box"
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
                  )}

                  <div>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>
                      Subject *
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        border: "1px solid #d1d5db",
                        borderRadius: "6px",
                        fontSize: "1rem",
                        boxSizing: "border-box",
                        appearance: "none",
                        WebkitAppearance: "none"
                      }}
                    >
                      <option value="">Select Subject</option>
                      {subjects.map(subject => (
                        <option key={subject} value={subject}>{subject}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>
                      Qualification *
                    </label>
                    <input
                      type="text"
                      name="qualification"
                      value={formData.qualification}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., M.Sc, Ph.D"
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
                    <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>
                      Experience *
                    </label>
                    <input
                      type="text"
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., 5 years"
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
                    <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>
                      Assign Batches
                    </label>
                    <div style={{
                      border: "1px solid #d1d5db",
                      borderRadius: "6px",
                      padding: "1rem",
                      maxHeight: "200px",
                      overflowY: "auto",
                      boxSizing: "border-box"
                    }}>
                      {availableBatches.map(batch => (
                        <label key={batch} style={{
                          display: "flex",
                          alignItems: "center",
                          padding: "0.5rem",
                          cursor: "pointer"
                        }}>
                          <input
                            type="checkbox"
                            checked={formData.assignedBatches.includes(batch)}
                            onChange={() => handleBatchSelection(batch)}
                            style={{ marginRight: "0.5rem" }}
                          />
                          {batch}
                        </label>
                      ))}
                    </div>
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
                        fontSize: "1rem",
                        boxSizing: "border-box",
                        appearance: "none",
                        WebkitAppearance: "none"
                      }}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>

                  <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                    <button
                      type="submit"
                      disabled={submitting}
                      style={{
                        flex: 1,
                        background: submitting ? "#ccc" : "#667eea",
                        color: "#fff",
                        border: "none",
                        padding: "0.75rem",
                        borderRadius: "6px",
                        cursor: submitting ? "not-allowed" : "pointer",
                        fontSize: "1rem",
                        fontWeight: "600"
                      }}
                    >
                      {submitting ? "Submitting..." : (modalMode === "add" ? "Add Teacher" : "Update Teacher")}
                    </button>
                    <button
                      type="button"
                      onClick={closeModal}
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

export default TeacherManagement;
