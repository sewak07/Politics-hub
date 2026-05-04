import express from "express";
import {
  getComments,
  addComment,
  updateComment,
  deleteComment,
} from "../controller/commentController.js";

import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

// GET COMMENTS FOR A POST (PUBLIC)
router.get("/post/:postId", getComments);

// PROTECTED ROUTES
router.post("/post/:postId", authMiddleware, addComment);
router.put("/:id", authMiddleware, updateComment);
router.delete("/:id", authMiddleware, deleteComment);

export default router;