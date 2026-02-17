import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaMoneyBillWave, FaCheckCircle, FaClock, FaExclamationTriangle } from "react-icons/fa";
import api from "../../services/api";

const FeeStatus = () => {
  const [feeData, setFeeData] = useState({ fees: [], summary: {} });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeeStatus = async () => {
      try {
        setLoading(true);
        const response = await api.get("/student/fees");
        console.log("Fee Status API Response:", response.data);
        setFeeData(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching fee status:", err);
        setError(err.response?.data?.detail || "Failed to load fee status");
      } finally {
        setLoading(false);
      }
    };

    fetchFeeStatus();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "#10b981";
      case "pending":
        return "#f59e0b";
      case "overdue":
        return "#ef4444";
      case "partial":
        return "#06b6d4";
      default:
        return "#6b7280";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "paid":
        return <FaCheckCircle />;
      case "pending":
        return <FaClock />;
      case "overdue":
        return <FaExclamationTriangle />;
      case "partial":
        return <FaClock />;
      default:
        return <FaMoneyBillWave />;
    }
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
          Fee Status
        </h1>

        {loading ? (
          <div style={{
            textAlign: "center",
            color: "#fff",
            fontSize: "1.2rem",
            padding: "3rem"
          }}>
            Loading fee status...
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
        ) : (
          <>
            {/* Summary Cards */}
            {feeData.summary && (
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "1.5rem",
                marginBottom: "3rem"
              }}>
                <div style={{
                  background: "#fff",
                  borderRadius: "12px",
                  padding: "1.5rem",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
                }}>
                  <div style={{ display: "flex", alignItems: "center", marginBottom: "0.5rem" }}>
                    <FaMoneyBillWave style={{ color: "#667eea", fontSize: "1.5rem", marginRight: "0.5rem" }} />
                    <h3 style={{ margin: 0, fontSize: "0.9rem", color: "#6b7280" }}>Total Fees</h3>
                  </div>
                  <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#1f2937", margin: "0.5rem 0 0" }}>
                    ₹{feeData.summary.totalFees?.toLocaleString() || 0}
                  </p>
                </div>

                <div style={{
                  background: "#fff",
                  borderRadius: "12px",
                  padding: "1.5rem",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
                }}>
                  <div style={{ display: "flex", alignItems: "center", marginBottom: "0.5rem" }}>
                    <FaCheckCircle style={{ color: "#10b981", fontSize: "1.5rem", marginRight: "0.5rem" }} />
                    <h3 style={{ margin: 0, fontSize: "0.9rem", color: "#6b7280" }}>Total Paid</h3>
                  </div>
                  <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#10b981", margin: "0.5rem 0 0" }}>
                    ₹{feeData.summary.totalPaid?.toLocaleString() || 0}
                  </p>
                </div>

                <div style={{
                  background: "#fff",
                  borderRadius: "12px",
                  padding: "1.5rem",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
                }}>
                  <div style={{ display: "flex", alignItems: "center", marginBottom: "0.5rem" }}>
                    <FaClock style={{ color: "#f59e0b", fontSize: "1.5rem", marginRight: "0.5rem" }} />
                    <h3 style={{ margin: 0, fontSize: "0.9rem", color: "#6b7280" }}>Pending</h3>
                  </div>
                  <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#f59e0b", margin: "0.5rem 0 0" }}>
                    ₹{feeData.summary.totalPending?.toLocaleString() || 0}
                  </p>
                </div>

                <div style={{
                  background: "#fff",
                  borderRadius: "12px",
                  padding: "1.5rem",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
                }}>
                  <div style={{ display: "flex", alignItems: "center", marginBottom: "0.5rem" }}>
                    <FaCheckCircle style={{ color: "#06b6d4", fontSize: "1.5rem", marginRight: "0.5rem" }} />
                    <h3 style={{ margin: 0, fontSize: "0.9rem", color: "#6b7280" }}>Paid %</h3>
                  </div>
                  <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#06b6d4", margin: "0.5rem 0 0" }}>
                    {feeData.summary.paidPercentage || 0}%
                  </p>
                </div>
              </div>
            )}

            {/* Fee Records Table */}
            {feeData.fees && feeData.fees.length > 0 ? (
              <div style={{
                background: "#fff",
                borderRadius: "12px",
                padding: "2rem",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                overflowX: "auto"
              }}>
                <h2 style={{ marginBottom: "1.5rem", color: "#1f2937" }}>Fee Records</h2>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid #e5e7eb" }}>
                      <th style={{ padding: "1rem", textAlign: "left", color: "#6b7280", fontWeight: "600" }}>Due Date</th>
                      <th style={{ padding: "1rem", textAlign: "left", color: "#6b7280", fontWeight: "600" }}>Amount</th>
                      <th style={{ padding: "1rem", textAlign: "left", color: "#6b7280", fontWeight: "600" }}>Paid</th>
                      <th style={{ padding: "1rem", textAlign: "left", color: "#6b7280", fontWeight: "600" }}>Pending</th>
                      <th style={{ padding: "1rem", textAlign: "left", color: "#6b7280", fontWeight: "600" }}>Status</th>
                      <th style={{ padding: "1rem", textAlign: "left", color: "#6b7280", fontWeight: "600" }}>Payment Date</th>
                      <th style={{ padding: "1rem", textAlign: "left", color: "#6b7280", fontWeight: "600" }}>Method</th>
                    </tr>
                  </thead>
                  <tbody>
                    {feeData.fees.map((fee) => (
                      <tr key={fee.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                        <td style={{ padding: "1rem", color: "#1f2937" }}>{fee.dueDate}</td>
                        <td style={{ padding: "1rem", color: "#1f2937", fontWeight: "600" }}>₹{fee.amount.toLocaleString()}</td>
                        <td style={{ padding: "1rem", color: "#10b981", fontWeight: "600" }}>₹{fee.paidAmount.toLocaleString()}</td>
                        <td style={{ padding: "1rem", color: "#f59e0b", fontWeight: "600" }}>₹{fee.pendingAmount.toLocaleString()}</td>
                        <td style={{ padding: "1rem" }}>
                          <span style={{
                            display: "inline-flex",
                            alignItems: "center",
                            padding: "0.25rem 0.75rem",
                            borderRadius: "20px",
                            fontSize: "0.875rem",
                            fontWeight: "600",
                            color: "#fff",
                            background: getStatusColor(fee.status)
                          }}>
                            <span style={{ marginRight: "0.25rem" }}>{getStatusIcon(fee.status)}</span>
                            {fee.status.toUpperCase()}
                          </span>
                        </td>
                        <td style={{ padding: "1rem", color: "#6b7280" }}>
                          {fee.paymentDate || "-"}
                        </td>
                        <td style={{ padding: "1rem", color: "#6b7280" }}>
                          {fee.paymentMethod ? fee.paymentMethod.replace("_", " ").toUpperCase() : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{
                textAlign: "center",
                color: "#fff",
                fontSize: "1.2rem",
                padding: "3rem",
                background: "rgba(255, 255, 255, 0.1)",
                borderRadius: "12px"
              }}>
                No fee records available
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FeeStatus;
