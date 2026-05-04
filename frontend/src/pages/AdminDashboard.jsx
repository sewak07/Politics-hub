import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import SearchBar from "../components/SearchBar";
import api from "../api/axios";
import AdminSidebar from "../components/AdminSidebar";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
      navigate("/");
      return;
    }
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await api.get("/posts");
      setPosts(res.data.posts || []);
    } catch (err) {
      console.log("FETCH POSTS ERROR:", err);
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
      <div
        className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-slate-950 transform transition-transform
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <AdminSidebar user={user} />
      </div>

      {/* OVERLAY (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* MAIN */}
      <main className="flex-1 p-4 md:p-8 overflow-x-hidden">

        {/* HEADER */}
        <div className="mb-8">
          {/* Top row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                className="md:hidden text-xl text-slate-300"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open sidebar"
              >
                <FiMenu />
              </button>

              <h1 className="text-xl md:text-2xl font-semibold">
                Post Management
              </h1>
            </div>

            <button
              onClick={() => navigate("/create-post")}
              className="bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-md text-sm font-medium text-white transition"
            >
              + New Post
            </button>
          </div>

          {/* Sub text */}
          <p className="text-sm text-slate-400 mt-2 max-w-xl">
            Moderate, edit, and control published content
          </p>
        </div>

        <SearchBar
          placeholder="Search posts by title, category, author..."
          onSearch={setSearch}
        />

        {/* TABLE */}
        <div className="bg-slate-950 border border-slate-800 rounded-lg overflow-x-auto mt-4">
          <table className="min-w-[700px] w-full text-sm">
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
                <tr key={post._id} className="hover:bg-slate-900/60">
                  <td className="px-6 py-4 font-medium">{post.title}</td>
                  <td className="px-6 py-4 text-slate-400">{post.category}</td>
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