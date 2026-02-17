import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AdminDataProvider } from "./store/adminDataContext";
import Header from "./components/Header";
import NavigationBar from "./components/NavigationBar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import AboutTeachers from "./pages/AboutTeachers";
import ContactUs from "./pages/ContactUs";
import AboutUs from "./pages/AboutUs";
import Achievers from "./pages/Achievers";
import Brochure from "./pages/Brochure";
import StudentDashboard from "./pages/student/StudentDashboard";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import BatchManagement from "./pages/admin/BatchManagement";
import CourseManagement from "./pages/admin/CourseManagement";
import FeeManagement from "./pages/admin/FeeManagement";
import StudentManagement from "./pages/admin/StudentManagement";
import TeacherManagement from "./pages/admin/TeacherManagement";
import Reports from "./pages/admin/Reports";
import AttendanceView from "./pages/student/AttendanceView";
import StudyMaterialAccess from "./pages/student/StudyMaterialAccess";
import TestResults from "./pages/student/TestResults";
import TestAssignments from "./pages/student/TestAssignments";
import FeeStatus from "./pages/student/FeeStatus";
import AttendanceMarking from "./pages/teacher/AttendanceMarking";
import StudentPerformance from "./pages/teacher/StudentPerformance";
import StudyMaterialUpload from "./pages/teacher/StudyMaterialUpload";
import TestsAssignments from "./pages/teacher/TestsAssignments";
import AssignedBatches from "./pages/teacher/AssignedBatches";

const App = () => (
    <AdminDataProvider>
      <Router>
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
          <Header />
          <NavigationBar />
          <div style={{ flex: 1 }}>
            <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/about-teachers" element={<AboutTeachers />} />
      <Route path="/contact-us" element={<ContactUs />} />
      <Route path="/about-us" element={<AboutUs />} />
      <Route path="/achievers" element={<Achievers />} />
      <Route path="/brochure" element={<Brochure />} />
      <Route path="/student/dashboard" element={<StudentDashboard />} />
      <Route path="/student/attendance" element={<AttendanceView />} />
      <Route path="/student/study-material" element={<StudyMaterialAccess />} />
      <Route path="/student/test-assignments" element={<TestAssignments />} />
      <Route path="/student/test-results" element={<TestResults />} />
      <Route path="/student/fees-status" element={<FeeStatus />} />
      <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
      <Route path="/teacher/assigned-batches" element={<AssignedBatches />} />
      <Route path="/teacher/attendance" element={<AttendanceMarking />} />
      <Route path="/teacher/marks" element={<StudentPerformance />} />
      <Route path="/teacher/materials" element={<StudyMaterialUpload />} />
      <Route path="/teacher/tests" element={<TestsAssignments />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/batches" element={<BatchManagement />} />
      <Route path="/admin/courses" element={<CourseManagement />} />
      <Route path="/admin/fees" element={<FeeManagement />} />
      <Route path="/admin/students" element={<StudentManagement />} />
      <Route path="/admin/teachers" element={<TeacherManagement />} />
      <Route path="/admin/reports" element={<Reports />} />
      {/* Add more routes as needed */}
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </AdminDataProvider>
);

export default App;
