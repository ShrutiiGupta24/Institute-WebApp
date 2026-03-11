import React from "react";

import A1 from "../assets/A1.png";
import A2 from "../assets/A2.png";
import A4 from "../assets/A4.png";
import A5 from "../assets/A5.png";
import A6 from "../assets/A6.png";
import A7 from "../assets/A7.png";
import A8 from "../assets/A8.png";
import A9 from "../assets/A9.png";
import A10 from "../assets/A10.png";
import A11 from "../assets/A11.png";
import A12 from "../assets/A12.png";
import A13 from "../assets/A13.png";
import A14 from "../assets/A14.png";
import A15 from "../assets/A15.png";
import A16 from "../assets/A16.png";
import A17 from "../assets/A17.png";

const achievers = [
  { id: 1, name: "Manik", subject: "Maths", score: "96/100", image: A1 },
  { id: 2, name: "Isha", subject: "Maths", score: "96/100", image: A2 },
  { id: 4, name: "Ansh", subject: "Maths", score: "95/100", image: A4 },
  { id: 5, name: "Harsh", subject: "Maths", score: "95/100", image: A5 },
  { id: 6, name: "Mitali", subject: "Maths", score: "95/100", image: A6 },
  { id: 7, name: "Suhani", subject: "Maths", score: "95/100", image: A7 },
  { id: 8, name: "Abhi", subject: "Maths", score: "97/100", image: A8 },
  { id: 9, name: "Lakshay", subject: "Maths", score: "98/100", image: A9 },
  { id: 10, name: "Bhavya", subject: "Maths", score: "98/100", image: A10 },
  { id: 11, name: "Samarpreet", subject: "Maths", score: "94/100", image: A11 },
  { id: 12, name: "Anuva", subjects: ["Maths", "Science"], score: ["85/100","94/100"], image: A12 },
  { id: 13, name: "Riya", subject: "Maths", score: "94/100", image: A13 },
  { id: 14, name: "Harsh", subject: "Maths", score: "94/100", image: A14 },
  { id: 15, name: "Kush", subject: ["Maths", "Physics"], score: ["97/100","95/100"], image: A15 },
  { id: 16, name: "Tanisha", subject: "Maths", score: "95/100", image: A16 },
  { id: 17, name: "Mohit", subject: "Maths", score: "99/100", image: A17 }
];

const getMathScore = (student) => {
  const parseScore = (raw) => {
    if (!raw && raw !== 0) return 0;
    const value = String(raw).split("/")[0].trim();
    return Number(value) || 0;
  };

  if (student.subject === "Maths") {
    return parseScore(student.score);
  }

  if (Array.isArray(student.subjects) && Array.isArray(student.score)) {
    const mathIndex = student.subjects.findIndex((sub) => String(sub).toLowerCase().includes("math"));
    return mathIndex !== -1 ? parseScore(student.score[mathIndex]) : 0;
  }

  if (Array.isArray(student.subject) && Array.isArray(student.score)) {
    const mathIndex = student.subject.findIndex((sub) => String(sub).toLowerCase().includes("math"));
    return mathIndex !== -1 ? parseScore(student.score[mathIndex]) : 0;
  }

  return 0;
};

const sortedAchievers = [...achievers].sort((a, b) => getMathScore(b) - getMathScore(a));

const backgroundStyle = {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #e0e7ff 0%, #fff 100%)",
  position: "relative",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center"
};

const decoCircleStyle = {
  position: "absolute",
  borderRadius: "50%",
  opacity: 0.15,
  zIndex: 0
};

const cardStyle = {
  border: "1px solid rgba(0,0,0,0.12)",
  borderRadius: "14px",
  padding: "1.25rem",
  width: "240px",
  minWidth: "240px",
  boxShadow: "0 18px 30px rgba(0,0,0,0.08)",
  textAlign: "center",
  background: "#fff",
  margin: "0.75rem",
  transition: "transform 200ms ease, box-shadow 200ms ease"
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: "1rem",
  width: "100%",
  maxWidth: 1000,
  marginTop: "1.5rem"
};

const Achievers = () => {
  return (
    <div style={{ ...backgroundStyle, paddingTop: "2rem", paddingBottom: "2rem" }}>
      <div style={{ ...decoCircleStyle, width: 200, height: 200, top: 30, left: 30, background: "#6366f1" }} />
      <div style={{ ...decoCircleStyle, width: 150, height: 150, bottom: 40, right: 60, background: "#f59e42" }} />
      <div style={{ ...decoCircleStyle, width: 100, height: 100, top: 200, right: 120, background: "#10b981" }} />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 1100,
          width: "100%",
          margin: "0 auto",
          padding: "2.5rem",
          background: "rgba(255,255,255,0.92)",
          borderRadius: 16,
          boxShadow: "0 24px 50px rgba(0,0,0,0.08)"
        }}
      >
        <h2 style={{ textAlign: "center", margin: 0, fontSize: "2.25rem", letterSpacing: "0.02em" }}>
          Our Star Achievers
        </h2>
        <p style={{ textAlign: "center", maxWidth: 680, margin: "0.75rem auto 1.75rem", color: "#4b5563" }}>
          Celebrating the hard work and dedication of our students — each achiever is a testament to focused effort and smart guidance.
        </p>

        <div style={gridStyle}>
          {sortedAchievers.map((student) => (
            <div
              key={student.id}
              style={cardStyle}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-6px) scale(1.02)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0) scale(1)")}
            >
              <img
                src={student.image}
                alt={student.name}
                style={{ width: "110px", height: "110px", borderRadius: "50%", objectFit: "cover", marginBottom: "0.75rem", border: "3px solid rgba(99,102,241,0.55)" }}
              />
              <h3 style={{ margin: "0.5rem 0 0.25rem", fontSize: "1.15rem" }}>{student.name}</h3>
              <p style={{ margin: 0, fontSize: "0.95rem", color: "#374151" }}>
                <strong>{student.subjects ? "Subjects" : "Subject"}:</strong> {student.subjects ? student.subjects.join(", ") : student.subject}
              </p>
              <p style={{ margin: "0.25rem 0 0", fontSize: "0.95rem", color: "#374151" }}>
                <strong>Score:</strong> {student.score}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Achievers;
