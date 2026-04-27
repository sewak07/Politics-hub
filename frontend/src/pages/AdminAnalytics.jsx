import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function AdminAnalytics() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
      navigate("/");
      return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.get("/admin/stats");
      setData(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  if (!data)
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="animate-pulse text-slate-400">Loading analytics...</div>
      </div>
    );

  function SidebarItem({ label, onClick, active }) {
    return (
      <div
        onClick={onClick}
        className={`cursor-pointer px-3 py-2 rounded-md ${active ? "bg-slate-800" : "hover:bg-slate-800"
          }`}
      >
        {label}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex overflow-hidden">

      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 p-6 h-screen sticky top-0 flex flex-col">

        {/* HEADER */}
        <div>
          <h1 className="text-xl font-bold tracking-wide text-white">
            Politics Hub
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Admin Intelligence Panel
          </p>
        </div>

        {/* NAV */}
        <div className="mt-8 space-y-2 text-sm flex-1">
          <button
            onClick={() => navigate("/admin")}
            className="w-full text-left px-3 py-2 rounded-md text-slate-400 hover:bg-slate-800"
          >
            Posts Management
          </button>

          <button className="w-full text-left px-3 py-2 rounded-md bg-slate-800">
            Analytics
          </button>

          {user.role === "superadmin" && (
            <button
              onClick={() => navigate("/superadmin")}
              className="w-full text-left px-3 py-2 rounded-md text-slate-400 hover:bg-slate-800"
            >
              Super Admin
            </button>
          )}
        </div>

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

      {/* MAIN */}
      <main className="flex-1 p-8 space-y-8 h-screen overflow-y-auto">

        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-semibold">Analytics Dashboard</h1>
          <p className="text-sm text-slate-400">
            Real-time platform performance insights
          </p>
        </div>

        {/* TOP CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card label="Posts" value={data.totalPosts} />
          <Card label="Likes" value={data.totalLikes} accent />
          <Card label="Engagement Rate" value={data.engagementRate} />
        </div>

        {/* SECOND ROW */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <MiniCard title="Users Today" value={data.newUsersToday} />
          <MiniCard title="Users This Week" value={data.newUsersWeek} />
          <MiniCard title="Peak Hour" value={`${data.peakHour ?? "--"}:00`} />

        </div>

        {/* TRENDING POSTS */}
        <Section title="🔥 Trending Posts">
          <div className="space-y-2">
            {data.trendingPosts.map((p, i) => (
              <div
                key={i}
                className="flex justify-between items-center bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 hover:bg-slate-800 transition"
              >
                <div className="flex items-center gap-3">
                  <span className="text-slate-500 text-sm">{i + 1}</span>
                  <span className="font-medium">{p.title}</span>
                </div>
                <span className="text-pink-400 font-semibold">
                  ❤️ {p.likesCount}
                </span>
              </div>
            ))}
          </div>
        </Section>

        {/* TOP ADMINS by posts*/}
        <Section title="🏆 Top Admins by Posts">
          <div className="space-y-2">
            {data.postsByAdmin.map((a, i) => (
              <div
                key={i}
                className="flex justify-between items-center bg-slate-900 border border-slate-800 rounded-lg px-4 py-3"
              >
                <span className="flex items-center gap-2">
                  <span className="text-slate-500 text-sm">{i + 1}</span>
                  {a.username}
                </span>
                <span className="text-blue-400 font-semibold">
                  {a.total}
                </span>
              </div>
            ))}
          </div>
        </Section>

        {/*top admin by likes*/}
        <Section title="🔥 Top Admins by Likes">
          <div className="space-y-2">
            {data.rankedAdminsByLikes.map((a, i) => (
              <div
                key={i}
                className="flex justify-between items-center bg-slate-900 border border-slate-800 rounded-lg px-4 py-3"
              >
                <span className="flex items-center gap-2">
                  <span className="text-slate-500 text-sm">{i + 1}</span>
                  {a.username}
                </span>

                <span className="text-pink-400 font-semibold flex items-center gap-1">
                  <span>{a.totalLikes ?? 0}</span>
                  <span className="text-slate-500 text-xs">likes</span>
                </span>
              </div>
            ))}
          </div>
        </Section>

        {/* top categories by likes */}
        <Section title="🗂️ Top Categories by Posts">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {data.rankedCategories.map((c) => (
              <div
                key={c.category}
                className="flex justify-between bg-slate-900 border border-slate-800 rounded-lg px-4 py-3"
              >
                <span>
                  {c.rank}. {c.category}
                </span>

                <span className="text-emerald-400 font-semibold">
                  {c.total} posts
                </span>
              </div>
            ))}
          </div>
        </Section>

        {/*top categories by posts */}
        {/* CATEGORIES BY LIKES */}
        <Section title="🔥 Top Categories by Likes">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {data.rankedCategories
              ?.sort((a, b) => (b.totalLikes || 0) - (a.totalLikes || 0))
              .map((c, i) => (
                <div
                  key={c.category}
                  className="flex justify-between bg-slate-900 border border-slate-800 rounded-lg px-4 py-3"
                >
                  <span>
                    {i + 1}. {c.category}
                  </span>

                  <span className="text-pink-400 font-semibold">
                    ❤️ {c.totalLikes || 0}
                  </span>
                </div>
              ))}
          </div>
        </Section>

      </main>
    </div>
  );
}

/* ---------- UI COMPONENTS ---------- */

function Card({ label, value, accent }) {
  return (
    <div
      className={`rounded-xl border p-5 bg-slate-900 ${accent ? "border-pink-500/40" : "border-slate-800"
        }`}
    >
      <p className="text-slate-400 text-sm">{label}</p>
      <h2 className="text-3xl font-bold mt-2">{value}</h2>
    </div>
  );
}

function MiniCard({ title, value }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
      <p className="text-slate-400 text-sm">{title}</p>
      <p className="text-xl font-semibold mt-1">{value}</p>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">{title}</h2>
      {children}
    </div>
  );
}

function SidebarItem({ label, active }) {
  return (
    <div
      className={`px-3 py-2 rounded-md cursor-pointer transition ${active
        ? "bg-slate-800 text-white"
        : "text-slate-400 hover:bg-slate-800"
        }`}
    >
      {label}
    </div>
  );
}