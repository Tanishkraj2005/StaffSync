import { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import API from "../services/api";
import Layout from "../components/Layout";
import { generateLeavePDF } from "../utils/pdfGenerator";

const localizer = momentLocalizer(moment);

const STATUS_COLORS = {
  Approved: { bg: "#10b981", border: "#059669", light: "bg-emerald-100 text-emerald-700" },
  Pending:  { bg: "#f59e0b", border: "#d97706", light: "bg-amber-100 text-amber-700" },
  Rejected: { bg: "#ef4444", border: "#dc2626", light: "bg-red-100 text-red-700" },
};

const LeaveCalendar = () => {
  const [leaves, setLeaves] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const res = await API.get("/leaves/my-leaves");
        setLeaves(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to fetch leaves:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaves();
  }, []);

  const events = leaves.map((leave) => ({
    id: leave._id,
    title: `${leave.leaveType} (${leave.status})`,
    start: new Date(leave.fromDate),
    end: new Date(leave.toDate),
    resource: leave,
  }));

  const eventStyleGetter = (event) => {
    const color = STATUS_COLORS[event.resource.status] || STATUS_COLORS.Pending;
    return {
      style: {
        backgroundColor: color.bg,
        borderLeft: `4px solid ${color.border}`,
        borderRadius: "8px",
        color: "white",
        fontWeight: 600,
        fontSize: "11px",
        padding: "2px 8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
      },
    };
  };

  return (
    <Layout>
      <div className="space-y-6 fade-in-up">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Leave Calendar
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              All your leave requests plotted across the calendar.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(STATUS_COLORS).map(([status, color]) => (
              <span key={status} className={`px-3 py-1 rounded-full text-xs font-semibold ${color.light}`}>
                {status}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {Object.entries(STATUS_COLORS).map(([status, color]) => {
            const count = leaves.filter((l) => l.status === status).length;
            return (
              <div key={status} className="glass rounded-2xl p-4 text-center card-hover">
                <p className="text-3xl font-extrabold" style={{ color: color.bg }}>{count}</p>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-1">{status}</p>
              </div>
            );
          })}
        </div>

        <div className="glass rounded-3xl p-4 sm:p-6 shadow-xl">
          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="skeleton h-10 w-full" />
              ))}
            </div>
          ) : (
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 520 }}
              eventPropGetter={eventStyleGetter}
              onSelectEvent={(event) => setSelected(event.resource)}
              popup
              views={["month", "week", "agenda"]}
              defaultView="month"
            />
          )}
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-gray-700 overflow-hidden fade-in-up">

            <div className="animated-gradient p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">Leave Request</p>
                  <h2 className="text-2xl font-extrabold">{selected.leaveType}</h2>
                </div>
                <span className={`px-3 py-1.5 rounded-full text-xs font-bold bg-white/20`}>
                  {selected.status}
                </span>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "From", value: moment(selected.fromDate).format("D MMM YYYY") },
                  { label: "To",   value: moment(selected.toDate).format("D MMM YYYY") },
                  { label: "Days", value: `${(selected.daysRequested || 1)} day(s)` },
                  { label: "Applied", value: moment(selected.createdAt).format("D MMM YYYY") },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</p>
                    <p className="text-sm font-bold text-gray-800 dark:text-white mt-1">{value}</p>
                  </div>
                ))}
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Reason</p>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{selected.reason}</p>
              </div>

              {selected.status === "Rejected" && selected.rejectionReason && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl p-3">
                  <p className="text-xs font-semibold text-red-500 uppercase tracking-wider mb-1">Rejection Reason</p>
                  <p className="text-sm text-red-700 dark:text-red-300">{selected.rejectionReason}</p>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                {selected.status === "Approved" && (
                  <button
                    onClick={() => generateLeavePDF(selected)}
                    className="flex-1 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-md hover:shadow-lg transition-all"
                  >
                    📄 Download Leave Slip
                  </button>
                )}
                <button
                  onClick={() => setSelected(null)}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default LeaveCalendar;
