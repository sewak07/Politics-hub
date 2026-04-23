import jwt from "jsonwebtoken";
import User from "../model/User.model.js";

const optionalAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) return next();

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("_id username role");

    if (user) {
      req.user = {
        _id: user._id,
        username: user.username,
        role: user.role,
      };
    }

    next();
  } catch (err) {
    next();
  }
};

export default optionalAuth;