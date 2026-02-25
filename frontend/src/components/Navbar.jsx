import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Navbar = ({ darkMode, setDarkMode }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const NavButton = ({ to, label }) => (
    <Link
      to={to}
      className="px-4 py-2 text-sm font-medium rounded-lg 
        text-gray-800 dark:text-gray-200
        hover:bg-indigo-600 hover:text-white 
        dark:hover:bg-indigo-500
        transition-all duration-200"
    >
      {label}
    </Link>
  );

  return (
    <div className="
      w-full backdrop-blur-lg bg-white/70 dark:bg-gray-800/70
      shadow-md border-b border-gray-300 dark:border-gray-700
      px-4 sm:px-6 py-4 flex justify-between items-center
    ">
      {/* Title */}
      <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-500 
        bg-clip-text text-transparent tracking-wide">
        StaffSync
      </h1>

      <div className="hidden md:flex items-center gap-4">

        {user?.role === "Employee" && (
          <>
            <NavButton to="/employee" label="Dashboard" />
            <NavButton to="/apply-leave" label="Apply Leave" />
            <NavButton to="/apply-reimbursement" label="Reimbursement" />
          </>
        )}

        {user?.role === "Manager" && (
          <NavButton to="/manager" label="Leave Requests" />
        )}

        {user?.role === "Admin" && (
          <NavButton to="/admin" label="Admin Panel" />
        )}
      </div>

      <div className="flex items-center gap-3">
        
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="px-3 py-2 rounded-lg 
            bg-gray-200 dark:bg-gray-700 
            hover:bg-gray-300 dark:hover:bg-gray-600
            transition-all text-sm"
        >
          {darkMode ? "☀ Light" : "🌙 Dark"}
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="bg-gradient-to-r from-red-500 to-red-600 
            hover:from-red-600 hover:to-red-700
            transition text-white px-4 py-2 rounded-lg text-sm shadow"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;