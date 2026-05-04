import dotenv from "dotenv";
dotenv.config();

import express from "express";
import connectDB from "./database/database.js";
import cors from "cors";

// ROUTES
import authRoutes from "./routes/auth.js";
import postRoutes from "./routes/posts.js";
import commentRoutes from "./routes/comments.js";
import adminRoutes from "./routes/admin.js";

// MIDDLEWARE
import errorMiddleware from "./middleware/error.middleware.js";

const app = express();

// CORS
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"],
  credentials: true
}));

// BODY PARSER
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ROUTES
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/posts", postRoutes);
app.use("/api/v1/comments", commentRoutes);
app.use("/api/v1/admin", adminRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ERROR HANDLER
app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(); //  WAIT for MongoDB first

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  }
};

start();
