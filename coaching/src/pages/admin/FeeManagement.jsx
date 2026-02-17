import React, { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaArrowLeft, FaMoneyBillWave, FaCheckCircle, FaExclamationCircle, FaCalendarAlt, FaSearch, FaFilter, FaUserGraduate, FaEdit } from "react-icons/fa";
import { getAllFees, getAllStudents, updateFee } from "../../services/adminService";

const FeeManagement = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const location = useLocation();
  let user = {};
  try {
    const userData = localStorage.getItem("user");
    if (userData) user = JSON.parse(userData);
  } catch (e) {}
  const adminName = location.state?.name || user.full_name || "Admin";
  
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [classFilter, setClassFilter] = useState("All");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [isRevenueFlipped, setIsRevenueFlipped] = useState(false);

  // State for fetched data
  const [studentsData, setStudentsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch data from API
  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [feesRes, studentsRes] = await Promise.all([
        getAllFees(),
        getAllStudents()
      ]);

      const fees = feesRes.data;
      const students = studentsRes.data;

      // Combine fee and student data
      const combinedData = fees.map(fee => {
        const student = students.find(s => s.id === fee.student_id);
        const pendingAmount = fee.amount - fee.paid_amount;
        
        return {
          id: fee.id,
          studentId: fee.student_id,
          name: student?.name || "Unknown",
          rollNo: student?.email || "N/A",
          class: student?.course || "N/A",
          course: student?.course || "N/A",
          totalFees: fee.amount,
          paidAmount: fee.paid_amount,
          pendingAmount: pendingAmount,
          status: fee.status === "paid" ? "Paid" : fee.status === "overdue" ? "Overdue" : "Pending",
          dueDate: fee.due_date,
          lastPaymentDate: fee.payment_date || "N/A"
        };
      });

      setStudentsData(combinedData);
    } catch (err) {
      console.error("Error fetching fee data:", err);
      setError("Failed to load fee data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const getClassColor = (className) => {
    const colors = {
      "12": "#667eea",
      "11": "#764ba2",
      "10": "#f59e0b",
      "9": "#10b981",
      "JEE Main/Advance": "#ef4444",
      "CUET": "#06b6d4",
      "B.com(P/H)": "#8b5cf6"
    };
    return colors[className] || "#667eea";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Paid":
        return "#10b981";
      case "Pending":
        return "#f59e0b";
      case "Overdue":
        return "#ef4444";
      default:
        return "#666";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Paid":
        return <FaCheckCircle />;
      case "Pending":
      case "Overdue":
        return <FaExclamationCircle />;
      default:
        return null;
    }
  };

  const isOverdue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    return due < today;
  };

  const handleRecordPayment = (student) => {
    setEditingStudent(student);
    setPaymentAmount("");
    setPaymentDate(new Date().toISOString().split('T')[0]);
    setShowEditModal(true);
  };

  const handleStatusChange = async (student, newStatus) => {
    if (!window.confirm(`Are you sure you want to mark this fee as ${newStatus}?`)) {
      return;
    }

    try {
      const statusMap = {
        "Paid": "paid",
        "Pending": "pending",
        "Overdue": "overdue"
      };

      const feeData = {
        status: statusMap[newStatus]
      };

      // If marking as paid, set paid_amount to total amount
      if (newStatus === "Paid") {
        feeData.paid_amount = student.totalFees;
        feeData.payment_date = new Date().toISOString().split('T')[0];
      }

      await updateFee(student.id, feeData);
      alert(`Fee status updated to ${newStatus}!`);
      
      // Refetch data to update UI
      await fetchAllData();
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status. Please try again. " + (err.response?.data?.detail || err.message));
    }
  };

  const handleUpdatePayment = async () => {
    if (!paymentAmount || parseFloat(paymentAmount) <= 0) {
      alert("Please enter a valid payment amount");
      return;
    }

    const amount = parseFloat(paymentAmount);
    if (amount > editingStudent.pendingAmount) {
      alert("Payment amount cannot exceed pending amount");
      return;
    }

    try {
      const newPaidAmount = editingStudent.paidAmount + amount;
      const newPendingAmount = editingStudent.pendingAmount - amount;
      
      const feeData = {
        paid_amount: newPaidAmount,
        payment_date: paymentDate,
        status: newPendingAmount === 0 ? "paid" : "partial"
      };

      await updateFee(editingStudent.id, feeData);
      alert("Payment recorded successfully!");
      
      // Refetch data to update UI
      await fetchAllData();
      
      // Close modal and reset
      setShowEditModal(false);
      setEditingStudent(null);
      setPaymentAmount("");
      setPaymentDate("");
    } catch (err) {
      console.error("Error recording payment:", err);
      alert("Failed to record payment. Please try again. " + (err.response?.data?.detail || err.message));
    }
  };

  const filteredStudents = studentsData.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.rollNo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || student.status === statusFilter;
    const matchesClass = classFilter === "All" || student.class === classFilter;
    return matchesSearch && matchesStatus && matchesClass;
  });

  const totalRevenue = studentsData.reduce((sum, s) => sum + (s.paidAmount || 0), 0);
  const totalPending = studentsData.reduce((sum, s) => sum + (s.pendingAmount || 0), 0);
  const paidCount = studentsData.filter(s => s.status === "Paid").length;
  const pendingCount = studentsData.filter(s => s.status === "Pending" || s.status === "Overdue").length;

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
        maxWidth: "1400px", 
        margin: "0 auto", 
        padding: isMobile ? "1rem" : "2rem 3rem",
        width: "100%",
        boxSizing: "border-box"
      }}>
        <Link to="/admin/dashboard" state={{ name: adminName }} style={{
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
          Fee Management
        </h1>

        {/* Loading State */}
        {loading && (
          <div style={{ textAlign: "center", padding: "3rem", color: "#fff" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⏳</div>
            <div style={{ fontSize: "1.2rem" }}>Loading fee data...</div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div style={{ textAlign: "center", padding: "3rem" }}>
            <div style={{ background: "#fff", borderRadius: "16px", padding: "2rem", boxShadow: "0 10px 30px rgba(0,0,0,0.2)" }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem", color: "#ef4444" }}>⚠️</div>
              <div style={{ fontSize: "1.2rem", color: "#ef4444", marginBottom: "1rem" }}>{error}</div>
              <button
                onClick={fetchAllData}
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
        {/* Statistics Cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(250px, 1fr))",
          gap: isMobile ? "1.5rem" : "2rem",
          marginBottom: "3rem",
          width: "100%",
          boxSizing: "border-box"
        }}>
          {/* Total Revenue Card with Flip */}
          <div 
            onClick={() => setIsRevenueFlipped(!isRevenueFlipped)}
            style={{
              perspective: "1000px",
              cursor: "pointer",
              minHeight: "120px"
            }}
          >
            <div style={{
              position: "relative",
              width: "100%",
              height: "100%",
              minHeight: "120px",
              transition: "transform 0.6s",
              transformStyle: "preserve-3d",
              transform: isRevenueFlipped ? "rotateY(180deg)" : "rotateY(0deg)"
            }}>
              {/* Front of Card */}
              <div style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                backfaceVisibility: "hidden",
                background: "#fff",
                borderRadius: "16px",
                padding: isMobile ? "1.5rem" : "1.5rem",
                boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                boxSizing: "border-box"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <FaMoneyBillWave style={{ fontSize: "2rem", color: "#10b981" }} />
                  <div>
                    <div style={{ fontSize: "0.95rem", color: "#666" }}>Total Revenue</div>
                    <div style={{ fontSize: "0.8rem", fontWeight: "bold", color: "#10b981" }}>
                      Click to view
                    </div>
                  </div>
                </div>
              </div>

              {/* Back of Card */}
              <div style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                backfaceVisibility: "hidden",
                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                borderRadius: "16px",
                padding: isMobile ? "1.5rem" : "1.5rem",
                boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                transform: "rotateY(180deg)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                boxSizing: "border-box"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <FaMoneyBillWave style={{ fontSize: "2rem", color: "#fff" }} />
                  <div>
                    <div style={{ fontSize: "0.85rem", color: "#fff", opacity: 0.9 }}>Total Revenue</div>
                    <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#fff" }}>
                      ₹{totalRevenue.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style={{
            background: "#fff",
            borderRadius: "16px",
            padding: "1.5rem",
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.5rem" }}>
              <FaExclamationCircle style={{ fontSize: "2rem", color: "#f59e0b" }} />
              <div>
                <div style={{ fontSize: "0.85rem", color: "#666" }}>Total Pending</div>
                <div style={{ fontSize: "1.8rem", fontWeight: "bold", color: "#f59e0b" }}>
                  ₹{totalPending.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          <div style={{
            background: "#fff",
            borderRadius: "16px",
            padding: "1.5rem",
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.5rem" }}>
              <FaCheckCircle style={{ fontSize: "2rem", color: "#10b981" }} />
              <div>
                <div style={{ fontSize: "0.85rem", color: "#666" }}>Paid Students</div>
                <div style={{ fontSize: "1.8rem", fontWeight: "bold", color: "#10b981" }}>
                  {paidCount}
                </div>
              </div>
            </div>
          </div>

          <div style={{
            background: "#fff",
            borderRadius: "16px",
            padding: "1.5rem",
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.5rem" }}>
              <FaUserGraduate style={{ fontSize: "2rem", color: "#ef4444" }} />
              <div>
                <div style={{ fontSize: "0.85rem", color: "#666" }}>Pending Students</div>
                <div style={{ fontSize: "1.8rem", fontWeight: "bold", color: "#ef4444" }}>
                  {pendingCount}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div style={{
          background: "rgba(255,255,255,0.15)",
          backdropFilter: "blur(10px)",
          borderRadius: "16px",
          padding: isMobile ? "1rem" : "1.5rem 2rem",
          marginBottom: "2rem",
          border: "1px solid rgba(255,255,255,0.2)",
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: "1.5rem",
          alignItems: isMobile ? "stretch" : "center",
          width: "100%",
          boxSizing: "border-box"
        }}>
          <div style={{ 
            flex: isMobile ? "none" : "1 1 300px", 
            display: "flex", 
            alignItems: "center", 
            gap: "0.5rem", 
            background: "#fff", 
            borderRadius: "8px", 
            padding: "0.8rem",
            width: isMobile ? "100%" : "auto",
            boxSizing: "border-box"
          }}>
            <FaSearch style={{ color: "#999" }} />
            <input
              type="text"
              placeholder="Search by name or roll number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                fontSize: "1rem"
              }}
            />
          </div>

          <div style={{ 
            display: "flex", 
            flexDirection: isMobile ? "column" : "row",
            gap: "1rem", 
            alignItems: isMobile ? "stretch" : "center",
            width: isMobile ? "100%" : "auto"
          }}>
            {!isMobile && <FaFilter style={{ color: "#fff", fontSize: "1.2rem" }} />}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: "0.8rem 1rem",
                fontSize: "1rem",
                borderRadius: "8px",
                border: "none",
                outline: "none",
                cursor: "pointer",
                background: "#fff",
                width: isMobile ? "100%" : "auto",
                boxSizing: "border-box",
                appearance: "none",
                WebkitAppearance: "none"
              }}
            >
              <option value="All">All Status</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Overdue">Overdue</option>
            </select>

            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              style={{
                padding: "0.8rem 1rem",
                fontSize: "1rem",
                borderRadius: "8px",
                border: "none",
                outline: "none",
                cursor: "pointer",
                background: "#fff",
                width: isMobile ? "100%" : "auto",
                boxSizing: "border-box",
                appearance: "none",
                WebkitAppearance: "none"
              }}
            >
              <option value="All">All Classes</option>
              <option value="12">Class 12</option>
              <option value="11">Class 11</option>
              <option value="10">Class 10</option>
              <option value="9">Class 9</option>
              <option value="JEE Main/Advance">JEE Main/Advance</option>
              <option value="CUET">CUET</option>
              <option value="B.com(P/H)">B.com(P/H)</option>
            </select>
          </div>
        </div>

        {/* Students Fee Table */}
        <div style={{
          background: "#fff",
          borderRadius: "16px",
          padding: isMobile ? "1rem" : "2rem",
          boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
          overflowX: "auto",
          width: "100%",
          boxSizing: "border-box"
        }}>
          {filteredStudents.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem", color: "#999", fontSize: "1.2rem" }}>
              No students found
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #e0e0e0" }}>
                  <th style={{ padding: "1rem", textAlign: "left", fontSize: "0.9rem", color: "#666", fontWeight: "600" }}>Student</th>
                  <th style={{ padding: "1rem", textAlign: "left", fontSize: "0.9rem", color: "#666", fontWeight: "600" }}>Class</th>
                  <th style={{ padding: "1rem", textAlign: "left", fontSize: "0.9rem", color: "#666", fontWeight: "600" }}>Course</th>
                  <th style={{ padding: "1rem", textAlign: "center", fontSize: "0.9rem", color: "#666", fontWeight: "600" }}>Fee Structure</th>
                  <th style={{ padding: "1rem", textAlign: "center", fontSize: "0.9rem", color: "#666", fontWeight: "600" }}>Status</th>
                  <th style={{ padding: "1rem", textAlign: "center", fontSize: "0.9rem", color: "#666", fontWeight: "600" }}>Due Date</th>
                  <th style={{ padding: "1rem", textAlign: "center", fontSize: "0.9rem", color: "#666", fontWeight: "600" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr 
                    key={student.id} 
                    style={{ 
                      borderBottom: "1px solid #f0f0f0",
                      transition: "background 0.3s"
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = "#f9f9f9"}
                    onMouseOut={(e) => e.currentTarget.style.background = "#fff"}
                  >
                    <td style={{ padding: "1.2rem 1rem" }}>
                      <div>
                        <div style={{ fontWeight: "600", color: "#333", marginBottom: "0.2rem" }}>{student.name}</div>
                        <div style={{ fontSize: "0.85rem", color: "#999" }}>Roll: {student.rollNo}</div>
                      </div>
                    </td>
                    <td style={{ padding: "1.2rem 1rem" }}>
                      <span style={{
                        padding: "0.3rem 0.8rem",
                        background: `${getClassColor(student.class)}20`,
                        color: getClassColor(student.class),
                        borderRadius: "20px",
                        fontSize: "0.85rem",
                        fontWeight: "600"
                      }}>
                        {student.class}
                      </span>
                    </td>
                    <td style={{ padding: "1.2rem 1rem" }}>
                      <div style={{ color: "#666", fontSize: "0.9rem" }}>{student.course}</div>
                    </td>
                    <td style={{ padding: "1.2rem 1rem", textAlign: "center" }}>
                      <div style={{ fontSize: "0.8rem", color: "#999", marginBottom: "0.3rem" }}>Total: ₹{student.totalFees.toLocaleString()}</div>
                      <div style={{ display: "flex", justifyContent: "center", gap: "1rem", fontSize: "0.9rem" }}>
                        <div>
                          <span style={{ color: "#10b981", fontWeight: "600" }}>Paid:</span>
                          <span style={{ marginLeft: "0.3rem", fontWeight: "600" }}>₹{student.paidAmount.toLocaleString()}</span>
                        </div>
                        <div>
                          <span style={{ color: "#ef4444", fontWeight: "600" }}>Pending:</span>
                          <span style={{ marginLeft: "0.3rem", fontWeight: "600" }}>₹{student.pendingAmount.toLocaleString()}</span>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "1.2rem 1rem", textAlign: "center" }}>
                      <div style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        padding: "0.4rem 1rem",
                        background: `${getStatusColor(student.status)}20`,
                        color: getStatusColor(student.status),
                        borderRadius: "20px",
                        fontSize: "0.9rem",
                        fontWeight: "600"
                      }}>
                        {getStatusIcon(student.status)}
                        {student.status}
                      </div>
                    </td>
                    <td style={{ padding: "1.2rem 1rem", textAlign: "center" }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.3rem" }}>
                        <div style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.3rem",
                          color: isOverdue(student.dueDate) && student.status !== "Paid" ? "#ef4444" : "#666",
                          fontWeight: isOverdue(student.dueDate) && student.status !== "Paid" ? "600" : "normal"
                        }}>
                          <FaCalendarAlt style={{ fontSize: "0.85rem" }} />
                          {new Date(student.dueDate).toLocaleDateString('en-GB')}
                        </div>
                        {isOverdue(student.dueDate) && student.status !== "Paid" && (
                          <span style={{ fontSize: "0.75rem", color: "#ef4444", fontWeight: "600" }}>Overdue!</span>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: "1.2rem 1rem", textAlign: "center" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", alignItems: "center" }}>
                        {student.status !== "Paid" && (
                          <button
                            onClick={() => handleRecordPayment(student)}
                            style={{
                              padding: "0.6rem 1.2rem",
                              background: "#667eea",
                              color: "#fff",
                              border: "none",
                              borderRadius: "8px",
                              cursor: "pointer",
                              fontSize: "0.9rem",
                              fontWeight: "600",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.5rem",
                              transition: "all 0.3s",
                              width: "100%"
                            }}
                            onMouseOver={(e) => e.currentTarget.style.opacity = "0.9"}
                            onMouseOut={(e) => e.currentTarget.style.opacity = "1"}
                          >
                            <FaEdit /> Record Payment
                          </button>
                        )}
                        
                        <select
                          value={student.status}
                          onChange={(e) => handleStatusChange(student, e.target.value)}
                          style={{
                            padding: "0.6rem",
                            borderRadius: "8px",
                            border: "2px solid #e0e0e0",
                            cursor: "pointer",
                            fontSize: "0.9rem",
                            fontWeight: "600",
                            background: "#fff",
                            color: "#333",
                            width: "100%"
                          }}
                        >
                          <option value="Paid">Mark as Paid</option>
                          <option value="Pending">Mark as Pending</option>
                          <option value="Overdue">Mark as Overdue</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Record Payment Modal */}
        {showEditModal && (
          <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "2rem"
          }}
          onClick={() => setShowEditModal(false)}
          >
            <div
              style={{
                background: "#fff",
                borderRadius: "16px",
                padding: "2.5rem",
                maxWidth: "600px",
                width: "100%",
                boxShadow: "0 20px 60px rgba(0,0,0,0.3)"
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 style={{ marginBottom: "2rem", color: "#333", fontSize: "2rem" }}>
                Record Payment
              </h2>

              <div style={{
                background: "#f9f9f9",
                padding: "1.5rem",
                borderRadius: "12px",
                marginBottom: "2rem"
              }}>
                <div style={{ marginBottom: "1rem" }}>
                  <div style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#333" }}>{editingStudent?.name}</div>
                  <div style={{ fontSize: "0.9rem", color: "#666" }}>Roll No: {editingStudent?.rollNo} • Class: {editingStudent?.class}</div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginTop: "1rem" }}>
                  <div>
                    <div style={{ fontSize: "0.8rem", color: "#999" }}>Total Fees</div>
                    <div style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#333" }}>₹{editingStudent?.totalFees.toLocaleString()}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.8rem", color: "#999" }}>Paid Amount</div>
                    <div style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#10b981" }}>₹{editingStudent?.paidAmount.toLocaleString()}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.8rem", color: "#999" }}>Pending Amount</div>
                    <div style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#ef4444" }}>₹{editingStudent?.pendingAmount.toLocaleString()}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.8rem", color: "#999" }}>Due Date</div>
                    <div style={{ fontSize: "1rem", fontWeight: "600", color: "#666" }}>
                      {editingStudent && new Date(editingStudent.dueDate).toLocaleDateString('en-GB')}
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#666", marginBottom: "0.5rem", fontWeight: "600" }}>
                    Payment Amount *
                  </label>
                  <input
                    type="number"
                    placeholder="Enter amount"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    max={editingStudent?.pendingAmount}
                    style={{
                      width: "100%",
                      padding: "0.9rem",
                      fontSize: "1rem",
                      borderRadius: "8px",
                      border: "2px solid #e0e0e0",
                      outline: "none",
                      boxSizing: "border-box"
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#666", marginBottom: "0.5rem", fontWeight: "600" }}>
                    Payment Date *
                  </label>
                  <input
                    type="date"
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.9rem",
                      fontSize: "1rem",
                      borderRadius: "8px",
                      border: "2px solid #e0e0e0",
                      outline: "none",
                      boxSizing: "border-box"
                    }}
                  />
                </div>

                <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                  <button
                    onClick={handleUpdatePayment}
                    style={{
                      flex: 1,
                      padding: "1rem",
                      background: "#10b981",
                      color: "#fff",
                      border: "none",
                      borderRadius: "10px",
                      cursor: "pointer",
                      fontSize: "1.1rem",
                      fontWeight: "600",
                      transition: "all 0.3s"
                    }}
                    onMouseOver={(e) => e.currentTarget.style.opacity = "0.9"}
                    onMouseOut={(e) => e.currentTarget.style.opacity = "1"}
                  >
                    Record Payment
                  </button>
                  <button
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingStudent(null);
                    }}
                    style={{
                      flex: 1,
                      padding: "1rem",
                      background: "#666",
                      color: "#fff",
                      border: "none",
                      borderRadius: "10px",
                      cursor: "pointer",
                      fontSize: "1.1rem",
                      fontWeight: "600",
                      transition: "all 0.3s"
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = "#555"}
                    onMouseOut={(e) => e.currentTarget.style.background = "#666"}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        </>
        )}
      </div>
    </div>
  );
};

export default FeeManagement;
