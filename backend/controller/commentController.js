import Comment from '../model/Comment.model.js';

// ADD COMMENT
export const addComment = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.length < 2) {
      return res.status(400).json({ message: "Comment too short" });
    }

    const comment = await Comment.create({
      text,
      post: req.params.postId,
      user: req.user.id,
    });

    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//get comments for a post
export const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId }).populate('user', 'username').sort({ createdAt: -1 });
    res.status(200).json({ message: 'Comments retrieved successfully', comments });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

//update comment
export const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // only owner can edit
    if (comment.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not allowed" });
    }

    comment.text = text || comment.text;

    const updated = await comment.save();

    res.status(200).json({
      message: "Comment updated",
      updated
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//delete comment
export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // allow owner OR admin
    if (
      req.user.role !== "admin" &&
      comment.user.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await Comment.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Comment deleted"
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};