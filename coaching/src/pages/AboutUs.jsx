import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const statBlocks = [
  { label: "Learners Mentored", value: "2,500+", accent: "#f472b6" },
  { label: "Boards & Entrances", value: "6 Streams", accent: "#38bdf8" },
  { label: "Session Rhythm", value: "90 mins", accent: "#fbbf24" }
];

const valueChips = [
  "Small cohorts (1:20)",
  "Adaptive practice engine",
  "Mentor office hours"
];

const culturePillars = [
  { title: "Discipline", detail: "Morning accountability rituals keep every learner on tempo." },
  { title: "Clarity", detail: "Whiteboard storytelling + tactile aids for every tricky concept." },
  { title: "Care", detail: "Weekly reflection circles so minds stay confident, not burnt out." }
];

const AboutUs = () => {
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
    const fontId = "about-page-fonts";
    if (document.getElementById(fontId)) {
      return;
    }
    const link = document.createElement("link");
    link.id = fontId;
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Space+Grotesk:wght@400;500;600&display=swap";
    document.head.appendChild(link);
  }, []);

  return (
    <div
      style={{
        minHeight: "calc(100vh - 160px)",
        backgroundImage:
          "radial-gradient(circle at 15% 20%, rgba(255,255,255,0.14), transparent 45%), " +
          "radial-gradient(circle at 80% 0%, rgba(255,255,255,0.08), transparent 40%), " +
          "linear-gradient(135deg, #0f172a 0%, #312e81 55%, #7c3aed 100%)",
        padding: isMobile ? "2rem 1rem 3rem" : "3rem 2rem 4rem",
        fontFamily: "'Space Grotesk', 'Trebuchet MS', sans-serif",
        color: "#f8fafc"
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Hero */}
        <section
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "minmax(0,1.1fr) minmax(0,0.9fr)",
            gap: isMobile ? "1.5rem" : "2.5rem",
            marginBottom: "3rem"
          }}
        >
          <div
            style={{
              background: "rgba(15,23,42,0.55)",
              borderRadius: "28px",
              padding: isMobile ? "1.75rem" : "2.5rem",
              border: "1px solid rgba(255,255,255,0.12)",
              boxShadow: "0 35px 70px rgba(15,23,42,0.4)",
              backdropFilter: "blur(18px)"
            }}
          >
            <p style={{ letterSpacing: "0.3em", textTransform: "uppercase", fontSize: "0.8rem", color: "#a5b4fc", marginBottom: "1rem" }}>
              Pinnacle Institute • Since 2010
            </p>
            <h1
              style={{
                fontFamily: "'Playfair Display', 'Georgia', serif",
                fontSize: "clamp(2rem, 4.5vw, 3.4rem)",
                marginBottom: "1rem",
                lineHeight: 1.2
              }}
            >
              A finishing school for clarity, courage, and character.
            </h1>
            <p style={{ fontSize: "1.05rem", lineHeight: 1.8, color: "rgba(248,250,252,0.9)", marginBottom: "1.5rem" }}>
              From disciplined board prep to mindful entrance coaching, we engineer learning journeys that keep students curious, consistent, and career-ready.
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginBottom: "1.5rem" }}>
              {valueChips.map((chip) => (
                <span
                  key={chip}
                  style={{
                    padding: "0.45rem 0.9rem",
                    borderRadius: "999px",
                    border: "1px solid rgba(255,255,255,0.2)",
                    background: "rgba(255,255,255,0.08)",
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
                to="/contact-us"
                style={{
                  background: "linear-gradient(120deg, #c084fc, #7c3aed)",
                  color: "#fff",
                  padding: "0.85rem 1.75rem",
                  borderRadius: "999px",
                  textDecoration: "none",
                  fontWeight: 600,
                  boxShadow: "0 20px 40px rgba(124,58,237,0.35)",
                  transition: "transform 0.3s"
                }}
                onMouseOver={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
                onMouseOut={(e) => (e.currentTarget.style.transform = "translateY(0)")}
              >
                Start a Conversation →
              </Link>
              <Link
                to="/about-teachers"
                style={{
                  padding: "0.85rem 1.75rem",
                  borderRadius: "999px",
                  border: "1px solid rgba(255,255,255,0.5)",
                  color: "#f8fafc",
                  textDecoration: "none",
                  fontWeight: 600
                }}
              >
                Meet Our Mentors
              </Link>
            </div>
          </div>

          <div
            style={{
              background: "linear-gradient(165deg, #f8fafc 0%, #dbeafe 40%, #c7d2fe 100%)",
              borderRadius: "28px",
              padding: isMobile ? "1.75rem" : "2.5rem",
              color: "#0f172a",
              boxShadow: "0 30px 70px rgba(30,64,175,0.25)",
              display: "flex",
              flexDirection: "column",
              gap: "1rem"
            }}
          >
            {statBlocks.map((stat) => (
              <div
                key={stat.label}
                style={{
                  borderRadius: "18px",
                  border: `1px solid ${stat.accent}44`,
                  padding: "1.2rem 1.4rem",
                  background: "rgba(255,255,255,0.9)",
                  boxShadow: "0 20px 35px rgba(15,23,42,0.08)"
                }}
              >
                <p style={{ fontSize: "2.2rem", fontWeight: 700, color: stat.accent, margin: 0 }}>{stat.value}</p>
                <p style={{ margin: "0.3rem 0 0", color: "#475569", fontWeight: 600 }}>{stat.label}</p>
              </div>
            ))}

            <div
              style={{
                borderRadius: "20px",
                padding: "1.2rem 1.4rem",
                background: "#0f172a",
                color: "#f8fafc",
                boxShadow: "0 25px 50px rgba(15,23,42,0.4)"
              }}
            >
              <p style={{ margin: 0, fontSize: "0.8rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "#a5b4fc" }}>Lead Mentor</p>
              <h3 style={{ margin: "0.5rem 0 0", fontSize: "1.4rem", fontFamily: "'Playfair Display', 'Georgia', serif" }}>Sudhanshu Shekhar</h3>
              <p style={{ margin: "0.4rem 0 0", color: "rgba(248,250,252,0.8)", lineHeight: 1.6 }}>
                30+ years of mathematics storytelling, author of beloved board prep titles, and mentor to thousands of achievers.
              </p>
            </div>
          </div>
        </section>

        {/* Culture Grid */}
        <section
          style={{
            background: "rgba(255,255,255,0.08)",
            borderRadius: "32px",
            padding: isMobile ? "2rem" : "2.8rem",
            border: "1px solid rgba(255,255,255,0.12)",
            boxShadow: "0 35px 60px rgba(15,23,42,0.35)",
            backdropFilter: "blur(14px)",
            marginBottom: "3rem"
          }}
        >
          <h3 style={{ margin: 0, fontSize: "1.7rem", marginBottom: "1.5rem", fontFamily: "'Playfair Display', 'Georgia', serif" }}>
            The culture code
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
              gap: "1.25rem"
            }}
          >
            {culturePillars.map((pillar) => (
              <div
                key={pillar.title}
                style={{
                  padding: "1.5rem",
                  borderRadius: "18px",
                  border: "1px solid rgba(255,255,255,0.25)",
                  background: "rgba(15,23,42,0.35)"
                }}
              >
                <p style={{ letterSpacing: "0.25em", fontSize: "0.75rem", textTransform: "uppercase", color: "#a5b4fc", margin: 0 }}>
                  {pillar.title}
                </p>
                <p style={{ margin: "0.6rem 0 0", lineHeight: 1.7 }}>{pillar.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section
          style={{
            borderRadius: "30px",
            padding: isMobile ? "2rem" : "2.8rem",
            background: "linear-gradient(135deg, #fca5a5, #fb7185, #f472b6)",
            color: "#0f172a",
            boxShadow: "0 35px 60px rgba(0,0,0,0.25)",
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            alignItems: isMobile ? "flex-start" : "center",
            justifyContent: "space-between",
            gap: "1rem"
          }}
        >
          <div>
            <p style={{ margin: 0, letterSpacing: "0.3em", textTransform: "uppercase", fontSize: "0.75rem" }}>Take the next step</p>
            <h3 style={{ margin: "0.5rem 0 0", fontSize: "1.8rem", fontFamily: "'Playfair Display', 'Georgia', serif" }}>
              Visit us or schedule a call.
            </h3>
          </div>
          <Link
            to="/contact-us"
            style={{
              background: "#0f172a",
              color: "#fff",
              padding: "0.9rem 1.8rem",
              borderRadius: "999px",
              textDecoration: "none",
              fontWeight: 600
            }}
          >
            Plan a visit →
          </Link>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;
