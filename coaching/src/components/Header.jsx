import React, { useState, useEffect } from "react";

const logoUrl = "https://cdn-icons-png.flaticon.com/512/3135/3135768.png"; // Example icon, replace with your own if needed

const Header = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const headerStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: isMobile ? "0.75rem 0" : "1.5rem 0",
    background: "#fff",
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
    position: "sticky",
    top: 0,
    width: "100%",
    zIndex: 200
  };

  const logoStyle = {
    width: isMobile ? 36 : 48,
    height: isMobile ? 36 : 48,
    marginRight: isMobile ? 8 : 16
  };

  const titleStyle = {
    fontFamily: "Segoe UI, Arial, sans-serif",
    fontWeight: 800,
    fontSize: isMobile ? "1.2rem" : "2.2rem",
    background: "linear-gradient(90deg, #6366f1 0%, #06b6d4 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    letterSpacing: isMobile ? "1px" : "2px"
  };

  return (
    <header style={headerStyle}>
      <img src={logoUrl} alt="Institute Logo" style={logoStyle} />
      <span style={titleStyle}>Pinnacle Institute</span>
    </header>
  );
};

export default Header;
