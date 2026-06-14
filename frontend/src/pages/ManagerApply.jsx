import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import Layout from "../components/Layout";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";

const LEAVE_TYPES = [
  { value: "Sick Leave", icon: "🤒" },
  { value: "Casual Leave", icon: "🌴" },
  { value: "Emergency Leave", icon: "🚨" },
  { value: "Maternity Leave", icon: "🤱" },
  { value: "Paternity Leave", icon: "👨‍👶" },
  { value: "Other", icon: "📋" },
];

const CATEGORIES = [
  { value: "Travel", icon: "✈️" },
  { value: "Food", icon: "🍽️" },
  { value: "Accommodation", icon: "🏨" },
  { value: "Office Supply", icon: "📦" },
  { value: "Medical", icon: "💊" },
  { value: "Client Entertainment", icon: "🤝", managerOnly: true },
  { value: "Team Meals", icon: "🍱", managerOnly: true },
  { value: "Software / Tools", icon: "💻", managerOnly: true },
  { value: "Other", icon: "📋" },
];

const LeaveForm = ({ user }) => {
  const navigate = useNavigate();
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
      toast.success("Leave request submitted! An Admin will review it.");
      setTimeout(() => navigate("/manager"), 1400);
    } catch (err) {
      toast.error(err.response?.data?.message || "Submission failed.");
    } finally {
      setLoading(false);
    }
  };

  const days = getDays();
  const balance = user?.leaveBalance ?? 20;
  const overBalance = days && days > balance;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">

      <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800/50">
        <span className="text-lg mt-0.5">🔒</span>
        <div>
          <p className="text-sm font-black text-teal-800 dark:text-teal-300">Admin Approval Required</p>
          <p className="text-xs text-teal-600 dark:text-teal-400 mt-0.5 font-medium">As a Manager, your leave requests are reviewed and approved by an Admin — not by other Managers.</p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-teal-600 flex items-center justify-center text-white text-xs font-black">1</span>
          Select Leave Type
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {LEAVE_TYPES.map(t => (
            <button type="button" key={t.value}
              onClick={() => setForm({ ...form, leaveType: t.value })}
              className={`relative flex flex-col items-center text-center gap-2 p-4 rounded-2xl border-2 transition-all ${form.leaveType === t.value
                ? "border-teal-500 bg-teal-50 dark:bg-teal-900/30 shadow-md -translate-y-0.5"
                : "border-gray-100 dark:border-gray-700 hover:border-teal-300 bg-white dark:bg-gray-800"}`}>
              {form.leaveType === t.value && (
                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-teal-500 shadow-[0_0_8px_rgba(20,184,166,0.8)]" />
              )}
              <span className="text-2xl">{t.icon}</span>
              <span className={`text-xs font-bold ${form.leaveType === t.value ? "text-teal-700 dark:text-teal-300" : "text-gray-600 dark:text-gray-400"}`}>{t.value}</span>
            </button>
          ))}
        </div>
      </div>

      <hr className="border-gray-100 dark:border-gray-700" />

      <div className="space-y-4">
        <h3 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-teal-600 flex items-center justify-center text-white text-xs font-black">2</span>
          Duration
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">From Date</label>
            <input type="date" required
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-gray-900 dark:text-white font-medium transition-all"
              onChange={e => setForm({ ...form, fromDate: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">To Date</label>
            <input type="date" required
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-gray-900 dark:text-white font-medium transition-all"
              onChange={e => setForm({ ...form, toDate: e.target.value })} />
          </div>
        </div>
        {days !== null && (
          <div className={`flex items-center gap-3 p-4 rounded-xl border ${overBalance ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800" : "bg-teal-50 dark:bg-teal-900/20 border-teal-200 dark:border-teal-800"}`}>
            <span className="text-2xl">{overBalance ? "⚠️" : "✅"}</span>
            <div>
              <p className={`font-black ${overBalance ? "text-red-700 dark:text-red-400" : "text-teal-700 dark:text-teal-400"}`}>{days} Day{days !== 1 ? "s" : ""} Requested</p>
              <p className={`text-xs font-medium ${overBalance ? "text-red-500" : "text-teal-500"}`}>
                {overBalance ? `Exceeds your balance of ${balance} days.` : `${balance - days} days remaining after approval.`}
              </p>
            </div>
          </div>
        )}
      </div>

      <hr className="border-gray-100 dark:border-gray-700" />

      <div className="space-y-4">
        <h3 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-teal-600 flex items-center justify-center text-white text-xs font-black">3</span>
          Reason
        </h3>
        <textarea rows="3" required
          className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-gray-900 dark:text-white font-medium resize-none transition-all"
          placeholder="Brief reason for your leave..."
          onChange={e => setForm({ ...form, reason: e.target.value })} />
      </div>

      <div className="flex gap-3 justify-end pt-2">
        <button type="button" onClick={() => navigate("/manager")}
          className="px-6 py-3 font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all">
          Cancel
        </button>
        <button type="submit"
          disabled={loading || !form.leaveType || !form.fromDate || !form.toDate || !form.reason}
          className="px-8 py-3 rounded-xl text-white font-black bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 transition-all shadow-lg shadow-teal-500/30 disabled:opacity-50 flex items-center gap-2 hover:-translate-y-0.5 transform">
          {loading ? <><span className="animate-spin">↻</span> Submitting...</> : <>Submit Request →</>}
        </button>
      </div>
    </form>
  );
};

const ReimbursementForm = ({ user }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ amount: "", category: "", description: "", expenseDate: "" });
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => data.append(k, v));
      if (receipt) data.append("receipt", receipt);
      await API.post("/reimbursements/apply", data, { headers: { "Content-Type": "multipart/form-data" } });
      toast.success("Reimbursement claim submitted!");
      setTimeout(() => navigate("/manager"), 1400);
    } catch (err) {
      toast.error(err.response?.data?.message || "Submission failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">

      <div className="space-y-4">
        <h3 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white text-xs font-black">1</span>
          Expense Category
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {CATEGORIES.map(c => (
            <button type="button" key={c.value}
              onClick={() => setForm({ ...form, category: c.value })}
              className={`relative flex flex-col items-center text-center gap-2 p-4 rounded-2xl border-2 transition-all ${form.category === c.value
                ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 shadow-md -translate-y-0.5"
                : "border-gray-100 dark:border-gray-700 hover:border-emerald-300 bg-white dark:bg-gray-800"}`}>
              {form.category === c.value && (
                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
              )}
              {c.managerOnly && (
                <span className="absolute top-2 left-2 text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-700/50">MGR</span>
              )}
              <span className="text-2xl">{c.icon}</span>
              <span className={`text-xs font-bold ${form.category === c.value ? "text-emerald-700 dark:text-emerald-300" : "text-gray-600 dark:text-gray-400"}`}>{c.value}</span>
            </button>
          ))}
        </div>
      </div>

      <hr className="border-gray-100 dark:border-gray-700" />

      <div className="space-y-4">
        <h3 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white text-xs font-black">2</span>
          Amount & Date
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount (₹)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₹</span>
              <input type="number" min="1" required
                className="w-full pl-9 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 dark:text-white font-black text-lg transition-all"
                placeholder="0.00" value={form.amount}
                onChange={e => setForm({ ...form, amount: e.target.value })} />
            </div>

            {parseFloat(form.amount) > 50000 && (
              <div className="flex items-start gap-2 mt-2 px-3 py-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50">
                <span className="text-base">⚠️</span>
                <p className="text-xs font-bold text-amber-700 dark:text-amber-400">Claims above ₹50,000 require additional Finance team verification and may take longer to process.</p>
              </div>
            )}
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Expense Date</label>
            <input type="date" required
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 dark:text-white font-medium transition-all"
              onChange={e => setForm({ ...form, expenseDate: e.target.value })} />
          </div>
        </div>
      </div>

      <hr className="border-gray-100 dark:border-gray-700" />

      <div className="space-y-4">
        <h3 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white text-xs font-black">3</span>
          Details & Proof
        </h3>
        <textarea rows="3" required
          className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 dark:text-white font-medium resize-none transition-all"
          placeholder="Describe this business expense..."
          onChange={e => setForm({ ...form, description: e.target.value })} />

        <label className={`block w-full rounded-2xl border-2 border-dashed p-5 text-center cursor-pointer transition-all ${receipt
          ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
          : "border-gray-300 dark:border-gray-600 hover:border-emerald-400 hover:bg-gray-50 dark:hover:bg-gray-700/50"}`}>
          <input type="file" accept=".jpg,.jpeg,.png,.pdf" className="hidden"
            onChange={e => setReceipt(e.target.files[0] || null)} />
          {receipt ? (
            <div className="flex flex-col items-center gap-1">
              <span className="text-2xl">📄</span>
              <p className="font-bold text-emerald-700 dark:text-emerald-300 text-sm">{receipt.name}</p>
              <p className="text-xs text-emerald-500">{(receipt.size / 1024).toFixed(1)} KB · Click to change</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1">
              <span className="text-2xl">📤</span>
              <p className="font-bold text-gray-600 dark:text-gray-300 text-sm">Upload Receipt</p>
              <p className="text-xs text-gray-400">JPG, PNG or PDF</p>
            </div>
          )}
        </label>
      </div>

      <div className="flex gap-3 justify-end pt-2">
        <button type="button" onClick={() => navigate("/manager")}
          className="px-6 py-3 font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all">
          Cancel
        </button>
        <button type="submit"
          disabled={loading || !form.category || !form.amount || !form.expenseDate || !form.description}
          className="px-8 py-3 rounded-xl text-white font-black bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 transition-all shadow-lg shadow-emerald-500/30 disabled:opacity-50 flex items-center gap-2 hover:-translate-y-0.5 transform">
          {loading ? <><span className="animate-spin">↻</span> Submitting...</> : <>Submit Claim →</>}
        </button>
      </div>
    </form>
  );
};

const ManagerApply = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState(null);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8 fade-in-up pb-10">

        <div className="relative overflow-hidden bg-gradient-to-r from-teal-700 via-emerald-700 to-teal-800 p-8 sm:p-10 rounded-3xl shadow-xl shadow-teal-900/30 text-white">
          <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-900/40 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/4 pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="flex items-center gap-2 text-sm text-teal-200 mb-3 font-bold uppercase tracking-wider">
                <Link to="/manager" className="hover:text-white transition-colors">Team Requests</Link>
                <span>/</span>
                <span className="text-white">My Apply</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white mb-2 drop-shadow-md tracking-tight">
                Submit a Request
              </h1>
              <p className="text-teal-100 text-sm max-w-md font-medium">
                As a Manager, choose what you'd like to submit — a personal leave request or a business expense claim.
              </p>
            </div>
            <div className="w-16 h-16 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shadow-xl ring-2 ring-white/30">
              📝
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

          <button
            onClick={() => setActiveTab(activeTab === "leave" ? null : "leave")}
            className={`group relative overflow-hidden rounded-3xl p-8 text-left transition-all duration-300 border-2 ${activeTab === "leave"
              ? "border-teal-500 bg-gradient-to-br from-teal-600 to-teal-700 text-white shadow-2xl shadow-teal-500/30 scale-[1.02]"
              : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-teal-400 hover:shadow-xl shadow-md"}`}
          >
            <div className={`absolute -top-6 -right-6 w-28 h-28 rounded-full blur-2xl transition-all ${activeTab === "leave" ? "bg-white/20" : "bg-teal-100 dark:bg-teal-900/20 group-hover:bg-teal-200/50"}`} />
            <div className="relative z-10">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-5 shadow-lg transition-all ${activeTab === "leave"
                ? "bg-white/20 ring-2 ring-white/30"
                : "bg-teal-50 dark:bg-teal-900/30 group-hover:bg-teal-100 dark:group-hover:bg-teal-900/50"}`}>
                🌴
              </div>
              <h2 className={`text-2xl font-black mb-1 tracking-tight ${activeTab === "leave" ? "text-white" : "text-gray-900 dark:text-white"}`}>
                Leave Request
              </h2>
              <p className={`text-sm font-medium ${activeTab === "leave" ? "text-teal-100" : "text-gray-500 dark:text-gray-400"}`}>
                Apply for sick, casual, emergency or any other personal leave.
              </p>
              <div className={`mt-4 inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider px-3 py-1.5 rounded-full transition-all ${activeTab === "leave"
                ? "bg-white/20 text-white"
                : "bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300"}`}>
                {activeTab === "leave" ? "✓ Selected — Fill form below" : "Click to select"}
              </div>
            </div>
          </button>

          <button
            onClick={() => setActiveTab(activeTab === "reimbursement" ? null : "reimbursement")}
            className={`group relative overflow-hidden rounded-3xl p-8 text-left transition-all duration-300 border-2 ${activeTab === "reimbursement"
              ? "border-emerald-500 bg-gradient-to-br from-emerald-600 to-emerald-700 text-white shadow-2xl shadow-emerald-500/30 scale-[1.02]"
              : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-emerald-400 hover:shadow-xl shadow-md"}`}
          >
            <div className={`absolute -top-6 -right-6 w-28 h-28 rounded-full blur-2xl transition-all ${activeTab === "reimbursement" ? "bg-white/20" : "bg-emerald-100 dark:bg-emerald-900/20 group-hover:bg-emerald-200/50"}`} />
            <div className="relative z-10">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-5 shadow-lg transition-all ${activeTab === "reimbursement"
                ? "bg-white/20 ring-2 ring-white/30"
                : "bg-emerald-50 dark:bg-emerald-900/30 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/50"}`}>
                💳
              </div>
              <h2 className={`text-2xl font-black mb-1 tracking-tight ${activeTab === "reimbursement" ? "text-white" : "text-gray-900 dark:text-white"}`}>
                Expense Claim
              </h2>
              <p className={`text-sm font-medium ${activeTab === "reimbursement" ? "text-emerald-100" : "text-gray-500 dark:text-gray-400"}`}>
                Submit travel, food, accommodation or any business expense.
              </p>
              <div className={`mt-4 inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider px-3 py-1.5 rounded-full transition-all ${activeTab === "reimbursement"
                ? "bg-white/20 text-white"
                : "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"}`}>
                {activeTab === "reimbursement" ? "✓ Selected — Fill form below" : "Click to select"}
              </div>
            </div>
          </button>
        </div>

        {activeTab && (
          <div className={`bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 shadow-xl border-2 transition-all fade-in-up ${activeTab === "leave"
            ? "border-teal-200 dark:border-teal-800/50 shadow-teal-100 dark:shadow-teal-900/10"
            : "border-emerald-200 dark:border-emerald-800/50 shadow-emerald-100 dark:shadow-emerald-900/10"}`}>

            <div className={`flex items-center gap-4 mb-8 pb-6 border-b ${activeTab === "leave" ? "border-teal-100 dark:border-teal-800/50" : "border-emerald-100 dark:border-emerald-800/50"}`}>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-lg ${activeTab === "leave"
                ? "bg-gradient-to-br from-teal-500 to-teal-700"
                : "bg-gradient-to-br from-emerald-500 to-emerald-700"}`}>
                {activeTab === "leave" ? "🌴" : "💳"}
              </div>
              <div>
                <h2 className="text-xl font-black text-gray-900 dark:text-white">
                  {activeTab === "leave" ? "Leave Request Form" : "Expense Claim Form"}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                  {activeTab === "leave"
                    ? `Your current leave balance: ${user?.leaveBalance ?? 20} days`
                    : "Attach receipt for faster processing"}
                </p>
              </div>
            </div>

            {activeTab === "leave"
              ? <LeaveForm user={user} />
              : <ReimbursementForm user={user} />
            }
          </div>
        )}

        {!activeTab && (
          <div className="text-center py-8 text-gray-400 dark:text-gray-600">
            <div className="text-4xl mb-3">☝️</div>
            <p className="font-bold text-sm">Select one of the options above to get started</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ManagerApply;
