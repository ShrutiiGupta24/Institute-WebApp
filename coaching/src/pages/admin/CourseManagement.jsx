import React, { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaArrowLeft,FaClock, FaMoneyBillWave, FaPlus, FaEdit, FaTrash} from "react-icons/fa";
import { getAllCourses, createCourse, updateCourse, deleteCourse } from "../../services/adminService";

const CourseManagement = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const location = useLocation();
  let user = {};
  try {
    const userData = localStorage.getItem("user");
    if (userData) user = JSON.parse(userData);
  } catch (e) {}
  const adminName = location.state?.name || user.full_name || "Admin";
  
  const [selectedClass, setSelectedClass] = useState(null);
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [showEditCourseModal, setShowEditCourseModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  
  // Form state
  const [courseName, setCourseName] = useState("");
  const [courseDuration, setCourseDuration] = useState("");
  const [monthlyFees, setMonthlyFees] = useState("");
  const [yearlyFees, setYearlyFees] = useState("");
  const [courseDescription, setCourseDescription] = useState("");

  // State for fetched data
  const [coursesData, setCoursesData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Define all classes to display
  const allClasses = ["9", "10", "11", "12", "JEE Main/Advance", "CUET", "B.com(P/H)"];

  // Fetch data from API on component mount
  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const coursesRes = await getAllCourses();
      const coursesFromDb = coursesRes.data;
      console.log("Fetched courses from DB:", coursesFromDb);

      // Initialize all classes with empty arrays
      const organizedCourses = {};
      allClasses.forEach(className => {
        organizedCourses[className] = [];
      });
      
      // Group courses by class/category
      coursesFromDb.forEach(course => {
        // Use class_category if available, otherwise try to infer from name
        let className = course.class_category || course.name;
        
        // If no class_category and name doesn't match, try to infer
        if (!course.class_category && !allClasses.includes(className)) {
          const lowerName = course.name.toLowerCase();
          if (lowerName.includes('12') || lowerName.includes('twelve')) {
            className = "12";
          } else if (lowerName.includes('11') || lowerName.includes('eleven')) {
            className = "11";
          } else if (lowerName.includes('10') || lowerName.includes('ten')) {
            className = "10";
          } else if (lowerName.includes('9') || lowerName.includes('nine')) {
            className = "9";
          } else if (lowerName.includes('jee')) {
            className = "JEE Main/Advance";
          } else if (lowerName.includes('cuet')) {
            className = "CUET";
          } else if (lowerName.includes('b.com') || lowerName.includes('bcom') || lowerName.includes('commerce')) {
            className = "B.com(P/H)";
          } else {
            // If no match found, categorize as "Other"
            className = "Other";
          }
        }
        
        if (organizedCourses[className] !== undefined) {
          organizedCourses[className].push({
            id: course.id,
            name: course.name,
            duration: course.duration || "N/A",
            monthlyFees: course.monthly_fees || "N/A",
            yearlyFees: course.yearly_fees || "N/A",
            description: course.description || ""
          });
        }
      });

      console.log("Organized courses:", organizedCourses);
      setCoursesData(organizedCourses);
    } catch (err) {
      console.error("Error fetching course data:", err);
      setError("Failed to load course data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const getClassColor = (className) => {
    const colors = {
      "12": "#667eea",
      "11": "#764ba2",
      "10": "#f59e0b",
      "9": "#10b981",
      "JEE Main/Advance": "#ef4444",
      "CUET": "#06b6d4",
      "B.com(P/H)": "#8b5cf6"
    };
    return colors[className] || "#667eea";
  };

  const getTotalCourses = (className) => {
    return coursesData[className]?.length || 0;
  };

  const handleAddCourse = async () => {
    if (!courseName.trim()) {
      alert("Please enter a course name");
      return;
    }

    try {
      const courseData = {
        name: courseName,
        class_category: selectedClass,  // Use the selected class from the card
        duration: courseDuration || null,
        monthly_fees: monthlyFees || null,
        yearly_fees: yearlyFees || null,
        description: courseDescription || null
      };

      await createCourse(courseData);
      alert("Course added successfully!");
      
      // Refetch data to update UI
      await fetchAllData();
      
      // Close modal and reset form
      setShowAddCourseModal(false);
      setCourseName("");
      setCourseDuration("");
      setMonthlyFees("");
      setYearlyFees("");
      setCourseDescription("");
    } catch (err) {
      console.error("Error adding course:", err);
      alert("Failed to add course. Please try again. " + (err.response?.data?.detail || err.message));
    }
  };

  const handleEditCourse = (course) => {
    setEditingCourse(course);
    setCourseName(course.name);
    setCourseDuration(course.duration);
    setMonthlyFees(course.monthlyFees);
    setYearlyFees(course.yearlyFees);
    setCourseDescription(course.description);
    setShowEditCourseModal(true);
  };

  const handleUpdateCourse = async () => {
    if (!courseName.trim() || !courseDuration.trim() || !monthlyFees.trim() || !yearlyFees.trim()) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const courseData = {
        name: courseName,
        class_category: selectedClass,
        duration: courseDuration,
        monthly_fees: monthlyFees,
        yearly_fees: yearlyFees,
        description: courseDescription
      };

      await updateCourse(editingCourse.id, courseData);
      alert("Course updated successfully!");
      
      // Refetch data to update UI
      await fetchAllData();
      
      // Close modal and reset form
      setShowEditCourseModal(false);
      setEditingCourse(null);
      setCourseName("");
      setCourseDuration("");
      setMonthlyFees("");
      setYearlyFees("");
      setCourseDescription("");
    } catch (err) {
      console.error("Error updating course:", err);
      alert("Failed to update course. Please try again. " + (err.response?.data?.detail || err.message));
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        await deleteCourse(courseId);
        alert("Course deleted successfully!");
        
        // Refetch data to update UI
        await fetchAllData();
      } catch (err) {
        console.error("Error deleting course:", err);
        alert("Failed to delete course. Please try again. " + (err.response?.data?.detail || err.message));
      }
    }
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
      <div style={{ 
        maxWidth: "1400px", 
        margin: "0 auto", 
        padding: isMobile ? "1rem" : "2rem 3rem",
        width: "100%",
        boxSizing: "border-box"
      }}>
        <Link to="/admin/dashboard" state={{ name: adminName }} style={{
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
          fontSize: isMobile ? "1.8rem" : "2.5rem",
          textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
          wordBreak: "break-word"
        }}>
          Course Management
        </h1>

        {/* Loading State */}
        {loading && (
          <div style={{
            textAlign: "center",
            color: "#fff",
            fontSize: "1.2rem",
            padding: "3rem"
          }}>
            <div style={{
              display: "inline-block",
              width: "50px",
              height: "50px",
              border: "5px solid rgba(255,255,255,0.3)",
              borderTop: "5px solid #fff",
              borderRadius: "50%",
              animation: "spin 1s linear infinite"
            }}></div>
            <p style={{ marginTop: "1rem" }}>Loading course data...</p>
            <style>
              {`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}
            </style>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div style={{
            background: "#fff",
            borderRadius: "12px",
            padding: "2rem",
            textAlign: "center",
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
          }}>
            <p style={{ color: "#dc3545", fontSize: "1.1rem", marginBottom: "1rem" }}>
              {error}
            </p>
            <button
              onClick={fetchAllData}
              style={{
                background: "#667eea",
                color: "#fff",
                border: "none",
                padding: "0.75rem 1.5rem",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "1rem"
              }}
            >
              Retry
            </button>
          </div>
        )}

        {/* Main Content */}
        {!loading && !error && !selectedClass ? (
          // Class Selection View
          <div>
            <h3 style={{
              color: "#fff",
              textAlign: "center",
              fontSize: isMobile ? "1.2rem" : "1.5rem",
              marginBottom: "2rem",
              opacity: 0.95
            }}>
              Select a Class to Manage Courses
            </h3>
            <div style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(300px, 1fr))",
              gap: isMobile ? "1.5rem" : "2rem",
              width: "100%",
              boxSizing: "border-box"
            }}>
              {Object.keys(coursesData).map((className) => (
                <div
                  key={className}
                  onClick={() => setSelectedClass(className)}
                  style={{
                    background: "#fff",
                    borderRadius: "16px",
                    padding: isMobile ? "1.5rem" : "2rem",
                    cursor: "pointer",
                    transition: "all 0.3s",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                    textAlign: "center",
                    width: "100%",
                    maxWidth: "100%",
                    boxSizing: "border-box"
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
                    width: "70px",
                    height: "70px",
                    background: `linear-gradient(135deg, ${getClassColor(className)}, ${getClassColor(className)}dd)`,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 1.5rem",
                    fontSize: className.includes("JEE") || className.includes("CUET") || className.includes("B.com") ? "0.7rem" : "1.5rem",
                    color: "#fff",
                    fontWeight: "bold",
                    padding: "0.5rem"
                  }}>
                    {className.includes("B.com") ? "B.COM" : className.includes("JEE") ? "JEE" : className.includes("CUET") ? "CUET" : className}
                  </div>
                  <h3 style={{
                    fontSize: "1.4rem",
                    color: "#333",
                    marginBottom: "1rem"
                  }}>
                    {className.includes("JEE") || className.includes("CUET") || className.includes("B.com") ? className : `Class ${className}`}
                  </h3>
                  <div style={{
                    display: "flex",
                    justifyContent: "center",
                    padding: "1rem 0",
                    borderTop: "2px solid #f0f0f0"
                  }}>
                    <div>
                      <div style={{ fontSize: "1.8rem", fontWeight: "bold", color: getClassColor(className) }}>
                        {getTotalCourses(className)}
                      </div>
                      <div style={{ fontSize: "0.85rem", color: "#666" }}>Courses</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : !loading && !error && selectedClass ? (
          // Course Details View
          <div>
            <button
              onClick={() => setSelectedClass(null)}
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
              <FaArrowLeft /> Back to Classes
            </button>

            <div style={{
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(10px)",
              borderRadius: "16px",
              padding: isMobile ? "1rem" : "1.5rem 2rem",
              marginBottom: "3rem",
              border: "1px solid rgba(255,255,255,0.2)",
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              justifyContent: "space-between",
              alignItems: isMobile ? "stretch" : "center",
              gap: "1rem",
              width: "100%",
              boxSizing: "border-box"
            }}>
              <h2 style={{ 
                color: "#fff", 
                margin: 0, 
                fontSize: isMobile ? "1.5rem" : "2rem",
                textAlign: isMobile ? "center" : "left",
                wordBreak: "break-word"
              }}>
                {selectedClass.includes("JEE") || selectedClass.includes("CUET") || selectedClass.includes("B.com") ? selectedClass : `Class ${selectedClass}`} Courses
              </h2>
              <div style={{ 
                display: "flex", 
                flexDirection: isMobile ? "column" : "row",
                gap: isMobile ? "1rem" : "2rem", 
                alignItems: "center",
                width: isMobile ? "100%" : "auto"
              }}>
                <div style={{ 
                  color: "#fff",
                  textAlign: "center"
                }}>
                  <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{getTotalCourses(selectedClass)}</div>
                  <div style={{ fontSize: "0.9rem", opacity: 0.9 }}>Total Courses</div>
                </div>
                <button
                  onClick={() => setShowAddCourseModal(true)}
                  style={{
                    padding: "0.8rem 1.5rem",
                    background: "#10b981",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "1rem",
                    fontWeight: "600",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    transition: "all 0.3s",
                    width: isMobile ? "100%" : "auto",
                    whiteSpace: "nowrap"
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = "#059669"}
                  onMouseOut={(e) => e.currentTarget.style.background = "#10b981"}
                >
                  <FaPlus /> Add New Course
                </button>
              </div>
            </div>

            {/* Courses Grid */}
            <div style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(350px, 1fr))",
              gap: isMobile ? "1.5rem" : "2rem",
              width: "100%",
              boxSizing: "border-box"
            }}>
              {coursesData[selectedClass].length === 0 ? (
                <div style={{
                  gridColumn: "1 / -1",
                  textAlign: "center",
                  padding: "3rem",
                  color: "#fff",
                  fontSize: "1.2rem"
                }}>
                  No courses found. Click "Add New Course" to create one.
                </div>
              ) : (
                coursesData[selectedClass].map((course) => (
                  <div
                    key={course.id}
                    style={{
                      background: "#fff",
                      borderRadius: "16px",
                      padding: isMobile ? "1.5rem" : "2rem",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                      transition: "all 0.3s",
                      borderTop: `4px solid ${getClassColor(selectedClass)}`,
                      width: "100%",
                      maxWidth: "100%",
                      boxSizing: "border-box"
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = "translateY(-5px)";
                      e.currentTarget.style.boxShadow = "0 15px 40px rgba(0,0,0,0.3)";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.2)";
                    }}
                  >
                    <div style={{ marginBottom: "1.5rem" }}>
                      <h3 style={{
                        fontSize: "1.5rem",
                        color: "#333",
                        margin: "0 0 1rem 0",
                        fontWeight: "bold"
                      }}>
                        {course.name}
                      </h3>
                      <p style={{ color: "#666", fontSize: "0.95rem", lineHeight: "1.6" }}>
                        {course.description}
                      </p>
                    </div>

                    <div style={{ marginBottom: "1.5rem" }}>
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.8rem",
                        marginBottom: "1rem",
                        padding: "0.8rem",
                        background: "#f9f9f9",
                        borderRadius: "8px"
                      }}>
                        <FaClock style={{ color: getClassColor(selectedClass), fontSize: "1.2rem" }} />
                        <div>
                          <div style={{ fontSize: "0.8rem", color: "#666" }}>Duration</div>
                          <div style={{ fontSize: "1rem", fontWeight: "600", color: "#333" }}>{course.duration}</div>
                        </div>
                      </div>

                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.8rem",
                        padding: "0.8rem",
                        background: "#f0fdf4",
                        borderRadius: "8px"
                      }}>
                        <FaMoneyBillWave style={{ color: "#10b981", fontSize: "1.2rem" }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: "0.8rem", color: "#666", marginBottom: "0.3rem" }}>Course Fees</div>
                          <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
                            <div>
                              <div style={{ fontSize: "0.75rem", color: "#666" }}>Monthly</div>
                              <div style={{ fontSize: "1.1rem", fontWeight: "bold", color: "#10b981" }}>{course.monthlyFees}</div>
                            </div>
                            <div style={{ width: "1px", height: "30px", background: "#d0d0d0" }}></div>
                            <div>
                              <div style={{ fontSize: "0.75rem", color: "#666" }}>Yearly</div>
                              <div style={{ fontSize: "1.1rem", fontWeight: "bold", color: "#10b981" }}>{course.yearlyFees}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: "0.8rem" }}>
                      <button
                        onClick={() => handleEditCourse(course)}
                        style={{
                          flex: 1,
                          padding: "0.9rem",
                          background: "#f59e0b",
                          color: "#fff",
                          border: "none",
                          borderRadius: "10px",
                          cursor: "pointer",
                          fontSize: "1rem",
                          fontWeight: "600",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "0.5rem",
                          transition: "all 0.3s"
                        }}
                        onMouseOver={(e) => e.currentTarget.style.opacity = "0.9"}
                        onMouseOut={(e) => e.currentTarget.style.opacity = "1"}
                      >
                        <FaEdit /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteCourse(course.id)}
                        style={{
                          flex: 1,
                          padding: "0.9rem",
                          background: "#ef4444",
                          color: "#fff",
                          border: "none",
                          borderRadius: "10px",
                          cursor: "pointer",
                          fontSize: "1rem",
                          fontWeight: "600",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "0.5rem",
                          transition: "all 0.3s"
                        }}
                        onMouseOver={(e) => e.currentTarget.style.opacity = "0.9"}
                        onMouseOut={(e) => e.currentTarget.style.opacity = "1"}
                      >
                        <FaTrash /> Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : null}

        {/* Add Course Modal */}
        {showAddCourseModal && (
          <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "2rem"
          }}
          onClick={() => setShowAddCourseModal(false)}
          >
            <div
              style={{
                background: "#fff",
                borderRadius: "16px",
                padding: "2.5rem",
                maxWidth: "700px",
                width: "100%",
                maxHeight: "85vh",
                overflow: "auto",
                boxShadow: "0 20px 60px rgba(0,0,0,0.3)"
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 style={{ marginBottom: "2rem", color: "#333", fontSize: "2rem" }}>
                Add New Course - {selectedClass.includes("JEE") || selectedClass.includes("CUET") || selectedClass.includes("B.com") ? selectedClass : `Class ${selectedClass}`}
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#666", marginBottom: "0.5rem", fontWeight: "600" }}>
                    Course Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Mathematics Advanced"
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.9rem",
                      fontSize: "1rem",
                      borderRadius: "8px",
                      border: "2px solid #e0e0e0",
                      outline: "none",
                      boxSizing: "border-box"
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#666", marginBottom: "0.5rem", fontWeight: "600" }}>
                    Duration *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., 12 months"
                    value={courseDuration}
                    onChange={(e) => setCourseDuration(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.9rem",
                      fontSize: "1rem",
                      borderRadius: "8px",
                      border: "2px solid #e0e0e0",
                      outline: "none",
                      boxSizing: "border-box"
                    }}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#666", marginBottom: "0.5rem", fontWeight: "600" }}>
                      Monthly Fees *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., ₹4,000"
                      value={monthlyFees}
                      onChange={(e) => setMonthlyFees(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "0.9rem",
                        fontSize: "1rem",
                        borderRadius: "8px",
                        border: "2px solid #e0e0e0",
                        outline: "none",
                        boxSizing: "border-box"
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#666", marginBottom: "0.5rem", fontWeight: "600" }}>
                      Yearly Fees *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., ₹45,000"
                      value={yearlyFees}
                      onChange={(e) => setYearlyFees(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "0.9rem",
                        fontSize: "1rem",
                        borderRadius: "8px",
                        border: "2px solid #e0e0e0",
                        outline: "none",
                        boxSizing: "border-box"
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#666", marginBottom: "0.5rem", fontWeight: "600" }}>
                    Description
                  </label>
                  <textarea
                    placeholder="Enter course description..."
                    value={courseDescription}
                    onChange={(e) => setCourseDescription(e.target.value)}
                    rows="4"
                    style={{
                      width: "100%",
                      padding: "0.9rem",
                      fontSize: "1rem",
                      borderRadius: "8px",
                      border: "2px solid #e0e0e0",
                      outline: "none",
                      boxSizing: "border-box",
                      fontFamily: "inherit",
                      resize: "vertical"
                    }}
                  />
                </div>

                <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                  <button
                    onClick={handleAddCourse}
                    style={{
                      flex: 1,
                      padding: "1rem",
                      background: getClassColor(selectedClass),
                      color: "#fff",
                      border: "none",
                      borderRadius: "10px",
                      cursor: "pointer",
                      fontSize: "1.1rem",
                      fontWeight: "600",
                      transition: "all 0.3s",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem"
                    }}
                    onMouseOver={(e) => e.currentTarget.style.opacity = "0.9"}
                    onMouseOut={(e) => e.currentTarget.style.opacity = "1"}
                  >
                    <FaPlus /> Add Course
                  </button>
                  <button
                    onClick={() => setShowAddCourseModal(false)}
                    style={{
                      flex: 1,
                      padding: "1rem",
                      background: "#666",
                      color: "#fff",
                      border: "none",
                      borderRadius: "10px",
                      cursor: "pointer",
                      fontSize: "1.1rem",
                      fontWeight: "600",
                      transition: "all 0.3s"
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = "#555"}
                    onMouseOut={(e) => e.currentTarget.style.background = "#666"}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Course Modal */}
        {showEditCourseModal && (
          <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "2rem"
          }}
          onClick={() => setShowEditCourseModal(false)}
          >
            <div
              style={{
                background: "#fff",
                borderRadius: "16px",
                padding: "2.5rem",
                maxWidth: "700px",
                width: "100%",
                maxHeight: "85vh",
                overflow: "auto",
                boxShadow: "0 20px 60px rgba(0,0,0,0.3)"
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 style={{ marginBottom: "2rem", color: "#333", fontSize: "2rem" }}>
                Edit Course Details
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#666", marginBottom: "0.5rem", fontWeight: "600" }}>
                    Course Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Mathematics Advanced"
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.9rem",
                      fontSize: "1rem",
                      borderRadius: "8px",
                      border: "2px solid #e0e0e0",
                      outline: "none",
                      boxSizing: "border-box"
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#666", marginBottom: "0.5rem", fontWeight: "600" }}>
                    Duration *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., 12 months"
                    value={courseDuration}
                    onChange={(e) => setCourseDuration(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.9rem",
                      fontSize: "1rem",
                      borderRadius: "8px",
                      border: "2px solid #e0e0e0",
                      outline: "none",
                      boxSizing: "border-box"
                    }}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#666", marginBottom: "0.5rem", fontWeight: "600" }}>
                      Monthly Fees *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., ₹4,000"
                      value={monthlyFees}
                      onChange={(e) => setMonthlyFees(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "0.9rem",
                        fontSize: "1rem",
                        borderRadius: "8px",
                        border: "2px solid #e0e0e0",
                        outline: "none",
                        boxSizing: "border-box"
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#666", marginBottom: "0.5rem", fontWeight: "600" }}>
                      Yearly Fees *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., ₹45,000"
                      value={yearlyFees}
                      onChange={(e) => setYearlyFees(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "0.9rem",
                        fontSize: "1rem",
                        borderRadius: "8px",
                        border: "2px solid #e0e0e0",
                        outline: "none",
                        boxSizing: "border-box"
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#666", marginBottom: "0.5rem", fontWeight: "600" }}>
                    Description
                  </label>
                  <textarea
                    placeholder="Enter course description..."
                    value={courseDescription}
                    onChange={(e) => setCourseDescription(e.target.value)}
                    rows="4"
                    style={{
                      width: "100%",
                      padding: "0.9rem",
                      fontSize: "1rem",
                      borderRadius: "8px",
                      border: "2px solid #e0e0e0",
                      outline: "none",
                      boxSizing: "border-box",
                      fontFamily: "inherit",
                      resize: "vertical"
                    }}
                  />
                </div>

                <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                  <button
                    onClick={handleUpdateCourse}
                    style={{
                      flex: 1,
                      padding: "1rem",
                      background: "#f59e0b",
                      color: "#fff",
                      border: "none",
                      borderRadius: "10px",
                      cursor: "pointer",
                      fontSize: "1.1rem",
                      fontWeight: "600",
                      transition: "all 0.3s",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem"
                    }}
                    onMouseOver={(e) => e.currentTarget.style.opacity = "0.9"}
                    onMouseOut={(e) => e.currentTarget.style.opacity = "1"}
                  >
                    Update Course
                  </button>
                  <button
                    onClick={() => {
                      setShowEditCourseModal(false);
                      setEditingCourse(null);
                    }}
                    style={{
                      flex: 1,
                      padding: "1rem",
                      background: "#666",
                      color: "#fff",
                      border: "none",
                      borderRadius: "10px",
                      cursor: "pointer",
                      fontSize: "1.1rem",
                      fontWeight: "600",
                      transition: "all 0.3s"
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = "#555"}
                    onMouseOut={(e) => e.currentTarget.style.background = "#666"}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseManagement;
