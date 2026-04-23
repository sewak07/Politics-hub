import jwt from "jsonwebtoken";
import User from "../model/User.model.js";

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = {
      _id: user._id,
      role: user.role,
      username: user.username,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid token",
      error: error.message,
    });
  }
};

export default authMiddleware;