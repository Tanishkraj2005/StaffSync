import { useEffect, useState, useContext } from "react";
import API from "../services/api";
import Layout from "../components/Layout";
import { AuthContext } from "../context/AuthContext";
import { generateLeavePDF, generateReimbursementPDF } from "../utils/pdfGenerator";
import { Link } from "react-router-dom";

const StatusBadge = ({ status }) => {
  const cfg = {
    Approved: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30",
    Pending: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300 border-amber-200 dark:border-amber-500/30",
    Rejected: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300 border-red-200 dark:border-red-500/30",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shadow-sm ${cfg[status]}`}>
      {status === "Approved" ? "✓" : status === "Rejected" ? "✕" : "…"} {status}
    </span>
  );
};

const StatCard = ({ title, value, subtitle, icon, theme }) => {
  const themes = {
    blue: "bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20 text-blue-900 dark:text-blue-100",
    orange: "bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20 text-amber-900 dark:text-amber-100",
    pink: "bg-pink-50 dark:bg-pink-500/10 border-pink-200 dark:border-pink-500/20 text-pink-900 dark:text-pink-100",
    green: "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-900 dark:text-emerald-100",
  };
  
  const iconThemes = {
    blue: "bg-gradient-to-br from-blue-400 to-blue-600 text-white shadow-blue-500/40",
    orange: "bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-amber-500/40",
    pink: "bg-gradient-to-br from-pink-400 to-pink-600 text-white shadow-pink-500/40",
    green: "bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-emerald-500/40",
  };
  
  const textThemes = {
    blue: "text-blue-600 dark:text-blue-400",
    orange: "text-amber-600 dark:text-amber-400",
    pink: "text-pink-600 dark:text-pink-400",
    green: "text-emerald-600 dark:text-emerald-400",
  };

  return (
    <div className={`rounded-3xl p-6 shadow-md border relative overflow-hidden flex justify-between items-center card-hover transition-all ${themes[theme]}`}>
      <div className={`absolute -bottom-8 -right-8 w-32 h-32 rounded-full opacity-20 blur-2xl ${iconThemes[theme].split(' ')[1]}`} />
      
      <div className="relative z-10">
        <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${textThemes[theme]}`}>{title}</p>
        <p className="text-4xl font-black mb-1">{value}</p>
        <p className="text-xs font-semibold opacity-70">{subtitle}</p>
      </div>
      
      <div className={`relative z-10 w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-lg ${iconThemes[theme]}`}>
        {icon}
      </div>
    </div>
  );
};

const EmployeeDashboard = () => {
  const { user } = useContext(AuthContext);
  const [leaves, setLeaves] = useState([]);
  const [reimbursements, setReimbursements] = useState([]);
  const [liveBalance, setLiveBalance] = useState(null);
  const [viewText, setViewText] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [r1, r2, r3] = await Promise.all([
          API.get("/leaves/my-leaves"),
          API.get("/reimbursements/my"),
          API.get("/auth/me"),
        ]);
        setLeaves(Array.isArray(r1.data) ? r1.data : []);
        setReimbursements(Array.isArray(r2.data) ? r2.data : []);
        setLiveBalance(r3.data?.leaveBalance ?? null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const count = (data, status) => data.filter(i => i?.status === status).length;
  const balance = liveBalance ?? user?.leaveBalance ?? 20;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <Layout>
      <div className="space-y-8 fade-in-up pb-10">

        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-600 rounded-3xl p-8 sm:p-10 shadow-xl shadow-indigo-500/20 relative overflow-hidden text-white border-0">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjIpIi8+PC9zdmc+')] opacity-20 mix-blend-overlay" />
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/20 blur-[80px] rounded-full pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-indigo-900/40 blur-[80px] rounded-full pointer-events-none" />
          
          <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white text-5xl font-black shadow-2xl ring-4 ring-white/40">
              {user?.name?.charAt(0) || "U"}
            </div>
            
            <div className="text-center md:text-left flex-1">
              <p className="text-indigo-100 font-bold tracking-wider text-xs mb-2 uppercase drop-shadow-md">
                {greeting}
              </p>
              <h1 className="text-3xl sm:text-5xl font-black text-white mb-4 drop-shadow-lg tracking-tight">
                Welcome back, {user?.name?.split(' ')[0]}!
              </h1>
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-3">
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white text-sm font-bold shadow-sm border border-white/20">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
                  {user?.role}
                </span>
                {user?.department && (
                  <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-white text-sm font-bold shadow-sm border border-white/10">
                    🏢 {user?.department}
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
               <Link to="/apply-leave" className="bg-white text-indigo-600 hover:bg-indigo-50 py-3.5 px-6 rounded-xl shadow-xl shadow-indigo-900/20 font-black transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2">
                 <span>📅</span> Apply Leave
               </Link>
               <Link to="/apply-reimbursement" className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white py-3.5 px-6 rounded-xl shadow-xl font-bold transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2">
                 <span>💳</span> Claim Expense
               </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger">
          <StatCard 
            title="Leave Balance" 
            value={balance} 
            subtitle="Days remaining" 
            icon="🌴" 
            theme="blue" 
          />
          <StatCard 
            title="Pending Leaves" 
            value={count(leaves, "Pending")} 
            subtitle="Awaiting approval" 
            icon="⏳" 
            theme="orange" 
          />
          <StatCard 
            title="Pending Claims" 
            value={count(reimbursements, "Pending")} 
            subtitle="Reimbursements" 
            icon="🧾" 
            theme="pink" 
          />
          <StatCard 
            title="Approved Claims" 
            value={`₹${reimbursements.filter(r => r.status === "Approved").reduce((a, b) => a + b.amount, 0).toLocaleString("en-IN")}`} 
            subtitle="Total reimbursed" 
            icon="💰" 
            theme="green" 
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-8">

          <div className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-lg border border-indigo-100 dark:border-indigo-500/20 flex flex-col h-full relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-400 to-indigo-600" />
            <div className="flex items-center justify-between px-6 py-5 border-b border-indigo-50 dark:border-indigo-500/10 bg-indigo-50/50 dark:bg-indigo-500/5">
              <div>
                <h2 className="text-lg font-black text-indigo-900 dark:text-indigo-100 flex items-center gap-2">
                  <span className="text-indigo-500 text-xl">📅</span> My Leaves
                </h2>
                <p className="text-xs font-bold text-indigo-500 dark:text-indigo-400 mt-1">{leaves.length} request{leaves.length !== 1 ? "s" : ""} total</p>
              </div>
              <Link to="/apply-leave" className="text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/20 px-4 py-2 rounded-xl transition">
                + Apply
              </Link>
            </div>

            <div className="flex-1 overflow-x-auto">
              {loading ? (
                <div className="p-6 space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="skeleton h-12 w-full rounded-xl" />)}</div>
              ) : leaves.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-center h-full">
                  <div className="text-5xl mb-4 opacity-40">📋</div>
                  <p className="text-base font-bold text-indigo-900 dark:text-indigo-200">No leaves yet</p>
                  <p className="text-sm text-indigo-500 dark:text-indigo-400 mt-1">You haven't requested any time off.</p>
                </div>
              ) : (
                <table className="w-full text-sm text-left">
                  <thead className="bg-indigo-50/80 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 font-bold border-b border-indigo-100 dark:border-indigo-500/20 uppercase tracking-wider text-xs">
                    <tr>
                      <th className="px-6 py-4">Type</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-indigo-50 dark:divide-indigo-500/10">
                    {leaves.slice(0, 5).map(leave => (
                      <tr key={leave._id} className="hover:bg-indigo-50/50 dark:hover:bg-indigo-500/5 transition-colors">
                        <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">{leave.leaveType}</td>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300 text-xs font-semibold">
                          {new Date(leave.fromDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })} → 
                          {new Date(leave.toDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                        </td>
                        <td className="px-6 py-4"><StatusBadge status={leave.status} /></td>
                        <td className="px-6 py-4 text-right">
                          {leave.status === "Approved" && (
                            <button onClick={() => generateLeavePDF(leave, user)} className="text-indigo-700 dark:text-indigo-300 font-bold text-xs bg-indigo-100 dark:bg-indigo-900/40 hover:bg-indigo-200 dark:hover:bg-indigo-900/60 px-3 py-1.5 rounded-lg transition-colors border border-indigo-200 dark:border-indigo-700 shadow-sm">
                              📄 Slip
                            </button>
                          )}
                          {leave.status === "Rejected" && leave.rejectionReason && (
                            <button onClick={() => setViewText(leave.rejectionReason)} className="text-red-700 dark:text-red-300 font-bold text-xs bg-red-100 dark:bg-red-900/40 hover:bg-red-200 dark:hover:bg-red-900/60 px-3 py-1.5 rounded-lg transition-colors border border-red-200 dark:border-red-700 shadow-sm">
                              Reason
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            {leaves.length > 5 && (
              <div className="bg-indigo-50/50 dark:bg-indigo-900/20 px-6 py-3 text-center border-t border-indigo-100 dark:border-indigo-500/20">
                <span className="text-xs text-indigo-600 dark:text-indigo-400 font-bold">Showing latest 5 requests</span>
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-lg border border-purple-100 dark:border-purple-500/20 flex flex-col h-full relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-pink-500" />
            <div className="flex items-center justify-between px-6 py-5 border-b border-purple-50 dark:border-purple-500/10 bg-purple-50/50 dark:bg-purple-500/5">
              <div>
                <h2 className="text-lg font-black text-purple-900 dark:text-purple-100 flex items-center gap-2">
                  <span className="text-purple-500 text-xl">💳</span> My Expenses
                </h2>
                <p className="text-xs font-bold text-purple-500 dark:text-purple-400 mt-1">{reimbursements.length} claim{reimbursements.length !== 1 ? "s" : ""} total</p>
              </div>
              <Link to="/apply-reimbursement" className="text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-md shadow-purple-500/20 px-4 py-2 rounded-xl transition">
                + Claim
              </Link>
            </div>

            <div className="flex-1 overflow-x-auto">
              {loading ? (
                <div className="p-6 space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="skeleton h-12 w-full rounded-xl" />)}</div>
              ) : reimbursements.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-center h-full">
                  <div className="text-5xl mb-4 opacity-40">🧾</div>
                  <p className="text-base font-bold text-purple-900 dark:text-purple-200">No expenses yet</p>
                  <p className="text-sm text-purple-500 dark:text-purple-400 mt-1">You haven't submitted any expense claims.</p>
                </div>
              ) : (
                <table className="w-full text-sm text-left">
                  <thead className="bg-purple-50/80 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300 font-bold border-b border-purple-100 dark:border-purple-500/20 uppercase tracking-wider text-xs">
                    <tr>
                      <th className="px-6 py-4">Amount</th>
                      <th className="px-6 py-4">Description</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-purple-50 dark:divide-purple-500/10">
                    {reimbursements.slice(0, 5).map(r => (
                      <tr key={r._id} className="hover:bg-purple-50/50 dark:hover:bg-purple-500/5 transition-colors">
                        <td className="px-6 py-4 font-black text-gray-900 dark:text-white tracking-tight">₹{r.amount}</td>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300 text-xs font-medium truncate max-w-[120px]">
                          {r.description}
                        </td>
                        <td className="px-6 py-4"><StatusBadge status={r.status} /></td>
                        <td className="px-6 py-4 text-right">
                          {r.status === "Approved" && (
                            <button onClick={() => generateReimbursementPDF(r, user)} className="text-purple-700 dark:text-purple-300 font-bold text-xs bg-purple-100 dark:bg-purple-900/40 hover:bg-purple-200 dark:hover:bg-purple-900/60 px-3 py-1.5 rounded-lg transition-colors border border-purple-200 dark:border-purple-700 shadow-sm">
                              📄 Slip
                            </button>
                          )}
                          {r.status === "Rejected" && r.rejectionReason && (
                            <button onClick={() => setViewText(r.rejectionReason)} className="text-red-700 dark:text-red-300 font-bold text-xs bg-red-100 dark:bg-red-900/40 hover:bg-red-200 dark:hover:bg-red-900/60 px-3 py-1.5 rounded-lg transition-colors border border-red-200 dark:border-red-700 shadow-sm">
                              Reason
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            {reimbursements.length > 5 && (
              <div className="bg-purple-50/50 dark:bg-purple-900/20 px-6 py-3 text-center border-t border-purple-100 dark:border-purple-500/20">
                <span className="text-xs text-purple-600 dark:text-purple-400 font-bold">Showing latest 5 claims</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {viewText && (
        <div className="fixed inset-0 bg-gray-900/60 flex items-center justify-center z-50 backdrop-blur-md p-4" onClick={() => setViewText(null)}>
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 w-full max-w-sm shadow-2xl border border-gray-100 dark:border-gray-800 transform transition-all" onClick={e => e.stopPropagation()}>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center text-2xl mb-5 shadow-lg shadow-red-500/30 text-white">✕</div>
            <h3 className="font-black text-gray-900 dark:text-white text-2xl mb-3 tracking-tight">Rejection Reason</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 font-medium">{viewText}</p>
            <button onClick={() => setViewText(null)} className="mt-6 w-full py-3.5 rounded-xl bg-gray-900 hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 text-white text-sm font-bold shadow-xl transition-all hover:-translate-y-0.5">
              Close
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default EmployeeDashboard;