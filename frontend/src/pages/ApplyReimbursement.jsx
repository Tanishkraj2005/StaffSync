import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import Layout from "../components/Layout";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";

const CATEGORIES = [
  { value: "Travel", icon: "✈️", desc: "Flights, trains, cab fares" },
  { value: "Food", icon: "🍽️", desc: "Business meals & entertainment" },
  { value: "Accommodation", icon: "🏨", desc: "Hotel & lodging expenses" },
  { value: "Office Supply", icon: "📦", desc: "Stationery, equipment" },
  { value: "Medical", icon: "💊", desc: "Health-related expenses" },
  { value: "Other", icon: "📋", desc: "Any other business expense" },
];

const ApplyReimbursement = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [form, setForm] = useState({ amount: "", category: "", description: "", expenseDate: "" });
  const [loading, setLoading] = useState(false);
  const [receipt, setReceipt] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => data.append(k, v));
      if (receipt) data.append("receipt", receipt);
      await API.post("/reimbursements/apply", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Reimbursement claim submitted!");
      setTimeout(() => navigate("/employee"), 1400);
    } catch (err) {
      toast.error(err.response?.data?.message || "Submission failed.");
    } finally {
      setLoading(false);
    }
  };

  const selectedCat = CATEGORIES.find(c => c.value === form.category);
  const amount = parseFloat(form.amount) || 0;

  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-8 fade-in-up pb-10">

        <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 p-8 sm:p-10 rounded-3xl shadow-xl shadow-purple-500/20 text-white border-0">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-900/40 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/4 pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="flex items-center gap-2 text-sm text-purple-100 mb-3 font-bold uppercase tracking-wider">
                <Link to="/employee" className="hover:text-white transition-colors">Dashboard</Link>
                <span>/</span>
                <span className="text-white">Expense Claim</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white mb-2 drop-shadow-md tracking-tight">
                Claim Reimbursement
              </h1>
              <p className="text-purple-100 text-sm max-w-xl font-medium">
                Submit your business expense details below. Be sure to attach a clear receipt for faster processing.
              </p>
            </div>
            <div className="w-16 h-16 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shadow-xl ring-2 ring-white/40">
              💳
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-800 shadow-lg shadow-gray-200/50 dark:shadow-none space-y-8 relative overflow-hidden">

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-black text-sm shadow-md">1</div>
                  <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Expense Category</h2>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {CATEGORIES.map(c => (
                    <button type="button" key={c.value}
                      onClick={() => setForm({ ...form, category: c.value })}
                      className={`relative flex flex-col items-center text-center gap-2 p-4 rounded-2xl border-2 transition-all duration-200 ${form.category === c.value
                          ? "border-pink-400 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 shadow-md shadow-pink-500/10 transform -translate-y-1"
                          : "border-gray-100 dark:border-gray-800 hover:border-pink-200 dark:hover:border-pink-700 bg-white dark:bg-gray-900 hover:shadow-sm"
                        }`}>
                      {form.category === c.value && (
                        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-pink-500 shadow-[0_0_8px_rgba(236,72,153,0.8)]" />
                      )}
                      <span className="text-3xl mb-1">{c.icon}</span>
                      <span className={`text-xs font-bold uppercase tracking-wider ${form.category === c.value ? "text-pink-700 dark:text-pink-300" : "text-gray-600 dark:text-gray-400"}`}>
                        {c.value}
                      </span>
                    </button>
                  ))}
                </div>
                <input type="hidden" value={form.category} required />
              </div>

              <hr className="border-gray-100 dark:border-gray-800" />

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-black text-sm shadow-md">2</div>
                  <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Amount & Date</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₹</span>
                      <input type="number" min="1" className="w-full pl-9 pr-4 py-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-gray-900 dark:text-white font-black text-lg"
                        placeholder="0.00" value={form.amount}
                        onChange={e => setForm({ ...form, amount: e.target.value })} required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date of Expense</label>
                    <input type="date" className="w-full px-4 py-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-gray-900 dark:text-white font-medium"
                      onChange={e => setForm({ ...form, expenseDate: e.target.value })} required />
                  </div>
                </div>
              </div>

              <hr className="border-gray-100 dark:border-gray-800" />

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-black text-sm shadow-md">3</div>
                  <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Details & Proof</h2>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</label>
                    <textarea rows="3" className="w-full px-4 py-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-gray-900 dark:text-white font-medium resize-none"
                      placeholder="Provide context for this expense (e.g. Client dinner with XYZ...)"
                      onChange={e => setForm({ ...form, description: e.target.value })} required />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Receipt Document <span className="normal-case text-gray-400 font-medium opacity-80">(Highly Recommended)</span>
                    </label>
                    <label className={`relative block w-full rounded-2xl border-2 border-dashed p-6 text-center cursor-pointer transition-all duration-200 ${receipt
                        ? "border-pink-500 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 shadow-sm"
                        : "border-gray-300 dark:border-gray-700 hover:border-pink-400 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      }`}>
                      <input type="file" accept=".jpg,.jpeg,.png,.pdf" className="hidden"
                        onChange={e => setReceipt(e.target.files[0] || null)} />

                      {receipt ? (
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl text-white shadow-md">📄</div>
                          <div>
                            <p className="font-bold text-pink-700 dark:text-pink-300">{receipt.name}</p>
                            <p className="text-xs text-pink-500 mt-1 font-medium">{(receipt.size / 1024).toFixed(1)} KB • Click to change file</p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-2xl text-gray-500">📤</div>
                          <div>
                            <p className="font-bold text-gray-700 dark:text-gray-300">Click to upload receipt</p>
                            <p className="text-xs text-gray-500 mt-1 font-medium">JPG, PNG, or PDF format (Max 5MB)</p>
                          </div>
                        </div>
                      )}
                    </label>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-4 items-center justify-end">
                <button type="button" onClick={() => navigate("/employee")} className="w-full sm:w-auto px-6 py-3.5 font-bold text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-all">
                  Cancel
                </button>
                <button type="submit" disabled={loading || !form.category || !form.amount || !form.expenseDate || !form.description} className="w-full sm:w-auto px-10 py-3.5 rounded-xl text-white font-black bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all shadow-xl shadow-pink-500/30 disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2 transform hover:-translate-y-0.5">
                  {loading ? (
                    <><span className="animate-spin text-xl">↻</span> Submitting...</>
                  ) : (
                    <>Submit Claim <span className="text-xl">→</span></>
                  )}
                </button>
              </div>
            </form>
          </div>

          <div className="space-y-6">

            <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl p-8 text-white shadow-xl shadow-pink-500/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-900/40 rounded-full blur-2xl translate-y-1/4 -translate-x-1/4 pointer-events-none" />

              <div className="relative z-10 text-center">
                <p className="text-pink-100 font-bold uppercase tracking-widest text-xs mb-2">Claim Amount</p>
                <div className="text-5xl lg:text-6xl font-black mb-1 tracking-tighter truncate drop-shadow-md">
                  {amount > 0 ? `₹${amount.toLocaleString("en-IN")}` : "₹0"}
                </div>
                <p className="text-pink-100 text-sm font-bold">To be reimbursed</p>
              </div>

              {selectedCat && (
                <div className="relative z-10 mt-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex items-center gap-4 shadow-lg">
                  <div className="text-2xl">{selectedCat.icon}</div>
                  <div>
                    <p className="font-bold text-sm text-white uppercase tracking-wider">{selectedCat.value}</p>
                    <p className="text-xs text-pink-100 font-medium">Selected Category</p>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-sm">
              <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider mb-5 flex items-center gap-2">
                <span className="text-pink-500 text-lg">💡</span> Pro Tips
              </h3>
              <ul className="space-y-5">
                {[
                  { icon: "📎", title: "Always Attach Receipts", desc: "Claims with clear receipts are processed 3x faster." },
                  { icon: "🗓", title: "Be Accurate", desc: "Ensure your date and amount exactly matches the receipt." },
                  { icon: "📝", title: "Clear Descriptions", desc: "Vague descriptions will be sent back for details." },
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <span className="text-xl mt-0.5">{item.icon}</span>
                    <div>
                      <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{item.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed font-medium">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ApplyReimbursement;