import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Layout from "../components/Layout";

const ApplyReimbursement = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    amount: "",
    description: "",
    expenseDate: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.post("/reimbursements/apply", form);
    navigate("/employee");
  };

  return (
    <Layout>
      <div className="flex justify-center mt-10 mb-10 px-4">
        <div
          className="w-full max-w-xl 
          bg-white dark:bg-gray-800 
          rounded-3xl shadow-2xl 
          p-8 sm:p-10 
          border border-gray-200 dark:border-gray-700 
          transition-all"
        >
          {/* Title */}
          <h2
            className="text-3xl font-extrabold text-center 
            bg-gradient-to-r from-indigo-600 to-purple-500
            bg-clip-text text-transparent tracking-wide"
          >
            Apply for Reimbursement
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-300 text-sm mt-1 mb-6">
            Submit your expense details for approval.
          </p>

          <form onSubmit={handleSubmit} className="space-y-7">
            {/* Amount */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Amount
              </label>
              <input
                type="number"
                placeholder="Enter amount"
                className="w-full px-4 py-3 rounded-xl 
                border border-gray-300 dark:border-gray-600 
                bg-gray-50 dark:bg-gray-900 
                text-gray-900 dark:text-gray-100
                focus:ring-2 focus:ring-indigo-500 
                outline-none transition"
                onChange={(e) =>
                  setForm({ ...form, amount: e.target.value })
                }
              />
            </div>

            {/* Expense Date */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Expense Date
              </label>
              <input
                type="date"
                className="w-full px-4 py-3 rounded-xl 
                border border-gray-300 dark:border-gray-600 
                bg-gray-50 dark:bg-gray-900 
                text-gray-900 dark:text-gray-100
                focus:ring-2 focus:ring-indigo-500 
                outline-none transition"
                onChange={(e) =>
                  setForm({ ...form, expenseDate: e.target.value })
                }
              />
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Description
              </label>
              <textarea
                rows="4"
                placeholder="Enter expense description…"
                className="w-full px-4 py-3 rounded-xl 
                border border-gray-300 dark:border-gray-600 
                bg-gray-50 dark:bg-gray-900 
                text-gray-900 dark:text-gray-100
                focus:ring-2 focus:ring-indigo-500 
                outline-none transition resize-none"
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 rounded-xl font-semibold text-white 
              bg-gradient-to-r from-indigo-600 to-purple-600
              hover:from-indigo-700 hover:to-purple-700
              shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 
              transition-all"
            >
              Submit Reimbursement
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default ApplyReimbursement;