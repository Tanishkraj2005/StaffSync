import { useEffect, useState } from "react";
import API from "../services/api";
import Layout from "../components/Layout";
import toast from "react-hot-toast";

const ROLE_CFG = {
  Admin:    { pill: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300", dot: "bg-purple-500" },
  Manager:  { pill: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",   dot: "bg-blue-500" },
  Employee: { pill: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300", dot: "bg-emerald-500" },
};

const StatCard = ({ label, value, colorTheme, icon }) => {
  const blobThemes = {
    indigo: "bg-indigo-100 dark:bg-indigo-900/40",
    blue: "bg-blue-100 dark:bg-blue-900/40",
    green: "bg-emerald-100 dark:bg-emerald-900/40",
  };
  const iconThemes = {
    indigo: "bg-indigo-500 text-white",
    blue: "bg-blue-500 text-white",
    green: "bg-emerald-500 text-white",
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 relative overflow-hidden flex justify-between items-center card-hover">
      <div className={`absolute -top-12 -right-8 w-28 h-32 rounded-3xl ${blobThemes[colorTheme]} transform rotate-12`} />
      
      <div className="relative z-10">
        <p className="text-gray-500 dark:text-gray-400 text-xs font-bold mb-1 uppercase tracking-wider">{label}</p>
        <p className="text-3xl font-black text-gray-900 dark:text-white mb-1">{value}</p>
      </div>
      
      <div className={`relative z-10 w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-sm ${iconThemes[colorTheme]}`}>
        {icon}
      </div>
    </div>
  );
};

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState({});
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await API.get("/users/all");
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleRoleChange = (userId, newRole) =>
    setSelectedRoles({ ...selectedRoles, [userId]: newRole });

  const updateRole = async (userId) => {
    const role = selectedRoles[userId];
    if (!role) return;
    try {
      await API.put(`/users/${userId}/role`, { role });
      toast.success(`Role updated to ${role}`);
      fetchUsers();
    } catch (err) {
      toast.error("Failed to update role");
    }
  };

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-8 fade-in-up pb-10">

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mb-2">
              Admin Panel
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Manage users and assign roles across the organisation.
            </p>
          </div>
          <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800/50 text-purple-700 dark:text-purple-400 shadow-sm flex-shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500 pulse-dot" />
            Admin Access
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 stagger">
          <StatCard label="Total Users" value={users.length} colorTheme="indigo" icon="👥" />
          <StatCard label="Managers"    value={users.filter(u => u.role === "Manager").length} colorTheme="blue" icon="🛠" />
          <StatCard label="Employees"   value={users.filter(u => u.role === "Employee").length} colorTheme="green" icon="👤" />
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden flex flex-col h-full relative">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/20">
            <div>
              <h2 className="font-bold text-gray-900 dark:text-white">All Users</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">{users.length} registered accounts</p>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
              <input
                type="text"
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition w-full sm:w-64 shadow-sm"
              />
            </div>
          </div>

          {loading ? (
            <div className="p-8 space-y-4">
              {[...Array(5)].map((_, i) => <div key={i} className="skeleton h-12 w-full" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-16 text-center">
              <div className="text-5xl mb-4 opacity-50">👤</div>
              <p className="text-lg font-bold text-gray-800 dark:text-gray-200">No users found</p>
            </div>
          ) : (
            <div className="flex-1 overflow-x-auto">
              <table className="w-full text-sm text-left whitespace-nowrap">
                <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 font-bold border-b border-gray-100 dark:border-gray-800">
                  <tr>
                    {["User", "Email", "Current Role", "Change Role", "Action"].map(h => (
                      <th key={h} className="px-6 py-4 uppercase tracking-wider text-xs">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {filtered.map(user => {
                    const cfg = ROLE_CFG[user.role] || ROLE_CFG.Employee;
                    return (
                      <tr key={user._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-sm shadow-sm flex-shrink-0">
                              {user.name?.[0]?.toUpperCase() || "?"}
                            </div>
                            <p className="font-bold text-gray-900 dark:text-white">{user.name}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-xs font-medium">{user.email}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${cfg.pill}`}>
                            <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {user.role !== "Admin" ? (
                            <select
                              className="px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition font-medium"
                              value={selectedRoles[user._id] || user.role}
                              onChange={(e) => handleRoleChange(user._id, e.target.value)}
                            >
                              <option value="Employee">Employee</option>
                              <option value="Manager">Manager</option>
                            </select>
                          ) : (
                            <span className="text-xs text-gray-400 font-medium italic">🔒 Protected Account</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {user.role !== "Admin" ? (
                            <button onClick={() => updateRole(user._id)}
                              className="px-4 py-2 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all flex items-center gap-1">
                              <span>💾</span> Save
                            </button>
                          ) : (
                            <span className="text-xs text-gray-400">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AdminPanel;