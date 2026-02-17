import React, { useState, useEffect } from "react";

const classData = [
  {
    class: "Class 9",
    displayName: "9",
    subjects: ["Mathematics", "Physics", "Chemistry", "Biology", "English"],
    duration: "Full Academic Year",
    timings: "Morning & Evening Batches Available",
    fees: "₹15,000 per year",
    description: "Foundation building with focus on conceptual clarity and problem-solving skills."
  },
  {
    class: "Class 10",
    displayName: "10",
    subjects: ["Mathematics", "Science", "Social Science", "English"],
    duration: "Full Academic Year",
    timings: "Morning & Evening Batches Available",
    fees: "₹18,000 per year",
    description: "Board exam preparation with comprehensive study material and regular tests."
  },
  {
    class: "Class 11",
    displayName: "11",
    subjects: ["Mathematics", "Physics", "Chemistry", "Biology", "Commerce"],
    duration: "Full Academic Year",
    timings: "Morning & Evening Batches Available",
    fees: "₹25,000 per year",
    description: "Advanced concepts for JEE/NEET and board preparation with experienced faculty."
  },
  {
    class: "Class 12",
    displayName: "12",
    subjects: ["Mathematics", "Physics", "Chemistry", "Biology", "Commerce"],
    duration: "Full Academic Year",
    timings: "Morning & Evening Batches Available",
    fees: "₹30,000 per year",
    description: "Intensive board and competitive exam preparation with mock tests and doubt sessions."
  },
  {
    class: "JEE Main/Advance",
    displayName: "JEE",
    subjects: ["Physics", "Chemistry", "Mathematics"],
    duration: "1-2 Years Program",
    timings: "Intensive Daily Classes",
    fees: "₹40,000 per year",
    description: "Specialized coaching for JEE Main and Advanced with expert faculty, regular mock tests, and comprehensive study material."
  },
  {
    class: "CUET",
    displayName: "CUET",
    subjects: ["General Test", "Domain Specific Subjects", "Language"],
    duration: "6 Months - 1 Year",
    timings: "Weekend & Weekday Batches",
    fees: "₹25,000 per year",
    description: "Complete preparation for Common University Entrance Test with focus on aptitude, reasoning, and domain knowledge."
  },
  {
    class: "BCOM(P/H)",
    displayName: "BCOM",
    subjects: ["Accountancy", "Business Studies", "Economics", "Mathematics", "English"],
    duration: "Full Academic Year",
    timings: "Morning & Evening Batches Available",
    fees: "₹20,000 per year",
    description: "Comprehensive commerce education for B.Com (Pass/Hons) students with practical learning and exam-focused approach."
  }
];

const Brochure = () => {
  const [flippedCards, setFlippedCards] = useState({});
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleCardClick = (index) => {
    setFlippedCards(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <div style={{ 
      minHeight: "calc(100vh - 160px)", 
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      paddingTop: "2rem",
      paddingBottom: "2rem",
      width: "100%",
      overflowX: "hidden"
    }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: isMobile ? "1rem" : "3rem", width: "100%" }}>
        <h1 style={{ 
          textAlign: "center", 
          color: "#fff", 
          marginBottom: isMobile ? "2rem" : "3rem",
          fontSize: isMobile ? "2rem" : "2.5rem",
          textShadow: "2px 2px 4px rgba(0,0,0,0.3)"
        }}>
          Our Courses
        </h1>
        
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(280px, 1fr))",
          gap: isMobile ? "2rem" : "3rem",
          padding: isMobile ? "1rem 0" : "2rem",
          width: "100%"
        }}>
          {classData.map((item, index) => (
            <div 
              key={index}
              onClick={() => handleCardClick(index)}
              style={{
                perspective: "1000px",
                cursor: "pointer",
                height: isMobile ? "350px" : "400px",
                width: "100%",
                maxWidth: "100%"
              }}
            >
              <div style={{
                position: "relative",
                width: "100%",
                height: "100%",
                transition: "transform 0.6s",
                transformStyle: "preserve-3d",
                transform: flippedCards[index] ? "rotateY(180deg)" : "rotateY(0deg)"
              }}>
                {/* Front of card */}
                <div style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  backfaceVisibility: "hidden",
                  background: "linear-gradient(135deg, #fff 0%, #f0f0f0 100%)",
                  borderRadius: "16px",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "2rem"
                }}>
                  <div style={{
                    width: "120px",
                    height: "120px",
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "1.5rem",
                    boxShadow: "0 5px 15px rgba(102, 126, 234, 0.4)"
                  }}>
                    <span style={{
                      fontSize: "2.5rem",
                      color: "#fff",
                      fontWeight: "bold"
                    }}>
                      {item.displayName}
                    </span>
                  </div>
                  <h2 style={{
                    fontSize: "1.8rem",
                    color: "#333",
                    marginBottom: "1rem"
                  }}>
                    {item.class}
                  </h2>
                  <p style={{
                    color: "#666",
                    fontSize: "0.9rem",
                    textAlign: "center"
                  }}>
                    Click to see details
                  </p>
                </div>

                {/* Back of card */}
                <div style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  backfaceVisibility: "hidden",
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  borderRadius: "16px",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
                  transform: "rotateY(180deg)",
                  padding: "2rem",
                  color: "#fff",
                  overflowY: "auto"
                }}>
                  <h3 style={{
                    fontSize: "1.5rem",
                    marginBottom: "1rem",
                    borderBottom: "2px solid #fff",
                    paddingBottom: "0.5rem"
                  }}>
                    {item.class}
                  </h3>
                  
                  <p style={{
                    fontSize: "0.9rem",
                    marginBottom: "1rem",
                    lineHeight: "1.5"
                  }}>
                    {item.description}
                  </p>

                  <div style={{ marginBottom: "0.8rem" }}>
                    <strong>Subjects:</strong>
                    <p style={{ fontSize: "0.85rem", marginTop: "0.3rem" }}>
                      {item.subjects.join(", ")}
                    </p>
                  </div>

                  <div style={{ marginBottom: "0.8rem" }}>
                    <strong>Duration:</strong>
                    <p style={{ fontSize: "0.85rem", marginTop: "0.3rem" }}>
                      {item.duration}
                    </p>
                  </div>

                  <div style={{ marginBottom: "0.8rem" }}>
                    <strong>Timings:</strong>
                    <p style={{ fontSize: "0.85rem", marginTop: "0.3rem" }}>
                      {item.timings}
                    </p>
                  </div>

                  <div style={{ marginBottom: "0.8rem" }}>
                    <strong>Fees:</strong>
                    <p style={{ fontSize: "0.85rem", marginTop: "0.3rem" }}>
                      {item.fees}
                    </p>
                  </div>

                  <p style={{
                    fontSize: "0.75rem",
                    marginTop: "1.5rem",
                    opacity: 0.8,
                    textAlign: "center"
                  }}>
                    Click to flip back
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Brochure;
