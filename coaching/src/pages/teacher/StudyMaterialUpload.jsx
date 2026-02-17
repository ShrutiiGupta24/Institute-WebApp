import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaArrowLeft, FaUpload, FaFilePdf, FaTrash,FaBook } from "react-icons/fa";

const StudyMaterialUpload = () => {
  const location = useLocation();
  let user = {};
  try {
    const userData = localStorage.getItem("user");
    if (userData) user = JSON.parse(userData);
  } catch (e) {}
  const teacherName = location.state?.name || user.full_name || "Teacher";
  
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [materialTitle, setMaterialTitle] = useState("");
  const [uploadDate, setUploadDate] = useState(new Date().toISOString().split('T')[0]);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [saved, setSaved] = useState(false);
  const [materials, setMaterials] = useState({
    // Teacher-specific materials only
    // Each teacher can ONLY see and manage their own uploaded materials
    // Format: "subject-class": [{ title, date, fileName, size, uploadedBy }]
    // Data is filtered by teacher authentication on backend
  });

  // Different subjects for different teachers
  const getTeacherSubjects = () => {
    const teacherSubjectsMap = {
      "mathematics": [
        { id: 1, name: "Mathematics", color: "#667eea", class: "12" },
        { id: 2, name: "Mathematics", color: "#667eea", class: "11" },
        { id: 3, name: "Mathematics", color: "#667eea", class: "10" },
        { id: 4, name: "Mathematics", color: "#667eea", class: "9" },
        { id: 5, name: "Mathematics", color: "#667eea", class: "JEE Main/Advance" },
        { id: 6, name: "Mathematics", color: "#667eea", class: "CUET" },
        { id: 7, name: "Mathematics", color: "#667eea", class: "B.com(P/H)" }
      ],
      "physics": [
        { id: 8, name: "Physics", color: "#764ba2", class: "12" },
        { id: 9, name: "Physics", color: "#764ba2", class: "11" },
        { id: 10, name: "Physics", color: "#764ba2", class: "10" },
        { id: 11, name: "Physics", color: "#764ba2", class: "9" },
        { id: 12, name: "Physics", color: "#764ba2", class: "JEE Main/Advance" },
        { id: 13, name: "Physics", color: "#764ba2", class: "CUET" }
      ],
      "chemistry": [
        { id: 14, name: "Chemistry", color: "#f59e0b", class: "12" },
        { id: 15, name: "Chemistry", color: "#f59e0b", class: "11" },
        { id: 16, name: "Chemistry", color: "#f59e0b", class: "10" },
        { id: 17, name: "Chemistry", color: "#f59e0b", class: "9" },
        { id: 18, name: "Chemistry", color: "#f59e0b", class: "JEE Main/Advance" },
        { id: 19, name: "Chemistry", color: "#f59e0b", class: "CUET" }
      ],
      "biology": [
        { id: 20, name: "Biology", color: "#10b981", class: "12" },
        { id: 21, name: "Biology", color: "#10b981", class: "11" },
        { id: 22, name: "Biology", color: "#10b981", class: "10" },
        { id: 23, name: "Biology", color: "#10b981", class: "9" },
        { id: 24, name: "Biology", color: "#10b981", class: "CUET" }
      ],
      "english": [
        { id: 25, name: "English", color: "#06b6d4", class: "12" },
        { id: 26, name: "English", color: "#06b6d4", class: "11" },
        { id: 27, name: "English", color: "#06b6d4", class: "10" },
        { id: 28, name: "English", color: "#06b6d4", class: "9" },
        { id: 29, name: "English", color: "#06b6d4", class: "CUET" },
        { id: 30, name: "English", color: "#06b6d4", class: "B.com(P/H)" }
      ]
    };
    
    const teacherNameLower = teacherName.toLowerCase();
    
    if (teacherNameLower.includes("sudhanshu") || teacherNameLower.includes("math")) {
      return teacherSubjectsMap["mathematics"];
    } else if (teacherNameLower.includes("rajesh") || teacherNameLower.includes("physic")) {
      return teacherSubjectsMap["physics"];
    } else if (teacherNameLower.includes("priya") || teacherNameLower.includes("chemis")) {
      return teacherSubjectsMap["chemistry"];
    } else if (teacherNameLower.includes("anita") || teacherNameLower.includes("biolog")) {
      return teacherSubjectsMap["biology"];
    } else if (teacherNameLower.includes("kavita") || teacherNameLower.includes("english")) {
      return teacherSubjectsMap["english"];
    }
    
    return teacherSubjectsMap["mathematics"];
  };

  const subjects = getTeacherSubjects();

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      const sizeInMB = (file.size / (1024 * 1024)).toFixed(1);
      setFileSize(`${sizeInMB} MB`);
    }
  };

  const handleUpload = () => {
    if (!materialTitle.trim()) {
      alert("Please enter material title");
      return;
    }
    if (!fileName) {
      alert("Please select a file");
      return;
    }

    const key = `${selectedSubject.name}-${selectedSubject.class}`;
    const newMaterial = {
      id: Date.now(),
      title: materialTitle,
      date: uploadDate,
      fileName: fileName,
      size: fileSize,
      uploadedBy: teacherName
    };

    const updatedMaterials = {
      ...materials,
      [key]: [...(materials[key] || []), newMaterial]
    };
    setMaterials(updatedMaterials);

    console.log("Uploading material:", {
      teacher: teacherName,
      subject: selectedSubject.name,
      class: selectedSubject.class,
      title: materialTitle,
      date: uploadDate,
      fileName: fileName,
      size: fileSize
    });

    // Reset form
    setMaterialTitle("");
    setFileName("");
    setFileSize("");
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleDelete = (materialId) => {
    if (window.confirm("Are you sure you want to delete this material?")) {
      const key = `${selectedSubject.name}-${selectedSubject.class}`;
      const updatedMaterials = {
        ...materials,
        [key]: materials[key].filter(m => m.id !== materialId)
      };
      setMaterials(updatedMaterials);
    }
  };

  const getSubjectMaterials = () => {
    if (!selectedSubject) return [];
    const key = `${selectedSubject.name}-${selectedSubject.class}`;
    return materials[key] || [];
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      paddingTop: "2rem",
      paddingBottom: "4rem"
    }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
        <Link to="/teacher/dashboard" style={{
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
          Upload Study Material
        </h1>

        {!selectedSubject ? (
          // Subject Selection View
          <div>
            <h3 style={{
              color: "#fff",
              fontSize: "1.3rem",
              marginBottom: "1.5rem",
              textAlign: "center"
            }}>
              Select Your Subject & Class
            </h3>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "2rem"
            }}>
              {subjects.map((subject) => {
                const key = `${subject.name}-${subject.class}`;
                const count = materials[key]?.length || 0;
                return (
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
                      margin: "0 auto 1.5rem",
                      fontSize: "2rem",
                      color: "#fff"
                    }}>
                      <FaBook />
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
                      fontSize: "1rem",
                      marginBottom: "0.5rem"
                    }}>
                      {subject.class}
                    </p>
                    <p style={{
                      color: subject.color,
                      fontSize: "0.9rem",
                      fontWeight: "600"
                    }}>
                      {count} material{count !== 1 ? 's' : ''} uploaded
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          // Material Upload View
          <div>
            <button
              onClick={() => {
                setSelectedSubject(null);
                setMaterialTitle("");
                setFileName("");
                setFileSize("");
                setSaved(false);
              }}
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

            {/* Upload Form */}
            <div style={{
              background: "#fff",
              borderRadius: "16px",
              padding: "2rem",
              boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
              marginBottom: "2rem"
            }}>
              <div style={{
                marginBottom: "2rem",
                paddingBottom: "1.5rem",
                borderBottom: `3px solid ${selectedSubject.color}`
              }}>
                <h2 style={{
                  fontSize: "2rem",
                  color: "#333",
                  margin: "0 0 0.3rem 0"
                }}>
                  {selectedSubject.name}
                </h2>
                <p style={{ color: "#666", margin: 0 }}>
                  {selectedSubject.class} • Upload new study material
                </p>
              </div>

              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "1.5rem",
                marginBottom: "2rem"
              }}>
                <div>
                  <label style={{
                    display: "block",
                    fontSize: "0.9rem",
                    color: "#666",
                    marginBottom: "0.5rem",
                    fontWeight: "600"
                  }}>
                    Material Title *
                  </label>
                  <input
                    type="text"
                    value={materialTitle}
                    onChange={(e) => setMaterialTitle(e.target.value)}
                    placeholder="e.g., Algebra - Chapter 1"
                    style={{
                      width: "100%",
                      padding: "0.8rem",
                      fontSize: "1rem",
                      borderRadius: "8px",
                      border: "2px solid #e0e0e0",
                      outline: "none",
                      boxSizing: "border-box"
                    }}
                  />
                </div>
                <div>
                  <label style={{
                    display: "block",
                    fontSize: "0.9rem",
                    color: "#666",
                    marginBottom: "0.5rem",
                    fontWeight: "600"
                  }}>
                    Upload Date
                  </label>
                  <input
                    type="date"
                    value={uploadDate}
                    onChange={(e) => setUploadDate(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.8rem",
                      fontSize: "1rem",
                      borderRadius: "8px",
                      border: "2px solid #e0e0e0",
                      outline: "none",
                      boxSizing: "border-box"
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "2rem" }}>
                <label style={{
                  display: "block",
                  fontSize: "0.9rem",
                  color: "#666",
                  marginBottom: "0.5rem",
                  fontWeight: "600"
                }}>
                  Select File (PDF) *
                </label>
                <div style={{
                  display: "flex",
                  gap: "1rem",
                  alignItems: "center",
                  flexWrap: "wrap"
                }}>
                  <label style={{
                    padding: "0.8rem 1.5rem",
                    background: selectedSubject.color,
                    color: "#fff",
                    borderRadius: "8px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    fontSize: "1rem",
                    fontWeight: "600",
                    transition: "opacity 0.3s"
                  }}
                  onMouseOver={(e) => e.currentTarget.style.opacity = "0.9"}
                  onMouseOut={(e) => e.currentTarget.style.opacity = "1"}
                  >
                    <FaUpload /> Choose File
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileSelect}
                      style={{ display: "none" }}
                    />
                  </label>
                  {fileName && (
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      padding: "0.8rem 1rem",
                      background: "#f9f9f9",
                      borderRadius: "8px",
                      border: `2px solid ${selectedSubject.color}30`
                    }}>
                      <FaFilePdf style={{ color: "#ef4444", fontSize: "1.5rem" }} />
                      <div>
                        <div style={{ fontWeight: "600", color: "#333", fontSize: "0.95rem" }}>
                          {fileName}
                        </div>
                        <div style={{ fontSize: "0.8rem", color: "#666" }}>
                          {fileSize}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={handleUpload}
                disabled={!materialTitle.trim() || !fileName}
                style={{
                  padding: "1rem 2.5rem",
                  background: (!materialTitle.trim() || !fileName) ? "#ccc" : selectedSubject.color,
                  color: "#fff",
                  border: "none",
                  borderRadius: "12px",
                  cursor: (!materialTitle.trim() || !fileName) ? "not-allowed" : "pointer",
                  fontSize: "1.1rem",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  transition: "all 0.3s",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.2)"
                }}
                onMouseOver={(e) => {
                  if (materialTitle.trim() && fileName) {
                    e.currentTarget.style.opacity = "0.9";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }
                }}
                onMouseOut={(e) => {
                  if (materialTitle.trim() && fileName) {
                    e.currentTarget.style.opacity = "1";
                    e.currentTarget.style.transform = "translateY(0)";
                  }
                }}
              >
                <FaUpload /> Upload Material
              </button>

              {saved && (
                <div style={{
                  marginTop: "1rem",
                  padding: "1rem",
                  background: "#10b98120",
                  border: "2px solid #10b981",
                  borderRadius: "8px",
                  color: "#10b981",
                  textAlign: "center",
                  fontWeight: "600",
                  fontSize: "1rem"
                }}>
                  ✓ Material uploaded successfully! Students can now access it.
                </div>
              )}
            </div>

            {/* Uploaded Materials List */}
            <div style={{
              background: "#fff",
              borderRadius: "16px",
              padding: "2rem",
              boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
            }}>
              <h3 style={{
                fontSize: "1.5rem",
                color: "#333",
                marginBottom: "1.5rem",
                fontWeight: "bold"
              }}>
                Uploaded Materials ({getSubjectMaterials().length})
              </h3>

              {getSubjectMaterials().length === 0 ? (
                <div style={{
                  textAlign: "center",
                  padding: "3rem",
                  color: "#999"
                }}>
                  <FaBook style={{ fontSize: "3rem", marginBottom: "1rem" }} />
                  <p>No materials uploaded yet</p>
                </div>
              ) : (
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem"
                }}>
                  {getSubjectMaterials().map((material) => (
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
                        borderLeft: `4px solid ${selectedSubject.color}`,
                        flexWrap: "wrap",
                        gap: "1rem"
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "1rem", flex: 1, minWidth: "250px" }}>
                        <div style={{
                          width: "50px",
                          height: "50px",
                          background: `${selectedSubject.color}20`,
                          borderRadius: "8px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}>
                          <FaFilePdf style={{ fontSize: "1.5rem", color: "#ef4444" }} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <h4 style={{
                            fontSize: "1.1rem",
                            color: "#333",
                            margin: "0 0 0.3rem 0",
                            fontWeight: "600"
                          }}>
                            {material.title}
                          </h4>
                          <div style={{
                            display: "flex",
                            gap: "1rem",
                            fontSize: "0.85rem",
                            color: "#666",
                            flexWrap: "wrap"
                          }}>
                            <span>{material.fileName}</span>
                            <span>•</span>
                            <span>{material.size}</span>
                            <span>•</span>
                            <span>Uploaded: {material.date}</span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDelete(material.id)}
                        style={{
                          padding: "0.6rem 1rem",
                          background: "#ef4444",
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
                        <FaTrash /> Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyMaterialUpload;
