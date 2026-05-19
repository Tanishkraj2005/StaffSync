import { useEffect, useState, useContext } from "react";
import API from "../services/api";
import Layout from "../components/Layout";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";

const StatusBadge = ({ status }) => {
  const cfg = {
    Approved: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700/50",
    Pending:  "bg-amber-100  text-amber-700  dark:bg-amber-900/40  dark:text-amber-300  border border-amber-200  dark:border-amber-700/50",
    Rejected: "bg-red-100    text-red-700    dark:bg-red-900/40    dark:text-red-300    border border-red-200    dark:border-red-700/50",
  };
  const dot = { Approved: "bg-emerald-500", Pending: "bg-amber-500", Rejected: "bg-red-500" };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${cfg[status] || "bg-gray-100 text-gray-700"}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot[status]}`} />
      {status}
    </span>
  );
};

const ManagerDashboard = () => {
  const { user } = useContext(AuthContext);
  const [leaves, setLeaves] = useState([]);
  const [reimbursements, setReimbursements] = useState([]);
  const [activeTab, setActiveTab] = useState("leaves");
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [rejectId, setRejectId] = useState(null);
  const [rejectType, setRejectType] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [viewModal, setViewModal] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [r1, r2] = await Promise.all([API.get("/leaves/all"), API.get("/reimbursements/all")]);
      setLeaves(Array.isArray(r1.data) ? r1.data : []);
      setReimbursements(Array.isArray(r2.data) ? r2.data : []);
    } catch { toast.error("Failed to load requests."); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const approve = async (id, type) => {
    try {
      if (type === "leave") await API.put(`/leaves/${id}/status`, { status: "Approved" });
      else await API.put(`/reimbursements/${id}/status`, { status: "Approved" });
      toast.success("Request approved!"); fetchData();
    } catch (err) { toast.error(err.response?.data?.message || "Failed."); }
  };

  const submitReject = async () => {
    if (!rejectReason.trim()) { toast.error("Reason required."); return; }
    try {
      if (rejectType === "leave")
        await API.put(`/leaves/${rejectId}/status`, { status: "Rejected", rejectionReason: rejectReason });
      else
        await API.put(`/reimbursements/${rejectId}/status`, { status: "Rejected", rejectionReason: rejectReason });
      toast.success("Request rejected.");
      setRejectId(null); setRejectReason(""); fetchData();
    } catch (err) { toast.error(err.response?.data?.message || "Failed."); }
  };

  const countBy = (arr, s) => arr.filter(i => i?.status === s).length;
  const totalPending = countBy(leaves, "Pending") + countBy(reimbursements, "Pending");

  const rawData = activeTab === "leaves" ? leaves : reimbursements;
  const filteredData = rawData
    .filter(i => statusFilter === "All" || i.status === statusFilter)
    .filter(i => {
      if (!search) return true;
      const name = i.user?.name?.toLowerCase() || "";
      const extra = activeTab === "leaves" ? i.leaveType?.toLowerCase() : i.description?.toLowerCase();
      return name.includes(search.toLowerCase()) || extra?.includes(search.toLowerCase());
    });

  const tabs = [
    { id: "leaves", label: "Leave Requests", icon: "📅", count: leaves.length, pending: countBy(leaves, "Pending"), color: "from-blue-600 to-indigo-600", pill: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300" },
    { id: "reimbursements", label: "Expense Claims", icon: "💳", count: reimbursements.length, pending: countBy(reimbursements, "Pending"), color: "from-violet-600 to-purple-600", pill: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300" },
  ];
  const activeTabCfg = tabs.find(t => t.id === activeTab);
  const STATUS_FILTERS = ["All", "Pending", "Approved", "Rejected"];

  return (
    <Layout>
      <div className="space-y-6 fade-in-up pb-10">

        <div className="relative overflow-hidden bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 rounded-2xl px-7 py-6 text-white shadow-xl">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.25),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(139,92,246,0.15),transparent_60%)]" />
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-black uppercase tracking-widest text-slate-400">Manager View</span>
                {totalPending > 0 && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-black">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                    {totalPending} pending
                  </span>
                )}
              </div>
              <h1 className="text-2xl font-black tracking-tight text-white">Team Requests</h1>
              <p className="text-slate-400 text-sm mt-1">Review and action your team's leave and expense requests.</p>
            </div>
            <div className="flex gap-3 flex-wrap">
              {[
                { label: "Leaves",   value: leaves.length,         icon: "📅", color: "bg-blue-500/20 border-blue-500/30 text-blue-300" },
                { label: "Expenses", value: reimbursements.length,  icon: "💳", color: "bg-violet-500/20 border-violet-500/30 text-violet-300" },
                { label: "Pending",  value: totalPending,           icon: "⏳", color: "bg-amber-500/20 border-amber-500/30 text-amber-300" },
                { label: "Approved", value: countBy(leaves, "Approved") + countBy(reimbursements, "Approved"), icon: "✅", color: "bg-emerald-500/20 border-emerald-500/30 text-emerald-300" },
              ].map(s => (
                <div key={s.label} className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border ${s.color}`}>
                  <span className="text-lg">{s.icon}</span>
                  <div>
                    <p className="text-lg font-black leading-none">{s.value}</p>
                    <p className="text-xs font-bold opacity-60 mt-0.5">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => { setActiveTab(tab.id); setStatusFilter("All"); setSearch(""); }}
              className={`relative overflow-hidden rounded-2xl px-6 py-5 text-left transition-all duration-300 border-2 ${activeTab === tab.id
                ? `bg-gradient-to-r ${tab.color} text-white border-transparent shadow-xl`
                : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:border-gray-300 hover:shadow-lg"}`}>
              <div className={`absolute -top-4 -right-4 w-20 h-20 rounded-full blur-xl opacity-30 bg-gradient-to-br ${tab.color}`} />
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`w-11 h-11 rounded-xl flex items-center justify-center text-2xl shadow-sm ${activeTab === tab.id ? "bg-white/20" : "bg-gray-50 dark:bg-gray-800"}`}>
                    {tab.icon}
                  </span>
                  <div>
                    <p className={`font-black text-base ${activeTab === tab.id ? "text-white" : "text-gray-900 dark:text-white"}`}>{tab.label}</p>
                    <p className={`text-xs font-medium ${activeTab === tab.id ? "text-white/70" : "text-gray-400"}`}>{tab.count} total requests</p>
                  </div>
                </div>
                {tab.pending > 0 && (
                  <span className={`px-3 py-1.5 rounded-xl text-xs font-black ${activeTab === tab.id ? "bg-white/20 text-white" : tab.pill}`}>
                    {tab.pending} pending
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-lg overflow-hidden">
          <div className={`bg-gradient-to-r ${activeTabCfg.color} h-1`} />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20">
            <div className="flex items-center gap-3">
              <span className="text-xl">{activeTabCfg.icon}</span>
              <div>
                <h2 className="text-sm font-black text-gray-900 dark:text-white">{activeTabCfg.label}</h2>
                <p className="text-xs text-gray-400 font-medium">{filteredData.length} result{filteredData.length !== 1 ? "s" : ""}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">🔍</span>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name..."
                  className="pl-7 pr-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all w-36" />
              </div>
              <div className="flex gap-1">
                {STATUS_FILTERS.map(s => (
                  <button key={s} onClick={() => setStatusFilter(s)}
                    className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${statusFilter === s
                      ? `bg-gradient-to-r ${activeTabCfg.color} text-white shadow-sm`
                      : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-6 space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="skeleton h-12 w-full rounded-xl" />)}</div>
            ) : filteredData.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="text-5xl mb-4 opacity-30">📭</div>
                <p className="text-sm font-bold text-gray-600 dark:text-gray-300">No requests found</p>
                <p className="text-xs text-gray-400 mt-1">Try adjusting the filters.</p>
              </div>
            ) : activeTab === "leaves" ? (
              <table className="w-full text-sm text-left">
                <thead className="bg-blue-50/60 dark:bg-blue-900/10 border-b border-blue-100 dark:border-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-black uppercase tracking-wider">
                  <tr>{["Employee","Type","Duration","Days","Status","Actions"].map(col => (
                    <th key={col} className={`px-5 py-3 ${col === "Actions" ? "text-right" : ""}`}>{col}</th>
                  ))}</tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-800/80">
                  {filteredData.map(leave => (
                    <tr key={leave._id} className="hover:bg-blue-50/30 dark:hover:bg-blue-900/5 transition-colors group">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                            {leave.user?.name?.[0]?.toUpperCase() || "?"}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 dark:text-white text-sm">{leave.user?.name || "Unknown"}</p>
                            <p className="text-xs text-gray-400">{leave.user?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs font-bold border border-blue-100 dark:border-blue-800/50">
                          {leave.leaveType}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400 text-xs font-medium">
                        {new Date(leave.fromDate).toLocaleDateString("en-IN",{day:"2-digit",month:"short"})} → {new Date(leave.toDate).toLocaleDateString("en-IN",{day:"2-digit",month:"short"})}
                      </td>
                      <td className="px-5 py-3.5 font-black text-gray-700 dark:text-gray-300 text-sm">
                        {leave.daysRequested||1}<span className="text-xs text-gray-400 ml-0.5">d</span>
                      </td>
                      <td className="px-5 py-3.5"><StatusBadge status={leave.status} /></td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => setViewModal({ title: "Leave Reason", text: leave.reason })}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30 transition border border-blue-100 dark:border-blue-800/50">Details</button>
                          {leave.status === "Pending" && leave.user?._id !== (user?.id || user?._id) && (<>
                            <button onClick={() => approve(leave._id, "leave")}
                              className="px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 dark:text-emerald-400 dark:bg-emerald-900/40 transition border border-emerald-200 dark:border-emerald-800/50">✓ Approve</button>
                            <button onClick={() => { setRejectId(leave._id); setRejectType("leave"); }}
                              className="px-3 py-1.5 rounded-lg text-xs font-bold text-red-700 bg-red-100 hover:bg-red-200 dark:text-red-400 dark:bg-red-900/40 transition border border-red-200 dark:border-red-800/50">✕ Reject</button>
                          </>)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table className="w-full text-sm text-left">
                <thead className="bg-violet-50/60 dark:bg-violet-900/10 border-b border-violet-100 dark:border-violet-900/30 text-violet-700 dark:text-violet-400 text-xs font-black uppercase tracking-wider">
                  <tr>{["Employee","Amount","Description","Date","Status","Actions"].map(col => (
                    <th key={col} className={`px-5 py-3 ${col === "Actions" ? "text-right" : ""}`}>{col}</th>
                  ))}</tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-800/80">
                  {filteredData.map(r => (
                    <tr key={r._id} className="hover:bg-violet-50/30 dark:hover:bg-violet-900/5 transition-colors group">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                            {r.user?.name?.[0]?.toUpperCase() || "?"}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 dark:text-white text-sm">{r.user?.name || "Unknown"}</p>
                            <p className="text-xs text-gray-400">{r.user?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 font-black text-gray-900 dark:text-white text-sm">₹{r.amount?.toLocaleString("en-IN")}</td>
                      <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400 text-xs font-medium max-w-[160px] truncate">
                        {r.description?.substring(0,32)}{r.description?.length > 32 ? "…" : ""}
                      </td>
                      <td className="px-5 py-3.5 text-gray-400 text-xs font-medium">
                        {new Date(r.expenseDate).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})}
                      </td>
                      <td className="px-5 py-3.5"><StatusBadge status={r.status} /></td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => setViewModal({ title: "Expense Description", text: r.description })}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold text-violet-600 bg-violet-50 hover:bg-violet-100 dark:text-violet-400 dark:bg-violet-900/30 transition border border-violet-100 dark:border-violet-800/50">Details</button>
                          {r.receiptUrl && (
                            <a href={`${(import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace("/api","")}${r.receiptUrl}`} target="_blank" rel="noreferrer"
                              className="px-3 py-1.5 rounded-lg text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-800 transition border border-gray-200 dark:border-gray-700">📎 Receipt</a>
                          )}
                          {r.status === "Pending" && r.user?._id !== (user?.id || user?._id) && (<>
                            <button onClick={() => approve(r._id, "reimbursement")}
                              className="px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 dark:text-emerald-400 dark:bg-emerald-900/40 transition border border-emerald-200 dark:border-emerald-800/50">✓ Approve</button>
                            <button onClick={() => { setRejectId(r._id); setRejectType("reimbursement"); }}
                              className="px-3 py-1.5 rounded-lg text-xs font-bold text-red-700 bg-red-100 hover:bg-red-200 dark:text-red-400 dark:bg-red-900/40 transition border border-red-200 dark:border-red-800/50">✕ Reject</button>
                          </>)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {viewModal && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setViewModal(null)}>
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm p-6 border border-gray-100 dark:border-gray-800" onClick={e => e.stopPropagation()}>
            <div className="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-xl mb-3">📝</div>
            <h3 className="font-black text-gray-900 dark:text-white text-base mb-2">{viewModal.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700">{viewModal.text}</p>
            <button onClick={() => setViewModal(null)} className="mt-4 w-full py-2.5 rounded-xl bg-gray-900 hover:bg-gray-800 dark:bg-white dark:text-gray-900 text-white text-sm font-bold transition">Close</button>
          </div>
        </div>
      )}

      {rejectId && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => { setRejectId(null); setRejectReason(""); }}>
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm p-6 border border-gray-100 dark:border-gray-800" onClick={e => e.stopPropagation()}>
            <div className="w-11 h-11 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-xl mb-3">⚠️</div>
            <h3 className="font-black text-gray-900 dark:text-white text-base mb-1">Reject Request</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Provide a reason so the employee understands.</p>
            <textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)} rows="3"
              placeholder="E.g. Insufficient balance, missing receipt..."
              className="w-full px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition text-gray-900 dark:text-white text-sm resize-none mb-4" />
            <div className="flex gap-3">
              <button onClick={() => { setRejectId(null); setRejectReason(""); }}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition">Cancel</button>
              <button onClick={submitReject} disabled={!rejectReason.trim()}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-sm font-bold shadow-md transition">Reject</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default ManagerDashboard;