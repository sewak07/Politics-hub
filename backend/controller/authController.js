import jwt from "jsonwebtoken";
import User from "../model/User.model.js";

// REGISTER
export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      username,
      email,
      password,
      role: "user",
    });

    res.status(201).json({
      message: "User created",
      user,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// LOGIN (WORKS FOR ALL ROLES INCLUDING SUPERADMIN)
export const loginUser = async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({ message: "email not found" });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: "password incorrect" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login success",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};