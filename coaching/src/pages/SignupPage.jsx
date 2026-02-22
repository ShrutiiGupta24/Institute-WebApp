import React, { useEffect, useState } from "react";
import { FaUserShield, FaClipboardCheck, FaUserPlus } from "react-icons/fa";
import { submitSignupRequest } from "../services/signupService";

const roleOptions = [
  { value: "student", label: "Student" },
  { value: "teacher", label: "Teacher" },
  { value: "parent", label: "Parent / Guardian" }
];

const reassurancePoints = [
  {
    title: "Verified access",
    copy: "Only approved profiles receive login credentials to our LMS.",
    icon: FaUserShield
  },
  {
    title: "Human review",
    copy: "Admin team validates every submission before activating an account.",
    icon: FaClipboardCheck
  },
  {
    title: "Priority follow-up",
    copy: "Expect a call or WhatsApp within one business day once approved.",
    icon: FaUserPlus
  }
];

const initialFormState = {
  fullName: "",
  email: "",
  phone: "",
  desiredRole: roleOptions[0].value,
  academicFocus: "",
  motivations: ""
};

const SignupPage = () => {
  const [form, setForm] = useState(initialFormState);
  const [phoneError, setPhoneError] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMobile, setIsMobile] = useState(() => (typeof window === "undefined" ? true : window.innerWidth <= 768));

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }
    const fontId = "signup-page-fonts";
    if (document.getElementById(fontId)) {
      return;
    }
    const link = document.createElement("link");
    link.id = fontId;
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=Space+Grotesk:wght@400;500;600&display=swap";
    document.head.appendChild(link);
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === "phone") {
      setPhoneError("");
    }
  };

  const validatePhone = () => {
    if (!/^\d{10}$/.test(form.phone)) {
      setPhoneError("Enter a 10-digit phone number");
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validatePhone()) {
      return;
    }
    setStatus({ type: "", message: "" });
    setIsSubmitting(true);
    try {
      await submitSignupRequest(form);
      setStatus({ type: "success", message: "Request submitted. Admin will enable your account after review." });
      setForm(initialFormState);
    } catch (error) {
      const apiMessage = error.response?.data?.detail || error.response?.data?.message;
      setStatus({ type: "error", message: apiMessage || "Unable to submit request. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "calc(100vh - 160px)",
        backgroundImage:
          "radial-gradient(circle at 10% 20%, rgba(255,255,255,0.15), transparent 40%), " +
          "linear-gradient(135deg, #0f172a 0%, #312e81 50%, #7c3aed 100%)",
        padding: isMobile ? "2rem 1rem 3rem" : "3rem 2rem 4rem",
        fontFamily: "'Space Grotesk', 'Trebuchet MS', sans-serif",
        color: "#f8fafc"
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "minmax(0,0.9fr) minmax(0,1.1fr)",
          gap: isMobile ? "1.5rem" : "2.5rem"
        }}
      >
        <div>
          <p style={{ letterSpacing: "0.35em", textTransform: "uppercase", fontSize: "0.75rem", color: "#a5b4fc" }}>
            Secure access
          </p>
          <h1
            style={{
              fontFamily: "'Playfair Display', 'Georgia', serif",
              fontSize: "clamp(2rem, 4.5vw, 3.2rem)",
              lineHeight: 1.15,
              margin: "0 0 1rem"
            }}
          >
            Request a Pinnacle login and let admin unlock your dashboard.
          </h1>
          <p style={{ lineHeight: 1.8, color: "rgba(248,250,252,0.88)", marginBottom: "2rem" }}>
            Share your details once. The request reaches only the admin notification center, so students and teachers never see it. Approval happens after identity verification.
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
              gap: "1rem"
            }}
          >
            {reassurancePoints.map((point) => {
              const Icon = point.icon;
              return (
                <div
                  key={point.title}
                  style={{
                    background: "rgba(15,23,42,0.5)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    borderRadius: "20px",
                    padding: "1.5rem",
                    boxShadow: "0 25px 45px rgba(15,23,42,0.5)"
                  }}
                >
                  <div
                    style={{
                      width: "46px",
                      height: "46px",
                      borderRadius: "14px",
                      background: "rgba(255,255,255,0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "0.8rem"
                    }}
                  >
                    <Icon size={22} />
                  </div>
                  <h3 style={{ margin: 0, fontSize: "1.15rem", color: "#fff" }}>{point.title}</h3>
                  <p style={{ margin: "0.4rem 0 0", color: "rgba(248,250,252,0.75)", lineHeight: 1.6 }}>{point.copy}</p>
                </div>
              );
            })}
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{
            background: "rgba(255,255,255,0.96)",
            borderRadius: "28px",
            padding: isMobile ? "1.75rem" : "2.5rem",
            color: "#0f172a",
            boxShadow: "0 35px 60px rgba(15,23,42,0.35)",
            border: "1px solid rgba(15,23,42,0.08)"
          }}
        >
          <p style={{ letterSpacing: "0.3em", textTransform: "uppercase", fontSize: "0.75rem", color: "#475569" }}>Request Access</p>
          <h2 style={{ margin: "0.4rem 0 1.5rem", fontSize: "1.9rem", fontFamily: "'Playfair Display', 'Georgia', serif" }}>
            Admin approval required before login.
          </h2>

          <label style={{ fontWeight: 600, display: "block" }}>Full name</label>
          <input
            type="text"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            required
            placeholder="Enter your full name"
            style={{
              width: "100%",
              marginTop: "0.35rem",
              marginBottom: "1rem",
              padding: "0.9rem 0.95rem",
              borderRadius: "12px",
              border: "1px solid #e2e8f0"
            }}
          />

          <label style={{ fontWeight: 600, display: "block" }}>Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="name@example.com"
            style={{
              width: "100%",
              marginTop: "0.35rem",
              marginBottom: "1rem",
              padding: "0.9rem 0.95rem",
              borderRadius: "12px",
              border: "1px solid #e2e8f0"
            }}
          />

          <label style={{ fontWeight: 600, display: "block" }}>Phone</label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
            maxLength={10}
            placeholder="10-digit contact number"
            style={{
              width: "100%",
              marginTop: "0.35rem",
              marginBottom: phoneError ? "0.4rem" : "1rem",
              padding: "0.9rem 0.95rem",
              borderRadius: "12px",
              border: `1px solid ${phoneError ? "#dc2626" : "#e2e8f0"}`
            }}
          />
          {phoneError && <p style={{ color: "#dc2626", marginTop: 0, marginBottom: "0.8rem" }}>{phoneError}</p>}

          <label style={{ fontWeight: 600, display: "block" }}>Role requesting access for</label>
          <select
            name="desiredRole"
            value={form.desiredRole}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              marginTop: "0.35rem",
              marginBottom: "1rem",
              padding: "0.9rem 0.95rem",
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
              background: "#fff"
            }}
          >
            {roleOptions.map((role) => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </select>

          <label style={{ fontWeight: 600, display: "block" }}>Academic focus / class</label>
          <input
            type="text"
            name="academicFocus"
            value={form.academicFocus}
            onChange={handleChange}
            required
            placeholder="e.g., Class 11 • Science stream"
            style={{
              width: "100%",
              marginTop: "0.35rem",
              marginBottom: "1rem",
              padding: "0.9rem 0.95rem",
              borderRadius: "12px",
              border: "1px solid #e2e8f0"
            }}
          />

          <label style={{ fontWeight: 600, display: "block" }}>Anything we should know?</label>
          <textarea
            name="motivations"
            value={form.motivations}
            onChange={handleChange}
            rows={4}
            placeholder="Share goals, preferred slots, or referral code (optional)."
            style={{
              width: "100%",
              marginTop: "0.35rem",
              marginBottom: "1.5rem",
              padding: "0.9rem 0.95rem",
              borderRadius: "16px",
              border: "1px solid #e2e8f0",
              resize: "vertical"
            }}
          />

          {status.message && (
            <div
              style={{
                marginBottom: "1rem",
                padding: "0.9rem 1rem",
                borderRadius: "14px",
                background: status.type === "success" ? "#ecfdf5" : "#fef2f2",
                color: status.type === "success" ? "#065f46" : "#b91c1c",
                fontWeight: 600
              }}
            >
              {status.message}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: "100%",
              padding: "1rem 1.2rem",
              borderRadius: "16px",
              border: "none",
              background: "linear-gradient(120deg, #c084fc, #7c3aed)",
              color: "#fff",
              fontWeight: 700,
              fontSize: "1.05rem",
              cursor: isSubmitting ? "not-allowed" : "pointer",
              opacity: isSubmitting ? 0.7 : 1,
              boxShadow: "0 25px 45px rgba(124,58,237,0.35)",
              transition: "transform 0.3s"
            }}
            onMouseOver={(event) => {
              if (!isSubmitting) {
                event.currentTarget.style.transform = "translateY(-2px)";
              }
            }}
            onMouseOut={(event) => {
              event.currentTarget.style.transform = "translateY(0)";
            }}
          >
            {isSubmitting ? "Sending..." : "Send approval request"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
