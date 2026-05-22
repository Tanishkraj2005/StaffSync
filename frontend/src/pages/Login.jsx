import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { GoogleLogin } from "@react-oauth/google";

const Login = () => {
  const { login, loginWithGoogle } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const redirect = (role) => {
    if (role === "Employee") navigate("/employee");
    if (role === "Manager") navigate("/manager");
    if (role === "Admin") navigate("/admin");
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      const user = await loginWithGoogle(credentialResponse.credential);
      redirect(user.role);
    } catch (err) {
      setError("Google login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      redirect(user.role);
    } catch {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex overflow-hidden"
      style={{ background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4c1d95 70%, #6d28d9 100%)" }}>

      <div className="hidden lg:flex flex-col justify-between w-[46%] p-14 relative overflow-hidden">

        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-white/5" />
        <div className="absolute -bottom-24 -right-12 w-96 h-96 rounded-full bg-purple-500/10" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center font-black text-white text-lg shadow-lg">
            S
          </div>
          <span className="text-white text-2xl font-black tracking-tight">StaffSync</span>
        </div>

        <div className="relative z-10 space-y-6">
          <div>
            <h1 className="text-5xl font-black text-white leading-tight">
              Manage your<br />
              <span className="text-purple-300">team effortlessly.</span>
            </h1>
            <p className="text-white/55 text-base mt-4 leading-relaxed max-w-sm">
              StaffSync brings leave management, expense reimbursements, and team administration into one clean platform.
            </p>
          </div>

          <div className="space-y-3">
            {[
              { icon: "✅", text: "Apply & track leaves instantly" },
              { icon: "💳", text: "Submit expense claims with receipts" },
              { icon: "🛡", text: "Role-based access for every team" },
            ].map(f => (
              <div key={f.text} className="flex items-center gap-3 bg-white/10 border border-white/10 rounded-xl px-4 py-3">
                <span>{f.icon}</span>
                <span className="text-white/80 text-sm font-medium">{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-white/25 text-xs">© 2025 StaffSync. All rights reserved.</p>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto"
        style={{ background: "rgba(255,255,255,0.06)", backdropFilter: "blur(12px)" }}>

        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 sm:p-10 space-y-5">

          <div className="lg:hidden flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl animated-gradient flex items-center justify-center text-white font-black text-sm">S</div>
            <span className="text-xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">StaffSync</span>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900">Welcome back 👋</h2>
            <p className="text-gray-500 text-sm mt-1">Sign in to your StaffSync account</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">Email</label>
              <input type="email" placeholder="you@company.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition"
                onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">Password</label>
              <input type="password" placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition"
                onChange={e => setForm({ ...form, password: e.target.value })} required />
              <div className="flex justify-end">
                <Link to="/forgot-password" className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold">
                  Forgot password?
                </Link>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-60 text-sm">
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-gray-400 text-xs">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError("Google login failed.")}
              useOneTap
              theme="outline"
              size="large"
              shape="pill"
            />
          </div>

          <p className="text-center text-gray-500 text-sm">
            Don't have an account?{" "}
            <Link to="/register" className="text-indigo-600 hover:text-indigo-700 font-semibold">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;