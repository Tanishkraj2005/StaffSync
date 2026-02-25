import { useEffect, useState } from "react";
import Navbar from "./Navbar";

const Layout = ({ children }) => {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 
      dark:from-gray-900 dark:to-gray-950 transition-colors duration-300">

      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

      <div className="p-4 sm:p-6 lg:p-10 text-gray-800 dark:text-gray-100 
        max-w-7xl mx-auto w-full">
        {children}
      </div>
    </div>
  );
};

export default Layout;