import React from "react";
import { Link } from "react-router-dom";
import { FaHome, FaPhone, FaSignInAlt, FaUserPlus } from "react-icons/fa";

const MenuDropdown = ({ onClose }) => (
  <div style={{
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    borderRadius: "12px",
    padding: "1.5rem",
    minWidth: "250px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
  }}>
    <h3 style={{
      color: "#fff",
      marginBottom: "1rem",
      fontSize: "1.2rem",
      borderBottom: "2px solid rgba(255,255,255,0.3)",
      paddingBottom: "0.5rem"
    }}>
      Quick Links
    </h3>
    <ul style={{
      listStyle: "none",
      padding: 0,
      margin: 0
    }}>
      <li style={{ marginBottom: "0.8rem" }}>
        <Link to="/" onClick={onClose} style={{
          color: "#fff",
          textDecoration: "none",
          display: "flex",
          alignItems: "center",
          padding: "0.7rem",
          borderRadius: "8px",
          transition: "all 0.3s ease",
          background: "rgba(255,255,255,0.1)"
        }}
        onMouseOver={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
        onMouseOut={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
        >
          <FaHome style={{ marginRight: "0.8rem", fontSize: "1.2rem" }} />
          Home Page
        </Link>
      </li>
      <li style={{ marginBottom: "0.8rem" }}>
        <Link to="/contact-us" onClick={onClose} style={{
          color: "#fff",
          textDecoration: "none",
          display: "flex",
          alignItems: "center",
          padding: "0.7rem",
          borderRadius: "8px",
          transition: "all 0.3s ease",
          background: "rgba(255,255,255,0.1)"
        }}
        onMouseOver={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
        onMouseOut={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
        >
          <FaPhone style={{ marginRight: "0.8rem", fontSize: "1.2rem" }} />
          Contact Us
        </Link>
      </li>
      <li style={{ marginBottom: "0.8rem" }}>
        <Link to="/login" onClick={onClose} style={{
          color: "#fff",
          textDecoration: "none",
          display: "flex",
          alignItems: "center",
          padding: "0.7rem",
          borderRadius: "8px",
          transition: "all 0.3s ease",
          background: "rgba(255,255,255,0.1)"
        }}
        onMouseOver={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
        onMouseOut={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
        >
          <FaSignInAlt style={{ marginRight: "0.8rem", fontSize: "1.2rem" }} />
          Login
        </Link>
      </li>
      <li style={{ marginBottom: "0" }}>
        <Link to="/signup" onClick={onClose} style={{
          color: "#fff",
          textDecoration: "none",
          display: "flex",
          alignItems: "center",
          padding: "0.7rem",
          borderRadius: "8px",
          transition: "all 0.3s ease",
          background: "rgba(255,255,255,0.1)"
        }}
        onMouseOver={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
        onMouseOut={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
        >
          <FaUserPlus style={{ marginRight: "0.8rem", fontSize: "1.2rem" }} />
          Sign Up
        </Link>
      </li>
    </ul>
  </div>
);

export default MenuDropdown;
