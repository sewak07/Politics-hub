import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";
import {
  getUsers,
  promoteToAdmin,
  demoteAdmin,
  getAdminStats,
} from "../controller/adminController.js";
import { getActivityLogs } from "../controller/activityController.js";

const router = express.Router();

// 🔐 SUPERADMIN ONLY

router.get(
  "/users",
  authMiddleware,
  roleMiddleware("superadmin"),
  getUsers
);

router.patch(
  "/users/promote/:id",
  authMiddleware,
  roleMiddleware("superadmin"),
  promoteToAdmin
);

router.patch(
  "/users/demote/:id",
  authMiddleware,
  roleMiddleware("superadmin"),
  demoteAdmin
);

//both admin and superadmin

router.get(
  "/stats",
  authMiddleware,
  roleMiddleware("superadmin", "admin"),
  getAdminStats
);


router.get(
  "/activity",
  authMiddleware,
  roleMiddleware("superadmin","admin"),
  getActivityLogs
);

export default router;