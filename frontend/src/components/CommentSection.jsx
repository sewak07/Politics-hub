import { useEffect, useState } from "react";
import api from "../api/axios";

export default function CommentSection({ postId }) {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);

  // EDIT STATE
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");

  // FETCH COMMENTS
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);

        const res = await api.get(`/comments/post/${postId}`);
        setComments(res.data.comments || []);

      } catch (err) {
        console.error("FETCH ERROR:", err);
        setComments([]);
      } finally {
        setLoading(false);
      }
    };

    if (postId) fetchComments();
  }, [postId]);

  // ADD COMMENT
  const handleAddComment = async () => {
    if (!commentText.trim()) return;

    try {
      setPosting(true);

      const res = await api.post(`/comments/post/${postId}`, {
        text: commentText,
      });

      setComments(res.data.comments || []);
      setCommentText("");

    } catch (err) {
      console.error("ADD ERROR:", err);
    } finally {
      setPosting(false);
    }
  };

  // DELETE COMMENT
  const handleDelete = async (id) => {
    try {
      await api.delete(`/comments/${id}`);

      setComments((prev) => prev.filter((c) => c._id !== id));

    } catch (err) {
      console.error("DELETE ERROR:", err);
    }
  };

  // START EDIT
  const startEdit = (comment) => {
    setEditId(comment._id);
    setEditText(comment.text);
  };

  // SAVE EDIT
  const handleUpdate = async (id) => {
    try {
      const res = await api.put(`/comments/${id}`, {
        text: editText,
      });

      setComments((prev) =>
        prev.map((c) =>
          c._id === id ? { ...c, text: res.data.updated.text } : c
        )
      );

      setEditId(null);
      setEditText("");

    } catch (err) {
      console.error("UPDATE ERROR:", err);
    }
  };

  return (
    <div className="mt-10 border-t border-neutral-200 pt-6">

      <h3 className="text-sm font-semibold mb-3 text-neutral-700">
        Comments
      </h3>

      {/* INPUT */}
      <div className="flex gap-2 mb-6">
        <input
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-red-400"
        />

        <button
          onClick={handleAddComment}
          disabled={posting}
          className="bg-red-600 text-white px-4 py-2 text-sm hover:bg-red-700 transition"
        >
          {posting ? "Posting..." : "Post"}
        </button>
      </div>

      {/* COMMENTS LIST */}
      <div className="space-y-4">

        {loading ? (
          <p className="text-xs text-neutral-500 animate-pulse">
            Loading comments...
          </p>
        ) : comments.length === 0 ? (
          <p className="text-xs text-neutral-500">
            No comments yet. Be the first voice.
          </p>
        ) : (
          comments.map((c) => (
            <div key={c._id} className="border-b border-neutral-100 pb-3">

              {/* EDIT MODE / VIEW MODE */}
              {editId === c._id ? (
                <div className="flex gap-2 mb-2">
                  <input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="flex-1 border px-2 py-1 text-sm"
                  />

                  <button
                    onClick={() => handleUpdate(c._id)}
                    className="text-xs bg-green-600 text-white px-2"
                  >
                    Save
                  </button>

                  <button
                    onClick={() => setEditId(null)}
                    className="text-xs bg-gray-400 text-white px-2"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <div className="text-sm text-neutral-800">
                    {c.text}
                  </div>

                  {/* DATE */}
                  <div className="text-xs text-neutral-400 mt-1">
                    {c.createdAt &&
                      new Date(c.createdAt).toLocaleString()}
                  </div>
                </>
              )}

              {/* META + ACTIONS */}
              <div className="text-xs text-neutral-500 mt-2 flex justify-between">

                <span>{c.user?.username || "user"}</span>

                <div className="flex gap-3">

                  <button
                    onClick={() => startEdit(c)}
                    className="hover:text-blue-600"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(c._id)}
                    className="hover:text-red-600"
                  >
                    Delete
                  </button>

                </div>
              </div>

            </div>
          ))
        )}

      </div>
    </div>
  );
}