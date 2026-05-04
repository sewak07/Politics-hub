import express from "express";
import {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  toggleLikePost,
  getLikedPosts,
} from "../controller/postController.js";

import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";
import upload from "../middleware/upload.js";
import optionalAuth from "../middleware/optionalAuth.js";

const router = express.Router();

// PUBLIC ROUTES 
router.get("/", optionalAuth, getPosts);
router.get("/liked", authMiddleware, getLikedPosts);
router.get("/:id",optionalAuth, getPostById);


// CREATE POST
router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin", "superadmin"),
  upload.array("media", 10),
  createPost
);

// UPDATE POST
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "superadmin"),
  upload.array("media", 10),
  updatePost
);

// DELETE POST
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "superadmin"),
  deletePost
);

// LIKE / UNLIKE
router.patch("/:id/like", authMiddleware, toggleLikePost);



export default router;