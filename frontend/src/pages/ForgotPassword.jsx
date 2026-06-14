import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post("/auth/forgot-password", { email });
      setSent(true);
      toast.success("Reset link sent! Check your email.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send reset link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex overflow-hidden"
      style={{ background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4c1d95 70%, #6d28d9 100%)" }}>

      <div className="hidden lg:flex flex-col justify-between w-[46%] p-14 relative overflow-hidden">
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-white/5" />
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center font-black text-white text-lg">S</div>
          <span className="text-white text-2xl font-black tracking-tight">StaffSync</span>
        </div>
        <div className="relative z-10 space-y-4">
          <h1 className="text-5xl font-black text-white leading-tight">Forgot your<br /><span className="text-purple-300">password?</span></h1>
          <p className="text-white/55 text-base leading-relaxed">No worries — enter your email and we'll send you a reset link.</p>
        </div>
        <p className="relative z-10 text-white/25 text-xs">© 2025 StaffSync. All rights reserved.</p>
      </div>

      <div className="flex-1 flex items-center justify-center p-6"
        style={{ background: "rgba(255,255,255,0.06)", backdropFilter: "blur(12px)" }}>

        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 sm:p-10 space-y-5">
          <div className="lg:hidden flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl animated-gradient flex items-center justify-center text-white font-black text-sm">S</div>
            <span className="text-xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">StaffSync</span>
          </div>

          {sent ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center text-3xl mx-auto">✅</div>
              <h2 className="text-2xl font-black text-gray-900">Email Sent!</h2>
              <p className="text-gray-500 text-sm">If <strong>{email}</strong> has an account, you'll receive a reset link within a few minutes.</p>
              <Link to="/" className="block w-full py-3 rounded-xl text-center font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 transition hover:from-indigo-700 hover:to-purple-700">
                Back to Sign In
              </Link>
            </div>
          ) : (
            <>
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-gray-900">Reset Password</h2>
                <p className="text-gray-500 text-sm mt-1">We'll send a reset link to your email.</p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">Email Address</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="you@company.com" required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition" />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl disabled:opacity-60 transition-all">
                  {loading ? "Sending…" : "Send Reset Link"}
                </button>
              </form>
              <p className="text-center text-gray-500 text-sm">
                Remember your password? <Link to="/" className="text-indigo-600 hover:text-indigo-700 font-semibold">Sign In</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
