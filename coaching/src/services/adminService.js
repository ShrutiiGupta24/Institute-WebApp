import api from "./api";

// Admin endpoints
export const getAdmins = () => api.get("/admins");

// Dashboard stats
export const getDashboardStats = () => api.get("/admin/dashboard");

// Student Management
export const getAllStudents = (skip = 0, limit = 100) => 
  api.get(`/admin/students?skip=${skip}&limit=${limit}`);

export const createStudent = (studentData) => 
  api.post("/admin/students", studentData);

export const updateStudent = (studentId, studentData) => 
  api.put(`/admin/students/${studentId}`, studentData);

export const deleteStudent = (studentId) => 
  api.delete(`/admin/students/${studentId}`);

// Student Batch Enrollment
export const enrollStudentInBatch = (studentId, batchId) =>
  api.post(`/admin/students/${studentId}/batches/${batchId}`);

export const unenrollStudentFromBatch = (studentId, batchId) =>
  api.delete(`/admin/students/${studentId}/batches/${batchId}`);

export const getStudentBatches = (studentId) =>
  api.get(`/admin/students/${studentId}/batches`);

// Teacher Management
export const getAllTeachers = (skip = 0, limit = 100) => 
  api.get(`/admin/teachers?skip=${skip}&limit=${limit}`);

export const createTeacher = (teacherData) => 
  api.post("/admin/teachers", teacherData);

export const updateTeacher = (teacherId, teacherData) => 
  api.put(`/admin/teachers/${teacherId}`, teacherData);

export const deleteTeacher = (teacherId) => 
  api.delete(`/admin/teachers/${teacherId}`);

// Course Management
export const getAllCourses = () => 
  api.get("/admin/courses");

export const createCourse = (courseData) => 
  api.post("/admin/courses", courseData);

export const updateCourse = (courseId, courseData) => 
  api.put(`/admin/courses/${courseId}`, courseData);

export const deleteCourse = (courseId) => 
  api.delete(`/admin/courses/${courseId}`);

// Batch Management
export const getAllBatches = () => 
  api.get("/admin/batches");

export const createBatch = (batchData) => 
  api.post("/admin/batches", batchData);

export const updateBatch = (batchId, batchData) => 
  api.put(`/admin/batches/${batchId}`, batchData);

export const deleteBatch = (batchId) => 
  api.delete(`/admin/batches/${batchId}`);

// Fee Management
export const getAllFees = (status = null) => {
  const params = status ? `?status=${status}` : "";
  return api.get(`/admin/fees${params}`);
};

export const createFee = (feeData) => 
  api.post("/admin/fees", feeData);

export const updateFee = (feeId, feeData) => 
  api.put(`/admin/fees/${feeId}`, feeData);

export const deleteFee = (feeId) => 
  api.delete(`/admin/fees/${feeId}`);

// Reports
export const getAttendanceReport = (startDate = null, endDate = null) => {
  let params = [];
  if (startDate) params.push(`start_date=${startDate}`);
  if (endDate) params.push(`end_date=${endDate}`);
  const queryString = params.length ? `?${params.join("&")}` : "";
  return api.get(`/admin/reports/attendance${queryString}`);
};

export const getFeeReport = () => 
  api.get("/admin/reports/fees");
