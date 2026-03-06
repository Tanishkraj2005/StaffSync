import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import Layout from "../components/Layout";

const ApplyReimbursement = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ amount: "", description: "", expenseDate: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post("/reimbursements/apply", form);
      setSuccess(true);
      setTimeout(() => navigate("/employee"), 1500);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const field = "w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition-all text-sm shadow-sm";

  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-6">

        
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Link to="/employee" className="hover:text-purple-600 dark:hover:text-purple-400 transition">Dashboard</Link>
          <span>/</span>
          <span className="text-gray-800 dark:text-white font-medium">Apply for Reimbursement</span>
        </div>

        
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent tracking-wide">
              Expense Reimbursement
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Submit your expense claim with all the required details for approval.
            </p>
          </div>
          <span className="self-start sm:self-auto inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-purple-50 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300 border border-purple-100 dark:border-purple-800">
            Employee Access
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/40">
              <h2 className="font-semibold text-gray-800 dark:text-white text-sm">Expense Details</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">All fields are required</p>
            </div>

            <div className="p-6">
              {success && (
                <div className="mb-5 flex items-center gap-3 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 text-green-700 dark:text-green-300 text-sm py-3 px-4 rounded-xl">
                  <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                  Reimbursement submitted successfully! Redirecting…
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">

                
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-widest">
                    Expense Category
                  </label>
                  <select
                    onChange={(e) => setForm({ ...form, description: e.target.value + " — " })}
                    className={field}
                  >
                    <option value="">Select a category (optional)…</option>
                    <option value="Travel">Travel (Flights, Trains, Cabs)</option>
                    <option value="Hotel & Accommodation">Hotel & Accommodation</option>
                    <option value="Equipment & Tools">Equipment & Tools</option>
                    <option value="Food & Meals">Food & Meals</option>
                    <option value="Internet & Communication">Internet & Communication</option>
                    <option value="Medical">Medical</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-widest">
                      Amount (₹)
                    </label>
                    <input
                      type="number"
                      placeholder="0.00"
                      min="1"
                      value={form.amount}
                      className={field}
                      onChange={(e) => setForm({ ...form, amount: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-widest">
                      Expense Date
                    </label>
                    <input
                      type="date"
                      className={field}
                      onChange={(e) => setForm({ ...form, expenseDate: e.target.value })}
                      required
                    />
                  </div>
                </div>

                
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-widest">
                    Description
                  </label>
                  <textarea
                    rows="4"
                    placeholder="Provide full details: what was purchased, why, and any invoice or bill reference numbers…"
                    value={form.description}
                    className={`${field} resize-none`}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    required
                  />
                </div>

                
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => navigate("/employee")}
                    className="sm:w-36 py-3 rounded-xl text-sm font-semibold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading || success}
                    className="flex-1 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all disabled:opacity-60"
                  >
                    {loading ? "Submitting request…" : "Submit Reimbursement"}
                  </button>
                </div>
              </form>
            </div>
          </div>

          
          <div className="space-y-4">

            
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700 bg-purple-50 dark:bg-purple-900/30">
                <h3 className="font-semibold text-purple-800 dark:text-purple-200 text-sm">Reimbursement Policy</h3>
              </div>
              <div className="p-5 space-y-3 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 shrink-0" />
                  <p>Claims must be submitted within <strong className="text-gray-800 dark:text-gray-200">30 days</strong> of the expense date.</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 shrink-0" />
                  <p>Attach bill/receipt numbers in the description for faster processing.</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 shrink-0" />
                  <p>Approved amounts are credited within <strong className="text-gray-800 dark:text-gray-200">7 working days</strong>.</p>
                </div>
              </div>
            </div>

            
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-5">
              <h3 className="font-semibold text-gray-800 dark:text-white text-sm mb-3">Eligible Expenses</h3>
              <div className="space-y-2">
                {[
                  { label: "Travel", sub: "Flights, trains, cabs" },
                  { label: "Accommodation", sub: "Hotels & lodging" },
                  { label: "Equipment", sub: "Tools & tech gear" },
                  { label: "Food", sub: "Business meals only" },
                ].map((c) => (
                  <div key={c.label} className="flex items-center justify-between py-1.5 border-b border-gray-50 dark:border-gray-700 last:border-0">
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{c.label}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{c.sub}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ApplyReimbursement;