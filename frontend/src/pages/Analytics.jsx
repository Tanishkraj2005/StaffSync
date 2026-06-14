import { useState, useEffect, useContext } from "react";
import API from "../services/api";
import Layout from "../components/Layout";
import { AuthContext } from "../context/AuthContext";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area,
} from "recharts";

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

const StatCard = ({ label, value, sub, color, icon }) => (
  <div className="glass rounded-2xl p-5 card-hover border border-white/10 relative overflow-hidden">
    <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-10"
      style={{ background: `radial-gradient(circle, ${color}, transparent 70%)`, transform: "translate(30%, -30%)" }} />
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-4xl font-black mt-1" style={{ color }}>{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
      </div>
      <span className="text-3xl">{icon}</span>
    </div>
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass border border-white/20 rounded-xl px-4 py-3 shadow-xl text-sm">
      <p className="font-bold text-gray-800 dark:text-white mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }} className="font-semibold">
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
};

const Analytics = () => {
  const { user } = useContext(AuthContext);
  const [summary, setSummary] = useState(null);
  const [leaveMonthly, setLeaveMonthly] = useState([]);
  const [leaveTypesData, setLeaveTypesData] = useState([]);
  const [reimbMonthly, setReimbMonthly] = useState([]);
  const [topTakers, setTopTakers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [s, lm, lt, rm, tt] = await Promise.all([
          API.get("/analytics/summary"),
          API.get("/analytics/leaves-by-month"),
          API.get("/analytics/leave-types"),
          API.get("/analytics/reimbursement-by-month"),
          API.get("/analytics/top-leave-takers"),
        ]);
        setSummary(s.data);
        setLeaveMonthly(lm.data);
        setLeaveTypesData(lt.data);
        setReimbMonthly(rm.data);
        setTopTakers(tt.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return (
    <Layout>
      <div className="space-y-6">
        <div className="skeleton h-10 w-64 rounded-xl" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-32 rounded-2xl" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-64 rounded-2xl" />)}
        </div>
      </div>
    </Layout>
  );

  return (
    <Layout>
      <div className="space-y-8 fade-in-up">

        <div>
          <h1 className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
            Analytics
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Overview of leave trends, reimbursements, and team activity.
          </p>
        </div>

        {summary && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Total Users"      value={summary.totalUsers}      icon="👥" color="#6366f1" />
            <StatCard label="Total Leaves"     value={summary.totalLeaves}     icon="📅" color="#10b981" sub={`${summary.leaves.Pending} pending`} />
            <StatCard label="Reimbursements"   value={summary.totalReimbursements} icon="💳" color="#f59e0b" sub={`${summary.reimbursements.Pending} pending`} />
            <StatCard label="₹ Total Paid" value={`₹${(summary.totalReimbursementAmount || 0).toLocaleString()}`} icon="💰" color="#8b5cf6" />
          </div>
        )}

        {summary && (
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Approved Leaves", value: summary.leaves.Approved, color: "#10b981" },
              { label: "Pending Leaves",  value: summary.leaves.Pending,  color: "#f59e0b" },
              { label: "Rejected Leaves", value: summary.leaves.Rejected, color: "#ef4444" },
            ].map(s => (
              <div key={s.label} className="glass rounded-2xl p-4 text-center card-hover">
                <p className="text-3xl font-black" style={{ color: s.color }}>{s.value}</p>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-wider">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          <div className="glass rounded-2xl p-6">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Leaves by Month</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={leaveMonthly} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb20" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="Approved" fill="#10b981" radius={[4,4,0,0]} />
                <Bar dataKey="Pending"  fill="#f59e0b" radius={[4,4,0,0]} />
                <Bar dataKey="Rejected" fill="#ef4444" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="glass rounded-2xl p-6">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Leave Type Breakdown</h3>
            {leaveTypesData.length === 0 ? (
              <div className="h-[240px] flex items-center justify-center text-gray-400">No data yet</div>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={leaveTypesData} dataKey="value" nameKey="name" cx="50%" cy="50%"
                    outerRadius={90} innerRadius={45} paddingAngle={4} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}>
                    {leaveTypesData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val) => [`${val} requests`, ""]} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="glass rounded-2xl p-6">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Monthly Reimbursement Spend (₹)</h3>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={reimbMonthly}>
                <defs>
                  <linearGradient id="reimb" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb20" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="amount" stroke="#8b5cf6" strokeWidth={2} fill="url(#reimb)" name="Amount (₹)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="glass rounded-2xl p-6">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Top Leave Takers</h3>
            {topTakers.length === 0 ? (
              <div className="h-[240px] flex items-center justify-center text-gray-400">No approved leaves yet</div>
            ) : (
              <div className="space-y-3">
                {topTakers.map((t, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl animated-gradient flex items-center justify-center text-white font-black text-xs flex-shrink-0">
                      {t.name?.[0]?.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">{t.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full rounded-full"
                            style={{
                              width: `${Math.min((t.days / (topTakers[0]?.days || 1)) * 100, 100)}%`,
                              background: `hsl(${240 - i * 30}, 70%, 60%)`
                            }} />
                        </div>
                        <span className="text-xs font-bold text-gray-500 dark:text-gray-400 w-12 text-right">{t.days}d</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Analytics;
