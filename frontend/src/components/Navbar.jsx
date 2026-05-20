import { useContext, useState, useRef, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link, useLocation } from "react-router-dom";

const Navbar = ({ darkMode, setDarkMode }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => { logout(); navigate("/"); };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [];

  if (user?.role === "Employee") {
    navLinks.push({ to: "/employee", label: "Dashboard" });
    navLinks.push({ to: "/apply-leave", label: "Apply Leave" });
    navLinks.push({ to: "/apply-reimbursement", label: "Reimbursement" });
  }

  if (user?.role === "Manager") {
    navLinks.push({ to: "/manager", label: "Team Requests", icon: "👥" });
    navLinks.push({ to: "/employee", label: "My Dashboard", icon: "📊" });
    navLinks.push({ to: "/my-apply", label: "My Apply", icon: "📝" });
  }

  if (user?.role === "Admin") {
    navLinks.push({ to: "/admin", label: "Admin Panel", icon: "👑" });
    navLinks.push({ to: "/manager", label: "Team Requests", icon: "👥" });
    navLinks.push({ to: "/analytics", label: "Analytics", icon: "📈" });
    navLinks.push({ to: "/settings", label: "Settings", icon: "⚙️" });
    navLinks.push({ to: "/audit-logs", label: "Audit Logs", icon: "🔐" });
    navLinks.push({ to: "/employee", label: "My Dashboard", icon: "📊" });
  }

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-900 text-white shadow-xl shadow-indigo-900/20 border-b border-indigo-500/30">

      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-pink-500 via-purple-400 to-indigo-400 opacity-50" />

      <div className="hidden md:flex max-w-7xl mx-auto px-6 items-center justify-between h-20 gap-6">

        <Link to="/" className="flex items-center gap-3 flex-shrink-0 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-pink-500/30 group-hover:scale-105 transition-transform ring-2 ring-white/20">
            S
          </div>
          <span className="text-2xl font-black text-white tracking-tight drop-shadow-md">
            StaffSync
          </span>
        </Link>

        {navLinks.length > 0 && (
          <div className="flex items-center gap-2 bg-black/20 p-1.5 rounded-2xl border border-white/10 backdrop-blur-md">
            {navLinks.map(link => (
              <Link key={link.to} to={link.to}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${isActive(link.to)
                  ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg shadow-pink-500/20 transform scale-[1.02]"
                  : "text-indigo-200 hover:text-white hover:bg-white/10"
                  }`}>
                <span>{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </div>
        )}

        <div className="flex items-center gap-4 flex-shrink-0">
          <button onClick={() => setDarkMode(!darkMode)}
            className="w-11 h-11 rounded-xl flex items-center justify-center text-lg bg-black/20 hover:bg-white/10 border border-white/10 transition-all text-indigo-200 hover:text-white shadow-inner">
            {darkMode ? "☀️" : "🌙"}
          </button>

          {user && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-2xl bg-black/20 hover:bg-white/10 border border-white/10 outline-none cursor-pointer transition-all"
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-black text-sm shadow-sm">
                  {user.name?.charAt(0)?.toUpperCase()}
                </div>
                <div className="flex flex-col items-start leading-tight">
                  <span className="text-sm font-bold text-white">
                    {user.name?.split(" ")[0]}
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-wider text-pink-300">
                    {user.role}
                  </span>
                </div>
                <span className={`text-xs text-indigo-300 transition-transform ml-1 ${dropdownOpen ? 'rotate-180' : ''}`}>▼</span>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-3 w-56 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 z-50 overflow-hidden fade-in-up">
                  <Link
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-5 py-4 text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
                  >
                    <span className="text-lg">👤</span> My Profile
                  </Link>
                  <div className="h-px w-full bg-gray-100 dark:bg-gray-700/50" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 text-left px-5 py-4 text-sm font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                  >
                    <span className="text-lg">🚪</span> Sign out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="md:hidden flex flex-col">
        <div className="flex items-center justify-between px-5 h-16">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-black text-sm shadow-md shadow-pink-500/30">S</div>
            <span className="font-black text-lg text-white tracking-tight drop-shadow-md">StaffSync</span>
          </Link>

          <div className="flex items-center gap-3">
            <button onClick={() => setDarkMode(!darkMode)}
              className="w-9 h-9 rounded-full bg-black/20 hover:bg-white/10 flex items-center justify-center border border-white/10 text-sm text-indigo-200 transition-colors">
              {darkMode ? "☀️" : "🌙"}
            </button>
            {user && (
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDropdownOpen(!dropdownOpen);
                  }}
                  className="flex items-center outline-none cursor-pointer hover:scale-105 transition-transform"
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-black text-sm shadow-md ring-2 ring-white/20">
                    {user.name?.charAt(0)?.toUpperCase()}
                  </div>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-3 w-48 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 z-50 overflow-hidden fade-in-up">
                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-indigo-900/30"
                    >
                      <span>👤</span> Profile
                    </Link>
                    <div className="h-px w-full bg-gray-100 dark:bg-gray-700/50" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 text-left px-4 py-3 text-sm font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30"
                    >
                      <span>🚪</span> Sign out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {navLinks.length > 0 && (
          <div className="flex overflow-x-auto gap-2 px-5 pb-4 no-scrollbar border-t border-white/10 mt-1 pt-3">
            {navLinks.map(link => (
              <Link key={link.to} to={link.to}
                className={`flex-shrink-0 px-4 py-2 text-xs font-bold rounded-full transition-all flex items-center justify-center gap-1.5 ${isActive(link.to)
                  ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg shadow-pink-500/20"
                  : "bg-black/20 border border-white/10 text-indigo-100 hover:bg-white/10"
                  }`}>
                {link.icon && <span>{link.icon}</span>}
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