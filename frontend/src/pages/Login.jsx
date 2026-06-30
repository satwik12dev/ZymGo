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

  try {
    const res = await axios.post(
      "http://localhost:3000/admin/login",
      {
        email,
        password,
      }
    );

    console.log(res.data);

    localStorage.setItem("token", res.data.token);
localStorage.setItem("user", JSON.stringify(res.data.user));

navigate("/dashboard");
  } catch (err) {
    console.error(err);
  }
};

  return (
    <div className="min-h-screen bg-linear-to-r from-slate-900 via-slate-800 to-black flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8 sm:mb-10">
          <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-orange-500 rounded-2xl flex items-center justify-center shadow-xl">
            <FaBolt className="text-white text-3xl sm:text-4xl" />
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold text-white mt-5">
            Zymgoo CRM
          </h1>

          <p className="text-gray-400 text-sm sm:text-lg mt-2 px-2">
            Admin Panel - Sign in to continue
          </p>
        </div>

        {/* Login Card */}
        <form
          onSubmit={handleLogin}
          className="bg-slate-800 border border-slate-700 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl"
        >
          {/* Email */}
          <div className="mb-5">
            <label className="block text-white font-medium mb-2 text-sm sm:text-base">
              Username, Email or Mobile
            </label>

            <div className="flex items-center bg-slate-700 border border-slate-600 rounded-xl px-4 h-12 sm:h-14">
              <HiOutlineUser className="text-orange-500 text-xl sm:text-2xl" />

              <input
                type="email"
                placeholder="admin@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent outline-none text-white ml-3 w-full placeholder:text-gray-400 text-sm sm:text-base"
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-5">
            <label className="block text-white font-medium mb-2 text-sm sm:text-base">
              Password
            </label>

            <div className="flex items-center bg-slate-700 border border-slate-600 rounded-xl px-4 h-12 sm:h-14">
              <HiOutlineLockClosed className="text-orange-500 text-xl sm:text-2xl" />

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-transparent outline-none text-white ml-3 w-full placeholder:text-gray-400 text-sm sm:text-base"
              />
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
            <label className="flex items-center gap-2 text-white text-sm sm:text-base cursor-pointer">
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
              className="text-orange-500 hover:text-orange-400 text-sm self-start sm:self-auto"
            >
              Forgot password?
            </button>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 sm:h-14 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:bg-orange-400 text-white text-lg sm:text-xl font-semibold transition-all duration-300"
          >
            {loading ? "Signing In..." : "Sign In to Dashboard"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-gray-500 mt-8 sm:mt-10 text-xs sm:text-sm px-4">
          © 2026 Zymgoo. All rights reserved.
        </p>
      </div>
    </div>
  );
}