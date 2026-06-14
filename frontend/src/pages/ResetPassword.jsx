import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) return toast.error("Passwords do not match.");
    if (password.length < 6) return toast.error("Password must be at least 6 characters.");
    setLoading(true);
    try {
      await API.post(`/auth/reset-password/${token}`, { password });
      toast.success("Password reset! Please sign in.");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Reset failed. Link may have expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex overflow-hidden"
      style={{ background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4c1d95 70%, #6d28d9 100%)" }}>
      <div className="hidden lg:flex flex-col justify-between w-[46%] p-14 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/5" />
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center font-black text-white text-lg">S</div>
          <span className="text-white text-2xl font-black tracking-tight">StaffSync</span>
        </div>
        <div className="relative z-10 space-y-4">
          <h1 className="text-5xl font-black text-white leading-tight">Set a new<br /><span className="text-purple-300">password.</span></h1>
          <p className="text-white/55 text-base">Choose a strong password to protect your account.</p>
        </div>
        <p className="relative z-10 text-white/25 text-xs">© 2025 StaffSync. All rights reserved.</p>
      </div>

      <div className="flex-1 flex items-center justify-center p-6"
        style={{ background: "rgba(255,255,255,0.06)", backdropFilter: "blur(12px)" }}>
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 sm:p-10 space-y-5">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900">New Password</h2>
            <p className="text-gray-500 text-sm mt-1">Enter and confirm your new password.</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">New Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="Min. 6 characters" required minLength={6}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition" />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">Confirm Password</label>
              <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
                placeholder="Repeat password" required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg disabled:opacity-60 transition-all">
              {loading ? "Resetting…" : "Reset Password"}
            </button>
          </form>
          <p className="text-center text-gray-500 text-sm">
            <Link to="/" className="text-indigo-600 hover:text-indigo-700 font-semibold">Back to Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
