import { useEffect, useState } from "react";
import api from "../api/axios";
import SearchBar from "../components/SearchBar";
import AdminActivity from "../components/AdminActivity";
import CategoryActivity from "../components/CategoryActivity";
import { useNavigate } from "react-router-dom";

export default function ActivityLog() {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("24h");
  const [selectedAdminId, setSelectedAdminId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
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

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <h1 className="text-2xl font-semibold mb-4">Activity Log</h1>

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
    </div>
  );
}