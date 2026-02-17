import React, { useState, useEffect, useRef } from "react";

const achieversData = {
  "Class 9": [
    { name: "Aarav Mehta", image: "https://randomuser.me/api/portraits/men/21.jpg", percentage: 98, marks: 490, className: "9" },
    { name: "Simran Kaur", image: "https://randomuser.me/api/portraits/women/22.jpg", percentage: 97, marks: 485, className: "9" }
  ],
  "Class 10": [
    { name: "Rohan Gupta", image: "https://randomuser.me/api/portraits/men/23.jpg", percentage: 99, marks: 495, className: "10" },
    { name: "Priya Sharma", image: "https://randomuser.me/api/portraits/women/24.jpg", percentage: 98, marks: 490, className: "10" }
  ],
  "Class 11": [
    { name: "Kabir Singh", image: "https://randomuser.me/api/portraits/men/25.jpg", percentage: 96, marks: 480, className: "11" },
    { name: "Ananya Jain", image: "https://randomuser.me/api/portraits/women/26.jpg", percentage: 97, marks: 485, className: "11" }
  ],
  "Class 12": [
    { name: "Vikas Yadav", image: "https://randomuser.me/api/portraits/men/27.jpg", percentage: 99, marks: 495, className: "12" },
    { name: "Megha Sinha", image: "https://randomuser.me/api/portraits/women/28.jpg", percentage: 98, marks: 490, className: "12" }
  ],
  "JEE Mains/Advance": [
    { name: "Rajat Kumar", image: "https://randomuser.me/api/portraits/men/29.jpg", percentage: 99.5, marks: 330, className: "JEE Mains" },
    { name: "Sneha Agarwal", image: "https://randomuser.me/api/portraits/women/30.jpg", percentage: 99.2, marks: 325, className: "JEE Advance" }
  ],
  "CUET": [
    { name: "Amit Joshi", image: "https://randomuser.me/api/portraits/men/31.jpg", percentage: 98.7, marks: 790, className: "CUET" },
    { name: "Riya Kapoor", image: "https://randomuser.me/api/portraits/women/32.jpg", percentage: 98.3, marks: 785, className: "CUET" }
  ],
  "B.com(P/H)": [
    { name: "Sahil Verma", image: "https://randomuser.me/api/portraits/men/33.jpg", percentage: 97.5, marks: 680, className: "B.com(P)" },
    { name: "Nisha Singh", image: "https://randomuser.me/api/portraits/women/34.jpg", percentage: 97.2, marks: 675, className: "B.com(H)" }
  ]
};

const categories = Object.keys(achieversData);

const cardStyle = {
  border: "1px solid #ccc",
  borderRadius: "8px",
  padding: "1rem",
  width: "220px",
  minWidth: "220px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  textAlign: "center",
  background: "#fff",
  margin: "0 0.5rem"
};

const sliderStyle = {
  display: "flex",
  overflowX: "auto",
  scrollBehavior: "smooth",
  width: "100%",
  maxWidth: "500px",
  margin: "0 auto"
};

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

const Achievers = () => {
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const students = achieversData[selectedCategory];
  const sliderRef = useRef(null);

  // Auto-scroll effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % students.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [students]);

  // Scroll to the current card
  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.scrollTo({
        left: currentIndex * 230, // 220px card + 10px margin
        behavior: "smooth"
      });
    }
  }, [currentIndex, selectedCategory]);

  const prevStudent = () => setCurrentIndex((prev) => (prev === 0 ? students.length - 1 : prev - 1));
  const nextStudent = () => setCurrentIndex((prev) => (prev === students.length - 1 ? 0 : prev + 1));

  return (
    <div style={{...backgroundStyle, paddingTop: "2rem", paddingBottom: "2rem"}}>
      {/* Decorative circles */}
      <div style={{ ...decoCircleStyle, width: 200, height: 200, top: 30, left: 30, background: "#6366f1" }} />
      <div style={{ ...decoCircleStyle, width: 150, height: 150, bottom: 40, right: 60, background: "#f59e42" }} />
      <div style={{ ...decoCircleStyle, width: 100, height: 100, top: 200, right: 120, background: "#10b981" }} />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 600, width: "100%", margin: "0 auto", padding: "2rem", background: "#f9f9f9", borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
        <h2 style={{ textAlign: "center" }}>Our Achievers</h2>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0.5rem", marginBottom: "1rem" }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => { setSelectedCategory(cat); setCurrentIndex(0); }}
              style={{ padding: "0.4rem 0.8rem", borderRadius: 4, border: cat === selectedCategory ? "2px solid #333" : "1px solid #ccc", background: cat === selectedCategory ? "#333" : "#fff", color: cat === selectedCategory ? "#fff" : "#333", cursor: "pointer", fontWeight: cat === selectedCategory ? "bold" : "normal" }}
            >
              {cat}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
          <button onClick={prevStudent} style={{ fontSize: "1.5rem", background: "none", border: "none", cursor: "pointer" }}>&lt;</button>
          <div ref={sliderRef} style={sliderStyle}>
            {students.map((student, idx) => (
              <div key={idx} style={cardStyle}>
                <img src={student.image} alt={student.name} style={{ width: "100px", height: "100px", borderRadius: "50%", objectFit: "cover", marginBottom: "0.5rem" }} />
                <h3>{student.name}</h3>
                <p><strong>Class:</strong> {student.className}</p>
                <p><strong>Percentage:</strong> {student.percentage}%</p>
                <p><strong>Marks:</strong> {student.marks}</p>
              </div>
            ))}
          </div>
          <button onClick={nextStudent} style={{ fontSize: "1.5rem", background: "none", border: "none", cursor: "pointer" }}>&gt;</button>
        </div>
      </div>
    </div>
  );
};

export default Achievers;
