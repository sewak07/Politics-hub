import Post from "../model/Post.model.js";
import { createActivityLog } from "../utils/createActivityLog.js";

export const createPost = async (req, res) => {
  try {
    const { title, content, category, tags } = req.body;

    if (!req.user?._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const media = Array.isArray(req.files)
      ? req.files.map((file) => ({
        type: file.mimetype.startsWith("image")
          ? "image"
          : file.mimetype.startsWith("video")
            ? "video"
            : "pdf",
        url: file.path,
        public_id: file.filename || null,
      }))
      : [];

    const post = await Post.create({
      title,
      content,
      category,
      tags: tags ? tags.split(",") : [],
      media,
      author: req.user._id,
    });

    await createActivityLog({
      action: "POST_CREATED",
      message: `Created post "${post.title}"`,
      actor: req.user._id,
      post: post._id,
    });

    return res.status(201).json({
      message: "Post created successfully",
      post,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// getting all posts (public + category filter)
export const getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = { isPublished: true };

    if (req.query.category && req.query.category !== "all") {
      filter.category = req.query.category;
    }

    const posts = await Post.find(filter)
      .populate("author", "username")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // FIX: user detection (works even after refresh)
    const userId = req.user?._id?.toString() || req.user?.id?.toString();

    const updatedPosts = posts.map((post) => ({
      ...post,
      isLiked: userId
        ? post.likes.some((id) => id.toString() === userId)
        : false,
    }));

    const total = await Post.countDocuments(filter);

    res.json({
      total,
      page,
      pages: Math.ceil(total / limit),
      posts: updatedPosts,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


//geting post by id
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", "username")
      .lean();

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const userId = req.user?._id?.toString();

    const isLiked = userId
      ? post.likes?.some((id) => id.toString() === userId)
      : false;

    res.status(200).json({
      message: "Post retrieved successfully",
      post: {
        ...post,
        isLiked,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};


export const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // security check
    if (
      req.user.role !== "admin" &&
      post.author.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const { title, content, category, tags } = req.body;

    post.title = title || post.title;
    post.content = content || post.content;
    post.category = category || post.category;
    post.tags = tags ? tags.split(",") : post.tags;

    // ⚡ MEDIA UPDATE (images/videos/pdfs)
    if (req.files && req.files.length > 0) {
      const newMedia = req.files.map((file) => ({
        type: file.mimetype.startsWith("image")
          ? "image"
          : file.mimetype.startsWith("video")
            ? "video"
            : "pdf",
        url: file.path,
        public_id: file.filename || null,
      }));

      // replace old media completely
      post.media = newMedia;
    }



    const updated = await post.save();

   // LOG
    await createActivityLog({
      action: "POST_UPDATED",
      message: `Updated post "${updated.title}"`,
      actor: req.user._id,
      post: updated._id,
    });

    res.json({
      message: "Post updated",
      updated,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//delete post (admin only)
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "Post not found" });

    if (req.user.role !== "admin" && post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await Post.findByIdAndDelete(req.params.id);

       await createActivityLog({
      action: "POST_DELETED",
      message: `Deleted post "${post.title}"`,
      actor: req.user._id,
      post: post._id,
    });

    res.json({ message: "Post deleted" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Like / Unlike post
export const toggleLikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const userId = req.user._id.toString();

    // check if already liked
    const alreadyLiked = post.likes.includes(userId);

    if (alreadyLiked) {
      // UNLIKE
      post.likes = post.likes.filter(
        (id) => id.toString() !== userId
      );
    } else {
      // LIKE
      post.likes.push(userId);
    }

    await post.save();

      await createActivityLog({
      action: alreadyLiked ? "POST_UNLIKED" : "POST_LIKED",
      message: `${alreadyLiked ? "Unliked" : "Liked"} post "${post.title}"`,
      actor: req.user._id,
      post: post._id,
    });


    res.json({
      message: alreadyLiked ? "Post unliked" : "Post liked",
      likeCount: post.likes.length,
      liked: !alreadyLiked,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};


//for getting liked posts
export const getLikedPosts = async (req, res) => {
  try {
    const userId = req.user._id;

    const posts = await Post.find({
      likes: userId,
    }).populate("author", "username");

    res.json({ posts });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

