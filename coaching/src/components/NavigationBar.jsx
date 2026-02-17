import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import MenuDropdown from "./MenuDropdown";

const NavigationBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
      if (window.innerWidth > 1024) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const headerOffset = isMobile ? 72 : 96;
  const barHeight = isMobile ? 56 : 72;

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/about-us", label: "About Us" },
    { path: "/about-teachers", label: "About Teachers" },
    { path: "/brochure", label: "Brochure" },
    { path: "/contact-us", label: "Contact Us" },
    { path: "/about-batches", label: "About Batches" },
    { path: "/achievers", label: "Achievers" }
  ];

  const navStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: isMobile ? "0.5rem 1rem" : "1rem 2rem",
    background: "#333",
    color: "#fff",
    position: "sticky",
    top: `${headerOffset}px`,
    width: "100%",
    zIndex: 150,
    boxSizing: "border-box"
  };

  const linkStyle = (isActive) => ({
    color: "#fff",
    textDecoration: "none",
    borderBottom: isActive ? "2px solid #06b6d4" : "none",
    background: isActive ? "#06b6d4" : "transparent",
    padding: "0.4rem 0.75rem",
    display: "block"
  });

  return (
    <nav style={navStyle}>
      {/* Desktop Navigation */}
      {!isMobile && (
        <div style={{ flex: 1 }}>
          <ul style={{
            display: "flex",
            gap: "0.5rem",
            rowGap: "0.5rem",
            listStyle: "none",
            margin: 0,
            padding: 0,
            flexWrap: "wrap",
            justifyContent: "flex-start"
          }}>
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link to={link.path} style={linkStyle(location.pathname === link.path)}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Mobile Hamburger for Navigation Links */}
      {isMobile && (
        <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
          <div
            style={{ cursor: "pointer", fontSize: "1.5rem", padding: "0.5rem", color: "#fff" }}
            onClick={toggleMobileMenu}
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </div>
          <span style={{ color: "#fff", marginLeft: "0.5rem", fontSize: "0.9rem" }}>Menu</span>
        </div>
      )}

      {/* Mobile Full-Screen Menu */}
      {isMobile && mobileMenuOpen && (
        <div
          style={{
            position: "fixed",
            top: `${headerOffset + barHeight}px`,
            left: 0,
            width: "100%",
            height: `calc(100vh - ${headerOffset + barHeight}px)`,
            background: "#333",
            zIndex: 900,
            overflowY: "auto",
            padding: "1rem 0"
          }}
        >
          <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {navLinks.map((link) => (
              <li key={link.path} style={{ marginBottom: "0.5rem" }}>
                <Link
                  to={link.path}
                  style={{
                    ...linkStyle(location.pathname === link.path),
                    padding: "1rem 1.5rem",
                    fontSize: "1.1rem",
                    borderBottom: location.pathname === link.path ? "2px solid #06b6d4" : "1px solid #555"
                  }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Login/Profile Menu (Desktop & Mobile) */}
      <div style={{ display: "flex", alignItems: "center", marginLeft: "auto" }}>
        <div
          style={{ cursor: "pointer", marginLeft: "1rem", fontSize: "1.5rem", padding: "0.5rem", color: "#fff" }}
          onClick={toggleMenu}
        >
          &#9776;
        </div>
        {menuOpen && (
          <div
            style={{
              position: "absolute",
              top: "calc(100% + 8px)",
              right: "20px",
              background: "#fff",
              color: "#333",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              zIndex: 1000,
            }}
          >
            <MenuDropdown onClose={toggleMenu} />
          </div>
        )}
      </div>
      
    </nav>
  );
};

export default NavigationBar;
