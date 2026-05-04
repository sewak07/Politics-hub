import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import api from "../api/axios";
import SearchBar from "../components/SearchBar";

export default function SuperAdminDashboard() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAdmins: 0,
    postsLast24hrs: 0,
  });

  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (!user || user.role !== "superadmin") {
      navigate("/");
      return;
    }

    fetchStats();
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data.users || []);
    } catch (err) {
      console.log("FETCH USERS ERROR:", err);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await api.get("/admin/stats");

      const data = res.data || {};

      const postsLast24hrs = (data.postsByAdmin || []).reduce(
        (sum, admin) => sum + (admin.last24h || 0),
        0
      );

      setStats({
        totalUsers: data.totalUsers || 0,
        totalAdmins: data.totalAdmins || 0,
        postsLast24hrs,
      });
    } catch (err) {
      console.error("FETCH STATS ERROR:", err);
    }
  };

  const makeAdmin = async (id) => {
    await api.patch(`/admin/users/promote/${id}`);
    fetchUsers();
  };

  const demoteAdmin = async (id) => {
    await api.patch(`/admin/users/demote/${id}`);
    fetchUsers();
  };

  if (!user || user.role !== "superadmin") return null;

  const filteredUsers = users.filter(
    (u) =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-screen bg-slate-900 text-gray-200 flex overflow-hidden">

      {/* SIDEBAR (NO SCROLL EVER) */}
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
          <button className="w-full text-left px-3 py-2 rounded-md bg-slate-800">
            User management
          </button>

          <button
            onClick={() => navigate("/admin/activity")}
            className="w-full text-left px-3 py-2 rounded-md text-slate-400 hover:bg-slate-800"
          >
            Activity log
          </button>

          <button
            onClick={() => navigate("/admin")}
            className="w-full text-left px-3 py-2 rounded-md text-slate-400 hover:bg-slate-800"
          >
            Admin Dashboard
          </button>
        </nav>

        {/* FOOTER (stays at bottom) */}
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

      {/* MAIN (ONLY SCROLL AREA) */}
      <main className="flex-1 h-full overflow-y-auto p-4 md:p-8 space-y-6">

        {/* HEADER */}
        <div className="flex items-center gap-3 mb-2">
          <button
            className="md:hidden text-xl"
            onClick={() => setSidebarOpen(true)}
          >
            <FiMenu />
          </button>

          <div>
            <h1 className="text-xl md:text-2xl font-semibold">
              User management
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Promote, demote, and manage users
            </p>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

          <div className="bg-slate-950 border border-slate-800 rounded-lg p-4">
            <p className="text-sm text-slate-400">Total users</p>
            <p className="text-3xl font-semibold mt-1">
              {stats.totalUsers}
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-lg p-4">
            <p className="text-sm text-slate-400">Admins</p>
            <p className="text-3xl font-semibold mt-1 text-blue-400">
              {stats.totalAdmins}
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-lg p-4">
            <p className="text-sm text-slate-400">Posts (24h)</p>
            <p className="text-3xl font-semibold mt-1 text-green-400">
              {stats.postsLast24hrs}
            </p>
          </div>

        </div>

        {/* SEARCH */}
        <SearchBar
          placeholder="Search users..."
          onSearch={setSearch}
        />

        {/* TABLE */}
        <div className="bg-slate-950 border border-slate-800 rounded-lg overflow-x-auto">

          <table className="min-w-[700px] w-full text-sm text-slate-200">

            <thead className="bg-slate-900 text-slate-300 uppercase text-xs">
              <tr>
                <th className="px-6 py-4 text-left">Username</th>
                <th className="px-6 py-4 text-left">Email</th>
                <th className="px-6 py-4 text-left">Role</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800">

              {filteredUsers.map((u) => (
                <tr key={u._id} className="hover:bg-slate-900/60">

                  <td className="px-6 py-4 font-medium">
                    {u.username}
                  </td>

                  <td className="px-6 py-4 text-slate-400">
                    {u.email}
                  </td>

                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-xs border bg-slate-800 text-slate-300 border-slate-700">
                      {u.role}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">

                      {u.role === "user" && (
                        <button
                          onClick={() => makeAdmin(u._id)}
                          className="bg-emerald-600 px-3 py-1 rounded-md text-xs hover:bg-emerald-500"
                        >
                          Promote
                        </button>
                      )}

                      {u.role === "admin" && (
                        <button
                          onClick={() => demoteAdmin(u._id)}
                          className="bg-amber-500 px-3 py-1 rounded-md text-xs hover:bg-amber-400"
                        >
                          Demote
                        </button>
                      )}

                    </div>
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

          {filteredUsers.length === 0 && (
            <div className="p-10 text-center text-slate-400">
              No users found
            </div>
          )}

        </div>

      </main>
    </div>
  );
}