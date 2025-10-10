import React, { useState } from "react";
import { useAuthStore } from "../store/user.store.js";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const { login, register, loading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let success = false;
    if (isRegister) {
      success = await register(form.username, form.email, form.password);
    } else {
      success = await login(form.email, form.password);
    }

    if (success) navigate("/");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-100 via-white to-red-50">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-center text-red-600 mb-6">
          {isRegister ? "Create an Account" : "Welcome Back"}
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 mb-4 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-gray-700 mb-1 font-medium">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-400 outline-none"
                placeholder="Enter your username"
              />
            </div>
          )}

          <div>
            <label className="block text-gray-700 mb-1 font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-400 outline-none"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-400 outline-none"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading
              ? "Processing..."
              : isRegister
              ? "Register"
              : "Login"}
          </button>
        </form>

        <p className="text-center text-gray-600 text-sm mt-6">
          {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-red-600 font-semibold hover:underline"
          >
            {isRegister ? "Login" : "Register"}
          </button>
        </p>
      </div>
    </div>
  );
}
