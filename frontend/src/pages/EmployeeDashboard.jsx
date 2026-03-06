import { useEffect, useState } from "react";
import API from "../services/api";
import Layout from "../components/Layout";

const EmployeeDashboard = () => {
  const [leaves, setLeaves] = useState([]);
  const [reimbursements, setReimbursements] = useState([]);
  const [viewText, setViewText] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get("/leaves/my-leaves");
        setLeaves(Array.isArray(res.data) ? res.data : []);

        const res2 = await API.get("/reimbursements/my");
        setReimbursements(Array.isArray(res2.data) ? res2.data : []);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      }
    };

    fetchData();
  }, []);

  const countByStatus = (data, status) => {
    if (!Array.isArray(data)) return 0;
    return data.filter((item) => item?.status === status).length;
  };

  return (
    <Layout>
      <div className="space-y-12">

        {/* TOP HEADER  */}
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-extrabold 
            bg-gradient-to-r from-indigo-600 to-purple-600 
            bg-clip-text text-transparent tracking-wide">
            Employee Dashboard
          </h1>

          <span className="px-5 py-2 rounded-full text-sm font-semibold
            bg-indigo-100 text-indigo-700 dark:bg-indigo-700 dark:text-white shadow">
            👤 Employee Access
          </span>
        </div>

        {/* SUMMARY BOXES  */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            Overview
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* Approved */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 
                dark:from-green-900 dark:to-green-800 border border-green-300 dark:border-green-700 shadow-lg">
              <h3 className="text-xl font-semibold text-green-800 dark:text-green-300 mb-4">
                Approved
              </h3>

              <div className="flex justify-between items-center">
                <div>
                  <span className="text-gray-700 dark:text-gray-300 text-sm">Leaves</span>
                  <p className="text-3xl font-extrabold text-green-700 dark:text-green-400">
                    {countByStatus(leaves, "Approved")}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-gray-700 dark:text-gray-300 text-sm">Reimbursements</span>
                  <p className="text-3xl font-extrabold text-green-700 dark:text-green-400">
                    {countByStatus(reimbursements, "Approved")}
                  </p>
                </div>
              </div>
            </div>

            {/* Pending */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-yellow-50 to-yellow-100
                dark:from-yellow-900 dark:to-yellow-800 border border-yellow-300 dark:border-yellow-700 shadow-lg">
              <h3 className="text-xl font-semibold text-yellow-800 dark:text-yellow-300 mb-4">
                Pending
              </h3>

              <div className="flex justify-between items-center">
                <div>
                  <span className="text-gray-700 dark:text-gray-300 text-sm">Leaves</span>
                  <p className="text-3xl font-extrabold text-yellow-600 dark:text-yellow-300">
                    {countByStatus(leaves, "Pending")}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-gray-700 dark:text-gray-300 text-sm">Reimbursements</span>
                  <p className="text-3xl font-extrabold text-yellow-600 dark:text-yellow-300">
                    {countByStatus(reimbursements, "Pending")}
                  </p>
                </div>
              </div>
            </div>

            {/* Rejected */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-red-50 to-red-100
                dark:from-red-900 dark:to-red-800 border border-red-300 dark:border-red-700 shadow-lg">
              <h3 className="text-xl font-semibold text-red-800 dark:text-red-300 mb-4">
                Rejected
              </h3>

              <div className="flex justify-between items-center">
                <div>
                  <span className="text-gray-700 dark:text-gray-300 text-sm">Leaves</span>
                  <p className="text-3xl font-extrabold text-red-600 dark:text-red-300">
                    {countByStatus(leaves, "Rejected")}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-gray-700 dark:text-gray-300 text-sm">Reimbursements</span>
                  <p className="text-3xl font-extrabold text-red-600 dark:text-red-300">
                    {countByStatus(reimbursements, "Rejected")}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* LEAVES & REIMBURSEMENTS SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* LEAVES TABLE */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              My Leaves
            </h2>

            <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl 
                border border-gray-200 dark:border-gray-700">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                  <tr>
                    <th className="p-3 text-left">Type</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-left">Reason</th>
                  </tr>
                </thead>

                <tbody>
                  {leaves.map((leave) => (
                    <tr key={leave._id} className="border-t dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                      <td className="p-3">{leave.leaveType}</td>

                      <td className="p-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold 
                            ${leave.status === "Approved"
                              ? "bg-green-100 text-green-700 dark:bg-green-700 dark:text-white"
                              : leave.status === "Rejected"
                                ? "bg-red-100 text-red-700 dark:bg-red-700 dark:text-white"
                                : "bg-yellow-100 text-yellow-700 dark:bg-yellow-700 dark:text-white"
                            }
                          `}
                        >
                          {leave.status}
                        </span>
                      </td>

                      <td className="p-3">
                        {leave.status === "Rejected" ? (
                          <button
                            onClick={() => setViewText(leave.rejectionReason)}
                            className="bg-red-100 dark:bg-red-700 text-red-700 dark:text-white 
                              text-xs px-3 py-1 rounded-md border border-red-300 dark:border-red-600 
                              hover:bg-red-200 dark:hover:bg-red-600 transition"
                          >
                            View Reason
                          </button>
                        ) : (
                          <span className="text-gray-400 text-xs">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* REIMBURSEMENTS TABLE */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              My Reimbursements
            </h2>

            <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl 
                border border-gray-200 dark:border-gray-700">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                  <tr>
                    <th className="p-3 text-left">Amount</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-left">Reason</th>
                  </tr>
                </thead>

                <tbody>
                  {reimbursements.map((r) => (
                    <tr key={r._id} className="border-t dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                      <td className="p-3">₹ {r.amount}</td>

                      <td className="p-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold 
                            ${r.status === "Approved"
                              ? "bg-green-100 text-green-700 dark:bg-green-700 dark:text-white"
                              : r.status === "Rejected"
                                ? "bg-red-100 text-red-700 dark:bg-red-700 dark:text-white"
                                : "bg-yellow-100 text-yellow-700 dark:bg-yellow-700 dark:text-white"
                            }
                          `}
                        >
                          {r.status}
                        </span>
                      </td>

                      <td className="p-3">
                        {r.status === "Rejected" ? (
                          <button
                            onClick={() => setViewText(r.rejectionReason)}
                            className="bg-red-100 dark:bg-red-700 text-red-700 dark:text-white 
                              text-xs px-3 py-1 rounded-md border border-red-300 dark:border-red-600 
                              hover:bg-red-200 dark:hover:bg-red-600 transition"
                          >
                            View Reason
                          </button>
                        ) : (
                          <span className="text-gray-400 text-xs">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>

      {/* MODAL */}
      {viewText && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-2xl w-full max-w-md border border-gray-300 dark:border-gray-700">
            <h3 className="text-lg font-bold mb-3 text-gray-900 dark:text-white">
              Rejection Reason
            </h3>

            <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
              {viewText}
            </p>

            <div className="flex justify-end">
              <button
                onClick={() => setViewText(null)}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default EmployeeDashboard;