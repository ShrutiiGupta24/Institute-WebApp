import React, { useState, useEffect } from "react";
import { FaWhatsapp, FaFacebook, FaYoutube, FaInstagram } from "react-icons/fa";

const Footer = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <footer
      style={{
        background: "#18368eff",
        padding: isMobile ? "1rem 0.5rem" : "1rem",
        textAlign: "center",
        width: "100%",
        color: "#fff",
      }}
    >
      <div>
        <p style={{ fontSize: isMobile ? "0.85rem" : "1rem", margin: "0.5rem 0" }}>
          Address:{" "}
          <a
            href="https://maps.app.goo.gl/U9rSX5HyBY4UYSBcA"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#fff", textDecoration: "underline" }}
          >
            N-4 Vani Vihar, Uttam Nagar, Delhi - 110059
          </a>
        </p>
        <p style={{ fontSize: isMobile ? "0.85rem" : "1rem", margin: "0.5rem 0" }}>
          Phone: 9953029806 | 9990642287 | 9891799044
        </p>
        <p style={{ fontSize: isMobile ? "0.85rem" : "1rem", margin: "0.5rem 0" }}>
          Email: pinnacleinstitute129@gmail.com
        </p>
        <div
          style={{
            marginTop: "0.5rem",
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            justifyContent: "center",
            alignItems: "center",
            gap: isMobile ? "0.5rem" : "0",
          }}
        >
          <a
            href="https://wa.me/9990642287 "
            target="_blank"
            rel="noopener noreferrer"
            style={{
              margin: isMobile ? "0" : "0 0.5rem",
              display: "inline-flex",
              alignItems: "center",
              color: "#fff",
              textDecoration: "none",
              fontSize: isMobile ? "0.9rem" : "1rem",
            }}
          >
            <FaWhatsapp style={{ marginRight: "0.3rem" }} /> WhatsApp
          </a>
          <a
            href="https://www.facebook.com/pinnacleinstitutes"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              margin: isMobile ? "0" : "0 0.5rem",
              display: "inline-flex",
              alignItems: "center",
              color: "#fff",
              textDecoration: "none",
              fontSize: isMobile ? "0.9rem" : "1rem",
            }}
          >
            <FaFacebook style={{ marginRight: "0.3rem" }} /> Facebook
          </a>
          <a
            href="https://www.youtube.com/@renspinnacleinstitute8752"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              margin: isMobile ? "0" : "0 0.5rem",
              display: "inline-flex",
              alignItems: "center",
              color: "#fff",
              textDecoration: "none",
              fontSize: isMobile ? "0.9rem" : "1rem",
            }}
          >
            <FaYoutube style={{ marginRight: "0.3rem" }} /> Youtube
          </a>
          <a
            href="https://www.instagram.com/pinnacle_institute?igsh=MWc1ZnU3cGRhbnF4eA=="
            target="_blank"
            rel="noopener noreferrer"
            style={{
              margin: isMobile ? "0" : "0 0.5rem",
              display: "inline-flex",
              alignItems: "center",
              color: "#fff",
              textDecoration: "none",
              fontSize: isMobile ? "0.9rem" : "1rem",
            }}
          >
            <FaInstagram style={{ marginRight: "0.3rem" }} /> Instagram
          </a>
        </div>
      </div>
      <p style={{ marginTop: "1rem", fontSize: isMobile ? "0.85rem" : "1rem" }}>
        &copy; 2026 Pinnacle Institute
      </p>
    </footer>
  );
};

export default Footer;
