import { useEffect, useState } from "react";
import API from "../services/api";
import Layout from "../components/Layout";

const ManagerDashboard = () => {
  const [leaves, setLeaves] = useState([]);
  const [reimbursements, setReimbursements] = useState([]);

  const [activeTab, setActiveTab] = useState("leaves");

  const [rejectId, setRejectId] = useState(null);
  const [rejectType, setRejectType] = useState("");
  const [rejectReason, setRejectReason] = useState("");

  const [viewText, setViewText] = useState(null);

  const fetchData = async () => {
    try {
      const res = await API.get("/leaves/all");
      setLeaves(Array.isArray(res.data) ? res.data : []);

      const res2 = await API.get("/reimbursements/all");
      setReimbursements(Array.isArray(res2.data) ? res2.data : []);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const approve = async (id, type) => {
    if (type === "leave") {
      await API.put(`/leaves/${id}/status`, { status: "Approved" });
    } else {
      await API.put(`/reimbursements/${id}/status`, { status: "Approved" });
    }
    fetchData();
  };

  const openRejectModal = (id, type) => {
    setRejectId(id);
    setRejectType(type);
  };

  const submitReject = async () => {
    if (!rejectReason) return;

    if (rejectType === "leave") {
      await API.put(`/leaves/${rejectId}/status`, {
        status: "Rejected",
        rejectionReason: rejectReason,
      });
    } else {
      await API.put(`/reimbursements/${rejectId}/status`, {
        status: "Rejected",
        rejectionReason: rejectReason,
      });
    }

    setRejectId(null);
    setRejectReason("");
    fetchData();
  };

  const ActionButtons = ({ item, type }) => (
    <div className="flex gap-2">
      {item.status === "Pending" && (
        <>
          <button
            onClick={() => approve(item._id, type)}
            className="px-4 py-1.5 text-sm rounded-lg font-medium bg-green-600 hover:bg-green-700 text-white shadow transition"
          >
            Approve
          </button>

          <button
            onClick={() => openRejectModal(item._id, type)}
            className="px-4 py-1.5 text-sm rounded-lg font-medium bg-red-600 hover:bg-red-700 text-white shadow transition"
          >
            Reject
          </button>
        </>
      )}
    </div>
  );

  const countByStatus = (data, status) => {
    if (!Array.isArray(data)) return 0;
    return data.filter((item) => item?.status === status).length;
  };

  const activeData = activeTab === "leaves" ? leaves : reimbursements;

  return (
    <Layout>
      <div className="space-y-10">

        
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Manager Dashboard
          </h1>

          <span className="px-5 py-2 rounded-full text-sm font-semibold bg-purple-100 text-purple-700 dark:bg-purple-700 dark:text-white shadow">
            🛠 Manager Access
          </span>
        </div>

        
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => setActiveTab("leaves")}
            className={`px-6 py-2.5 rounded-xl font-semibold transition shadow 
              ${activeTab === "leaves"
                ? "bg-indigo-600 text-white shadow-lg"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
          >
            Leave Requests
          </button>

          <button
            onClick={() => setActiveTab("reimbursements")}
            className={`px-6 py-2.5 rounded-xl font-semibold transition shadow 
              ${activeTab === "reimbursements"
                ? "bg-indigo-600 text-white shadow-lg"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
          >
            Reimbursement Requests
          </button>
        </div>

        
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            {activeTab === "leaves" ? "Leave Overview" : "Reimbursement Overview"}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

            
            <div className="p-6 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 
              dark:from-green-900 dark:to-green-800 border border-green-300 dark:border-green-700 shadow-lg">

              <h3 className="text-xl font-semibold text-green-800 dark:text-green-300 mb-4">
                Approved
              </h3>

              <p className="text-4xl font-extrabold text-green-700 dark:text-green-300">
                {countByStatus(activeData, "Approved")}
              </p>
            </div>

            
            <div className="p-6 rounded-2xl bg-gradient-to-br from-yellow-50 to-yellow-100 
              dark:from-yellow-900 dark:to-yellow-800 border border-yellow-300 dark:border-yellow-700 shadow-lg">

              <h3 className="text-xl font-semibold text-yellow-800 dark:text-yellow-300 mb-4">
                Pending
              </h3>

              <p className="text-4xl font-extrabold text-yellow-700 dark:text-yellow-300">
                {countByStatus(activeData, "Pending")}
              </p>
            </div>

            
            <div className="p-6 rounded-2xl bg-gradient-to-br from-red-50 to-red-100 
              dark:from-red-900 dark:to-red-800 border border-red-300 dark:border-red-700 shadow-lg">

              <h3 className="text-xl font-semibold text-red-800 dark:text-red-300 mb-4">
                Rejected
              </h3>

              <p className="text-4xl font-extrabold text-red-700 dark:text-red-300">
                {countByStatus(activeData, "Rejected")}
              </p>
            </div>

          </div>
        </div>

        
        {activeTab === "leaves" && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Leave Requests</h2>

            <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl 
              border border-gray-200 dark:border-gray-700">

              <table className="min-w-full text-sm">
                <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                  <tr>
                    <th className="p-3 text-left">Employee</th>
                    <th className="p-3 text-left">Type</th>
                    <th className="p-3 text-left">From</th>
                    <th className="p-3 text-left">To</th>
                    <th className="p-3 text-left">Reason</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-left">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {leaves.map((leave) => (
                    <tr key={leave._id} className="border-t dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                      <td className="p-3">{leave.user.name}</td>
                      <td className="p-3">{leave.leaveType}</td>
                      <td className="p-3">{new Date(leave.fromDate).toLocaleDateString()}</td>
                      <td className="p-3">{new Date(leave.toDate).toLocaleDateString()}</td>

                      <td className="p-3">
                        <button
                          onClick={() => setViewText(leave.reason)}
                          className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm"
                        >
                          View
                        </button>
                      </td>

                      <td className="p-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold 
                            ${leave.status === "Approved"
                              ? "bg-green-100 text-green-700 dark:bg-green-700 dark:text-white"
                              : leave.status === "Rejected"
                                ? "bg-red-100 text-red-700 dark:bg-red-700 dark:text-white"
                                : "bg-yellow-100 text-yellow-700 dark:bg-yellow-700 dark:text-white"
                            }`}
                        >
                          {leave.status}
                        </span>
                      </td>

                      <td className="p-3">
                        <ActionButtons item={leave} type="leave" />
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          </div>
        )}

        
        {activeTab === "reimbursements" && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Reimbursement Requests</h2>

            <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl 
              border border-gray-200 dark:border-gray-700">

              <table className="min-w-full text-sm">
                <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                  <tr>
                    <th className="p-3 text-left">Employee</th>
                    <th className="p-3 text-left">Amount</th>
                    <th className="p-3 text-left">Date</th>
                    <th className="p-3 text-left">Description</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-left">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {reimbursements.map((r) => (
                    <tr key={r._id} className="border-t dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                      <td className="p-3">{r.user.name}</td>
                      <td className="p-3">₹ {r.amount}</td>
                      <td className="p-3">{new Date(r.expenseDate).toLocaleDateString()}</td>

                      <td className="p-3">
                        <button
                          onClick={() => setViewText(r.description)}
                          className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm"
                        >
                          View
                        </button>
                      </td>

                      <td className="p-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold 
                            ${r.status === "Approved"
                              ? "bg-green-100 text-green-700 dark:bg-green-700 dark:text-white"
                              : r.status === "Rejected"
                                ? "bg-red-100 text-red-700 dark:bg-red-700 dark:text-white"
                                : "bg-yellow-100 text-yellow-700 dark:bg-yellow-700 dark:text-white"
                            }`}
                        >
                          {r.status}
                        </span>
                      </td>

                      <td className="p-3">
                        <ActionButtons item={r} type="reimbursement" />
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          </div>
        )}

        
        {viewText && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-2xl w-full max-w-md border border-gray-300 dark:border-gray-700">
              <h3 className="text-lg font-bold mb-3 text-gray-900 dark:text-white">Details</h3>

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

        
        {rejectId && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl w-full max-w-md border border-gray-300 dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
                Enter Rejection Reason
              </h3>

              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded-xl bg-gray-50 dark:bg-gray-700 dark:text-white mb-4"
                rows="4"
              />

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setRejectId(null)}
                  className="px-4 py-2 border border-gray-400 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  Cancel
                </button>

                <button
                  onClick={submitReject}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl shadow"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </Layout>
  );
};

export default ManagerDashboard;