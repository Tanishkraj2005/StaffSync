import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Layout from "../components/Layout";

const ApplyLeave = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    leaveType: "",
    fromDate: "",
    toDate: "",
    reason: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.post("/leaves/apply", form);
    navigate("/employee");
  };

  return (
    <Layout>
      <div className="flex justify-center mt-10 mb-10 px-4">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-xl 
          bg-white dark:bg-gray-800 
          rounded-3xl shadow-2xl 
          p-8 sm:p-10 space-y-7
          border border-gray-200 dark:border-gray-700 
          transition-all"
        >
          {/* Title */}
          <h2 className="text-3xl font-extrabold text-center 
            bg-gradient-to-r from-indigo-600 to-purple-500
            bg-clip-text text-transparent tracking-wide">
            Apply for Leave
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-300 text-sm">
            Fill the details below to submit a leave request.
          </p>

          {/* Leave Type */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Leave Type
            </label>
            <input
              type="text"
              placeholder="Sick Leave, Personal Leave, etc."
              className="w-full px-4 py-3 rounded-xl 
              border border-gray-300 dark:border-gray-600 
              dark:bg-gray-900 dark:text-gray-100
              bg-gray-50 text-gray-900 
              focus:ring-2 focus:ring-indigo-500 
              outline-none transition"
              onChange={(e) => setForm({ ...form, leaveType: e.target.value })}
            />
          </div>

          {/* From Date */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              From Date
            </label>
            <input
              type="date"
              className="w-full px-4 py-3 rounded-xl 
              border border-gray-300 dark:border-gray-600 
              bg-gray-50 dark:bg-gray-900
              text-gray-900 dark:text-gray-100
              focus:ring-2 focus:ring-indigo-500 
              outline-none transition"
              onChange={(e) => setForm({ ...form, fromDate: e.target.value })}
            />
          </div>

          {/* To Date */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              To Date
            </label>
            <input
              type="date"
              className="w-full px-4 py-3 rounded-xl 
              border border-gray-300 dark:border-gray-600 
              bg-gray-50 dark:bg-gray-900
              text-gray-900 dark:text-gray-100
              focus:ring-2 focus:ring-indigo-500 
              outline-none transition"
              onChange={(e) => setForm({ ...form, toDate: e.target.value })}
            />
          </div>

          {/* Reason */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Reason
            </label>
            <textarea
              rows="4"
              placeholder="Explain the reason for your leave…"
              className="w-full px-4 py-3 rounded-xl 
              border border-gray-300 dark:border-gray-600 
              bg-gray-50 dark:bg-gray-900
              text-gray-900 dark:text-gray-100
              focus:ring-2 focus:ring-indigo-500 
              outline-none transition resize-none"
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
            />
          </div>

          {/* Submit Button */}
          <button
            className="w-full py-3 rounded-xl font-semibold text-white 
            bg-gradient-to-r from-indigo-600 to-purple-600
            hover:from-indigo-700 hover:to-purple-700
            shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 
            transition-all"
          >
            Submit Leave Request
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default ApplyLeave;