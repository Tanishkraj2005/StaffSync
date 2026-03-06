import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link, useLocation } from "react-router-dom";

const Navbar = ({ darkMode, setDarkMode }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navLinks = [];
  if (user?.role === "Employee") {
    navLinks.push({ to: "/employee", label: "Dashboard" });
    navLinks.push({ to: "/apply-leave", label: "Apply Leave" });
    navLinks.push({ to: "/apply-reimbursement", label: "Reimbursement" });
  }
  if (user?.role === "Manager") {
    navLinks.push({ to: "/manager", label: "Leave Requests" });
  }
  if (user?.role === "Admin") {
    navLinks.push({ to: "/admin", label: "Admin Panel" });
  }

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="w-full sticky top-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-gray-800/80 shadow-md border-b border-gray-300 dark:border-gray-700">

      
      <div className="hidden md:flex max-w-7xl mx-auto px-6 items-center justify-between py-4">
        
        <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-500 bg-clip-text text-transparent tracking-wide">
          StaffSync
        </h1>

        
        <div className="flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${isActive(link.to)
                  ? "bg-indigo-600 text-white shadow"
                  : "text-gray-800 dark:text-gray-200 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-500"
                }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-3 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all text-sm text-gray-700 dark:text-gray-200"
          >
            {darkMode ? "☀ Light" : "🌙 Dark"}
          </button>
          {user && (
            <button
              onClick={handleLogout}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition text-white px-4 py-2 rounded-lg text-sm shadow"
            >
              Logout
            </button>
          )}
        </div>
      </div>

      
      <div className="md:hidden">
        
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-500 bg-clip-text text-transparent">
            StaffSync
          </h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="px-2.5 py-1.5 rounded-lg bg-gray-200 dark:bg-gray-700 text-xs text-gray-700 dark:text-gray-200 transition-all"
            >
              {darkMode ? "☀" : "🌙"}
            </button>
            {user && (
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-xs font-semibold shadow transition"
              >
                Logout
              </button>
            )}
          </div>
        </div>

        
        {navLinks.length > 0 && (
          <div className="flex flex-wrap gap-2 px-4 pb-3">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${isActive(link.to)
                    ? "bg-indigo-600 text-white shadow"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-indigo-600 hover:text-white"
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;