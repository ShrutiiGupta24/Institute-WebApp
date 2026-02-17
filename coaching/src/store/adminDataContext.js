import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AdminDataContext = createContext();

export const useAdminData = () => {
  const context = useContext(AdminDataContext);
  if (!context) {
    throw new Error("useAdminData must be used within AdminDataProvider");
  }
  return context;
};

export const AdminDataProvider = ({ children }) => {
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [batches, setBatches] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch students from API
  const fetchStudents = async () => {
    try {
      const response = await api.get("/admin/students");
      setStudents(response.data);
    } catch (err) {
      console.error("Error fetching students:", err);
      setError("Failed to load students");
    }
  };

  // Fetch teachers from API
  const fetchTeachers = async () => {
    try {
      const response = await api.get("/admin/teachers");
      setTeachers(response.data);
    } catch (err) {
      console.error("Error fetching teachers:", err);
      setError("Failed to load teachers");
    }
  };

  // Fetch batches from API
  const fetchBatches = async () => {
    try {
      const response = await api.get("/admin/batches");
      setBatches(response.data);
    } catch (err) {
      console.error("Error fetching batches:", err);
      setError("Failed to load batches");
    }
  };

  // Fetch courses from API
  const fetchCourses = async () => {
    try {
      const response = await api.get("/admin/courses");
      setCourses(response.data);
    } catch (err) {
      console.error("Error fetching courses:", err);
      setError("Failed to load courses");
    }
  };

  // Initial data load
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchStudents(), fetchTeachers(), fetchBatches(), fetchCourses()]);
      setLoading(false);
    };
    
    const token = localStorage.getItem("token");
    if (token) {
      loadData();
    } else {
      setLoading(false);
    }
  }, []);

  // Calculate stats from real data
  const stats = {
    totalStudents: students.filter(s => s.status?.toLowerCase() === "active").length,
    totalTeachers: teachers.filter(t => t.status?.toLowerCase() === "active").length,
    activeBatches: batches.length,
    totalCourses: courses.length
  };

  const value = {
    students,
    setStudents,
    teachers,
    setTeachers,
    batches,
    setBatches,
    courses,
    setCourses,
    stats,
    loading,
    error,
    refreshStudents: fetchStudents,
    refreshTeachers: fetchTeachers,
    refreshBatches: fetchBatches,
    refreshCourses: fetchCourses
  };

  return (
    <AdminDataContext.Provider value={value}>
      {children}
    </AdminDataContext.Provider>
  );
};
