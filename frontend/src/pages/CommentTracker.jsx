import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import AdminSidebar from "../components/AdminSidebar";
import api from "../api/axios";

export default function CommentTracker() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
      navigate("/");
      return;
    }
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const res = await api.get("/admin/comments");
      setComments(res.data || []);
    } catch (err) {
      console.log("ERROR FETCHING COMMENTS:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteComment = async (id) => {
    try {
      await api.delete(`/comments/${id}`);
      setComments((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.log("DELETE ERROR:", err);
    }
  };

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
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">

        {/* HEADER */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden text-xl text-slate-300"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <FiMenu />
            </button>

            <h1 className="text-xl md:text-2xl font-semibold">
              Comment Tracker
            </h1>
          </div>

          <p className="text-sm text-slate-400 mt-2 max-w-xl">
            Monitor, moderate, and remove comments across posts
          </p>
        </div>

        {/* CONTENT */}
        {loading ? (
          <p className="text-slate-400 animate-pulse">
            Loading comments...
          </p>
        ) : comments.length === 0 ? (
          <p className="text-slate-500">No comments found</p>
        ) : (
          <div className="space-y-4">
            {comments.map((c) => (
              <div
                key={c._id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-4 md:p-5"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">

                  {/* META */}
                  <div className="text-sm text-slate-400 space-y-1">
                    <p>
                      User:{" "}
                      <span className="text-white font-medium">
                        {c.user?.username}
                      </span>
                    </p>
                    <p>
                      Post:{" "}
                      <span className="text-white">
                        {c.post?.title}
                      </span>
                    </p>
                  </div>

                  {/* ACTION */}
                  <button
                    onClick={() => deleteComment(c._id)}
                    className="self-start md:self-auto text-xs px-3 py-1.5 rounded-md bg-red-600/90 hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </div>

                {/* COMMENT */}
                <p className="mt-3 text-slate-200 leading-relaxed text-sm">
                  {c.text}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}