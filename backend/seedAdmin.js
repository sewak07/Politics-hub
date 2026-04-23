import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./model/User.model.js";

dotenv.config();

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  await User.deleteMany({ role: "superadmin" });

  const email = "admin@gmail.com";
  const password = "admin123";

  await User.create({
    username: "Super Admin",
    email,
    password,
    role: "superadmin",
  });

  console.log("Superadmin created:");
  console.log("Email:", email);
  console.log("Password:", password);

  process.exit();
};

seed();