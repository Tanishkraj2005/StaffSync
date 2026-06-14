import { useState, useEffect } from "react";
import API from "../services/api";
import Layout from "../components/Layout";

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async (p = 1) => {
    setLoading(true);
    try {
      const res = await API.get(`/audit-logs?page=${p}&limit=20`);
      setLogs(res.data.logs);
      setTotal(res.data.total);
      setPages(res.data.pages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLogs(page); }, [page]);

  const actionBadge = (action) => {
    const cfg = {
      ROLE_UPDATED:     "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
      LEAVE_APPROVED:   "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
      LEAVE_REJECTED:   "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
      REIMB_APPROVED:   "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
      REIMB_REJECTED:   "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
    };
    return cfg[action] || "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
  };

  return (
    <Layout>
      <div className="space-y-8 fade-in-up">

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
              Audit Logs
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {total} total system events recorded.
            </p>
          </div>
          <span className="px-4 py-2 rounded-full text-xs font-bold bg-red-500/10 border border-red-500/30 text-red-400">
            🔐 Admin Only
          </span>
        </div>

        <div className="glass rounded-2xl overflow-hidden border border-white/10 dark:border-white/5">
          {loading ? (
            <div className="p-8 space-y-3">
              {[...Array(8)].map((_, i) => <div key={i} className="skeleton h-10 w-full" />)}
            </div>
          ) : logs.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-4xl mb-2">📋</p>
              <p className="text-gray-500 dark:text-gray-400 font-medium">No audit logs yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-white/8 dark:border-white/5">
                    {["Time", "Action", "Performed By", "Target", "Details"].map(h => (
                      <th key={h} className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {logs.map(log => (
                    <tr key={log._id} className="hover:bg-indigo-500/5 transition-colors">
                      <td className="px-5 py-4 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        {new Date(log.createdAt).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${actionBadge(log.action)}`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg animated-gradient flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                            {log.performedBy?.name?.[0]?.toUpperCase() || "?"}
                          </div>
                          <span className="text-gray-800 dark:text-gray-200 font-medium text-xs">{log.performedBy?.name || "System"}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-xs text-gray-500 dark:text-gray-400">
                        {log.targetUser?.name || "—"}
                      </td>
                      <td className="px-5 py-4 text-xs text-gray-600 dark:text-gray-400 max-w-xs truncate">
                        {log.details || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {pages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="px-4 py-2 rounded-xl text-sm font-semibold border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 transition">
              ← Prev
            </button>
            <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Page {page} of {pages}</span>
            <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages}
              className="px-4 py-2 rounded-xl text-sm font-semibold border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 transition">
              Next →
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AuditLogs;
