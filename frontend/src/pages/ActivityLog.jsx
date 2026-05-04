import { useEffect, useState } from "react";
import api from "../api/axios";
import SearchBar from "../components/SearchBar";
import AdminActivity from "../components/AdminActivity";
import CategoryActivity from "../components/CategoryActivity";
import { useNavigate } from "react-router-dom";
import { FiMenu } from "react-icons/fi";

export default function ActivityLog() {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("24h");
  const [selectedAdminId, setSelectedAdminId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (!user || user.role !== "superadmin") {
      navigate("/");
      return;
    }

    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await api.get("/admin/activity");

      const safeLogs = Array.isArray(res?.data?.logs)
        ? res.data.logs
        : [];

      setLogs(safeLogs);
      setFilteredLogs(safeLogs);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    const q = (value || "").toLowerCase();

    const filtered = logs.filter((log) => {
      return (
        log?.action?.toLowerCase().includes(q) ||
        log?.message?.toLowerCase().includes(q) ||
        log?.actor?.username?.toLowerCase().includes(q) ||
        log?.post?.title?.toLowerCase().includes(q) ||
        log?.targetUser?.username?.toLowerCase().includes(q)
      );
    });

    setFilteredLogs(filtered);
  };

  if (!user || user.role !== "superadmin") return null;

  return (
    <div className="h-screen bg-slate-900 text-white flex overflow-hidden">

      {/* SIDEBAR */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-slate-950 border-r border-slate-800 p-6 flex flex-col
        transform transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* TOP */}
        <div>
          <h1 className="text-xl font-semibold tracking-wide">
            PoliticsHub
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Super Admin Panel
          </p>
        </div>

        {/* NAV */}
        <nav className="mt-10 space-y-2 text-sm">
          <button
            onClick={() => navigate("/superadmin")}
            className="w-full text-left px-3 py-2 rounded-md text-slate-400 hover:bg-slate-800"
          >
            User Management
          </button>

          <button className="w-full text-left px-3 py-2 rounded-md bg-slate-800">
            Activity Log
          </button>

          <button
            onClick={() => navigate("/admin")}
            className="w-full text-left px-3 py-2 rounded-md text-slate-400 hover:bg-slate-800"
          >
            Admin Dashboard
          </button>
        </nav>

        {/* FOOTER */}
        <div className="mt-auto pt-6 border-t border-slate-800">
          <p className="text-sm text-yellow-400 font-medium">
            Super Admin
          </p>
          <p className="text-xs text-slate-400">
            Full editorial access
          </p>
        </div>
      </aside>

      {/* OVERLAY */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* MAIN CONTENT (ONLY SCROLL AREA) */}
      <main className="flex-1 h-full overflow-y-auto p-4 md:p-8">

        {/* HEADER */}
        <div className="flex items-center gap-3 mb-6">
          <button
            className="md:hidden text-xl"
            onClick={() => setSidebarOpen(true)}
          >
            <FiMenu />
          </button>

          <div>
            <h1 className="text-2xl font-semibold">Activity Log</h1>
            <p className="text-sm text-slate-400">
              Track all system actions
            </p>
          </div>
        </div>

        {/* TIME FILTER */}
        <div className="flex justify-end mb-6">
          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-sm p-2 rounded text-white"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="1m">Last 1 Month</option>
            <option value="1y">Last 1 Year</option>
            <option value="all">All Time</option>
          </select>
        </div>

        {/* ADMIN */}
        <div className="mb-6">
          <AdminActivity
            logs={logs}
            range={range}
            onSelectAdmin={setSelectedAdminId}
          />
        </div>

        {/* CATEGORY */}
        <div className="mb-6">
          <CategoryActivity logs={logs} range={range} />
        </div>

        {/* SEARCH */}
        <SearchBar placeholder="Search logs..." onSearch={handleSearch} />

        {loading && (
          <p className="text-slate-400 mt-3">Loading activity...</p>
        )}

        {/* LOGS */}
        <div className="space-y-4 mt-4">
          {filteredLogs.map((log) => (
            <div
              key={log?._id}
              className="bg-slate-950 border border-slate-800 p-4 rounded-lg"
            >
              <p className="text-sm text-slate-200">
                <span className="text-blue-400 font-medium">
                  {log?.actor?.username || "System"}
                </span>{" "}
                • {log?.action}
              </p>

              <p className="text-sm text-slate-300 mt-1">
                {log?.message}
              </p>

              <div className="text-xs text-slate-500 mt-3 flex justify-between">
                <div className="flex gap-4">
                  {log?.post && (
                    <button
                      onClick={() => navigate(`/post/${log.post._id}`)}
                      className="text-green-400 hover:underline"
                    >
                      View Post
                    </button>
                  )}
                </div>

                <span>
                  {log?.createdAt
                    ? new Date(log.createdAt).toLocaleString()
                    : ""}
                </span>
              </div>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}