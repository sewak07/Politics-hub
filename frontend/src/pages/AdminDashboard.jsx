import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import api from "../api/axios";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalLikes: 0,
  });
  const [likesByAdmin, setLikesByAdmin] = useState([]);
  const [search, setSearch] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
      navigate("/");
      return;
    }

    fetchPosts();
    fetchStats();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await api.get("/posts");
      setPosts(res.data.posts || []);
    } catch (err) {
      console.log("FETCH POSTS ERROR:", err);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await api.get("/admin/stats");

      setStats({
        totalPosts: res.data.totalPosts || 0,
        totalLikes: res.data.totalLikes || 0,
      });

      setLikesByAdmin(res.data.likesByAdmin || []);
    } catch (err) {
      console.log("FETCH STATS ERROR:", err);
    }
  };

  const deletePost = async (id) => {
    try {
      await api.delete(`/posts/${id}`);
      fetchPosts();
    } catch (err) {
      console.log("DELETE ERROR:", err);
    }
  };

  const filteredPosts = posts.filter((post) => {
    const q = search.toLowerCase();

    return (
      post.title?.toLowerCase().includes(q) ||
      post.category?.toLowerCase().includes(q) ||
      post.author?.username?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 flex">

      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-950 border-r border-slate-800 p-6 flex flex-col">
        <div>
          <h1 className="text-xl font-semibold tracking-wide">
            PoliticsHub
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Admin Control Panel
          </p>
        </div>

        <nav className="mt-10 space-y-2 text-sm">
          <button className="w-full text-left px-3 py-2 rounded-md bg-slate-800">
            Posts Management
          </button>

          <button className="w-full text-left px-3 py-2 rounded-md text-slate-400 hover:bg-slate-800">
            Comments
          </button>

          <button
            onClick={() => navigate("/admin/analytics")}
            className="w-full text-left px-3 py-2 rounded-md text-slate-400 hover:bg-slate-800"
          >
            Analytics
          </button>

          {/* SUPERADMIN ONLY BUTTON */}
          {user.role === "superadmin" && (
            <button
              onClick={() => navigate("/superadmin")}
              className="w-full text-left px-3 py-2 rounded-md text-slate-400 hover:bg-slate-800"
            >
              Super Admin
            </button>
          )}
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-800">
          <p className="text-sm text-blue-400 font-medium">
            Admin Access
          </p>
          <p className="text-xs text-slate-500">
            Content moderation panel
          </p>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 p-8">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold">
              Post Management
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Moderate, edit, and control published content
            </p>
          </div>

          <button
            onClick={() => navigate("/create-post")}
            className="bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-md text-sm font-medium text-white transition"
          >
            + New Post
          </button>
        </div>

        <SearchBar
          placeholder="Search posts by title, category, author..."
          onSearch={setSearch}
        />


        {/* POSTS LIST */}
        <div className="bg-slate-950 border border-slate-800 rounded-lg overflow-hidden mt-4">
          <table className="w-full text-sm">
            <thead className="bg-slate-900 text-slate-300 text-xs uppercase">
              <tr>
                <th className="text-left px-6 py-4">Title</th>
                <th className="text-left px-6 py-4">Category</th>
                <th className="text-left px-6 py-4">Author</th>
                <th className="text-right px-6 py-4">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800">
              {filteredPosts.map((post) => (
                <tr
                  key={post._id}
                  className="hover:bg-slate-900/60 transition"
                >
                  <td className="px-6 py-4 text-slate-100 font-medium">
                    {post.title}
                  </td>

                  <td className="px-6 py-4 text-slate-400">
                    {post.category}
                  </td>

                  <td className="px-6 py-4 text-slate-400">
                    {post.author?.username}
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => navigate(`/post/${post._id}`)}
                        className="px-3 py-1.5 text-xs rounded-md bg-blue-600 hover:bg-blue-500 text-white"
                      >
                        View
                      </button>

                      <button
                        onClick={() => deletePost(post._id)}
                        className="px-3 py-1.5 text-xs rounded-md bg-red-600 hover:bg-red-500 text-white"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>



          {filteredPosts.length === 0 && (
            <div className="p-10 text-center text-slate-500">
              No posts available
            </div>
          )}
        </div>
      </main>
    </div>
  );
}