import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/login", form);

      if (!res?.data?.token || !res?.data?.user) {
        throw new Error("Invalid login response");
      }

      console.log("LOGIN RESPONSE:", res.data);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      const role = res.data.user.role;

      alert("Login successful");

      // IMPORTANT: delay navigation slightly prevents race conditions
      setTimeout(() => {
        if (role === "superadmin") navigate("/superadmin");
        else if (role === "admin") navigate("/admin");
        else navigate("/");
      }, 50);

    } catch (err) {
      console.log("LOGIN ERROR:", err);
      alert(err?.response?.data?.message || "Login failed");
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#faf7f2]">
      <form
        onSubmit={handleSubmit}
        className="w-[380px] bg-white p-8 border border-neutral-300"
      >
        <h2 className="text-2xl font-bold mb-6">Login</h2>

        <input
          name="email"
          value={form.email}
          placeholder="Email"
          className="w-full border p-2 mb-3"
          onChange={handleChange}
        />

        <input
          name="password"
          value={form.password}
          type="password"
          placeholder="Password"
          className="w-full border p-2 mb-4"
          onChange={handleChange}
        />

        <button
          type="submit"
          className="w-full bg-red-700 text-white py-2 font-bold"
        >
          Login
        </button>

        <p className="text-sm mt-4">
          No account?{" "}
          <Link to="/register" className="text-red-700 font-bold">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}