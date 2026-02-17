import React, { useState, useEffect } from "react";

const AboutUs = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div style={{
      minHeight: "calc(100vh - 160px)",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      paddingTop: "2rem",
      paddingBottom: "2rem",
      paddingLeft: isMobile ? "1rem" : "2rem",
      paddingRight: isMobile ? "1rem" : "2rem",
      width: "100%",
      overflowX: "hidden"
    }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto", width: "100%" }}>
        <h2 style={{ 
          textAlign: "center", 
          color: "#fff", 
          fontSize: isMobile ? "2rem" : "2.5rem",
          marginBottom: "3rem",
          textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
          fontWeight: "700"
        }}>About Us</h2>
      
      <div style={{
        background: "#fff",
        borderRadius: "16px",
        padding: isMobile ? "1.5rem" : "2.5rem",
        boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
        marginBottom: "2rem",
        width: "100%",
        boxSizing: "border-box"
      }}>
        <h3 style={{ color: "#667eea", marginBottom: "1rem", fontSize: isMobile ? "1.5rem" : "1.8rem" }}>Welcome to Coaching Institute!</h3>
        
        <p style={{ lineHeight: "1.8", color: "#333", fontSize: "1.05rem", marginBottom: "1.5rem" }}>
          With 15 years of excellence in education, our institute is dedicated to strengthening the academic foundation of students from Class 9th to 12th. We focus on clear concepts, disciplined learning, and consistent performance to prepare students for board exams and future professional success.
        </p>

        <p style={{ lineHeight: "1.8", color: "#333", fontSize: "1.05rem", marginBottom: "1.5rem" }}>
          The institute is led by Sudhanshu Shekhar Sir, an experienced Mathematics educator with over 30 years of expertise. His effective teaching methods and deep subject knowledge have guided hundreds of students toward successful careers as Engineers, Doctors, Chartered Accountants (CA), and other professionals. He is also a respected author of multiple academic books.
        </p>

        <p style={{ lineHeight: "1.8", color: "#333", fontSize: "1.05rem", marginBottom: "1.5rem" }}>
          Our approach combines conceptual clarity, logical thinking, and personal mentoring to ensure every student gains confidence and mastery in their subjects. Alongside academics, we emphasize discipline, values, and life skills, helping students grow into focused, responsible individuals.
        </p>

        <p style={{ lineHeight: "1.8", color: "#333", fontSize: "1.05rem" }}>
          We provide a supportive and motivating learning environment where students are guided to achieve excellence—academically and beyond.
        </p>
      </div>

      <div style={{ 
        display: "grid", 
        gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(400px, 1fr))", 
        gap: isMobile ? "1.5rem" : "2rem",
        width: "100%"
      }}>
        <div style={{
          background: "#fff",
          borderRadius: "16px",
          padding: isMobile ? "1.5rem" : "2rem",
          boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
          borderTop: "4px solid #667eea",
          width: "100%",
          boxSizing: "border-box"
        }}>
          <h3 style={{ color: "#667eea", marginBottom: "1rem", fontSize: isMobile ? "1.4rem" : "1.6rem" }}>Our Vision</h3>
          <p style={{ lineHeight: "1.8", color: "#333", fontSize: isMobile ? "1rem" : "1.05rem" }}>
            To be a center of excellence in education that empowers students with strong knowledge, confidence, and values, enabling them to succeed as Engineers, Doctors, CAs, and future leaders.
          </p>
        </div>

        <div style={{
          background: "#fff",
          borderRadius: "16px",
          padding: isMobile ? "1.5rem" : "2rem",
          boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
          borderTop: "4px solid #764ba2",
          width: "100%",
          boxSizing: "border-box"
        }}>
          <h3 style={{ color: "#764ba2", marginBottom: "1rem", fontSize: isMobile ? "1.4rem" : "1.6rem" }}>Our Mission</h3>
          <ul style={{ lineHeight: "2", color: "#333", fontSize: isMobile ? "1rem" : "1.05rem", paddingLeft: "1.5rem" }}>
            <li>To build strong academic foundations with clear concepts</li>
            <li>To mentor students with discipline, ethics, and confidence</li>
            <li>To prepare students for academic excellence and competitive careers</li>
            <li>To inspire students to dream big and work consistently toward success</li>
          </ul>
        </div>
      </div>
      </div>
    </div>
  );
};

export default AboutUs;
