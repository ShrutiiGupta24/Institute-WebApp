import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaWhatsapp, FaFacebook, FaYoutube, FaInstagram, FaPhone, FaEnvelope, FaMapMarkerAlt, FaChalkboardTeacher, FaMedal, FaStar } from "react-icons/fa";
import image1 from "../assets/WhatsApp Image 2026-01-26 at 1.03.36 PM.jpeg";
import image2 from "../assets/WhatsApp Image 2026-01-26 at 1.04.50 PM.jpeg";
import image3 from "../assets/WhatsApp Image 2026-01-26 at 1.11.50 PM.jpeg";
import image4 from "../assets/WhatsApp Image 2026-01-26 at 1.06.37 PM.jpeg";
import image5 from "../assets/Image1.jpeg";
import image6 from "../assets/Image2.jpeg";
import image7 from "../assets/Image3.jpeg";
import image8 from "../assets/Image4.jpeg";

// Adjust position for each image:
// Options: "center", "top", "bottom", "left", "right", "top center", "bottom center"
// Or use percentage: "50% 20%" (horizontal, vertical)
const carouselImages = [
  { src: image1, mobilePosition: "top", desktopPosition: "center" },
  { src: image2, mobilePosition: "center", desktopPosition: "center" },
  { src: image3, mobilePosition: "top", desktopPosition: "center" },
  { src: image4, mobilePosition: "center", desktopPosition: "50% 45%" },
  { src: image5, mobilePosition: "center", desktopPosition: "center" },
  { src: image6, mobilePosition: "center", desktopPosition: "center" },
  { src: image7, mobilePosition: "center", desktopPosition: "center" },
  { src: image8, mobilePosition: "center", desktopPosition: "center" }
];

const highlightStats = [
  { label: "Students Guided", value: "2,500+", accent: "#f472b6" },
  { label: "Board Toppers", value: "180+", accent: "#38bdf8" },
  { label: "Scholarships Won", value: "₹1.2 Cr", accent: "#34d399" }
];

const uspChips = [
  "Small Batches (1:20)",
  "Adaptive Practice Sheets",
  "Bi-weekly Parent Huddles",
  "Dedicated Doubt Rooms"
];

const pillarCards = [
  {
    title: "Signature Mentorship",
    description: "Personalised study journeys crafted by subject experts who track every milestone.",
    icon: FaChalkboardTeacher,
    gradient: "linear-gradient(135deg, #f472b6, #ec4899)"
  },
  {
    title: "Holistic Readiness",
    description: "STEM labs, Olympiad clubs, and soft-skills pods that keep learners interview-ready.",
    icon: FaMedal,
    gradient: "linear-gradient(135deg, #38bdf8, #2563eb)"
  },
  {
    title: "Result Rituals",
    description: "Weekly diagnostics + recovery plans so every test becomes a launchpad, not a setback.",
    icon: FaStar,
    gradient: "linear-gradient(135deg, #34d399, #059669)"
  }
];

const excellenceBadges = [
  { title: "15+ Years", detail: "Legacy of trust", emoji: "⏳", colors: ["#fde68a", "#f59e0b"] },
  { title: "Smart Campus", detail: "ERP enabled", emoji: "💡", colors: ["#bfdbfe", "#60a5fa"] },
  { title: "Parent Lounge", detail: "Transparent updates", emoji: "🤝", colors: ["#fecdd3", "#fb7185"] },
  { title: "Career Studio", detail: "NEET + JEE mentoring", emoji: "🚀", colors: ["#c7d2fe", "#7c3aed"] }
];

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const carouselHeight = isMobile ? 300 : 520;

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }
    const fontLinkId = "homepage-fonts";
    if (document.getElementById(fontLinkId)) {
      return;
    }
    const link = document.createElement("link");
    link.id = fontLinkId;
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap";
    document.head.appendChild(link);
  }, []);

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
        backgroundImage:
          "radial-gradient(circle at 15% 20%, rgba(255,255,255,0.14), transparent 45%), " +
          "radial-gradient(circle at 80% 0%, rgba(255,255,255,0.08), transparent 40%), " +
          "linear-gradient(135deg, #0f172a 0%, #312e81 55%, #7c3aed 100%)",
        paddingTop: "2rem",
        paddingBottom: "2rem",
        width: "100%",
        overflowX: "hidden",
        fontFamily: "'Space Grotesk', 'Trebuchet MS', sans-serif",
        color: "#0f172a"
      }}
    >
      {/* Carousel Section */}
      <section id="home" style={{ paddingBottom: "3rem", width: "100%", maxWidth: "1200px", margin: "0 auto", padding: "0 1rem" }}>
        <div style={{ 
          position: "relative", 
          width: "100%", 
          maxWidth: "100%",
          height: `${carouselHeight}px`,
          background: "linear-gradient(135deg, #020617, #111c44)",
          overflow: "hidden",
          borderRadius: "34px",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow: "0 50px 90px rgba(2,6,23,0.55)",
          isolation: "isolate"
        }}>
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: "-40%",
              background: "radial-gradient(circle at 30% 30%, rgba(99,102,241,0.35), transparent 60%)",
              filter: "blur(80px)",
              zIndex: 0
            }}
          />

          {carouselImages.map((imageData, index) => {
            const total = carouselImages.length;
            const prevIndex = (currentSlide - 1 + total) % total;
            const nextIndex = (currentSlide + 1) % total;
            const isActive = index === currentSlide;
            const isPrev = index === prevIndex;
            const isNext = index === nextIndex;
            const sideShift = isMobile ? 55 : 26;
            let transform = "translate(-50%, -50%) scale(0.7)";
            let opacity = 0;
            let width = isMobile ? "58%" : "42%";
            let height = isMobile ? "62%" : "68%";
            let zIndex = 1;
            let blurBorder = "rgba(255,255,255,0.2)";

            if (isActive) {
              transform = "translate(-50%, -50%) scale(1)";
              opacity = 1;
              width = isMobile ? "78%" : "60%";
              height = isMobile ? "80%" : "82%";
              zIndex = 4;
              blurBorder = "rgba(255,255,255,0.35)";
            } else if (isPrev) {
              transform = `translate(calc(-50% - ${sideShift}%), -50%) scale(${isMobile ? 0.88 : 0.93})`;
              opacity = 0.75;
              zIndex = 2;
            } else if (isNext) {
              transform = `translate(calc(-50% + ${sideShift}%), -50%) scale(${isMobile ? 0.88 : 0.93})`;
              opacity = 0.75;
              zIndex = 2;
            }

            return (
              <div
                key={imageData.src}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  width,
                  height,
                  borderRadius: "30px",
                  overflow: "hidden",
                  border: `1px solid ${blurBorder}`,
                  boxShadow: isActive
                    ? "0 35px 80px rgba(15,23,42,0.6)"
                    : "0 15px 40px rgba(15,23,42,0.35)",
                  transform,
                  opacity,
                  transition: "all 0.9s ease",
                  zIndex,
                  pointerEvents: isActive ? "auto" : "none",
                  backdropFilter: isActive ? "blur(4px)" : "none"
                }}
              >
                <img
                  src={imageData.src}
                  alt={`Slide ${index + 1}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: isMobile
                      ? imageData.mobilePosition || "center"
                      : imageData.desktopPosition || imageData.mobilePosition || "center",
                    filter: isActive ? "saturate(1.05)" : "saturate(0.9)",
                    transition: "filter 0.6s ease"
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: isActive
                      ? "linear-gradient(180deg, rgba(15,23,42,0.08) 0%, rgba(15,23,42,0.65) 100%)"
                      : "linear-gradient(180deg, rgba(15,23,42,0.2), rgba(15,23,42,0.7))",
                    mixBlendMode: "multiply"
                  }}
                />
              </div>
            );
          })}

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            style={{
              position: "absolute",
              left: isMobile ? "10px" : "20px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "rgba(2,6,23,0.75)",
              border: "1px solid rgba(255,255,255,0.25)",
              borderRadius: "50%",
              width: isMobile ? "38px" : "48px",
              height: isMobile ? "38px" : "48px",
              fontSize: isMobile ? "1.2rem" : "1.5rem",
              cursor: "pointer",
              zIndex: 10,
              color: "#f8fafc",
              fontWeight: "bold",
              boxShadow: "0 15px 30px rgba(2,6,23,0.55)",
              backdropFilter: "blur(8px)"
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
              background: "rgba(2,6,23,0.75)",
              border: "1px solid rgba(255,255,255,0.25)",
              borderRadius: "50%",
              width: isMobile ? "38px" : "48px",
              height: isMobile ? "38px" : "48px",
              fontSize: isMobile ? "1.2rem" : "1.5rem",
              cursor: "pointer",
              zIndex: 10,
              color: "#f8fafc",
              fontWeight: "bold",
              boxShadow: "0 15px 30px rgba(2,6,23,0.55)",
              backdropFilter: "blur(8px)"
            }}
          >
            ›
          </button>

          {/* Dot Indicators */}
          <div style={{
            position: "absolute",
            bottom: isMobile ? "1rem" : "1.5rem",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: "0.65rem",
            zIndex: 20
          }}>
            {carouselImages.map((imageData, index) => (
              <button
                key={`${imageData.src}-dot`}
                onClick={() => goToSlide(index)}
                style={{
                  width: currentSlide === index ? "36px" : "16px",
                  height: "6px",
                  borderRadius: "999px",
                  border: "none",
                  background: currentSlide === index
                    ? "linear-gradient(120deg, #f472b6, #c084fc, #7c3aed)"
                    : "rgba(255,255,255,0.35)",
                  cursor: "pointer",
                  transition: "width 0.3s ease, background 0.3s ease",
                  padding: 0
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Welcome Section */}
      <section style={{ padding: "3rem 1rem", width: "100%", maxWidth: "1200px", margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "minmax(0,1.2fr) minmax(0,0.8fr)",
            gap: "1.75rem"
          }}
        >
          <div
            style={{
              background: "rgba(15,23,42,0.55)",
              borderRadius: "24px",
              padding: isMobile ? "1.75rem" : "2.5rem",
              border: "1px solid rgba(255,255,255,0.12)",
              boxShadow: "0 35px 80px rgba(15,23,42,0.4)",
              backdropFilter: "blur(16px)",
              color: "#f8fafc"
            }}
          >
            <p
              style={{
                textTransform: "uppercase",
                letterSpacing: "0.3em",
                fontSize: "0.85rem",
                color: "#a5b4fc",
                marginBottom: "1rem"
              }}
            >
              Pinnacle Institute • Since 2010
            </p>
            <h1
              style={{
                fontFamily: "'Playfair Display', 'Georgia', serif",
                fontSize: "clamp(2rem, 5vw, 3.3rem)",
                marginBottom: "1rem",
                lineHeight: 1.2
              }}
            >
              Where consistent practice meets confident outcomes.
            </h1>
            <p style={{ fontSize: "1.1rem", lineHeight: 1.8, color: "rgba(248,250,252,0.9)", marginBottom: "1.75rem" }}>
              From foundational clarity in grades 9-10 to high-stakes board and entrance mentoring in grades 11-12, our
              studio classrooms blend disciplined academics, mindful wellness, and real-world readiness.
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginBottom: "1.5rem" }}>
              {uspChips.map((chip) => (
                <span
                  key={chip}
                  style={{
                    padding: "0.45rem 0.9rem",
                    borderRadius: "999px",
                    background: "rgba(255,255,255,0.12)",
                    border: "1px solid rgba(255,255,255,0.18)",
                    fontSize: "0.9rem",
                    color: "#e0e7ff"
                  }}
                >
                  {chip}
                </span>
              ))}
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
              <Link
                to="/about-us"
                style={{
                  background: "linear-gradient(120deg, #c084fc, #7c3aed)",
                  color: "#fff",
                  padding: "0.85rem 1.8rem",
                  borderRadius: "999px",
                  textDecoration: "none",
                  fontWeight: 600,
                  boxShadow: "0 20px 40px rgba(124,58,237,0.35)",
                  transition: "transform 0.3s"
                }}
                onMouseOver={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
                onMouseOut={(e) => (e.currentTarget.style.transform = "translateY(0)")}
              >
                Explore Our Story →
              </Link>
              <Link
                to="/contact-us"
                style={{
                  padding: "0.85rem 1.8rem",
                  borderRadius: "999px",
                  border: "1px solid rgba(255,255,255,0.4)",
                  color: "#f8fafc",
                  textDecoration: "none",
                  fontWeight: 600
                }}
              >
                Talk to an Academic Coach
              </Link>
            </div>
          </div>

          <div
            style={{
              background: "linear-gradient(165deg, #f8fafc 0%, #dbeafe 40%, #c7d2fe 100%)",
              borderRadius: "24px",
              padding: isMobile ? "1.75rem" : "2.5rem",
              boxShadow: "0 30px 70px rgba(30,64,175,0.25)",
              color: "#0f172a"
            }}
          >
            <p style={{ fontSize: "0.95rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#475569", marginBottom: "1.25rem" }}>
              Impact In Numbers
            </p>
            <h3 style={{ fontFamily: "'Playfair Display', 'Georgia', serif", fontSize: "1.8rem", marginBottom: "1.5rem", lineHeight: 1.3 }}>
              Parents trust us because progress is visible, structured, and celebrated every week.
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, minmax(0,1fr))", gap: "1rem" }}>
              {highlightStats.map((stat) => (
                <div
                  key={stat.label}
                  style={{
                    background: "#fff",
                    borderRadius: "18px",
                    padding: "1.2rem 1rem",
                    border: `1px solid ${stat.accent}33`,
                    boxShadow: "0 15px 30px rgba(15,23,42,0.08)"
                  }}
                >
                  <p style={{ fontSize: "2rem", fontWeight: 700, color: stat.accent, margin: 0 }}>{stat.value}</p>
                  <p style={{ margin: "0.4rem 0 0", color: "#475569", fontWeight: 500 }}>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
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
        <h2
          style={{
            textAlign: "center",
            color: "#f8fafc",
            fontFamily: "'Playfair Display', 'Georgia', serif",
            fontSize: "clamp(1.8rem,4vw,2.6rem)",
            marginBottom: "2rem"
          }}
        >
          A Living, Breathing Campus Culture
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(4, 1fr)", gap: "1.2rem" }}>
          {excellenceBadges.map((badge) => (
            <div
              key={badge.title}
              style={{
                borderRadius: "20px",
                padding: "1.8rem 1.2rem",
                background: `linear-gradient(135deg, ${badge.colors[0]}, ${badge.colors[1]})`,
                color: "#0f172a",
                boxShadow: "0 18px 40px rgba(15,23,42,0.18)",
                textAlign: "left",
                minHeight: "190px"
              }}
            >
              <div style={{ fontSize: "2.2rem" }}>{badge.emoji}</div>
              <h3 style={{ margin: "0.8rem 0 0.3rem", fontSize: "1.3rem", fontWeight: 700 }}>{badge.title}</h3>
              <p style={{ margin: 0, color: "rgba(15,23,42,0.75)", fontWeight: 500 }}>{badge.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pillars Section */}
      <section style={{ padding: "3rem 1rem", width: "100%", maxWidth: "1200px", margin: "0 auto" }}>
        <div
          style={{
            background: "rgba(255,255,255,0.08)",
            borderRadius: "28px",
            padding: isMobile ? "2rem" : "3rem",
            border: "1px solid rgba(255,255,255,0.12)",
            boxShadow: "0 35px 70px rgba(15,23,42,0.35)",
            backdropFilter: "blur(18px)"
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <p style={{ color: "#a5b4fc", letterSpacing: "0.25em", textTransform: "uppercase", fontSize: "0.85rem" }}>
              Why Parents Choose Pinnacle
            </p>
            <h2
              style={{
                color: "#fff",
                fontFamily: "'Playfair Display', 'Georgia', serif",
                fontSize: "clamp(1.9rem,4vw,2.8rem)",
                margin: 0
              }}
            >
              Academics engineered for clarity, courage, and care.
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: "1.5rem" }}>
            {pillarCards.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  style={{
                    background: pillar.gradient,
                    borderRadius: "22px",
                    padding: "2rem",
                    color: "#fff",
                    minHeight: "240px",
                    boxShadow: "0 25px 55px rgba(0,0,0,0.25)"
                  }}
                >
                  <div
                    style={{
                      width: "54px",
                      height: "54px",
                      borderRadius: "16px",
                      background: "rgba(255,255,255,0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "1.25rem"
                    }}
                  >
                    <Icon size={26} />
                  </div>
                  <h3 style={{ margin: "0 0 0.8rem", fontSize: "1.4rem", fontWeight: 700 }}>{pillar.title}</h3>
                  <p style={{ margin: 0, lineHeight: 1.7 }}>{pillar.description}</p>
                </div>
              );
            })}
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
