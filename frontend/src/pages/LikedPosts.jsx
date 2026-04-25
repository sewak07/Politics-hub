import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

export default function LikedPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLikedPosts = async () => {
      try {
        const res = await api.get("/posts/liked");
        setPosts(res.data.posts);
      } catch (err) {
        console.error("Failed to fetch liked posts", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLikedPosts();
  }, []);

  return (
    <div className="min-h-screen bg-[#faf7f2] text-neutral-900 font-serif">
      
      {/* HEADER */}
      <div className="max-w-6xl mx-auto px-6 pt-10 pb-6 border-b border-neutral-200">
        <h1 className="text-3xl font-bold tracking-tight">
          Liked Stories
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          Your saved reading history from PoliticsHub
        </p>
      </div>

      {/* CONTENT */}
      <div className="max-w-6xl mx-auto px-6 py-8">

        {loading ? (
          <div className="text-neutral-500">Loading your stories...</div>
        ) : posts.length === 0 ? (
          <div className="mt-20 text-center">
            <p className="text-neutral-500 text-lg">
              No liked posts yet
            </p>
            <p className="text-sm text-neutral-400 mt-2">
              Start exploring and like stories to save them here
            </p>
          </div>
        ) : (
          <div className="space-y-6">

            {posts.map((post) => (
              <Link
                to={`/post/${post._id}`}
                key={post._id}
                className="group flex gap-5 bg-white p-4 hover:shadow-md transition border border-neutral-200"
              >

                {/* IMAGE */}
                <div className="w-40 h-28 flex-shrink-0 overflow-hidden bg-neutral-100">
                  {post.media?.[0]?.url ? (
                    <img
                      src={post.media[0].url}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-neutral-400">
                      No Image
                    </div>
                  )}
                </div>

                {/* CONTENT */}
                <div className="flex flex-col justify-between flex-1">

                  <div>
                    <h2 className="text-lg font-semibold group-hover:text-red-700 transition">
                      {post.title}
                    </h2>

                    <p className="text-sm text-neutral-600 line-clamp-2 mt-1">
                      {post.content}
                    </p>
                  </div>

                  {/* META */}
                  <div className="flex items-center justify-between text-xs text-neutral-500 mt-3">

                    <span className="uppercase tracking-wide">
                      {post.category}
                    </span>

                    <span>
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>

                  </div>

                </div>

              </Link>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}