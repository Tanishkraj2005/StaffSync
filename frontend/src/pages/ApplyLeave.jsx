import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import Layout from "../components/Layout";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";

const LEAVE_TYPES = [
  { value: "Sick Leave", icon: "🤒", desc: "Medical illness or injury" },
  { value: "Casual Leave", icon: "🌴", desc: "Personal or family matters" },
  { value: "Emergency Leave", icon: "🚨", desc: "Unexpected urgent situations" },
  { value: "Maternity Leave", icon: "🤱", desc: "Childbirth and newborn care" },
  { value: "Paternity Leave", icon: "👨‍👶", desc: "New father parental leave" },
  { value: "Other", icon: "📋", desc: "Other miscellaneous leave" },
];

const ApplyLeave = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [form, setForm] = useState({ leaveType: "", fromDate: "", toDate: "", reason: "" });
  const [loading, setLoading] = useState(false);

  const getDays = () => {
    if (!form.fromDate || !form.toDate) return null;
    const from = new Date(form.fromDate);
    const to = new Date(form.toDate);
    if (to < from) return null;
    return Math.ceil((to - from) / 864e5) + 1;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post("/leaves/apply", form);
      toast.success("Leave request submitted successfully!");
      setTimeout(() => navigate("/employee"), 1400);
    } catch (err) {
      toast.error(err.response?.data?.message || "Submission failed.");
    } finally {
      setLoading(false);
    }
  };

  const days = getDays();
  const balance = user?.leaveBalance ?? 20;
  const overBalance = days && days > balance;
  const selectedType = LEAVE_TYPES.find(t => t.value === form.leaveType);

  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-8 fade-in-up pb-10">

        <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 to-blue-600 p-8 sm:p-10 rounded-3xl shadow-xl shadow-indigo-500/20 text-white border-0">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-900/40 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/4 pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="flex items-center gap-2 text-sm text-indigo-100 mb-3 font-bold uppercase tracking-wider">
                <Link to="/employee" className="hover:text-white transition-colors">Dashboard</Link>
                <span>/</span>
                <span className="text-white">Apply Leave</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white mb-2 drop-shadow-md tracking-tight">
                Leave Request
              </h1>
              <p className="text-indigo-100 text-sm max-w-xl font-medium">
                Fill out the details below to request time off. Your manager will review your request shortly.
              </p>
            </div>
            <div className="w-16 h-16 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shadow-xl ring-2 ring-white/40">
              📅
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-800 shadow-lg shadow-gray-200/50 dark:shadow-none space-y-8 relative overflow-hidden">

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-black text-sm shadow-md">1</div>
                  <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Select Leave Type</h2>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {LEAVE_TYPES.map(t => (
                    <button type="button" key={t.value}
                      onClick={() => setForm({ ...form, leaveType: t.value })}
                      className={`relative flex flex-col items-center text-center gap-2 p-4 rounded-2xl border-2 transition-all duration-200 ${form.leaveType === t.value
                          ? "border-indigo-400 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 shadow-md shadow-indigo-500/10 transform -translate-y-1"
                          : "border-gray-100 dark:border-gray-800 hover:border-indigo-200 dark:hover:border-indigo-700 bg-white dark:bg-gray-900 hover:shadow-sm"
                        }`}>
                      {form.leaveType === t.value && (
                        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
                      )}
                      <span className="text-3xl mb-1">{t.icon}</span>
                      <span className={`text-xs font-bold uppercase tracking-wider ${form.leaveType === t.value ? "text-indigo-700 dark:text-indigo-300" : "text-gray-600 dark:text-gray-400"}`}>
                        {t.value}
                      </span>
                    </button>
                  ))}
                </div>

              </div>

              <hr className="border-gray-100 dark:border-gray-800" />

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-black text-sm shadow-md">2</div>
                  <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Duration</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Start Date</label>
                    <input type="date" className="w-full px-4 py-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-gray-900 dark:text-white font-medium"
                      onChange={e => setForm({ ...form, fromDate: e.target.value })} required />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">End Date</label>
                    <input type="date" className="w-full px-4 py-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-gray-900 dark:text-white font-medium"
                      onChange={e => setForm({ ...form, toDate: e.target.value })} required />
                  </div>
                </div>

                {days !== null && (
                  <div className={`mt-4 flex items-start gap-4 p-4 rounded-2xl border shadow-sm ${overBalance
                      ? "bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-red-200 dark:border-red-800/50"
                      : "bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-emerald-200 dark:border-emerald-800/50"
                    }`}>
                    <div className="text-3xl mt-0.5 drop-shadow-sm">{overBalance ? "⚠️" : "✨"}</div>
                    <div>
                      <p className={`font-black text-lg ${overBalance ? "text-red-700 dark:text-red-400" : "text-emerald-700 dark:text-emerald-400"}`}>
                        {days} Day{days !== 1 ? "s" : ""} Requested
                      </p>
                      <p className={`text-sm mt-0.5 font-medium ${overBalance ? "text-red-600 dark:text-red-300" : "text-emerald-600 dark:text-emerald-300"}`}>
                        {overBalance
                          ? `This exceeds your current balance of ${balance} days. Approval may be difficult.`
                          : `You will have ${balance - days} days remaining in your balance after approval.`}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <hr className="border-gray-100 dark:border-gray-800" />

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-black text-sm shadow-md">3</div>
                  <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Details</h2>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Reason for Leave</label>
                  <textarea rows="4" className="w-full px-4 py-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-gray-900 dark:text-white font-medium resize-none"
                    placeholder="Provide a clear, brief reason for your manager..."
                    onChange={e => setForm({ ...form, reason: e.target.value })} required />
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-4 items-center justify-end">
                <button type="button" onClick={() => navigate("/employee")} className="w-full sm:w-auto px-6 py-3.5 font-bold text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-all">
                  Cancel
                </button>
                <button type="submit" disabled={loading || !form.leaveType || !form.fromDate || !form.toDate || !form.reason} className="w-full sm:w-auto px-10 py-3.5 rounded-xl text-white font-black bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all shadow-xl shadow-indigo-500/30 disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2 transform hover:-translate-y-0.5">
                  {loading ? (
                    <><span className="animate-spin text-xl">↻</span> Submitting...</>
                  ) : (
                    <>Submit Request <span className="text-xl">→</span></>
                  )}
                </button>
              </div>
            </form>
          </div>

          <div className="space-y-6">

            <div className="bg-gradient-to-br from-indigo-500 to-blue-600 rounded-3xl p-8 text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-900/40 rounded-full blur-2xl translate-y-1/4 -translate-x-1/4 pointer-events-none" />

              <div className="relative z-10 text-center">
                <p className="text-indigo-100 font-bold uppercase tracking-widest text-xs mb-2">Available Balance</p>
                <div className="text-6xl font-black mb-1 tracking-tighter drop-shadow-md">
                  {balance}
                </div>
                <p className="text-indigo-100 text-sm font-bold">Days Remaining</p>
              </div>

              {selectedType && (
                <div className="relative z-10 mt-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex items-center gap-4 shadow-lg">
                  <div className="text-2xl">{selectedType.icon}</div>
                  <div>
                    <p className="font-bold text-sm text-white uppercase tracking-wider">{selectedType.value}</p>
                    <p className="text-xs text-indigo-100 font-medium">Selected Type</p>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-sm">
              <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider mb-5 flex items-center gap-2">
                <span className="text-indigo-500 text-lg">📋</span> Guidelines
              </h3>
              <ul className="space-y-5">
                {[
                  { icon: "📌", title: "Advance Notice", desc: "Submit requests at least 2 days prior to your leave date." },
                  { icon: "🚨", title: "Emergencies", desc: "Emergency leaves can be applied same-day with manager notification." },
                  { icon: "⏱", title: "Approval Time", desc: "Managers typically review and action requests within 24 hours." },
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <span className="text-xl mt-0.5">{item.icon}</span>
                    <div>
                      <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{item.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed font-medium">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ApplyLeave;