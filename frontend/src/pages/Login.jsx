import { useState } from "react";
import axios from "axios";
import { HiOutlineUser, HiOutlineLockClosed } from "react-icons/hi";
import { FaBolt } from "react-icons/fa";

import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post("http://localhost:3000/admin/login", {
        email,
        password,
      });

      console.log(res.data);

      // Save token
      localStorage.setItem("token", res.data.token);

      // Save admin data if returned
      if (res.data.admin) {
        localStorage.setItem("admin", JSON.stringify(res.data.admin));
      }

      alert("Login Successful!");

      // Redirect
      navigate("/dashboard")
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
        "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-r from-slate-900 via-slate-800 to-black flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-10">
          <div className="mx-auto w-20 h-20 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
            <FaBolt className="text-white text-4xl" />
          </div>

          <h1 className="text-white text-5xl font-bold mt-6">
            Zymgoo CRM
          </h1>

          <p className="text-gray-400 mt-2 text-lg">
            Admin Panel - Sign in to continue
          </p>
        </div>

        {/* Login Card */}
        <form
          onSubmit={handleLogin}
          className="bg-slate-800 border border-slate-700 rounded-3xl p-8 shadow-2xl"
        >
          {/* Email */}
          <div className="mb-6">
            <label className="block text-white font-medium mb-2">
              Username, Email or Mobile
            </label>

            <div className="flex items-center bg-slate-700 rounded-xl px-4 h-14 border border-slate-600">
              <HiOutlineUser className="text-orange-500 text-2xl" />

              <input
                type="email"
                placeholder="admin@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent outline-none text-white ml-3 w-full placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="block text-white font-medium mb-2">
              Password
            </label>

            <div className="flex items-center bg-slate-700 rounded-xl px-4 h-14 border border-slate-600">
              <HiOutlineLockClosed className="text-orange-500 text-2xl" />

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-transparent outline-none text-white ml-3 w-full placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex justify-between items-center mb-6">
            <label className="flex items-center gap-2 text-white cursor-pointer">
              <input
                type="checkbox"
                checked={remember}
                onChange={() => setRemember(!remember)}
                className="accent-orange-500"
              />
              Remember me
            </label>

            <button
              type="button"
              className="text-orange-500 hover:text-orange-400"
            >
              Forgot password?
            </button>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:bg-orange-400 text-white text-xl font-semibold transition"
          >
            {loading ? "Signing In..." : "Sign In to Dashboard"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-gray-500 mt-10">
          © 2026 Zymgoo. All rights reserved.
        </p>

      </div>
    </div>
  );
}