import React, { useState } from "react";
import { submitContactQuery } from "../services/contactService";

const classOptions = [
  "Class 9",
  "Class 10",
  "Class 11",
  "Class 12",
  "JEE Mains/Advance",
  "CUET",
  "BCOM(P/H)"
];

const backgroundStyle = {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "flex-start",
  padding: "2rem",
  paddingTop: "2rem"
};

const cardStyle = {
  maxWidth: 500,
  width: "100%",
  padding: "2.5rem",
  background: "#fff",
  borderRadius: 16,
  boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
  position: "relative",
  borderTop: "4px solid #667eea"
};

const inputStyle = {
  width: "100%",
  padding: "0.9rem 0.4rem", 
  border: "1px solid #d1d5db",
  borderRadius: 8,
  marginTop: 8, 
  marginBottom: 16,
  fontSize: "1rem",
  outline: "none",
  transition: "border 0.2s"
};

const labelStyle = {
  fontWeight: 600,
  color: "#374151"
};

const buttonStyle = {
  width: "100%",
  padding: "1rem",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  color: "#fff",
  border: "none",
  borderRadius: 10,
  fontWeight: 700,
  fontSize: "1.1rem",
  cursor: "pointer",
  boxShadow: "0 4px 15px rgba(102,126,234,0.3)",
  transition: "all 0.3s"
};

const ContactUs = ({ isHomePage = false }) => {
  const [form, setForm] = useState({ name: "", phone: "", className: "" });
  const [phoneError, setPhoneError] = useState("");
  const [status, setStatus] = useState({ type: null, message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      // Only allow numbers
      if (!/^\d*$/.test(value)) return;
      setPhoneError("");
    }
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validatePhone = (phone) => {
    return /^\d{10}$/.test(phone);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validatePhone(form.phone)) {
      setPhoneError("Phone number must be 10 digits.");
      return;
    }
    setPhoneError("");
    setStatus({ type: null, message: "" });

    try {
      setIsSubmitting(true);
      await submitContactQuery({
        name: form.name.trim(),
        phone: form.phone,
        className: form.className,
      });
      setStatus({ type: "success", message: "Thanks! We will reach out shortly." });
      setForm({ name: "", phone: "", className: "" });
    } catch (error) {
      const detail = error.response?.data?.detail || "Unable to submit right now. Please try again.";
      setStatus({ type: "error", message: detail });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={isHomePage ? {} : backgroundStyle}>
      {!isHomePage && (
        <h2 style={{ 
          textAlign: "center", 
          color: "#fff", 
          fontSize: "2.5rem",
          marginBottom: "2rem",
          textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
          fontWeight: 700
        }}>Contact Us</h2>
      )}
      <form onSubmit={handleSubmit} style={cardStyle}>
        <div>
          <label style={labelStyle}>Name:</label><br />
          <input type="text" name="name" value={form.name} onChange={handleChange} required style={inputStyle} placeholder="Enter your name" />
        </div>
        <div>
          <label style={labelStyle}>Phone:</label><br />
          <input type="tel" name="phone" value={form.phone} onChange={handleChange} required style={inputStyle} maxLength={10} placeholder="10-digit phone number" />
          {phoneError && <div style={{ color: "#ef4444", fontSize: "0.95rem", marginBottom: 8 }}>{phoneError}</div>}
        </div>
        <div>
          <label style={labelStyle}>Class:</label><br />
          <select name="className" value={form.className} onChange={handleChange} required style={inputStyle}>
            <option value="" disabled>Select Class</option>
            {classOptions.map((cls, idx) => (
              <option key={idx} value={cls}>{cls}</option>
            ))}
          </select>
        </div>
        {status.message && (
          <div
            style={{
              marginBottom: 12,
              padding: "0.8rem",
              borderRadius: 8,
              background: status.type === "success" ? "#ecfdf5" : "#fef2f2",
              color: status.type === "success" ? "#047857" : "#b91c1c",
              fontWeight: 600,
            }}
          >
            {status.message}
          </div>
        )}
        <button 
          type="submit" 
          style={{
            ...buttonStyle,
            opacity: isSubmitting ? 0.7 : 1,
            cursor: isSubmitting ? "not-allowed" : "pointer",
          }}
          disabled={isSubmitting}
          onMouseOver={(e) => {
            if (isSubmitting) return;
            e.currentTarget.style.opacity = "0.9";
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 6px 20px rgba(102,126,234,0.4)";
          }}
          onMouseOut={(e) => {
            if (isSubmitting) return;
            e.currentTarget.style.opacity = "1";
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 15px rgba(102,126,234,0.3)";
          }}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default ContactUs;
