import { useNavigate, useLocation } from "react-router-dom";

export default function AdminSidebar({ user }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const Item = ({ label, path }) => (
    <button
      onClick={() => navigate(path)}
      className={`w-full text-left px-3 py-2 rounded-md text-sm transition
        ${isActive(path)
          ? "bg-slate-800 text-white"
          : "text-slate-400 hover:bg-slate-800"
        }`}
    >
      {label}
    </button>
  );

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 p-6 h-screen sticky top-0 flex flex-col">
      {/* HEADER */}
      <div>
        <h1 className="text-xl font-bold tracking-wide text-white">
          Politics Hub
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Admin Control Panel
        </p>
      </div>

      {/* NAV */}
      <nav className="mt-8 space-y-2 flex-1">
        <Item label="Posts Management" path="/admin" />
        <Item label="Comments" path="/admin/comments" />
        <Item label="Analytics" path="/admin/analytics" />

        {user?.role === "superadmin" && (
          <Item label="Super Admin" path="/superadmin" />
        )}
      </nav>

      {/* FOOTER */}
      <div className="pt-6 border-t border-slate-800">
        <p className="text-sm text-blue-400 font-medium">
          Admin Access
        </p>
        <p className="text-xs text-slate-500 mt-1">
          Content moderation panel
        </p>
      </div>
    </aside>
  );
}