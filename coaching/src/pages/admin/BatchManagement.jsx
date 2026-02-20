import React, { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaArrowLeft, FaClock, FaUserGraduate, FaChalkboardTeacher, FaPlus, FaUsers, FaSearch, FaTrash } from "react-icons/fa";
import { getAllBatches, getAllCourses, getAllTeachers, getAllStudents, createBatch, updateBatch, deleteBatch } from "../../services/adminService";
import { useAdminData } from "../../store/adminDataContext";

// Define all classes to display (moved outside component to avoid re-creation on every render)
const ALL_CLASSES = ["9", "10", "11", "12", "JEE Main/Advance", "CUET", "B.com(P/H)"];

const BatchManagement = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const location = useLocation();
  let user = {};
  try {
    const userData = localStorage.getItem("user");
    if (userData) user = JSON.parse(userData);
  } catch (e) {}
  const adminName = location.state?.name || user.full_name || "Admin";
  
  const { refreshBatches } = useAdminData();
  const [selectedClass, setSelectedClass] = useState(null);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [searchStudent, setSearchStudent] = useState("");
  const [showCreateBatchModal, setShowCreateBatchModal] = useState(false);
  const [newStudentName, setNewStudentName] = useState("");
  const [newStudentRoll, setNewStudentRoll] = useState("");
  const [newStudentClass, setNewStudentClass] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [showEditBatchModal, setShowEditBatchModal] = useState(false);
  const [editingBatch, setEditingBatch] = useState(null);
  const [showViewStudentsModal, setShowViewStudentsModal] = useState(false);
  
  // Create batch form state
  const [newBatchName, setNewBatchName] = useState("");
  const [newBatchSubject, setNewBatchSubject] = useState("");
  const [newBatchTeacher, setNewBatchTeacher] = useState("");
  const [newBatchTiming, setNewBatchTiming] = useState("");
  const [newBatchDays, setNewBatchDays] = useState("");
  const [newBatchCapacity, setNewBatchCapacity] = useState(30);

  // State for fetched data
  const [batchesData, setBatchesData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch data from API on component mount
  const fetchAllData = useCallback(async (retryCount = 0) => {
    try {
      setLoading(true);
      setError(null);
      
      // Add a small delay on first load to ensure token is set
      if (retryCount === 0) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      // Fetch all required data with individual error handling
      let batchesRes, coursesRes, teachersRes, studentsRes;
      
      try {
        [batchesRes, coursesRes, teachersRes, studentsRes] = await Promise.all([
          getAllBatches().catch(err => {
            console.error("Error fetching batches:", err);
            return { data: [] };
          }),
          getAllCourses().catch(err => {
            console.error("Error fetching courses:", err);
            return { data: [] };
          }),
          getAllTeachers().catch(err => {
            console.error("Error fetching teachers:", err);
            return { data: [] };
          }),
          getAllStudents().catch(err => {
            console.error("Error fetching students:", err);
            return { data: [] };
          })
        ]);
      } catch (err) {
        console.error("Error in Promise.all:", err);
        throw err;
      }

      // Process batches data and organize by course
      const batches = batchesRes?.data || [];
      const coursesData = coursesRes?.data || [];
      const teachersData = teachersRes?.data || [];
      const studentsData = studentsRes?.data || [];

      setStudents(studentsData);
      setCourses(coursesData);
      setTeachers(teachersData);

      // Initialize all classes with empty arrays
      const organizedBatches = {};
      ALL_CLASSES.forEach(className => {
        organizedBatches[className] = [];
      });
      
      // Fill in batches from database
      batches.forEach(batch => {
        const course = coursesData.find(c => c.id === batch.course_id);
        
        // Extract class from batch code (e.g., "9", "12", etc.)
        // The code field stores the class identifier
        let className = null;
        
        // First try to extract from the code field
        if (batch.code) {
          const codeStr = batch.code.toString();
          // Check if code starts with or is a class number
          if (ALL_CLASSES.includes(codeStr)) {
            className = codeStr;
          } else {
            // Try to extract class from code pattern (e.g., "9-BATCH-A", "CLS9-BATCH-123")
            for (const cls of ALL_CLASSES) {
              if (codeStr.includes(cls) || codeStr.startsWith(cls)) {
                className = cls;
                break;
              }
            }
          }
        }
        
        // If still no match, try to map from course name
        if (!className && course) {
          const courseName = course.name;
          if (ALL_CLASSES.includes(courseName)) {
            className = courseName;
          } else {
            // Try to find matching class from our list
            const lowerCourseName = courseName.toLowerCase();
            if (lowerCourseName.includes('12') || lowerCourseName.includes('twelve')) {
              className = "12";
            } else if (lowerCourseName.includes('11') || lowerCourseName.includes('eleven')) {
              className = "11";
            } else if (lowerCourseName.includes('10') || lowerCourseName.includes('ten')) {
              className = "10";
            } else if (lowerCourseName.includes('9') || lowerCourseName.includes('nine')) {
              className = "9";
            } else if (lowerCourseName.includes('jee')) {
              className = "JEE Main/Advance";
            } else if (lowerCourseName.includes('cuet')) {
              className = "CUET";
            } else if (lowerCourseName.includes('b.com') || lowerCourseName.includes('bcom') || lowerCourseName.includes('commerce')) {
              className = "B.com(P/H)";
            }
          }
        }
        
        // Only add if we have a valid className
        if (className && organizedBatches[className] !== undefined) {
          const teacher = teachersData.find(t => t.id === batch.teacher_id);
          const batchStudents = studentsData.filter(s => s.batch === batch.code);

          organizedBatches[className].push({
            id: batch.id,
            name: batch.name,
            code: batch.code,
            subject: course ? course.name : "N/A",
            teacher: teacher ? teacher.name : "No Teacher Assigned",
            timing: batch.timing || "N/A",
            maxCapacity: batch.max_students,
            days: batch.days || "N/A",
            studentList: batchStudents.map(s => ({
              id: s.id,
              name: s.name,
              rollNo: s.email // Using email as rollNo temporarily
            }))
          });
        }
      });

      setBatchesData(organizedBatches);
    } catch (err) {
      console.error("Error fetching batch data:", err);
      const errorMessage = err.response?.data?.detail 
        || err.message 
        || "Failed to load batch data. Please check your connection and try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchAllData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const classes = ALL_CLASSES;

  const getClassColor = (className) => {
    const colors = {
      "12": "#667eea",
      "11": "#764ba2",
      "10": "#f59e0b",
      "9": "#10b981",
      "JEE Main/Advance": "#ef4444",
      "JEE": "#ef4444",
      "CUET": "#06b6d4",
      "B.com(P/H)": "#8b5cf6",
      "B.com": "#8b5cf6",
      "Commerce": "#8b5cf6",
      "Science": "#667eea",
      "Arts": "#f59e0b"
    };
    return colors[className] || "#667eea";
  };

  const getTotalBatches = (className) => {
    return batchesData[className]?.length || 0;
  };

  const getTotalStudents = (className) => {
    return batchesData[className]?.reduce((sum, batch) => sum + batch.studentList.length, 0) || 0;
  };

  const getUniqueSubjects = (className) => {
    if (!batchesData[className]) return [];
    const subjects = [...new Set(batchesData[className].map(batch => batch.subject))];
    return subjects;
  };

  const handleSubjectFilterChange = (subject) => {
    setSelectedSubjects(prev => {
      if (prev.includes(subject)) {
        return prev.filter(s => s !== subject);
      } else {
        return [...prev, subject];
      }
    });
  };

  const getFilteredBatches = (className) => {
    if (!batchesData[className]) return [];
    if (selectedSubjects.length === 0) return batchesData[className];
    return batchesData[className].filter(batch => selectedSubjects.includes(batch.subject));
  };

  const handleAddStudent = (student) => {
    if (selectedBatch && selectedClass) {
      const batch = batchesData[selectedClass].find(b => b.id === selectedBatch.id);
      if (batch.studentList.length < batch.maxCapacity) {
        const updatedBatches = {
          ...batchesData,
          [selectedClass]: batchesData[selectedClass].map(b =>
            b.id === selectedBatch.id 
              ? { ...b, studentList: [...b.studentList, { id: student.id, name: student.name, rollNo: student.rollNo }] } 
              : b
          )
        };
        setBatchesData(updatedBatches);
        alert("Student added successfully!");
        setShowAddStudentModal(false);
        setSearchStudent("");
        setNewStudentName("");
        setNewStudentRoll("");
        setNewStudentClass("");
      } else {
        alert("Batch is full!");
      }
    }
  };

  const handleAddNewStudent = () => {
    if (!newStudentName.trim() || !newStudentRoll.trim() || !newStudentClass.trim()) {
      alert("Please fill all student details");
      return;
    }
    
    if (selectedBatch && selectedClass) {
      const batch = batchesData[selectedClass].find(b => b.id === selectedBatch.id);
      if (batch.studentList.length < batch.maxCapacity) {
        const newStudent = {
          id: Date.now(),
          name: newStudentName,
          rollNo: newStudentRoll
        };
        const updatedBatches = {
          ...batchesData,
          [selectedClass]: batchesData[selectedClass].map(b =>
            b.id === selectedBatch.id ? { ...b, studentList: [...b.studentList, newStudent] } : b
          )
        };
        setBatchesData(updatedBatches);
        alert(`Student ${newStudentName} added successfully!`);
        setShowAddStudentModal(false);
        setNewStudentName("");
        setNewStudentRoll("");
        setNewStudentClass("");
      } else {
        alert("Batch is full!");
      }
    }
  };

  const handleCreateBatch = async () => {
    if (!newBatchName.trim() || !newBatchSubject.trim() || !newBatchTeacher.trim()) {
      alert("Please fill all required batch details");
      return;
    }

    try {
      // Find course_id based on subject name (not selectedClass)
      const course = courses.find(c => c.name.toLowerCase() === newBatchSubject.toLowerCase());
      
      if (!course) {
        alert(`Course "${newBatchSubject}" not found. Please create a course with this name in Course Management for Class ${selectedClass}.`);
        return;
      }
      
      // Verify the course belongs to the selected class
      if (course.class_category && course.class_category !== selectedClass) {
        alert(`Course "${newBatchSubject}" belongs to Class ${course.class_category}, not Class ${selectedClass}. Please select a course for Class ${selectedClass}.`);
        return;
      }

      // Find teacher_id based on teacher name
      const teacher = teachers.find(t => t.name.toLowerCase().includes(newBatchTeacher.toLowerCase()));
      
      if (!teacher) {
        alert(`Teacher "${newBatchTeacher}" not found. Please select an existing teacher or add them in Teacher Management first.`);
        return;
      }

      const batchData = {
        name: newBatchName,
        code: selectedClass,  // Use selectedClass directly as code (e.g., "9", "10", "11", "12")
        course_id: course.id,
        teacher_id: teacher.id,
        timing: newBatchTiming,
        days: newBatchDays,
        max_students: newBatchCapacity
      };

      await createBatch(batchData);
      alert("Batch created successfully!");
      
      // Refetch data to update UI
      await fetchAllData();
      if (refreshBatches) {
        try {
          await refreshBatches();
        } catch (refreshErr) {
          console.warn("Failed to refresh global batches:", refreshErr);
        }
      }
      
      // Close modal and reset form
      setShowCreateBatchModal(false);
      setNewBatchName("");
      setNewBatchSubject("");
      setNewBatchTeacher("");
      setNewBatchTiming("");
      setNewBatchDays("");
      setNewBatchCapacity(30);
    } catch (err) {
      console.error("Error creating batch:", err);
      const errorMessage = err.response?.data?.detail || err.message || "Failed to create batch";
      alert(errorMessage);
    }
  };

  const handleEditBatch = (batch) => {
    setEditingBatch(batch);
    setNewBatchName(batch.name);
    setNewBatchSubject(batch.subject);
    setNewBatchTeacher(batch.teacher);
    setNewBatchTiming(batch.timing);
    setNewBatchDays(batch.days);
    setNewBatchCapacity(batch.maxCapacity);
    setShowEditBatchModal(true);
  };

  const handleUpdateBatch = async () => {
    if (!newBatchName.trim() || !newBatchSubject.trim() || !newBatchTeacher.trim() || 
        !newBatchTiming.trim() || !newBatchDays.trim()) {
      alert("Please fill all batch details");
      return;
    }

    try {
      // Find course and teacher IDs
      const course = courses.find(c => c.name === newBatchSubject);
      const teacher = teachers.find(t => t.name === newBatchTeacher);

      if (!course) {
        alert("Course not found");
        return;
      }

      const batchData = {
        name: newBatchName,
        code: selectedClass,
        course_id: course.id,
        teacher_id: teacher?.id || null,
        timing: newBatchTiming,
        days: newBatchDays,
        max_students: newBatchCapacity
      };

      await updateBatch(editingBatch.id, batchData);
      alert("Batch updated successfully!");
      
      // Refetch data to update UI
      await fetchAllData();
      if (refreshBatches) {
        try {
          await refreshBatches();
        } catch (refreshErr) {
          console.warn("Failed to refresh global batches:", refreshErr);
        }
      }
      
      // Close modal and reset form
      setShowEditBatchModal(false);
      setEditingBatch(null);
      setNewBatchName("");
      setNewBatchSubject("");
      setNewBatchTeacher("");
      setNewBatchTiming("");
      setNewBatchDays("");
      setNewBatchCapacity(30);
    } catch (err) {
      console.error("Error updating batch:", err);
      const errorMessage = err.response?.data?.detail || err.message || "Failed to update batch";
      alert(errorMessage);
    }
  };

  const handleDeleteBatch = async (batch) => {
    const confirmMessage = `Are you sure you want to drop "${batch.name}"?\n\nThis will permanently delete the batch. This action cannot be undone.`;
    
    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      await deleteBatch(batch.id);
      alert("Batch deleted successfully!");
      
      // Refetch data to update UI
      await fetchAllData();
      if (refreshBatches) {
        try {
          await refreshBatches();
        } catch (refreshErr) {
          console.warn("Failed to refresh global batches:", refreshErr);
        }
      }
    } catch (err) {
      console.error("Error deleting batch:", err);
      alert("Failed to delete batch. Please try again. " + (err.response?.data?.detail || err.message));
    }
  };

  const handleViewStudents = (batch) => {
    setSelectedBatch(batch);
    setShowViewStudentsModal(true);
  };

  const handleRemoveStudent = (studentId) => {
    if (window.confirm("Are you sure you want to remove this student from the batch?")) {
      const updatedBatches = {
        ...batchesData,
        [selectedClass]: batchesData[selectedClass].map(b =>
          b.id === selectedBatch.id 
            ? { ...b, studentList: b.studentList.filter(s => s.id !== studentId) } 
            : b
        )
      };
      setBatchesData(updatedBatches);
      setSelectedBatch({
        ...selectedBatch,
        studentList: selectedBatch.studentList.filter(s => s.id !== studentId)
      });
      alert("Student removed successfully!");
    }
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchStudent.toLowerCase()) ||
    student.email.toLowerCase().includes(searchStudent.toLowerCase())
  );

  return (
    <div style={{
      minHeight: "calc(100vh - 160px)",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      paddingTop: "2rem",
      paddingBottom: "2rem"
    }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "2rem 3rem" }}>
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
          fontSize: "2.5rem",
          textShadow: "2px 2px 4px rgba(0,0,0,0.3)"
        }}>
          Batch Management
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
            <p style={{ marginTop: "1rem" }}>Loading batch data...</p>
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
        {!loading && !error && (
          <div>
            {!selectedClass ? (
              // Class Selection View
              <div>
                <h3 style={{
                  color: "#fff",
                  fontSize: "1.3rem",
                  marginBottom: "2rem",
                  textAlign: "center"
                }}>
                  Select Class to View Batches
                </h3>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: "2rem"
                }}>
                  {classes.map((className) => (
                <div
                  key={className}
                  onClick={() => setSelectedClass(className)}
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
                    justifyContent: "space-around",
                    padding: "1rem 0",
                    borderTop: "2px solid #f0f0f0"
                  }}>
                    <div>
                      <div style={{ fontSize: "1.8rem", fontWeight: "bold", color: getClassColor(className) }}>
                        {getTotalBatches(className)}
                      </div>
                      <div style={{ fontSize: "0.85rem", color: "#666" }}>Batches</div>
                    </div>
                    <div>
                      <div style={{ fontSize: "1.8rem", fontWeight: "bold", color: getClassColor(className) }}>
                        {getTotalStudents(className)}
                      </div>
                      <div style={{ fontSize: "0.85rem", color: "#666" }}>Students</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          // Batch Details View
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
                {selectedClass.includes("JEE") || selectedClass.includes("CUET") || selectedClass.includes("B.com") ? selectedClass : `Class ${selectedClass}`} Batches
              </h2>
              <div style={{ 
                display: "flex", 
                flexDirection: isMobile ? "column" : "row",
                gap: isMobile ? "1rem" : "2rem", 
                alignItems: isMobile ? "stretch" : "center",
                width: isMobile ? "100%" : "auto"
              }}>
                <div style={{ 
                  display: "flex",
                  justifyContent: "space-around",
                  gap: "2rem",
                  color: "#fff",
                  flexWrap: "wrap"
                }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{getTotalBatches(selectedClass)}</div>
                    <div style={{ fontSize: "0.9rem", opacity: 0.9 }}>Total Batches</div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{getTotalStudents(selectedClass)}</div>
                    <div style={{ fontSize: "0.9rem", opacity: 0.9 }}>Total Students</div>
                  </div>
                </div>
                <button
                  onClick={() => setShowCreateBatchModal(true)}
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
                  <FaPlus /> Create New Batch
                </button>
              </div>
            </div>

            <div style={{ display: "flex", gap: "2rem", flexDirection: isMobile ? "column" : "row" }}>
              {/* Batches Grid */}
              <div style={{
                flex: 1,
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(350px, 1fr))",
                gap: isMobile ? "1.5rem" : "2rem",
                width: "100%",
                boxSizing: "border-box"
              }}>
                {getFilteredBatches(selectedClass).length === 0 ? (
                  <div style={{
                    gridColumn: "1 / -1",
                    textAlign: "center",
                    padding: "3rem",
                    color: "#fff",
                    fontSize: "1.2rem"
                  }}>
                    No batches found for selected filters
                  </div>
                ) : (
                  getFilteredBatches(selectedClass).map((batch) => (
                <div
                  key={batch.id}
                  style={{
                    background: "#fff",
                    borderRadius: "16px",
                    padding: "2rem",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                    transition: "all 0.3s",
                    borderTop: `4px solid ${getClassColor(selectedClass)}`
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
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                      <h3 style={{
                        fontSize: "1.5rem",
                        color: "#333",
                        margin: 0,
                        fontWeight: "bold"
                      }}>
                        {batch.name}
                      </h3>
                      <div style={{
                        padding: "0.3rem 0.8rem",
                        background: `${getClassColor(selectedClass)}20`,
                        color: getClassColor(selectedClass),
                        borderRadius: "20px",
                        fontSize: "0.85rem",
                        fontWeight: "600"
                      }}>
                        {batch.subject}
                      </div>
                    </div>
                    <p style={{ color: "#999", fontSize: "0.9rem", margin: "0.3rem 0" }}>{batch.days}</p>
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
                        <div style={{ fontSize: "0.8rem", color: "#666" }}>Timing</div>
                        <div style={{ fontSize: "1rem", fontWeight: "600", color: "#333" }}>{batch.timing}</div>
                      </div>
                    </div>

                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.8rem",
                      padding: "0.8rem",
                      background: "#f9f9f9",
                      borderRadius: "8px"
                    }}>
                      <FaChalkboardTeacher style={{ color: getClassColor(selectedClass), fontSize: "1.2rem" }} />
                      <div>
                        <div style={{ fontSize: "0.8rem", color: "#666" }}>Teacher</div>
                        <div style={{ fontSize: "1rem", fontWeight: "600", color: "#333" }}>{batch.teacher}</div>
                      </div>
                    </div>
                  </div>

                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "1rem",
                    background: batch.studentList.length >= batch.maxCapacity ? "#fef2f2" : "#f0fdf4",
                    borderRadius: "8px",
                    marginBottom: "1rem"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <FaUsers style={{ color: batch.studentList.length >= batch.maxCapacity ? "#ef4444" : "#10b981", fontSize: "1.3rem" }} />
                      <div>
                        <div style={{ fontSize: "0.8rem", color: "#666" }}>Batch Size</div>
                        <div style={{ fontSize: "1.3rem", fontWeight: "bold", color: batch.studentList.length >= batch.maxCapacity ? "#ef4444" : "#10b981" }}>
                          {batch.studentList.length} / {batch.maxCapacity}
                        </div>
                      </div>
                    </div>
                    <div style={{
                      padding: "0.4rem 1rem",
                      background: batch.studentList.length >= batch.maxCapacity ? "#ef4444" : "#10b981",
                      color: "#fff",
                      borderRadius: "20px",
                      fontSize: "0.85rem",
                      fontWeight: "600"
                    }}>
                      {batch.studentList.length >= batch.maxCapacity ? "FULL" : `${batch.maxCapacity - batch.studentList.length} Seats Left`}
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "0.8rem", marginBottom: "1rem" }}>
                    <button
                      onClick={() => handleViewStudents(batch)}
                      style={{
                        flex: 1,
                        padding: "0.9rem",
                        background: "#06b6d4",
                        color: "#fff",
                        border: "none",
                        borderRadius: "10px",
                        cursor: "pointer",
                        fontSize: "0.95rem",
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
                      <FaUsers /> View Students ({batch.studentList.length})
                    </button>
                    <button
                      onClick={() => handleEditBatch(batch)}
                      style={{
                        flex: 1,
                        padding: "0.9rem",
                        background: "#f59e0b",
                        color: "#fff",
                        border: "none",
                        borderRadius: "10px",
                        cursor: "pointer",
                        fontSize: "0.95rem",
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
                      <FaSearch /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteBatch(batch)}
                      style={{
                        padding: "0.9rem",
                        background: "#ef4444",
                        color: "#fff",
                        border: "none",
                        borderRadius: "10px",
                        cursor: "pointer",
                        fontSize: "0.95rem",
                        fontWeight: "600",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.5rem",
                        transition: "all 0.3s",
                        minWidth: "45px"
                      }}
                      onMouseOver={(e) => e.currentTarget.style.background = "#dc2626"}
                      onMouseOut={(e) => e.currentTarget.style.background = "#ef4444"}
                      title="Drop Batch"
                    >
                      <FaTrash />
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedBatch(batch);
                      setShowAddStudentModal(true);
                    }}
                    disabled={batch.studentList.length >= batch.maxCapacity}
                    style={{
                      width: "100%",
                      padding: "0.9rem",
                      background: batch.studentList.length >= batch.maxCapacity ? "#ccc" : getClassColor(selectedClass),
                      color: "#fff",
                      border: "none",
                      borderRadius: "10px",
                      cursor: batch.studentList.length >= batch.maxCapacity ? "not-allowed" : "pointer",
                      fontSize: "1rem",
                      fontWeight: "600",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                      transition: "all 0.3s"
                    }}
                    onMouseOver={(e) => {
                      if (batch.studentList.length < batch.maxCapacity) {
                        e.currentTarget.style.opacity = "0.9";
                      }
                    }}
                    onMouseOut={(e) => {
                      if (batch.studentList.length < batch.maxCapacity) {
                        e.currentTarget.style.opacity = "1";
                      }
                    }}
                  >
                    <FaPlus /> Add Student to Batch
                  </button>
                </div>
              )))
            }
            </div>

            {/* Subject Filter Sidebar */}
            <div style={{
              width: "280px",
              flexShrink: 0
            }}>
              <div style={{
                background: "#fff",
                borderRadius: "16px",
                padding: "1.5rem",
                boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                position: "sticky",
                top: "8rem"
              }}>
                <h3 style={{
                  fontSize: "1.2rem",
                  color: "#333",
                  marginBottom: "1.5rem",
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem"
                }}>
                  <FaSearch /> Filter by Subject
                </h3>

                {getUniqueSubjects(selectedClass).length === 0 ? (
                  <div style={{ color: "#999", fontSize: "0.9rem", textAlign: "center", padding: "1rem" }}>
                    No subjects available
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                    {getUniqueSubjects(selectedClass).map((subject) => {
                      const isSelected = selectedSubjects.includes(subject);
                      const batchCount = batchesData[selectedClass].filter(b => b.subject === subject).length;
                      
                      return (
                        <label
                          key={subject}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.8rem",
                            padding: "0.8rem",
                            background: isSelected ? `${getClassColor(selectedClass)}15` : "#f9f9f9",
                            borderRadius: "8px",
                            cursor: "pointer",
                            transition: "all 0.3s",
                            border: `2px solid ${isSelected ? getClassColor(selectedClass) : "transparent"}`
                          }}
                          onMouseOver={(e) => {
                            if (!isSelected) {
                              e.currentTarget.style.background = "#f0f0f0";
                            }
                          }}
                          onMouseOut={(e) => {
                            if (!isSelected) {
                              e.currentTarget.style.background = "#f9f9f9";
                            }
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSubjectFilterChange(subject)}
                            style={{
                              width: "18px",
                              height: "18px",
                              cursor: "pointer",
                              accentColor: getClassColor(selectedClass)
                            }}
                          />
                          <div style={{ flex: 1 }}>
                            <div style={{
                              fontWeight: "600",
                              color: isSelected ? getClassColor(selectedClass) : "#333",
                              fontSize: "0.95rem"
                            }}>
                              {subject}
                            </div>
                            <div style={{
                              fontSize: "0.8rem",
                              color: "#999",
                              marginTop: "0.2rem"
                            }}>
                              {batchCount} batch{batchCount !== 1 ? 'es' : ''}
                            </div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                )}

                {selectedSubjects.length > 0 && (
                  <button
                    onClick={() => setSelectedSubjects([])}
                    style={{
                      width: "100%",
                      marginTop: "1rem",
                      padding: "0.7rem",
                      background: "#ef4444",
                      color: "#fff",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontSize: "0.9rem",
                      fontWeight: "600",
                      transition: "all 0.3s"
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = "#dc2626"}
                    onMouseOut={(e) => e.currentTarget.style.background = "#ef4444"}
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </div>
          </div>
          </div>
            )}

            {/* Add Student Modal */}
            {showAddStudentModal && (
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
          onClick={() => {
            setShowAddStudentModal(false);
            setSearchStudent("");
          }}
          >
            <div
              style={{
                background: "#fff",
                borderRadius: "16px",
                padding: "2rem",
                maxWidth: "600px",
                width: "100%",
                maxHeight: "80vh",
                overflow: "auto",
                boxShadow: "0 20px 60px rgba(0,0,0,0.3)"
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 style={{ marginBottom: "1.5rem", color: "#333" }}>
                Add Student to {selectedBatch?.name}
              </h2>

              {/* Manual Entry Section */}
              <div style={{
                background: "#f9f9f9",
                padding: "1.5rem",
                borderRadius: "12px",
                marginBottom: "2rem",
                border: "2px solid #10b981"
              }}>
                <h3 style={{ fontSize: "1.1rem", color: "#333", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <FaPlus style={{ color: "#10b981" }} /> Add New Student
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#666", marginBottom: "0.5rem", fontWeight: "600" }}>
                      Student Name *
                    </label>
                    <input
                      type="text"
                      placeholder="Enter student name"
                      value={newStudentName}
                      onChange={(e) => setNewStudentName(e.target.value)}
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
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.9rem", color: "#666", marginBottom: "0.5rem", fontWeight: "600" }}>
                        Roll Number *
                      </label>
                      <input
                        type="text"
                        placeholder="Roll no."
                        value={newStudentRoll}
                        onChange={(e) => setNewStudentRoll(e.target.value)}
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
                      <label style={{ display: "block", fontSize: "0.9rem", color: "#666", marginBottom: "0.5rem", fontWeight: "600" }}>
                        Class *
                      </label>
                      <input
                        type="text"
                        placeholder="Class"
                        value={newStudentClass}
                        onChange={(e) => setNewStudentClass(e.target.value)}
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
                  <button
                    onClick={handleAddNewStudent}
                    style={{
                      padding: "0.9rem",
                      background: "#10b981",
                      color: "#fff",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontSize: "1rem",
                      fontWeight: "600",
                      transition: "all 0.3s",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem"
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = "#059669"}
                    onMouseOut={(e) => e.currentTarget.style.background = "#10b981"}
                  >
                    <FaPlus /> Add Student
                  </button>
                </div>
              </div>

              <div style={{
                borderTop: "2px solid #e0e0e0",
                paddingTop: "2rem",
                marginBottom: "1rem"
              }}>
                <h3 style={{ fontSize: "1.1rem", color: "#666", marginBottom: "1rem" }}>
                  Or Select from Existing Students
                </h3>
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "0.8rem",
                  border: "2px solid #e0e0e0",
                  borderRadius: "8px",
                  gap: "0.5rem"
                }}>
                  <FaSearch style={{ color: "#999" }} />
                  <input
                    type="text"
                    placeholder="Search by name or roll number..."
                    value={searchStudent}
                    onChange={(e) => setSearchStudent(e.target.value)}
                    style={{
                      flex: 1,
                      border: "none",
                      outline: "none",
                      fontSize: "1rem"
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <h3 style={{ fontSize: "1.1rem", color: "#666", marginBottom: "1rem" }}>
                  Available Students ({filteredStudents.length})
                </h3>
                {filteredStudents.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "2rem", color: "#999" }}>
                    No students found
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                    {filteredStudents.map((student) => (
                      <div
                        key={student.id}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "1rem",
                          background: "#f9f9f9",
                          borderRadius: "8px",
                          transition: "all 0.3s"
                        }}
                        onMouseOver={(e) => e.currentTarget.style.background = "#f0f0f0"}
                        onMouseOut={(e) => e.currentTarget.style.background = "#f9f9f9"}
                      >
                        <div>
                          <div style={{ fontWeight: "600", color: "#333", marginBottom: "0.3rem" }}>
                            {student.name}
                          </div>
                          <div style={{ fontSize: "0.85rem", color: "#666" }}>
                            Roll No: {student.rollNo} • Class: {student.currentClass}
                          </div>
                        </div>
                        <button
                          onClick={() => handleAddStudent(student)}
                          style={{
                            padding: "0.5rem 1rem",
                            background: getClassColor(selectedClass),
                            color: "#fff",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontSize: "0.9rem",
                            fontWeight: "600",
                            transition: "all 0.3s"
                          }}
                          onMouseOver={(e) => e.currentTarget.style.opacity = "0.9"}
                          onMouseOut={(e) => e.currentTarget.style.opacity = "1"}
                        >
                          Add
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => {
                  setShowAddStudentModal(false);
                  setSearchStudent("");
                }}
                style={{
                  width: "100%",
                  padding: "0.9rem",
                  background: "#666",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "1rem",
                  fontWeight: "600",
                  marginTop: "1rem",
                  transition: "all 0.3s"
                }}
                onMouseOver={(e) => e.currentTarget.style.background = "#555"}
                onMouseOut={(e) => e.currentTarget.style.background = "#666"}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Create Batch Modal */}
        {showCreateBatchModal && (
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
          onClick={() => setShowCreateBatchModal(false)}
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
                Create New Batch - {selectedClass.includes("JEE") || selectedClass.includes("CUET") || selectedClass.includes("B.com") ? selectedClass : `Class ${selectedClass}`}
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#666", marginBottom: "0.5rem", fontWeight: "600" }}>
                      Batch Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Batch A"
                      value={newBatchName}
                      onChange={(e) => setNewBatchName(e.target.value)}
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
                      Subject *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Mathematics"
                      value={newBatchSubject}
                      onChange={(e) => setNewBatchSubject(e.target.value)}
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
                    Assign Teacher *
                  </label>
                  <select
                    value={newBatchTeacher}
                    onChange={(e) => setNewBatchTeacher(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.9rem",
                      fontSize: "1rem",
                      borderRadius: "8px",
                      border: "2px solid #e0e0e0",
                      outline: "none",
                      boxSizing: "border-box",
                      cursor: "pointer",
                      background: "#fff"
                    }}
                  >
                    <option value="">-- Select Teacher --</option>
                    {teachers.map(teacher => (
                      <option key={teacher.id} value={teacher.name}>
                        {teacher.name} ({teacher.subject || 'N/A'})
                      </option>
                    ))}
                  </select>
                  {teachers.length === 0 && (
                    <div style={{ marginTop: "0.5rem", fontSize: "0.85rem", color: "#f59e0b" }}>
                      No teachers available. Please add teachers first.
                    </div>
                  )}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#666", marginBottom: "0.5rem", fontWeight: "600" }}>
                      Timing *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., 8:00 AM - 10:00 AM"
                      value={newBatchTiming}
                      onChange={(e) => setNewBatchTiming(e.target.value)}
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
                      Days *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Mon, Wed, Fri"
                      value={newBatchDays}
                      onChange={(e) => setNewBatchDays(e.target.value)}
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
                    Maximum Capacity *
                  </label>
                  <input
                    type="number"
                    placeholder="30"
                    value={newBatchCapacity}
                    onChange={(e) => setNewBatchCapacity(parseInt(e.target.value) || 30)}
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

                <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                  <button
                    onClick={handleCreateBatch}
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
                    <FaPlus /> Create Batch
                  </button>
                  <button
                    onClick={() => setShowCreateBatchModal(false)}
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

        {/* Edit Batch Modal */}
        {showEditBatchModal && (
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
          onClick={() => setShowEditBatchModal(false)}
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
                Edit Batch Details
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#666", marginBottom: "0.5rem", fontWeight: "600" }}>
                      Batch Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Batch A"
                      value={newBatchName}
                      onChange={(e) => setNewBatchName(e.target.value)}
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
                      Subject *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Mathematics"
                      value={newBatchSubject}
                      onChange={(e) => setNewBatchSubject(e.target.value)}
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
                    Assign Teacher *
                  </label>
                  <select
                    value={newBatchTeacher}
                    onChange={(e) => setNewBatchTeacher(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.9rem",
                      fontSize: "1rem",
                      borderRadius: "8px",
                      border: "2px solid #e0e0e0",
                      outline: "none",
                      boxSizing: "border-box",
                      cursor: "pointer",
                      background: "#fff"
                    }}
                  >
                    <option value="">-- Select Teacher --</option>
                    {teachers.map(teacher => (
                      <option key={teacher.id} value={teacher.name}>
                        {teacher.name} ({teacher.subject || 'N/A'})
                      </option>
                    ))}
                  </select>
                  {teachers.length === 0 && (
                    <div style={{ marginTop: "0.5rem", fontSize: "0.85rem", color: "#f59e0b" }}>
                      No teachers available. Please add teachers first.
                    </div>
                  )}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#666", marginBottom: "0.5rem", fontWeight: "600" }}>
                      Timing *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., 8:00 AM - 10:00 AM"
                      value={newBatchTiming}
                      onChange={(e) => setNewBatchTiming(e.target.value)}
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
                      Days *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Mon, Wed, Fri"
                      value={newBatchDays}
                      onChange={(e) => setNewBatchDays(e.target.value)}
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
                    Maximum Capacity *
                  </label>
                  <input
                    type="number"
                    placeholder="30"
                    value={newBatchCapacity}
                    onChange={(e) => setNewBatchCapacity(parseInt(e.target.value) || 30)}
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

                <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                  <button
                    onClick={handleUpdateBatch}
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
                    Update Batch
                  </button>
                  <button
                    onClick={() => {
                      setShowEditBatchModal(false);
                      setEditingBatch(null);
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

        {/* View Students Modal */}
        {showViewStudentsModal && (
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
          onClick={() => setShowViewStudentsModal(false)}
          >
            <div
              style={{
                background: "#fff",
                borderRadius: "16px",
                padding: "2.5rem",
                maxWidth: "800px",
                width: "100%",
                maxHeight: "85vh",
                overflow: "auto",
                boxShadow: "0 20px 60px rgba(0,0,0,0.3)"
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ marginBottom: "2rem" }}>
                <h2 style={{ color: "#333", fontSize: "2rem", marginBottom: "0.5rem" }}>
                  Students in {selectedBatch?.name}
                </h2>
                <div style={{ display: "flex", gap: "1rem", color: "#666", fontSize: "0.95rem" }}>
                  <span>Subject: <strong>{selectedBatch?.subject}</strong></span>
                  <span>•</span>
                  <span>Teacher: <strong>{selectedBatch?.teacher}</strong></span>
                  <span>•</span>
                  <span>Timing: <strong>{selectedBatch?.timing}</strong></span>
                </div>
              </div>

              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "1rem",
                background: selectedBatch?.studentList.length >= selectedBatch?.maxCapacity ? "#fef2f2" : "#f0fdf4",
                borderRadius: "10px",
                marginBottom: "2rem"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
                  <FaUsers style={{ 
                    fontSize: "2rem", 
                    color: selectedBatch?.studentList.length >= selectedBatch?.maxCapacity ? "#ef4444" : "#10b981" 
                  }} />
                  <div>
                    <div style={{ fontSize: "1.8rem", fontWeight: "bold", color: selectedBatch?.studentList.length >= selectedBatch?.maxCapacity ? "#ef4444" : "#10b981" }}>
                      {selectedBatch?.studentList.length} / {selectedBatch?.maxCapacity}
                    </div>
                    <div style={{ fontSize: "0.9rem", color: "#666" }}>Students Enrolled</div>
                  </div>
                </div>
                <div style={{
                  padding: "0.6rem 1.5rem",
                  background: selectedBatch?.studentList.length >= selectedBatch?.maxCapacity ? "#ef4444" : "#10b981",
                  color: "#fff",
                  borderRadius: "25px",
                  fontSize: "1rem",
                  fontWeight: "600"
                }}>
                  {selectedBatch?.studentList.length >= selectedBatch?.maxCapacity 
                    ? "FULL" 
                    : `${selectedBatch?.maxCapacity - selectedBatch?.studentList.length} Seats Left`}
                </div>
              </div>

              {selectedBatch?.studentList.length === 0 ? (
                <div style={{
                  textAlign: "center",
                  padding: "4rem 2rem",
                  color: "#999",
                  fontSize: "1.1rem"
                }}>
                  <FaUsers style={{ fontSize: "4rem", marginBottom: "1rem", opacity: 0.3 }} />
                  <div>No students enrolled yet</div>
                  <div style={{ fontSize: "0.95rem", marginTop: "0.5rem" }}>
                    Click "Add Student to Batch" to enroll students
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <h3 style={{ fontSize: "1.2rem", color: "#333", marginBottom: "0.5rem" }}>
                    Enrolled Students ({selectedBatch?.studentList.length})
                  </h3>
                  {selectedBatch?.studentList.map((student, index) => (
                    <div
                      key={student.id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "1.2rem",
                        background: "#f9f9f9",
                        borderRadius: "10px",
                        border: "2px solid #e0e0e0",
                        transition: "all 0.3s"
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background = "#f0f0f0";
                        e.currentTarget.style.borderColor = "#d0d0d0";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background = "#f9f9f9";
                        e.currentTarget.style.borderColor = "#e0e0e0";
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                        <div style={{
                          width: "45px",
                          height: "45px",
                          borderRadius: "50%",
                          background: `linear-gradient(135deg, ${getClassColor(selectedClass)}, ${getClassColor(selectedClass)}dd)`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#fff",
                          fontWeight: "bold",
                          fontSize: "1.1rem"
                        }}>
                          {index + 1}
                        </div>
                        <div>
                          <div style={{ fontWeight: "600", fontSize: "1.1rem", color: "#333", marginBottom: "0.3rem" }}>
                            {student.name}
                          </div>
                          <div style={{ fontSize: "0.9rem", color: "#666" }}>
                            Roll No: {student.rollNo}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveStudent(student.id)}
                        style={{
                          padding: "0.6rem 1.2rem",
                          background: "#ef4444",
                          color: "#fff",
                          border: "none",
                          borderRadius: "8px",
                          cursor: "pointer",
                          fontSize: "0.9rem",
                          fontWeight: "600",
                          transition: "all 0.3s",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem"
                        }}
                        onMouseOver={(e) => e.currentTarget.style.background = "#dc2626"}
                        onMouseOut={(e) => e.currentTarget.style.background = "#ef4444"}
                      >
                        <FaUserGraduate /> Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={() => setShowViewStudentsModal(false)}
                style={{
                  width: "100%",
                  padding: "1rem",
                  background: "#666",
                  color: "#fff",
                  border: "none",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontSize: "1.1rem",
                  fontWeight: "600",
                  marginTop: "2rem",
                  transition: "all 0.3s"
                }}
                onMouseOver={(e) => e.currentTarget.style.background = "#555"}
                onMouseOut={(e) => e.currentTarget.style.background = "#666"}
              >
                Close
              </button>
            </div>
          </div>
        )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BatchManagement;
