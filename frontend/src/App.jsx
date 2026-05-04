import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import CreatePost from "./pages/CreatePost";
import PostPage from "./pages/PostPage";
import ActivityLog from "./pages/ActivityLog";
import AdminAnalytics from "./pages/AdminAnalytics";
import LikedPosts from "./pages/LikedPosts";
import CommentTracker from "./pages/CommentTracker";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/category/:category" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/post/:id" element={<PostPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/superadmin" element={<SuperAdminDashboard />} />
        <Route path="/admin/activity" element={<ActivityLog />} />
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/admin/analytics" element={<AdminAnalytics />} />
        <Route path="/liked-posts" element={<LikedPosts />} />
        <Route path="/admin/comments" element={<CommentTracker />} />
      </Routes>
    </BrowserRouter>
  );
}