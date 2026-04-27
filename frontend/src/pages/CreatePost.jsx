import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function CreatePost() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    content: "",
    category: "national",
    tags: "",
  });

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
    navigate("/");
    return null;
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("title", form.title);
      formData.append("content", form.content);
      formData.append("category", form.category);
      formData.append("tags", form.tags);

      files.forEach((file) => {
        formData.append("media", file);
      });

      await api.post("/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      navigate("/admin");
    } catch (err) {
      console.log("CREATE POST ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 flex items-center justify-center p-6">

      <div className="w-full max-w-3xl bg-slate-950 border border-slate-800 rounded-lg p-6">

        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">
            Create New Post
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Publish news, analysis, or media content
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* TITLE */}
          <div>
            <label className="text-sm text-slate-400">Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          {/* CONTENT */}
          <div>
            <label className="text-sm text-slate-400">Content</label>
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              rows="6"
              className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          {/* CATEGORY + TAGS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <div>
              <label className="text-sm text-slate-400">Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-200"
              >
                <option value="national">National</option>
                <option value="international">International</option>
                <option value="economy">Economy</option>
                <option value="election">Election</option>
                <option value="opinion">Opinion</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-slate-400">Tags</label>
              <input
                type="text"
                name="tags"
                value={form.tags}
                onChange={handleChange}
                placeholder="e.g. politics, budget, news"
                className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-200"
              />
            </div>
          </div>

          {/* MEDIA UPLOAD */}
          <div>
            <label className="text-sm text-slate-400">
              Media (Images / Videos / PDFs)
            </label>

            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="w-full mt-1 text-slate-300"
            />

            <p className="text-xs text-slate-500 mt-1">
              You can upload multiple files (images, videos, PDFs)
            </p>
          </div>

          {/* PREVIEW FILES */}
          {files.length > 0 && (
            <div className="text-sm text-slate-400">
              Selected files: {files.length}
            </div>
          )}

          {/* ACTIONS */}
          <div className="flex justify-between pt-4">

            <button
              type="button"
              onClick={() => navigate("/admin")}
              className="px-4 py-2 rounded-md bg-slate-800 hover:bg-slate-700 text-sm"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-500 text-sm font-medium text-white"
            >
              {loading ? "Publishing..." : "Publish Post"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}