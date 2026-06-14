import { useState, useEffect } from "react";
import API from "../services/api";
import Layout from "../components/Layout";
import toast from "react-hot-toast";

const Settings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    API.get("/settings").then(res => {
      setSettings(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      await API.put("/settings", settings);
      toast.success("Settings saved successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition";

  if (loading) return (
    <Layout>
      <div className="space-y-4 max-w-2xl">
        {[...Array(5)].map((_, i) => <div key={i} className="skeleton h-16 rounded-xl" />)}
      </div>
    </Layout>
  );

  return (
    <Layout>
      <div className="space-y-8 fade-in-up max-w-2xl">

        <div>
          <h1 className="text-3xl font-black bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
            Settings
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Configure your organisation's StaffSync settings.</p>
        </div>

        <div className="glass rounded-2xl p-6 space-y-4">
          <h2 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">🏢 Company</h2>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Company Name</label>
            <input type="text" value={settings?.companyName || ""} className={inputClass}
              onChange={e => setSettings({ ...settings, companyName: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Allowed Email Domain</label>
            <input type="text" value={settings?.companyDomain || ""} placeholder="company.com (leave empty to allow all)"
              className={inputClass} onChange={e => setSettings({ ...settings, companyDomain: e.target.value })} />
            <p className="text-xs text-gray-400">Only emails from this domain can register. Leave blank to allow any email.</p>
          </div>
        </div>

        <div className="glass rounded-2xl p-6 space-y-4">
          <h2 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">📅 Leave Policy</h2>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Default Annual Leave Balance (days)</label>
            <input type="number" min="1" max="60" value={settings?.defaultLeaveBalance || 20} className={inputClass}
              onChange={e => setSettings({ ...settings, defaultLeaveBalance: Number(e.target.value) })} />
            <p className="text-xs text-gray-400">Applied during the yearly reset on January 1st.</p>
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <div>
              <p className="text-sm font-semibold text-gray-800 dark:text-white">Allow Carry Forward</p>
              <p className="text-xs text-gray-400">Let employees carry unused leaves to next year</p>
            </div>
            <button onClick={() => setSettings({ ...settings, allowCarryForward: !settings.allowCarryForward })}
              className={`relative w-12 h-6 rounded-full transition-colors ${settings?.allowCarryForward ? "bg-indigo-600" : "bg-gray-300 dark:bg-gray-600"}`}>
              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${settings?.allowCarryForward ? "translate-x-6" : "translate-x-0.5"}`} />
            </button>
          </div>
          {settings?.allowCarryForward && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Max Carry Forward Days</label>
              <input type="number" min="1" max="30" value={settings?.maxCarryForwardDays || 5} className={inputClass}
                onChange={e => setSettings({ ...settings, maxCarryForwardDays: Number(e.target.value) })} />
            </div>
          )}
        </div>

        <div className="glass rounded-2xl p-6 space-y-4">
          <h2 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">💳 Reimbursement</h2>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Monthly Budget Per Employee (₹)</label>
            <input type="number" min="0" value={settings?.reimbursementBudgetMonthly || 10000} className={inputClass}
              onChange={e => setSettings({ ...settings, reimbursementBudgetMonthly: Number(e.target.value) })} />
            <p className="text-xs text-gray-400">Employees will see a warning when claiming above this amount.</p>
          </div>
        </div>

        <div className="glass rounded-2xl p-6 space-y-4">
          <h2 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">📧 Email Digest</h2>
          <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <div>
              <p className="text-sm font-semibold text-gray-800 dark:text-white">Weekly Email Digest</p>
              <p className="text-xs text-gray-400">Managers receive a weekly summary of pending requests</p>
            </div>
            <button onClick={() => setSettings({ ...settings, emailDigestEnabled: !settings.emailDigestEnabled })}
              className={`relative w-12 h-6 rounded-full transition-colors ${settings?.emailDigestEnabled ? "bg-indigo-600" : "bg-gray-300 dark:bg-gray-600"}`}>
              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${settings?.emailDigestEnabled ? "translate-x-6" : "translate-x-0.5"}`} />
            </button>
          </div>
          {settings?.emailDigestEnabled && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Digest Day</label>
              <select value={settings?.emailDigestDay || "Monday"} className={inputClass}
                onChange={e => setSettings({ ...settings, emailDigestDay: e.target.value })}>
                {["Monday","Tuesday","Wednesday","Thursday","Friday"].map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        <button onClick={save} disabled={saving}
          className="w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl disabled:opacity-60 transition-all">
          {saving ? "Saving…" : "Save All Settings"}
        </button>
      </div>
    </Layout>
  );
};

export default Settings;
