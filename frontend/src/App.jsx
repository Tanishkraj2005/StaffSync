import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import AdminPanel from "./pages/AdminPanel";
import ApplyLeave from "./pages/ApplyLeave";
import ApplyReimbursement from "./pages/ApplyReimbursement";

function App({ darkMode, setDarkMode }) {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/employee"
        element={
          <ProtectedRoute allowedRoles={["Employee"]}>
            <EmployeeDashboard darkMode={darkMode} setDarkMode={setDarkMode} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/manager"
        element={
          <ProtectedRoute allowedRoles={["Manager"]}>
            <ManagerDashboard darkMode={darkMode} setDarkMode={setDarkMode} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <AdminPanel darkMode={darkMode} setDarkMode={setDarkMode} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/apply-leave"
        element={
          <ProtectedRoute allowedRoles={["Employee"]}>
            <ApplyLeave darkMode={darkMode} setDarkMode={setDarkMode} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/apply-reimbursement"
        element={
          <ProtectedRoute allowedRoles={["Employee"]}>
            <ApplyReimbursement darkMode={darkMode} setDarkMode={setDarkMode} />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;