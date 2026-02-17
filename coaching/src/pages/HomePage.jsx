import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaWhatsapp, FaFacebook, FaYoutube, FaInstagram, FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import image1 from "../assets/WhatsApp Image 2026-01-26 at 1.03.36 PM.jpeg";
import image2 from "../assets/WhatsApp Image 2026-01-26 at 1.04.50 PM.jpeg";
import image3 from "../assets/WhatsApp Image 2026-01-26 at 1.11.50 PM.jpeg";
import image4 from "../assets/WhatsApp Image 2026-01-26 at 1.06.37 PM.jpeg";

// Adjust position for each image:
// Options: "center", "top", "bottom", "left", "right", "top center", "bottom center"
// Or use percentage: "50% 20%" (horizontal, vertical)
const carouselImages = [
  { src: image1, position: "top" },
  { src: image2, position: "center" },
  { src: image3, position: "top" },
  { src: image4, position: "center" }
];

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll("nav ul li a");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            navLinks.forEach((link) => {
              link.classList.remove("active");
              if (link.getAttribute("href") === `#${entry.target.id}`) {
                link.classList.add("active");
              }
            });
          }
        });
      },
      { threshold: 0.6 }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div
      style={{
        scrollBehavior: "smooth",
        minHeight: "calc(100vh - 160px)",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        paddingTop: "2rem",
        paddingBottom: "2rem",
        width: "100%",
        overflowX: "hidden"
      }}
    >
      {/* Carousel Section */}
      <section id="home" style={{ paddingBottom: "3rem", width: "100%", maxWidth: "1200px", margin: "0 auto", padding: "0 1rem" }}>
        <div style={{ 
          position: "relative", 
          width: "100%", 
          maxWidth: "100%",
          height: isMobile ? "220px" : "360px",
          background: "#000",
          overflow: "hidden",
          borderRadius: "16px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
        }}>
          {carouselImages.map((imageData, index) => (
            <img
              key={index}
              src={imageData.src}
              alt={`Slide ${index + 1}`}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: imageData.position,
                opacity: currentSlide === index ? 1 : 0,
                transition: "opacity 0.8s ease-in-out"
              }}
            />
          ))}

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            style={{
              position: "absolute",
              left: isMobile ? "10px" : "20px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "rgba(255, 255, 255, 0.8)",
              border: "none",
              borderRadius: "50%",
              width: isMobile ? "35px" : "45px",
              height: isMobile ? "35px" : "45px",
              fontSize: isMobile ? "1.2rem" : "1.5rem",
              cursor: "pointer",
              zIndex: 100,
              color: "#333",
              fontWeight: "bold",
              boxShadow: "0 2px 10px rgba(0,0,0,0.3)"
            }}
          >
            ‹
          </button>

          <button
            onClick={nextSlide}
            style={{
              position: "absolute",
              right: isMobile ? "10px" : "20px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "rgba(255, 255, 255, 0.8)",
              border: "none",
              borderRadius: "50%",
              width: isMobile ? "35px" : "45px",
              height: isMobile ? "35px" : "45px",
              fontSize: isMobile ? "1.2rem" : "1.5rem",
              cursor: "pointer",
              zIndex: 100,
              color: "#333",
              fontWeight: "bold",
              boxShadow: "0 2px 10px rgba(0,0,0,0.3)"
            }}
          >
            ›
          </button>

          {/* Dot Indicators */}
          <div style={{
            position: "absolute",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: "10px",
            zIndex: 100
          }}>
            {carouselImages.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                style={{
                  width: currentSlide === index ? "30px" : "10px",
                  height: "10px",
                  borderRadius: "5px",
                  border: "none",
                  background: currentSlide === index ? "#fff" : "rgba(255,255,255,0.5)",
                  cursor: "pointer",
                  transition: "all 0.3s",
                  padding: 0
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Welcome Section */}
      <section style={{ padding: "3rem 1rem", width: "100%", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ textAlign: "center" }}>
          <h1 style={{ 
            color: "#fff", 
            fontSize: "clamp(1.8rem, 5vw, 3rem)", 
            marginBottom: "1.5rem",
            textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
            fontWeight: "bold"
          }}>
            Welcome to Pinnacle Institute
          </h1>
          <p style={{ 
            color: "#fff", 
            fontSize: "clamp(1rem, 3vw, 1.3rem)", 
            opacity: 0.95,
            lineHeight: "1.8",
            maxWidth: "800px",
            margin: "0 auto",
            padding: "0 1rem"
          }}>
            Building excellence through 15 years of dedicated education for Class 9th to 12th students
          </p>
        </div>
      </section>

      {/* About Us Section */}
      <section style={{ padding: "3rem 1rem", width: "100%", maxWidth: "1200px", margin: "0 auto" }}>
        <h2 style={{ 
          textAlign: "center", 
          color: "#fff", 
          fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
          marginBottom: "2rem",
          textShadow: "2px 2px 4px rgba(0,0,0,0.3)"
        }}>
          About Pinnacle Institute
        </h2>
        
        <div style={{
          background: "#fff",
          borderRadius: "16px",
          padding: isMobile ? "1.5rem" : "2.5rem",
          boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
          marginBottom: "2rem"
        }}>
          <p style={{ lineHeight: "1.8", color: "#333", fontSize: "1.05rem", marginBottom: "1.5rem" }}>
            With <strong>15 years of excellence in education</strong>, our institute is dedicated to strengthening the academic foundation of students from Class 9th to 12th. We focus on clear concepts, disciplined learning, and consistent performance to prepare students for board exams and future professional success.
          </p>

          <p style={{ lineHeight: "1.8", color: "#333", fontSize: "1.05rem", marginBottom: "1.5rem" }}>
            The institute is led by <strong>Sudhanshu Shekhar Sir</strong>, an experienced Mathematics educator with over 30 years of expertise. His effective teaching methods and deep subject knowledge have guided hundreds of students toward successful careers as Engineers, Doctors, Chartered Accountants (CA), and other professionals.
          </p>

          <p style={{ lineHeight: "1.8", color: "#333", fontSize: "1.05rem" }}>
            Our approach combines <strong>conceptual clarity, logical thinking, and personal mentoring</strong> to ensure every student gains confidence and mastery in their subjects. We provide a supportive and motivating learning environment where students are guided to achieve excellence—academically and beyond.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)", gap: "1.5rem" }}>
          <div style={{
            background: "#fff",
            borderRadius: "16px",
            padding: "2rem",
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
            borderTop: "4px solid #667eea"
          }}>
            <h3 style={{ color: "#667eea", marginBottom: "1rem", fontSize: "1.5rem" }}>Our Vision</h3>
            <p style={{ lineHeight: "1.8", color: "#333", fontSize: "1rem" }}>
              To be a center of excellence in education that empowers students with strong knowledge, confidence, and values, enabling them to succeed as Engineers, Doctors, CAs, and future leaders.
            </p>
          </div>

          <div style={{
            background: "#fff",
            borderRadius: "16px",
            padding: "2rem",
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
            borderTop: "4px solid #764ba2"
          }}>
            <h3 style={{ color: "#764ba2", marginBottom: "1rem", fontSize: "1.5rem" }}>Our Mission</h3>
            <p style={{ lineHeight: "1.8", color: "#333", fontSize: "1rem" }}>
              To provide quality education with a focus on building strong fundamentals, critical thinking, and discipline, preparing students for academic excellence and professional success.
            </p>
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <Link 
            to="/about-us"
            style={{
              display: "inline-block",
              background: "#fff",
              color: "#667eea",
              padding: "0.75rem 2rem",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: "600",
              fontSize: "1rem",
              boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
              transition: "all 0.3s"
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.3)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.2)";
            }}
          >
            Learn More About Us →
          </Link>
        </div>
      </section>

      {/* Quick Info Cards */}
      <section style={{ padding: "3rem 1rem", width: "100%", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: "1.5rem" }}>
          <div style={{
            background: "linear-gradient(135deg, #10b981, #059669)",
            borderRadius: "16px",
            padding: "2rem",
            textAlign: "center",
            color: "#fff",
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
          }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📚</div>
            <h3 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>15+ Years</h3>
            <p style={{ opacity: 0.9 }}>Of Educational Excellence</p>
          </div>

          <div style={{
            background: "linear-gradient(135deg, #f59e0b, #d97706)",
            borderRadius: "16px",
            padding: "2rem",
            textAlign: "center",
            color: "#fff",
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
          }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>👨‍🎓</div>
            <h3 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>Classes 9-12</h3>
            <p style={{ opacity: 0.9 }}>All Boards & Competitive Exams</p>
          </div>

          <div style={{
            background: "linear-gradient(135deg, #06b6d4, #0891b2)",
            borderRadius: "16px",
            padding: "2rem",
            textAlign: "center",
            color: "#fff",
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
          }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎯</div>
            <h3 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>Expert Faculty</h3>
            <p style={{ opacity: 0.9 }}>30+ Years Experience</p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section style={{ padding: "3rem 1rem 2rem", width: "100%", maxWidth: "1200px", margin: "0 auto" }}>
        <h2 style={{ 
          textAlign: "center", 
          color: "#fff", 
          fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
          marginBottom: "2rem",
          textShadow: "2px 2px 4px rgba(0,0,0,0.3)"
        }}>
          Get In Touch
        </h2>

        <div style={{
          background: "#fff",
          borderRadius: "16px",
          padding: isMobile ? "2rem 1.5rem" : "3rem",
          boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
        }}>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)", gap: "2rem" }}>
            <div>
              <h3 style={{ color: "#667eea", marginBottom: "1.5rem", fontSize: "1.5rem" }}>Contact Information</h3>
              
              <div style={{ marginBottom: "1.5rem" }}>
                <div style={{ display: "flex", alignItems: "start", gap: "1rem", marginBottom: "1rem" }}>
                  <FaMapMarkerAlt style={{ color: "#667eea", fontSize: "1.5rem", marginTop: "0.25rem" }} />
                  <div>
                    <h4 style={{ margin: "0 0 0.5rem 0", color: "#333" }}>Address</h4>
                    <a
                      href="https://maps.app.goo.gl/U9rSX5HyBY4UYSBcA"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#667eea", textDecoration: "none" }}
                    >
                      N-4 Vani Vihar, Uttam Nagar, Delhi - 110059
                    </a>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "start", gap: "1rem", marginBottom: "1rem" }}>
                  <FaPhone style={{ color: "#667eea", fontSize: "1.5rem", marginTop: "0.25rem" }} />
                  <div>
                    <h4 style={{ margin: "0 0 0.5rem 0", color: "#333" }}>Phone</h4>
                    <p style={{ margin: 0, color: "#666" }}>9953029806 | 9990642287 | 9891799044</p>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "start", gap: "1rem" }}>
                  <FaEnvelope style={{ color: "#667eea", fontSize: "1.5rem", marginTop: "0.25rem" }} />
                  <div>
                    <h4 style={{ margin: "0 0 0.5rem 0", color: "#333" }}>Email</h4>
                    <p style={{ margin: 0, color: "#666" }}>pinnacleinstitute129@gmail.com</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 style={{ color: "#667eea", marginBottom: "1.5rem", fontSize: "1.5rem" }}>Follow Us</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <a
                  href="https://wa.me/9990642287"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    padding: "0.75rem 1rem",
                    background: "#f3f4f6",
                    borderRadius: "8px",
                    textDecoration: "none",
                    color: "#333",
                    transition: "all 0.3s"
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = "#25D366";
                    e.currentTarget.style.color = "#fff";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = "#f3f4f6";
                    e.currentTarget.style.color = "#333";
                  }}
                >
                  <FaWhatsapp style={{ fontSize: "1.5rem" }} />
                  <span>WhatsApp</span>
                </a>

                <a
                  href="https://www.facebook.com/pinnacleinstitutes"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    padding: "0.75rem 1rem",
                    background: "#f3f4f6",
                    borderRadius: "8px",
                    textDecoration: "none",
                    color: "#333",
                    transition: "all 0.3s"
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = "#1877F2";
                    e.currentTarget.style.color = "#fff";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = "#f3f4f6";
                    e.currentTarget.style.color = "#333";
                  }}
                >
                  <FaFacebook style={{ fontSize: "1.5rem" }} />
                  <span>Facebook</span>
                </a>

                <a
                  href="https://www.youtube.com/@renspinnacleinstitute8752"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    padding: "0.75rem 1rem",
                    background: "#f3f4f6",
                    borderRadius: "8px",
                    textDecoration: "none",
                    color: "#333",
                    transition: "all 0.3s"
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = "#FF0000";
                    e.currentTarget.style.color = "#fff";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = "#f3f4f6";
                    e.currentTarget.style.color = "#333";
                  }}
                >
                  <FaYoutube style={{ fontSize: "1.5rem" }} />
                  <span>YouTube</span>
                </a>

                <a
                  href="https://www.instagram.com/pinnacle_institute?igsh=MWc1ZnU3cGRhbnF4eA=="
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    padding: "0.75rem 1rem",
                    background: "#f3f4f6",
                    borderRadius: "8px",
                    textDecoration: "none",
                    color: "#333",
                    transition: "all 0.3s"
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = "linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)";
                    e.currentTarget.style.color = "#fff";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = "#f3f4f6";
                    e.currentTarget.style.color = "#333";
                  }}
                >
                  <FaInstagram style={{ fontSize: "1.5rem" }} />
                  <span>Instagram</span>
                </a>
              </div>
            </div>
          </div>

          <div style={{ textAlign: "center", marginTop: "2rem", paddingTop: "2rem", borderTop: "1px solid #e5e7eb" }}>
            <Link
              to="/contact-us"
              style={{
                display: "inline-block",
                background: "#667eea",
                color: "#fff",
                padding: "0.75rem 2rem",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: "600",
                fontSize: "1rem",
                boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
                transition: "all 0.3s"
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(102, 126, 234, 0.6)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 15px rgba(102, 126, 234, 0.4)";
              }}
            >
              Visit Full Contact Page →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
