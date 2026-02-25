import { useEffect, useState } from "react";
import API from "../services/api";
import Layout from "../components/Layout";

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState({});

  const fetchUsers = async () => {
    const res = await API.get("/users/all");
    setUsers(res.data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = (userId, newRole) => {
    setSelectedRoles({
      ...selectedRoles,
      [userId]: newRole,
    });
  };

  const updateRole = async (userId) => {
    const role = selectedRoles[userId];
    if (!role) return;

    await API.put(`/users/${userId}/role`, { role });

    // ✅ SHOW ALERT AFTER SUCCESSFUL UPDATE
    alert(`Role updated to ${role}`);

    fetchUsers();
  };

  return (
    <Layout>
      <div
        className="bg-white dark:bg-gray-800 
        p-6 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 
        max-w-6xl mx-auto"
      >
        {/* Heading */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
              Admin Panel
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
              Manage all users and assign appropriate roles.
            </p>
          </div>

          <span className="px-4 py-2 rounded-full text-sm font-medium 
            bg-indigo-100 text-indigo-700 dark:bg-indigo-600 dark:text-white shadow">
            🛡 Administrator Access
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-gray-300 dark:border-gray-700">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-200 dark:bg-gray-700">
              <tr className="text-left text-gray-700 dark:text-gray-300">
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Current Role</th>
                <th className="p-3">Change Role</th>
              </tr>
            </thead>

            <tbody className="bg-white dark:bg-gray-800">
              {users.map((user) => (
                <tr
                  key={user._id}
                  className="border-t border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  <td className="p-3">{user.name}</td>
                  <td className="p-3">{user.email}</td>

                  <td className="p-3">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-semibold
                      bg-indigo-100 text-indigo-700 dark:bg-indigo-600 dark:text-white"
                    >
                      {user.role}
                    </span>
                  </td>

                  <td className="p-3">
                    {user.role !== "Admin" ? (
                      <div className="flex flex-wrap gap-2 items-center">
                        <select
                          className="border border-gray-400 dark:border-gray-600 rounded-lg 
                            px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700
                            text-gray-800 dark:text-gray-200"
                          value={selectedRoles[user._id] || user.role}
                          onChange={(e) =>
                            handleRoleChange(user._id, e.target.value)
                          }
                        >
                          <option value="Employee">Employee</option>
                          <option value="Manager">Manager</option>
                        </select>

                        <button
                          onClick={() => updateRole(user._id)}
                          className="bg-green-500 hover:bg-green-600 
                            transition text-white px-4 py-2 rounded-lg text-sm shadow"
                        >
                          Update
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">Protected</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default AdminPanel;