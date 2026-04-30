import { useEffect, useState } from "react";
import CommentSection from "../components/CommentSection";
import { useParams } from "react-router-dom";
import api from "../api/axios";

export default function PostPage() {
  const { id } = useParams();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [animatingLike, setAnimatingLike] = useState(false);

  // FETCH POST
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await api.get(`/posts/${id}`);
        setPost(res.data.post);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  // LIKE TOGGLE
  const toggleLike = async () => {
    try {
      setAnimatingLike(true);

      const res = await api.patch(`/posts/${id}/like`);

      setPost((prev) => ({
        ...prev,
        isLiked: res.data.liked,
        likes: Array(res.data.likeCount).fill(null),
      }));

      setTimeout(() => setAnimatingLike(false), 300);
    } catch (err) {
      console.error("Like failed", err);
      setAnimatingLike(false);
    }
  };

  if (loading)
    return (
      <div className="p-10 text-center animate-pulse">
        Loading...
      </div>
    );

  if (!post)
    return (
      <div className="p-10 text-center text-red-500">
        Post not found
      </div>
    );

  return (
    <div className="min-h-screen bg-[#faf7f2] text-neutral-900 font-serif">

      <div className="max-w-3xl mx-auto px-6 py-12">

        {/* TITLE */}
        <h1 className="text-red-700 text-3xl md:text-4xl font-bold leading-tight mb-4">
          {post.title}
        </h1>

        {/* META */}
        <div className="flex items-center justify-between text-xs text-neutral-500 border-b border-neutral-200 pb-4">
          <span>By {post.author?.username}</span>
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        </div>



        {/* IMAGE */}
        {post.media?.[0]?.url && (
          <div className="mb-8 overflow-hidden border border-neutral-200">
            <img
              src={post.media[0].url}
              className="w-full h-[420px] object-cover hover:scale-105 transition duration-500"
              alt={post.title}
            />
          </div>
        )}

        {/* CONTENT */}
        <div className="text-[17px] leading-relaxed text-neutral-800 space-y-5">
          {post.content.split("\n").map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>



        {/* FOOTER */}
        <div className="mt-10 pt-6 border-t border-neutral-200 flex justify-between text-xs text-neutral-500">
          <span className="uppercase tracking-widest">
            {post.category}
          </span>
          <span>PoliticsHub Editorial</span>
        </div>

        {/* LIKE SECTION */}
        <div className="flex items-center justify-between mt-4 mb-6">

          <button
            onClick={toggleLike}
            className="flex items-center gap-2 text-sm"
          >
            <span
              className={`text-xl transition-transform duration-300 ${animatingLike ? "scale-150" : "scale-100"
                } ${post.isLiked ? "text-red-500" : "text-neutral-400"
                }`}
            >
              {post.isLiked ? "❤️" : "🤍"}
            </span>

            <span className="text-neutral-600">
              {post.likes?.length || 0} likes
            </span>
          </button>

        </div>

        <CommentSection postId={id} />
      </div>
    </div>
  );
}