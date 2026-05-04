import Comment from "../model/Comment.model.js";

//  ADD COMMENT (USER)
export const addComment = async (req, res) => {
  try {
    const { text } = req.body;

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!text || text.trim().length < 2) {
      return res.status(400).json({ message: "Comment too short" });
    }

    await Comment.create({
      text,
      post: req.params.postId,
      user: req.user._id || req.user.id,
    });

    const comments = await Comment.find({ post: req.params.postId })
      .populate("user", "username")
      .sort({ createdAt: -1 });

    return res.status(201).json({
      message: "Comment added",
      comments,
    });
  } catch (err) {
    console.error("ADD COMMENT ERROR:", err);
    return res.status(500).json({ message: err.message });
  }
};


// GET COMMENTS (PER POST)
export const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate("user", "username")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Comments retrieved successfully",
      comments,
    });
  } catch (err) {
    console.error("GET COMMENTS ERROR:", err);
    return res.status(500).json({ message: err.message });
  }
};


// UPDATE COMMENT (OWNER)
export const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const userId = (req.user._id || req.user.id).toString();

    if (comment.user.toString() !== userId) {
      return res.status(403).json({ message: "Not allowed" });
    }

    comment.text = text || comment.text;
    const updated = await comment.save();

    return res.status(200).json({
      message: "Comment updated",
      updated,
    });
  } catch (err) {
    console.error("UPDATE COMMENT ERROR:", err);
    return res.status(500).json({ message: err.message });
  }
};


// DELETE COMMENT (OWNER / ADMIN / SUPERADMIN)
export const deleteComment = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const userId = (req.user._id || req.user.id).toString();

    if (
      comment.user.toString() !== userId &&
      req.user.role !== "admin" &&
      req.user.role !== "superadmin"
    ) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await Comment.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      message: "Comment deleted",
    });
  } catch (err) {
    console.error("DELETE COMMENT ERROR:", err);
    return res.status(500).json({ message: err.message });
  }
};


// ADMIN COMMENT TRACKER (ALL COMMENTS)
export const getAllCommentsForAdmin = async (req, res) => {
  try {
    if (
      req.user.role !== "admin" &&
      req.user.role !== "superadmin"
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    const comments = await Comment.find()
      .populate("user", "username role")
      .populate("post", "title category")
      .sort({ createdAt: -1 });

    return res.status(200).json(comments);
  } catch (err) {
    console.error("ADMIN COMMENT TRACKER ERROR:", err);
    return res.status(500).json({ message: err.message });
  }
};