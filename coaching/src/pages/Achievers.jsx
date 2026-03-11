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
  { id: 1, name: "Aarav Mehta", subject: "Physics", score: "98/100", image: A1 },
  { id: 2, name: "Simran Kaur", subject: "Chemistry", score: "97/100", image: A2 },
  { id: 4, name: "Rohan Gupta", subject: "Mathematics", score: "99/100", image: A4 },
  { id: 5, name: "Priya Sharma", subject: "Biology", score: "98/100", image: A5 },
  { id: 6, name: "Kabir Singh", subject: "English", score: "96/100", image: A6 },
  { id: 7, name: "Ananya Jain", subject: "Computer Science", score: "97/100", image: A7 },
  { id: 8, name: "Vikas Yadav", subject: "Accountancy", score: "99/100", image: A8 },
  { id: 9, name: "Megha Sinha", subject: "Business Studies", score: "98/100", image: A9 },
  { id: 10, name: "Rajat Kumar", subject: "JEE Mathematics", score: "99.5/100", image: A10 },
  { id: 11, name: "Sneha Agarwal", subject: "JEE Physics", score: "99.2/100", image: A11 },
  { id: 12, name: "Amit Joshi", subject: "CUET Economics", score: "98.7/100", image: A12 },
  { id: 13, name: "Riya Kapoor", subject: "CUET English", score: "98.3/100", image: A13 },
  { id: 14, name: "Sahil Verma", subject: "B.Com (P) Finance", score: "97.5/100", image: A14 },
  { id: 15, name: "Nisha Singh", subject: "B.Com (H) Taxation", score: "97.2/100", image: A15 },
  { id: 16, name: "Aniket Rao", subject: "Mathematics", score: "98.9/100", image: A16 },
  { id: 17, name: "Ritika Mehta", subject: "Science", score: "99/100", image: A17 }
];

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
          {achievers.map((student) => (
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
                <strong>Subject:</strong> {student.subject}
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
