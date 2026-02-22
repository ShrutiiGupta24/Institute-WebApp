import React, { useEffect, useState } from "react";
import { FaWhatsapp, FaPhoneAlt, FaMapMarkerAlt, FaClock } from "react-icons/fa";
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

const contactChannels = [
  {
    label: "Call Us",
    value: "9953029806 | 9990642287",
    icon: FaPhoneAlt,
    link: "tel:9953029806"
  },
  {
    label: "Visit Us",
    value: "N-4 Vani Vihar, Uttam Nagar, Delhi - 110059",
    icon: FaMapMarkerAlt,
    link: "https://maps.app.goo.gl/U9rSX5HyBY4UYSBcA"
  },
  {
    label: "WhatsApp",
    value: "+91 9990642287",
    icon: FaWhatsapp,
    link: "https://wa.me/9990642287"
  },
  {
    label: "Office Hours",
    value: "Mon-Sun· 9 AM - 10 PM",
    icon: FaClock
  }
];

const ContactUs = ({ isHomePage = false }) => {
  const [form, setForm] = useState({ name: "", phone: "", className: "" });
  const [phoneError, setPhoneError] = useState("");
  const [status, setStatus] = useState({ type: null, message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMobile, setIsMobile] = useState(typeof window === "undefined" ? true : window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }
    const fontId = "contact-page-fonts";
    if (document.getElementById(fontId)) {
      return;
    }
    const link = document.createElement("link");
    link.id = fontId;
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=Space+Grotesk:wght@400;500;600&display=swap";
    document.head.appendChild(link);
  }, []);

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

  const containerStyle = isHomePage
    ? {}
    : {
        minHeight: "calc(100vh - 160px)",
        backgroundImage:
          "radial-gradient(circle at 15% 30%, rgba(255,255,255,0.18), transparent 45%), " +
          "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #4c1d95 100%)",
        padding: isMobile ? "2rem 1rem 3rem" : "3rem 2rem 4rem",
        fontFamily: "'Space Grotesk', 'Trebuchet MS', sans-serif"
      };

  const formCardStyle = {
    borderRadius: "26px",
    padding: isMobile ? "1.5rem" : "2.4rem",
    background: "rgba(255,255,255,0.92)",
    boxShadow: "0 30px 60px rgba(15,23,42,0.3)",
    border: "1px solid rgba(15,23,42,0.08)",
    maxWidth: "560px",
    width: "100%"
  };

  const inputStyle = {
    width: "100%",
    padding: "0.95rem 0.9rem",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    marginTop: "0.4rem",
    marginBottom: "1rem",
    fontSize: "1rem",
    background: "#fff",
    outline: "none"
  };

  return (
    <div style={containerStyle}>
      {!isHomePage && (
        <div style={{ textAlign: "center", marginBottom: "2rem", color: "#f8fafc" }}>
          <p style={{ letterSpacing: "0.3em", textTransform: "uppercase", fontSize: "0.85rem", color: "#a5b4fc" }}>Let’s Talk</p>
          <h2 style={{ fontFamily: "'Playfair Display', 'Georgia', serif", fontSize: "clamp(2rem,4vw,2.8rem)", margin: 0 }}>
            Every conversation begins with curiosity.
          </h2>
        </div>
      )}
      <div
        style={{
          display: isHomePage ? "block" : "grid",
          gridTemplateColumns: isMobile ? "1fr" : "minmax(0,0.85fr) minmax(0,1fr)",
          gap: isMobile ? "1.5rem" : "2.5rem",
          maxWidth: "1200px",
          margin: isHomePage ? "0" : "0 auto"
        }}
      >
        {!isHomePage && (
          <div
            style={{
              borderRadius: "28px",
              padding: isMobile ? "1.5rem" : "2.4rem",
              background: "rgba(15,23,42,0.6)",
              border: "1px solid rgba(255,255,255,0.15)",
              boxShadow: "0 35px 60px rgba(15,23,42,0.45)",
              color: "#f8fafc",
              backdropFilter: "blur(14px)"
            }}
          >
            <h3 style={{ fontFamily: "'Playfair Display', 'Georgia', serif", fontSize: "1.8rem", marginTop: 0 }}>
              Walk in, dial in, or drop a note.
            </h3>
            <p style={{ color: "rgba(248,250,252,0.85)", lineHeight: 1.7, marginBottom: "1.5rem" }}>
              Our student success desk responds within the same business day because every question deserves momentum.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.5rem" }}>
              {contactChannels.map((channel) => {
                const Icon = channel.icon;
                const Wrapper = channel.link ? "a" : "div";
                const extraProps = channel.link
                  ? {
                      href: channel.link,
                      target: channel.link.startsWith("http") ? "_blank" : undefined,
                      rel: channel.link.startsWith("http") ? "noopener noreferrer" : undefined
                    }
                  : {};
                return (
                  <Wrapper
                    key={channel.label}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.9rem",
                      padding: "1rem 1.2rem",
                      borderRadius: "16px",
                      border: "1px solid rgba(255,255,255,0.2)",
                      background: "rgba(255,255,255,0.05)",
                      color: "inherit",
                      textDecoration: "none"
                    }}
                    {...extraProps}
                  >
                    <Icon size={20} />
                    <div>
                      <p style={{ margin: 0, fontWeight: 600 }}>{channel.label}</p>
                      <p style={{ margin: 0, color: "rgba(248,250,252,0.8)", fontSize: "0.95rem" }}>{channel.value}</p>
                    </div>
                  </Wrapper>
                );
              })}
            </div>

            <div
              style={{
                borderRadius: "20px",
                padding: "1.2rem 1.4rem",
                background: "linear-gradient(135deg, #f472b6, #fb7185)",
                color: "#0f172a"
              }}
            >
              <p style={{ margin: 0, fontWeight: 600 }}>Need a call back?</p>
              <p style={{ margin: "0.3rem 0 0" }}>Tap WhatsApp and send “Hi”, we’ll ring you within 10 minutes.</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} style={formCardStyle}>
          <p style={{ letterSpacing: "0.3em", textTransform: "uppercase", fontSize: "0.75rem", color: "#94a3b8", margin: 0 }}>
            Admissions Desk
          </p>
          <h3 style={{ margin: "0.4rem 0 1.5rem", fontSize: "1.9rem", color: "#0f172a", fontFamily: "'Playfair Display', 'Georgia', serif" }}>
            Tell us where you’re headed.
          </h3>
          <div>
            <label style={{ fontWeight: 600, color: "#0f172a" }}>Name</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} required style={inputStyle} placeholder="Your full name" />
          </div>
          <div>
            <label style={{ fontWeight: 600, color: "#0f172a" }}>Phone</label>
            <input type="tel" name="phone" value={form.phone} onChange={handleChange} required style={inputStyle} maxLength={10} placeholder="10-digit number" />
            {phoneError && <div style={{ color: "#dc2626", fontSize: "0.95rem", marginBottom: "0.5rem" }}>{phoneError}</div>}
          </div>
          <div>
            <label style={{ fontWeight: 600, color: "#0f172a" }}>Class</label>
            <select name="className" value={form.className} onChange={handleChange} required style={{ ...inputStyle, background: "#fff" }}>
              <option value="" disabled>Select class/program</option>
              {classOptions.map((cls, idx) => (
                <option key={idx} value={cls}>
                  {cls}
                </option>
              ))}
            </select>
          </div>

          {status.message && (
            <div
              style={{
                marginBottom: "1rem",
                padding: "0.9rem 1rem",
                borderRadius: "14px",
                background: status.type === "success" ? "#ecfdf5" : "#fef2f2",
                color: status.type === "success" ? "#047857" : "#b91c1c",
                fontWeight: 600
              }}
            >
              {status.message}
            </div>
          )}

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "1rem 1.2rem",
              borderRadius: "14px",
              border: "none",
              background: "linear-gradient(135deg, #7c3aed, #6366f1)",
              color: "#fff",
              fontWeight: 700,
              fontSize: "1.1rem",
              cursor: isSubmitting ? "not-allowed" : "pointer",
              opacity: isSubmitting ? 0.7 : 1,
              boxShadow: "0 20px 40px rgba(99,102,241,0.35)",
              transition: "transform 0.3s"
            }}
            disabled={isSubmitting}
            onMouseOver={(e) => {
              if (isSubmitting) return;
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseOut={(e) => {
              if (isSubmitting) return;
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            {isSubmitting ? "Submitting..." : "Submit Inquiry"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactUs;
