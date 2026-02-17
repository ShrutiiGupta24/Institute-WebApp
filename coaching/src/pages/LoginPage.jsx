import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const LoginPage = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [formData, setFormData] = useState({
    userType: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetSuccess, setResetSuccess] = useState("");
  const [resetError, setResetError] = useState("");

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.userType) {
      setError("Please select a user type");
      return;
    }
    
    if (!formData.email) {
      setError("Please enter your email");
      return;
    }
    
    if (!formData.password) {
      setError("Please enter a password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Call backend login API
      const response = await api.post("/auth/login", {
        email: formData.email,
        password: formData.password
      });

      const { access_token, user } = response.data;

      // Verify user role matches selected type
      if (user.role !== formData.userType) {
        setError(`Invalid credentials for ${formData.userType}`);
        setLoading(false);
        return;
      }

      // Save token and user info
      localStorage.setItem("token", access_token);
      localStorage.setItem("user", JSON.stringify(user));

      // Redirect based on user type with user's name
      switch (user.role) {
        case "student":
          navigate("/student/dashboard", { state: { name: user.full_name } });
          break;
        case "teacher":
          navigate("/teacher/dashboard", { state: { name: user.full_name } });
          break;
        case "admin":
          navigate("/admin/dashboard", { state: { name: user.full_name } });
          break;
        default:
          setError("Invalid user type");
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setResetError("");
    setResetSuccess("");

    if (!forgotPasswordEmail) {
      setResetError("Please enter your email");
      return;
    }

    if (!newPassword || !confirmPassword) {
      setResetError("Please enter and confirm your new password");
      return;
    }

    if (newPassword !== confirmPassword) {
      setResetError("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setResetError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      await api.post("/auth/reset-password", {
        email: forgotPasswordEmail,
        new_password: newPassword
      });

      setResetSuccess("Password reset successfully! You can now login.");
      setTimeout(() => {
        setShowForgotPassword(false);
        setForgotPasswordEmail("");
        setNewPassword("");
        setConfirmPassword("");
        setResetSuccess("");
      }, 2000);
    } catch (err) {
      setResetError(err.response?.data?.detail || "Failed to reset password. Please check your email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: "1rem"
        }}>
          <div style={{
            background: "#fff",
            borderRadius: "16px",
            padding: "2rem",
            maxWidth: "450px",
            width: "100%",
            boxShadow: "0 10px 40px rgba(0,0,0,0.3)"
          }}>
            <h2 style={{
              textAlign: "center",
              color: "#667eea",
              marginBottom: "1.5rem",
              fontSize: "1.8rem",
              fontWeight: "bold"
            }}>
              Reset Password
            </h2>

            <form onSubmit={handleForgotPassword}>
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  color: "#333",
                  fontWeight: "600"
                }}>
                  Email:
                </label>
                <input
                  type="email"
                  value={forgotPasswordEmail}
                  onChange={(e) => setForgotPasswordEmail(e.target.value)}
                  placeholder="Enter your registered email"
                  style={{
                    width: "100%",
                    padding: "0.9rem",
                    border: "2px solid #e0e0e0",
                    borderRadius: "8px",
                    fontSize: "1rem",
                    outline: "none"
                  }}
                />
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  color: "#333",
                  fontWeight: "600"
                }}>
                  New Password:
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  style={{
                    width: "100%",
                    padding: "0.9rem",
                    border: "2px solid #e0e0e0",
                    borderRadius: "8px",
                    fontSize: "1rem",
                    outline: "none"
                  }}
                />
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  color: "#333",
                  fontWeight: "600"
                }}>
                  Confirm Password:
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  style={{
                    width: "100%",
                    padding: "0.9rem",
                    border: "2px solid #e0e0e0",
                    borderRadius: "8px",
                    fontSize: "1rem",
                    outline: "none"
                  }}
                />
              </div>

              {resetError && (
                <div style={{
                  color: "#ef4444",
                  marginBottom: "1rem",
                  padding: "0.8rem",
                  background: "#fee",
                  borderRadius: "8px",
                  fontSize: "0.9rem"
                }}>
                  {resetError}
                </div>
              )}

              {resetSuccess && (
                <div style={{
                  color: "#10b981",
                  marginBottom: "1rem",
                  padding: "0.8rem",
                  background: "#d1fae5",
                  borderRadius: "8px",
                  fontSize: "0.9rem"
                }}>
                  {resetSuccess}
                </div>
              )}

              <div style={{ display: "flex", gap: "1rem" }}>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    flex: 1,
                    padding: "1rem",
                    background: loading ? "#ccc" : "#667eea",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "1rem",
                    fontWeight: "bold",
                    cursor: loading ? "not-allowed" : "pointer"
                  }}
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setForgotPasswordEmail("");
                    setNewPassword("");
                    setConfirmPassword("");
                    setResetError("");
                    setResetSuccess("");
                  }}
                  style={{
                    flex: 1,
                    padding: "1rem",
                    background: "#6b7280",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "1rem",
                    fontWeight: "bold",
                    cursor: "pointer"
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    <div style={{
      minHeight: "calc(100vh - 160px)",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      paddingTop: "2rem",
      paddingBottom: "2rem",
      padding: isMobile ? "2rem 1rem 2rem" : "2rem 2rem 2rem",
      width: "100%",
      overflowX: "hidden"
    }}>
      <div style={{
        background: "#fff",
        borderRadius: "16px",
        boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
        padding: isMobile ? "1.5rem 1rem" : "3rem",
        maxWidth: "450px",
        width: "100%",
        boxSizing: "border-box"
      }}>
        <h2 style={{
          textAlign: "center",
          color: "#667eea",
          marginBottom: "2rem",
          fontSize: isMobile ? "1.5rem" : "2rem",
          fontWeight: "bold",
          width: "100%",
          wordBreak: "break-word"
        }}>
          Login
        </h2>

        <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: "100%", overflow: "visible" }}>
          <div style={{ marginBottom: "1.5rem", width: "100%", maxWidth: "100%", boxSizing: "border-box" }}>
            <label style={{
              display: "block",
              marginBottom: "0.5rem",
              color: "#333",
              fontWeight: "600"
            }}>
              I am a:
            </label>
            <select
              name="userType"
              value={formData.userType}
              onChange={handleChange}
              style={{
                width: "100%",
                maxWidth: "100%",
                padding: "0.9rem",
                border: "2px solid #e0e0e0",
                borderRadius: "8px",
                fontSize: "1rem",
                outline: "none",
                transition: "border 0.3s",
                cursor: "pointer",
                boxSizing: "border-box",
                appearance: "none",
                WebkitAppearance: "none",
                minWidth: 0
              }}
              onFocus={(e) => e.target.style.borderColor = "#667eea"}
              onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
            >
              <option value="">Select User Type</option>
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="admin">Administrator</option>
            </select>
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{
              display: "block",
              marginBottom: "0.5rem",
              color: "#333",
              fontWeight: "600"
            }}>
              Email:
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              style={{
                width: "100%",
                padding: "0.9rem",
                border: "2px solid #e0e0e0",
                borderRadius: "8px",
                fontSize: "1rem",
                outline: "none",
                transition: "border 0.3s",
                boxSizing: "border-box"
              }}
              onFocus={(e) => e.target.style.borderColor = "#667eea"}
              onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
            />
          </div>

          <div style={{ marginBottom: "1.5rem", width: "100%", maxWidth: "100%", boxSizing: "border-box" }}>
            <label style={{
              display: "block",
              marginBottom: "0.5rem",
              color: "#333",
              fontWeight: "600"
            }}>
              Password:
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              style={{
                width: "100%",
                padding: "0.9rem",
                border: "2px solid #e0e0e0",
                borderRadius: "8px",
                fontSize: "1rem",
                outline: "none",
                transition: "border 0.3s",
                boxSizing: "border-box"
              }}
              onFocus={(e) => e.target.style.borderColor = "#667eea"}
              onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
            />
            <div style={{ textAlign: "right", marginTop: "0.5rem" }}>
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#667eea",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  textDecoration: "underline"
                }}
              >
                Forgot Password?
              </button>
            </div>
          </div>

          {error && (
            <div style={{
              color: "#ef4444",
              marginBottom: "1rem",
              padding: "0.8rem",
              background: "#fee",
              borderRadius: "8px",
              fontSize: "0.9rem",
              width: "100%",
              maxWidth: "100%",
              boxSizing: "border-box",
              wordBreak: "break-word"
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "1rem",
              background: loading ? "#ccc" : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontSize: "1.1rem",
              fontWeight: "bold",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "transform 0.2s, box-shadow 0.2s",
              boxShadow: "0 4px 15px rgba(102, 126, 234, 0.3)"
            }}
            onMouseOver={(e) => {
              if (!loading) {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 6px 20px rgba(102, 126, 234, 0.4)";
              }
            }}
            onMouseOut={(e) => {
              if (!loading) {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 4px 15px rgba(102, 126, 234, 0.3)";
              }
            }}
          >
            {loading ? "Logging in..." : "Submit"}
          </button>
        </form>

        <p style={{
          textAlign: "center",
          marginTop: "1.5rem",
          color: "#666",
          fontSize: "0.9rem"
        }}>
          Don't have an account? <a href="/signup" style={{ color: "#667eea", fontWeight: "600", textDecoration: "none" }}>Sign Up</a>
        </p>
      </div>
    </div>
    </>
  );
};

export default LoginPage;
