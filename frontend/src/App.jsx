import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import AdminPanel from "./pages/AdminPanel";
import ApplyLeave from "./pages/ApplyLeave";
import ApplyReimbursement from "./pages/ApplyReimbursement";
import LeaveCalendar from "./pages/LeaveCalendar";
import Analytics from "./pages/Analytics";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import AuditLogs from "./pages/AuditLogs";
import ManagerApply from "./pages/ManagerApply";

function App({ darkMode, setDarkMode }) {
  return (
    <Routes>

      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      <Route path="/employee" element={
        <ProtectedRoute allowedRoles={["Employee", "Manager", "Admin"]}>
          <EmployeeDashboard darkMode={darkMode} setDarkMode={setDarkMode} />
        </ProtectedRoute>
      } />
      <Route path="/apply-leave" element={
        <ProtectedRoute allowedRoles={["Employee", "Manager", "Admin"]}>
          <ApplyLeave darkMode={darkMode} setDarkMode={setDarkMode} />
        </ProtectedRoute>
      } />
      <Route path="/apply-reimbursement" element={
        <ProtectedRoute allowedRoles={["Employee", "Manager", "Admin"]}>
          <ApplyReimbursement darkMode={darkMode} setDarkMode={setDarkMode} />
        </ProtectedRoute>
      } />
      <Route path="/calendar" element={
        <ProtectedRoute allowedRoles={["Employee", "Manager", "Admin"]}>
          <LeaveCalendar darkMode={darkMode} setDarkMode={setDarkMode} />
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute allowedRoles={["Employee", "Manager", "Admin"]}>
          <Profile darkMode={darkMode} setDarkMode={setDarkMode} />
        </ProtectedRoute>
      } />

      <Route path="/manager" element={
        <ProtectedRoute allowedRoles={["Manager", "Admin"]}>
          <ManagerDashboard darkMode={darkMode} setDarkMode={setDarkMode} />
        </ProtectedRoute>
      } />
      <Route path="/analytics" element={
        <ProtectedRoute allowedRoles={["Manager", "Admin"]}>
          <Analytics darkMode={darkMode} setDarkMode={setDarkMode} />
        </ProtectedRoute>
      } />
      <Route path="/my-apply" element={
        <ProtectedRoute allowedRoles={["Manager", "Admin"]}>
          <ManagerApply darkMode={darkMode} setDarkMode={setDarkMode} />
        </ProtectedRoute>
      } />

      <Route path="/admin" element={
        <ProtectedRoute allowedRoles={["Admin"]}>
          <AdminPanel darkMode={darkMode} setDarkMode={setDarkMode} />
        </ProtectedRoute>
      } />
      <Route path="/settings" element={
        <ProtectedRoute allowedRoles={["Admin"]}>
          <Settings darkMode={darkMode} setDarkMode={setDarkMode} />
        </ProtectedRoute>
      } />
      <Route path="/audit-logs" element={
        <ProtectedRoute allowedRoles={["Admin"]}>
          <AuditLogs darkMode={darkMode} setDarkMode={setDarkMode} />
        </ProtectedRoute>
      } />
    </Routes>
  );
}

export default App;