import express from "express";
import { registerUser, loginUser } from "../controller/authController.js";
import { validate } from "../middleware/validation.middleware.js";
import { registerSchema } from "../validation/user.validation.js";
import { loginSchema } from "../validation/login.validation.js";

const router = express.Router();

// REGISTER
router.post("/register", validate(registerSchema), registerUser);

// LOGIN
router.post("/login", validate(loginSchema), loginUser);

export default router;