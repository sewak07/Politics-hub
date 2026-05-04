import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import api from "../api/axios";
import AdminSidebar from "../components/AdminSidebar";
import { FiTrendingUp, FiAward, FiThumbsUp, FiGrid } from "react-icons/fi";

export default function AdminAnalytics() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [data, setData] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  if (!data) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 animate-pulse">
        Loading analytics…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">

      {/* SIDEBAR */}
      <div
        className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-slate-950 transform transition-transform
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <AdminSidebar user={user} />
      </div>

      {/* OVERLAY */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* MAIN */}
      <main className="flex-1 p-4 md:p-8 space-y-8 overflow-y-auto">

        {/* HEADER */}
        <div className="mb-4">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden text-xl text-slate-300"
              onClick={() => setSidebarOpen(true)}
            >
              <FiMenu />
            </button>

            <h1 className="text-xl md:text-2xl font-semibold">
              Analytics Dashboard
            </h1>
          </div>

          <p className="text-sm text-slate-400 mt-2 max-w-xl">
            Real-time platform performance insights
          </p>
        </div>

        {/* TOP CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card label="Posts" value={data.totalPosts} />
          <Card label="Likes" value={data.totalLikes} accent />
          <Card label="Engagement Rate" value={data.engagementRate} />
        </div>

        {/* SECOND ROW */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <MiniCard title="Users Today" value={data.newUsersToday} />
          <MiniCard title="Users This Week" value={data.newUsersWeek} />
          <MiniCard title="Peak Hour" value={`${data.peakHour ?? "--"}:00`} />
        </div>

        {/* TRENDING POSTS */}
        <Section
          title={
            <span className="flex items-center gap-2">
              <FiTrendingUp className="text-red-400" />
              Trending Posts
            </span>
          }
        >
          <div className="space-y-2">
            {data.trendingPosts.map((p, i) => (
              <Row key={i} left={`${i + 1}. ${p.title}`} right={`❤️ ${p.likesCount}`} />
            ))}
          </div>
        </Section>

        {/* TOP ADMINS BY POSTS */}
        <Section
          title={
            <span className="flex items-center gap-2">
              <FiAward className="text-yellow-400" />
              Top Admins by Posts
            </span>
          }
        >
          <div className="space-y-2">
            {data.postsByAdmin.map((a, i) => (
              <Row key={i} left={`${i + 1}. ${a.username}`} right={a.total} />
            ))}
          </div>
        </Section>

        {/* TOP ADMINS BY LIKES */}
        <Section
          title={
            <span className="flex items-center gap-2">
              <FiThumbsUp className="text-pink-400" />
              Top Admins by Likes
            </span>
          }
        >
          <div className="space-y-2">
            {data.rankedAdminsByLikes.map((a, i) => (
              <Row
                key={i}
                left={`${i + 1}. ${a.username}`}
                right={`❤️ ${a.totalLikes ?? 0}`}
              />
            ))}
          </div>
        </Section>

        {/* TOP CATEGORIES */}
        <Section
          title={
            <span className="flex items-center gap-2">
              <FiGrid className="text-blue-400" />
              Top Categories
            </span>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {data.rankedCategories.map((c, i) => (
              <Row
                key={c.category}
                left={`${i + 1}. ${c.category}`}
                right={`${c.total} posts`}
              />
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

function Row({ left, right }) {
  return (
    <div className="flex justify-between items-center bg-slate-900 border border-slate-800 rounded-lg px-4 py-3">
      <span className="text-sm">{left}</span>
      <span className="font-semibold text-slate-300">{right}</span>
    </div>
  );
}