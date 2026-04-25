import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const CategoryPage = () => {
  const { category } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);

        let url =
          category === "all"
            ? "http://localhost:3000/api/posts"
            : `http://localhost:3000/api/posts/category/${category}`;

        const res = await axios.get(url);
        setPosts(res.data);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [category]);

  if (loading) {
    return <p className="text-gray-400 text-center mt-10">Loading posts...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 capitalize">
        {category} News
      </h1>

      {posts.length === 0 ? (
        <p className="text-gray-400">No posts found.</p>
      ) : (
        <div className="grid gap-6">
          {posts.map((post) => (
            <div
              key={post._id}
              className="border border-gray-700 p-4 rounded"
            >
              <h2 className="text-xl font-semibold">{post.title}</h2>
              <p className="text-gray-400 mt-2">
                {post.content.slice(0, 150)}...
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;