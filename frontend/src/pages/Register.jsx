import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Register = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Default role: Employee
      await register(
        form.name,
        form.email,
        form.password,
        "Employee"
      );

      navigate("/");
    } catch (err) {
      setError("Registration failed");
    }
  };

  return (
    <div
      className="
      min-h-screen flex items-center justify-center 
      bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500
      dark:from-gray-900 dark:via-gray-800 dark:to-black
      p-6
    "
    >
      <div
        className="
        w-full max-w-md 
        backdrop-blur-xl bg-white/20 dark:bg-gray-800/30
        rounded-3xl shadow-2xl 
        border border-white/40 dark:border-gray-700 
        p-10 space-y-8
        transition-all
      "
      >
        {/* Title */}
        <h2
          className="
          text-4xl font-extrabold text-center 
          bg-gradient-to-r from-white to-gray-200 dark:from-indigo-400 dark:to-purple-300
          bg-clip-text text-transparent drop-shadow-sm
        "
        >
          Create Account
        </h2>

        {error && (
          <p className="text-red-300 text-center text-sm">{error}</p>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Full Name */}
          <div>
            <label className="block mb-1 text-gray-100 dark:text-gray-300 text-sm font-medium">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Enter full name"
              className="
                w-full px-4 py-3 rounded-xl 
                bg-white/70 dark:bg-gray-900 
                border border-gray-300 dark:border-gray-700
                text-gray-800 dark:text-gray-100
                focus:ring-2 focus:ring-purple-400
                outline-none shadow-sm
              "
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 text-gray-100 dark:text-gray-300 text-sm font-medium">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter email"
              className="
                w-full px-4 py-3 rounded-xl 
                bg-white/70 dark:bg-gray-900 
                border border-gray-300 dark:border-gray-700
                text-gray-800 dark:text-gray-100
                focus:ring-2 focus:ring-purple-400
                outline-none shadow-sm
              "
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />
          </div>

          {/* Password */}
          <div>
            <label className="block mb-1 text-gray-100 dark:text-gray-300 text-sm font-medium">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter password"
              className="
                w-full px-4 py-3 rounded-xl 
                bg-white/70 dark:bg-gray-900 
                border border-gray-300 dark:border-gray-700
                text-gray-800 dark:text-gray-100
                focus:ring-2 focus:ring-purple-400
                outline-none shadow-sm
              "
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />
          </div>

          <button
            className="
              w-full py-3 rounded-xl font-semibold text-white
              bg-gradient-to-r from-indigo-600 to-purple-600
              hover:from-indigo-700 hover:to-purple-700
              shadow-lg hover:shadow-xl 
              transform hover:-translate-y-0.5 transition-all
            "
          >
            Register
          </button>
        </form>

        {/* Already have account */}
        <p className="text-sm text-center text-gray-200 dark:text-gray-400">
          Already have an account?{" "}
          <Link
            to="/"
            className="text-yellow-300 hover:text-yellow-200 font-semibold"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;