import api from "../api/axios";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/auth/register", form);
      alert("Account created");
      navigate("/login");
    } catch (err) {
      console.log(err?.response?.data); // IMPORTANT DEBUG
      alert(err?.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#faf7f2]">
      <form
        onSubmit={handleSubmit}
        className="w-[380px] bg-white p-8 border border-neutral-300"
      >
        <h2 className="text-2xl font-bold mb-6">Register</h2>

        <input
          name="username"
          placeholder="Username"
          className="w-full border p-2 mb-3"
          onChange={handleChange}
        />

        <input
          name="email"
          placeholder="Email"
          className="w-full border p-2 mb-3"
          onChange={handleChange}
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full border p-2 mb-4"
          onChange={handleChange}
        />

        <button className="w-full bg-red-700 text-white py-2 font-bold">
          Create Account
        </button>

        <p className="text-sm mt-4">
          Already have account?{" "}
          <Link to="/login" className="text-red-700 font-bold">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}