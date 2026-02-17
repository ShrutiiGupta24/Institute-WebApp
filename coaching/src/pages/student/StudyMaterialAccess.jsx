import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaBook, FaFilePdf, FaDownload, FaEye } from "react-icons/fa";
import api from "../../services/api";

const StudyMaterialAccess = () => {
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudyMaterials = async () => {
      try {
        setLoading(true);
        const response = await api.get("/student/study-materials");
        console.log("Study materials response:", response.data);
        setSubjects(response.data.subjects || []);
      } catch (err) {
        console.error("Error fetching study materials:", err);
        setError("Failed to load study materials");
      } finally {
        setLoading(false);
      }
    };

    fetchStudyMaterials();
  }, []);

  const handleDownload = async (materialId, title) => {
    try {
      const response = await api.get(`/student/study-materials/${materialId}/download`);
      
      // Open file URL in new tab for download
      if (response.data.file_url) {
        window.open(response.data.file_url, '_blank');
      } else {
        alert("Download link not available");
      }
    } catch (err) {
      console.error("Error downloading material:", err);
      alert("Failed to download material");
    }
  };

  const handleView = async (materialId, title) => {
    try {
      const response = await api.get(`/student/study-materials/${materialId}/download`);
      
      // Open file URL in new tab for viewing
      if (response.data.file_url) {
        window.open(response.data.file_url, '_blank');
      } else {
        alert("View link not available");
      }
    } catch (err) {
      console.error("Error viewing material:", err);
      alert("Failed to view material");
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <div style={{ color: "#fff", fontSize: "1.5rem" }}>Loading study materials...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: "1rem"
      }}>
        <div style={{ color: "#fff", fontSize: "1.5rem" }}>{error}</div>
        <Link to="/student/dashboard" style={{
          color: "#fff",
          textDecoration: "underline"
        }}>
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "calc(100vh - 160px)",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      paddingTop: "2rem",
      paddingBottom: "2rem"
    }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
        <Link to="/student/dashboard" style={{
          display: "inline-flex",
          alignItems: "center",
          color: "#fff",
          textDecoration: "none",
          marginBottom: "2rem",
          fontSize: "1rem",
          transition: "opacity 0.3s"
        }}
        onMouseOver={(e) => e.currentTarget.style.opacity = "0.8"}
        onMouseOut={(e) => e.currentTarget.style.opacity = "1"}
        >
          <FaArrowLeft style={{ marginRight: "0.5rem" }} />
          Back to Dashboard
        </Link>

        <h1 style={{
          textAlign: "center",
          color: "#fff",
          marginBottom: "3rem",
          fontSize: "2.5rem",
          textShadow: "2px 2px 4px rgba(0,0,0,0.3)"
        }}>
          Study Material
        </h1>

        {!selectedSubject ? (
          // Subject Selection View
          subjects.length === 0 ? (
            <div style={{
              background: "#fff",
              borderRadius: "16px",
              padding: "3rem",
              textAlign: "center",
              boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
            }}>
              <FaBook style={{ fontSize: "4rem", color: "#667eea", marginBottom: "1rem" }} />
              <h2 style={{ color: "#333", marginBottom: "1rem" }}>No Study Materials Available</h2>
              <p style={{ color: "#666", fontSize: "1rem" }}>
                Study materials will appear here once your teacher uploads them.
              </p>
            </div>
          ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "2rem"
          }}>
            {subjects.map((subject) => (
              <div
                key={subject.id}
                onClick={() => setSelectedSubject(subject)}
                style={{
                  background: "#fff",
                  borderRadius: "16px",
                  padding: "2rem",
                  cursor: "pointer",
                  transition: "all 0.3s",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                  textAlign: "center"
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-10px)";
                  e.currentTarget.style.boxShadow = "0 15px 40px rgba(0,0,0,0.3)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.2)";
                }}
              >
                <div style={{
                  width: "80px",
                  height: "80px",
                  background: `linear-gradient(135deg, ${subject.color}, ${subject.color}dd)`,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1.5rem"
                }}>
                  <FaBook style={{ fontSize: "2rem", color: "#fff" }} />
                </div>
                <h3 style={{
                  fontSize: "1.5rem",
                  color: "#333",
                  marginBottom: "0.5rem"
                }}>
                  {subject.name}
                </h3>
                <p style={{
                  color: "#666",
                  fontSize: "0.95rem"
                }}>
                  {subject.materials.length} materials available
                </p>
              </div>
            ))}
          </div>
          )
        ) : (
          // Materials List View
          <div>
            <button
              onClick={() => setSelectedSubject(null)}
              style={{
                background: "rgba(255,255,255,0.2)",
                color: "#fff",
                border: "none",
                padding: "0.8rem 1.5rem",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "1rem",
                marginBottom: "2rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                transition: "all 0.3s"
              }}
              onMouseOver={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.3)"}
              onMouseOut={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
            >
              <FaArrowLeft /> Back to Subjects
            </button>

            <div style={{
              background: "#fff",
              borderRadius: "16px",
              padding: "2rem",
              boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
            }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                marginBottom: "2rem",
                paddingBottom: "1rem",
                borderBottom: `3px solid ${selectedSubject.color}`
              }}>
                <div style={{
                  width: "60px",
                  height: "60px",
                  background: `linear-gradient(135deg, ${selectedSubject.color}, ${selectedSubject.color}dd)`,
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <FaBook style={{ fontSize: "1.5rem", color: "#fff" }} />
                </div>
                <div>
                  <h2 style={{
                    fontSize: "2rem",
                    color: "#333",
                    margin: 0
                  }}>
                    {selectedSubject.name}
                  </h2>
                  <p style={{ color: "#666", margin: "0.3rem 0 0 0" }}>
                    {selectedSubject.materials.length} study materials
                  </p>
                </div>
              </div>

              <div style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem"
              }}>
                {selectedSubject.materials.map((material) => (
                  <div
                    key={material.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "1.5rem",
                      background: "#f9f9f9",
                      borderRadius: "12px",
                      transition: "all 0.3s",
                      borderLeft: `4px solid ${selectedSubject.color}`
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = "#f0f0f0";
                      e.currentTarget.style.transform = "translateX(5px)";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = "#f9f9f9";
                      e.currentTarget.style.transform = "translateX(0)";
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem", flex: 1 }}>
                      <div style={{
                        width: "50px",
                        height: "50px",
                        background: `${selectedSubject.color}20`,
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}>
                        <FaFilePdf style={{ fontSize: "1.5rem", color: selectedSubject.color }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <h4 style={{
                          fontSize: "1.1rem",
                          color: "#333",
                          margin: "0 0 0.3rem 0"
                        }}>
                          {material.title}
                        </h4>
                        <div style={{
                          display: "flex",
                          gap: "1rem",
                          fontSize: "0.85rem",
                          color: "#666"
                        }}>
                          <span>{material.type}</span>
                          <span>•</span>
                          <span>{material.size}</span>
                          <span>•</span>
                          <span>Uploaded: {material.uploadDate}</span>
                        </div>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button
                        onClick={() => handleView(material.id, material.title)}
                        style={{
                          padding: "0.6rem 1rem",
                          background: `${selectedSubject.color}20`,
                          color: selectedSubject.color,
                          border: "none",
                          borderRadius: "8px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          fontSize: "0.9rem",
                          fontWeight: "600",
                          transition: "all 0.3s"
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.background = selectedSubject.color;
                          e.currentTarget.style.color = "#fff";
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.background = `${selectedSubject.color}20`;
                          e.currentTarget.style.color = selectedSubject.color;
                        }}
                      >
                        <FaEye /> View
                      </button>
                      <button
                        onClick={() => handleDownload(material.id, material.title)}
                        style={{
                          padding: "0.6rem 1rem",
                          background: selectedSubject.color,
                          color: "#fff",
                          border: "none",
                          borderRadius: "8px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          fontSize: "0.9rem",
                          fontWeight: "600",
                          transition: "all 0.3s"
                        }}
                        onMouseOver={(e) => e.currentTarget.style.opacity = "0.9"}
                        onMouseOut={(e) => e.currentTarget.style.opacity = "1"}
                      >
                        <FaDownload /> Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyMaterialAccess;
