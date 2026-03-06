import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import Layout from "../components/Layout";

const ApplyLeave = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ leaveType: "", fromDate: "", toDate: "", reason: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post("/leaves/apply", form);
      setSuccess(true);
      setTimeout(() => navigate("/employee"), 1500);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const field = "w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 transition-all text-sm shadow-sm";

  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-6">

        
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Link to="/employee" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Dashboard</Link>
          <span>/</span>
          <span className="text-gray-800 dark:text-white font-medium">Apply for Leave</span>
        </div>

        
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent tracking-wide">
              Leave Request
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Fill in the form below and submit your request for manager approval.
            </p>
          </div>
          <span className="self-start sm:self-auto inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800">
            Employee Access
          </span>
        </div>

        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">

            
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/40">
              <h2 className="font-semibold text-gray-800 dark:text-white text-sm">Leave Details</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">All fields are required</p>
            </div>

            <div className="p-6">
              {success && (
                <div className="mb-5 flex items-center gap-3 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 text-green-700 dark:text-green-300 text-sm py-3 px-4 rounded-xl">
                  <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                  Leave submitted successfully! Redirecting…
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">

                
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-widest">
                    Leave Type
                  </label>
                  <select
                    value={form.leaveType}
                    onChange={(e) => setForm({ ...form, leaveType: e.target.value })}
                    className={field}
                    required
                  >
                    <option value="">Select a leave type…</option>
                    <option value="Sick Leave">Sick Leave</option>
                    <option value="Casual Leave">Casual Leave</option>
                    <option value="Emergency Leave">Emergency Leave</option>
                    <option value="Maternity Leave">Maternity Leave</option>
                    <option value="Paternity Leave">Paternity Leave</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-widest">
                      From Date
                    </label>
                    <input
                      type="date"
                      className={field}
                      onChange={(e) => setForm({ ...form, fromDate: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-widest">
                      To Date
                    </label>
                    <input
                      type="date"
                      className={field}
                      onChange={(e) => setForm({ ...form, toDate: e.target.value })}
                      required
                    />
                  </div>
                </div>

                
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-widest">
                    Reason
                  </label>
                  <textarea
                    rows="4"
                    placeholder="Provide a clear reason for your leave request…"
                    className={`${field} resize-none`}
                    onChange={(e) => setForm({ ...form, reason: e.target.value })}
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
                    className="flex-1 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all disabled:opacity-60"
                  >
                    {loading ? "Submitting request…" : "Submit Leave Request"}
                  </button>
                </div>
              </form>
            </div>
          </div>

          
          <div className="space-y-4">

            
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700 bg-indigo-50 dark:bg-indigo-900/30">
                <h3 className="font-semibold text-indigo-800 dark:text-indigo-200 text-sm">Leave Policy</h3>
              </div>
              <div className="p-5 space-y-3 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0" />
                  <p>Submit leave requests at least <strong className="text-gray-800 dark:text-gray-200">2 days</strong> in advance.</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0" />
                  <p>Emergency leaves can be applied same day with a proper reason.</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0" />
                  <p>Your manager will approve or reject the request within <strong className="text-gray-800 dark:text-gray-200">24 hours</strong>.</p>
                </div>
              </div>
            </div>

            
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-5 space-y-3">
              <h3 className="font-semibold text-gray-800 dark:text-white text-sm mb-1">Status Guide</h3>
              {[
                { label: "Pending", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300", desc: "Awaiting manager review" },
                { label: "Approved", color: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300", desc: "Leave has been approved" },
                { label: "Rejected", color: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300", desc: "Request was declined" },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${s.color}`}>{s.label}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{s.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ApplyLeave;