import { useState, useEffect, useContext } from "react";
import API from "../services/api";
import Layout from "../components/Layout";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [form, setForm] = useState({ name: "", phone: "", department: "", bio: "" });
  const [loading, setLoading] = useState(false);
  const [leaveStats, setLeaveStats] = useState({ total: 0, approved: 0, pending: 0, rejected: 0 });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        phone: user.phone || "",
        department: user.department || "",
        bio: user.bio || "",
      });
    }

    API.get("/leaves/my-leaves").then(res => {
      const leaves = Array.isArray(res.data) ? res.data : [];
      setLeaveStats({
        total: leaves.length,
        approved: leaves.filter(l => l.status === "Approved").length,
        pending: leaves.filter(l => l.status === "Pending").length,
        rejected: leaves.filter(l => l.status === "Rejected").length,
      });
    }).catch(console.error);
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.put("/users/profile", form);
      toast.success("Profile updated successfully!");
      if (setUser) setUser(prev => ({ ...prev, ...res.data.user }));
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const balance = user?.leaveBalance ?? 20;
  const leaveUsed = 20 - balance;
  const leavePercent = Math.min(100, Math.max(0, Math.round((balance / 20) * 100)));

  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-8 fade-in-up pb-10">

        <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-10 mb-8 flex flex-col sm:flex-row items-center gap-6 sm:gap-8 relative overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">

          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
          <div className="absolute bottom-0 right-32 w-64 h-64 bg-pink-500/10 rounded-full blur-[80px] translate-y-1/2 pointer-events-none" />

          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white dark:bg-gray-800 p-2 shadow-lg ring-1 ring-gray-100 dark:ring-gray-700 flex-shrink-0 z-10">
            <div className="w-full h-full rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-4xl font-black shadow-inner">
              {user?.name?.[0]?.toUpperCase() || "U"}
            </div>
          </div>

          <div className="flex-1 text-center sm:text-left z-10">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2 justify-center sm:justify-start">
              <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight leading-none">
                {user?.name || "User"}
              </h1>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800 tracking-wider uppercase">
                {user?.role || "Employee"}
              </span>
            </div>
            <p className="text-gray-500 dark:text-gray-400 font-medium text-sm sm:text-base">
              {user?.email}
            </p>
          </div>

          <div className="z-10 mt-4 sm:mt-0">
            <button onClick={() => window.scrollTo({ top: 500, behavior: 'smooth' })} className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-indigo-600 dark:hover:bg-indigo-50 font-bold py-3 px-6 rounded-xl text-sm transition-all shadow-md flex items-center gap-2">
              <span>✏️</span> Edit Profile
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <div className="space-y-6">

            <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-5 flex items-center gap-2">
                <span className="text-indigo-500 text-lg">👤</span> About Me
              </h3>

              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-500 text-lg shadow-sm">🏢</div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Department</p>
                    <p className="text-sm font-black text-gray-900 dark:text-white mt-0.5">{user?.department || "Not specified"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center text-purple-500 text-lg shadow-sm">📞</div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Phone</p>
                    <p className="text-sm font-black text-gray-900 dark:text-white mt-0.5">{user?.phone || "Not specified"}</p>
                  </div>
                </div>
                {user?.bio && (
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-pink-50 dark:bg-pink-900/30 flex items-center justify-center text-pink-500 text-lg shadow-sm">📝</div>
                    <div>
                      <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Bio</p>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-1 italic leading-relaxed">"{user.bio}"</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-8 text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />

              <p className="text-indigo-100 font-bold uppercase tracking-widest text-xs mb-4">Leave Overview</p>

              <div className="flex items-end justify-between mb-3">
                <div>
                  <div className="text-6xl font-black tracking-tighter drop-shadow-md">{balance}</div>
                  <p className="text-indigo-100 text-sm font-bold">Days Available</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-black drop-shadow-md">{leaveUsed}</div>
                  <p className="text-indigo-100 text-xs font-bold">Days Used</p>
                </div>
              </div>

              <div className="w-full bg-black/20 rounded-full h-3 mt-6 mb-2 shadow-inner">
                <div className="bg-white h-3 rounded-full shadow-[0_0_12px_rgba(255,255,255,0.8)]" style={{ width: `${leavePercent}%` }}></div>
              </div>
              <p className="text-xs font-bold text-indigo-100 text-right">{leavePercent}% Remaining</p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-5 flex items-center gap-2">
                <span className="text-purple-500 text-lg">📊</span> Request History
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-100 dark:border-emerald-800/30">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
                    <span className="text-xs text-emerald-800 dark:text-emerald-300 font-bold uppercase tracking-wider">Approved</span>
                  </div>
                  <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">{leaveStats.approved}</span>
                </div>
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-100 dark:border-amber-800/30">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]"></div>
                    <span className="text-xs text-amber-800 dark:text-amber-300 font-bold uppercase tracking-wider">Pending</span>
                  </div>
                  <span className="text-xl font-black text-amber-600 dark:text-amber-400">{leaveStats.pending}</span>
                </div>
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border border-red-100 dark:border-red-800/30">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div>
                    <span className="text-xs text-red-800 dark:text-red-300 font-bold uppercase tracking-wider">Rejected</span>
                  </div>
                  <span className="text-xl font-black text-red-600 dark:text-red-400">{leaveStats.rejected}</span>
                </div>
              </div>
            </div>

          </div>

          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-800 shadow-sm">

              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-500 text-2xl shadow-sm">
                  ⚙️
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Profile Settings</h2>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Update your personal information</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Full Name</label>
                    <input type="text" className="w-full px-4 py-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-gray-900 dark:text-white font-medium"
                      value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your full name" required />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email Address</label>
                    <input type="email" className="w-full px-4 py-3.5 rounded-xl bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed font-medium"
                      value={user?.email || ""} disabled title="Email cannot be changed" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Phone Number</label>
                    <input type="tel" className="w-full px-4 py-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-gray-900 dark:text-white font-medium"
                      value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+91 9876543210" />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Department</label>
                    <input type="text" className="w-full px-4 py-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-gray-900 dark:text-white font-medium"
                      value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} placeholder="Engineering, HR, etc." />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Short Bio</label>
                  <textarea rows="4" className="w-full px-4 py-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-gray-900 dark:text-white resize-none font-medium"
                    value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} placeholder="Write a short introduction about yourself..." />
                </div>

                <div className="pt-4 flex justify-end">
                  <button type="submit" disabled={loading} className="w-full sm:w-auto px-10 py-3.5 rounded-xl text-white font-black bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all shadow-xl shadow-indigo-500/30 disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2 transform hover:-translate-y-0.5">
                    {loading ? (
                      <><span className="animate-spin text-xl">↻</span> Saving...</>
                    ) : (
                      <>Save Changes <span className="text-xl">✓</span></>
                    )}
                  </button>
                </div>

              </form>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
};

export default Profile;
