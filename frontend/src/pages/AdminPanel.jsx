import { useEffect, useState } from "react";
import API from "../services/api";
import Layout from "../components/Layout";

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState({});
  const [toast, setToast] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await API.get("/users/all");
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = (userId, newRole) => {
    setSelectedRoles({ ...selectedRoles, [userId]: newRole });
  };

  const updateRole = async (userId) => {
    const role = selectedRoles[userId];
    if (!role) return;
    await API.put(`/users/${userId}/role`, { role });
    setToast(`Role updated to ${role}`);
    setTimeout(() => setToast(""), 3000);
    fetchUsers();
  };

  const roleBadge = (role) => {
    const styles = {
      Admin: "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300",
      Manager: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
      Employee: "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300",
    };
    return styles[role] || "bg-gray-100 text-gray-700";
  };

  return (
    <Layout>
      <div className="space-y-8 pb-10">

        
        {toast && (
          <div className="fixed top-20 right-4 z-50 bg-green-600 text-white px-5 py-3 rounded-xl shadow-2xl text-sm font-medium animate-bounce">
            ✅ {toast}
          </div>
        )}

        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-500 bg-clip-text text-transparent">
              Admin Panel
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Manage employees and assign roles across the system.
            </p>
          </div>
          <span className="self-start sm:self-auto px-4 py-2 rounded-full text-sm font-semibold bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 shadow">
            🛡 Administrator Access
          </span>
        </div>

        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            { label: "Total Users", count: users.length, color: "from-indigo-500 to-purple-500", icon: "👥" },
            { label: "Managers", count: users.filter(u => u.role === "Manager").length, color: "from-blue-500 to-cyan-500", icon: "🛠" },
            { label: "Employees", count: users.filter(u => u.role === "Employee").length, color: "from-green-500 to-emerald-500", icon: "👤" },
          ].map((stat) => (
            <div key={stat.label} className={`p-5 rounded-2xl bg-gradient-to-br ${stat.color} text-white shadow-lg`}>
              <div className="text-2xl mb-1">{stat.icon}</div>
              <p className="text-3xl font-extrabold">{stat.count}</p>
              <p className="text-sm opacity-80 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-5 sm:p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white">All Users</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">{users.length} users in the system</p>
          </div>

          
          <div className="block sm:hidden divide-y divide-gray-100 dark:divide-gray-700">
            {users.map((user) => (
              <div key={user._id} className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">{user.name}</p>
                    <p className="text-gray-500 dark:text-gray-400 text-xs">{user.email}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${roleBadge(user.role)}`}>
                    {user.role}
                  </span>
                </div>
                {user.role !== "Admin" && (
                  <div className="flex gap-2 items-center">
                    <select
                      className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                      value={selectedRoles[user._id] || user.role}
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                    >
                      <option value="Employee">Employee</option>
                      <option value="Manager">Manager</option>
                    </select>
                    <button
                      onClick={() => updateRole(user._id)}
                      className="px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow transition"
                    >
                      Update
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          
          <div className="hidden sm:block overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 text-left">Name</th>
                  <th className="px-6 py-4 text-left">Email</th>
                  <th className="px-6 py-4 text-left">Current Role</th>
                  <th className="px-6 py-4 text-left">Change Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/40 transition">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{user.name}</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${roleBadge(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {user.role !== "Admin" ? (
                        <div className="flex items-center gap-2">
                          <select
                            className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-indigo-400 outline-none"
                            value={selectedRoles[user._id] || user.role}
                            onChange={(e) => handleRoleChange(user._id, e.target.value)}
                          >
                            <option value="Employee">Employee</option>
                            <option value="Manager">Manager</option>
                          </select>
                          <button
                            onClick={() => updateRole(user._id)}
                            className="px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow transition"
                          >
                            Update
                          </button>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs italic">Protected</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminPanel;