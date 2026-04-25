import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";

import TopBar from "../components/TopBar";
import Header from "../components/Header";
import CategoryNav from "../components/CategoryNav";
import ErrorBanner from "../components/ErrorBanner";
import EmptyState from "../components/EmptyState";

export default function Home() {
  const { category } = useParams();

  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [animatingLike, setAnimatingLike] = useState(null);

  const observerRef = useRef();

  // FETCH POSTS
  const loadPosts = async (pageNumber = 1) => {
    try {
      setLoading(true);
      setError("");

      const url =
        category && category !== "all"
          ? `/posts?category=${category}&page=${pageNumber}`
          : `/posts?page=${pageNumber}`;

      const res = await api.get(url);

      if (pageNumber === 1) {
        setPosts(res.data.posts);
      } else {
        setPosts((prev) => [...prev, ...res.data.posts]);
      }

      setHasMore(pageNumber < res.data.pages);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  // INIT + CATEGORY CHANGE
  useEffect(() => {
    setPosts([]);
    setPage(1);
    setHasMore(true);
  }, [category]);

  useEffect(() => {
    loadPosts(page);
  }, [page, category]);

  // INFINITE SCROLL
  const lastPostRef = (node) => {
    if (loading) return;

    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setPage((prev) => prev + 1);
      }
    });

    if (node) observerRef.current.observe(node);
  };

  // LIKE TOGGLE
  const toggleLike = async (postId) => {
    try {
      setAnimatingLike(postId);

      const res = await api.patch(`/posts/${postId}/like`);

      setPosts((prev) =>
        prev.map((post) =>
          post._id === postId
            ? {
              ...post,
              isLiked: res.data.liked,
              likes: Array(res.data.likeCount).fill(null),
            }
            : post
        )
      );

      setTimeout(() => setAnimatingLike(null), 300);
    } catch (err) {
      console.error("Like failed:", err);
      setAnimatingLike(null);
    }
  };

  // SKELETON
  const SkeletonCard = () => (
    <div className="animate-pulse border border-neutral-200 rounded-xl overflow-hidden bg-white">
      <div className="h-56 bg-neutral-200" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-neutral-200 rounded w-3/4" />
        <div className="h-4 bg-neutral-200 rounded w-full" />
        <div className="h-4 bg-neutral-200 rounded w-5/6" />
        <div className="flex justify-between pt-4">
          <div className="h-3 bg-neutral-200 rounded w-20" />
          <div className="h-3 bg-neutral-200 rounded w-16" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#faf7f2] text-neutral-900 font-serif">
      <TopBar />
      <Header />
      <CategoryNav />

      {/* ERROR */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6">
          <ErrorBanner message={error} />
        </div>
      )}

      {/* POSTS */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {posts.length === 0 && !loading && !error && (
          <div className="mt-24 sm:mt-32">
            <EmptyState />
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
          {/* SKELETON */}
          {loading &&
            Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}

          {/* POSTS */}
          {posts.map((post, index) => {
            const isLast = index === posts.length - 1;

            return (
              <Link
                to={`/post/${post._id}`}
                key={post._id}
                ref={isLast ? lastPostRef : null}
                className="group bg-white border border-neutral-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                {/* IMAGE */}
                <div className="relative overflow-hidden">
                  {post.media?.[0]?.url ? (
                    <img
                      src={post.media[0].url}
                      alt={post.title}
                      className="w-full h-44 sm:h-52 md:h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="h-44 sm:h-52 md:h-56 bg-neutral-200 flex items-center justify-center text-neutral-500 text-sm">
                      No Image
                    </div>
                  )}

                  <span className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-black/70 text-white text-[10px] sm:text-xs px-2 sm:px-3 py-1 rounded-full uppercase">
                    {post.category}
                  </span>
                </div>

                {/* CONTENT */}
                <div className="p-4 sm:p-5 flex flex-col gap-2 sm:gap-3">
                  <h2 className="text-red-700 text-base sm:text-lg font-semibold group-hover:text-red-600 leading-snug">
                    {post.title}
                  </h2>

                  <p className="text-sm text-neutral-600 line-clamp-3">
                    {post.content}
                  </p>

                  {/* AUTHOR + DATE */}
                  <div className="flex justify-between text-[11px] sm:text-xs text-neutral-500 pt-2 sm:pt-3 border-t">
                    <span className="truncate max-w-[120px]">
                      {post.author?.username}
                    </span>
                    <span>
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* LIKE SECTION */}
                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        toggleLike(post._id);
                      }}
                      className="flex items-center gap-2 text-sm sm:text-xs active:scale-95 transition"
                    >
                      <span
                        className={`text-xl sm:text-lg transition-transform duration-300 ${animatingLike === post._id
                            ? "scale-150"
                            : "scale-100"
                          } ${post.isLiked ? "text-red-500" : "text-neutral-400"
                          }`}
                      >
                        {post.isLiked ? "❤️" : "🤍"}
                      </span>

                      <span className="text-neutral-600">
                        {post.likes?.length || 0}
                      </span>
                    </button>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}