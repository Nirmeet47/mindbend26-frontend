"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../lib/api";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await api.post("/auth/login", {
        email: form.email,
        password: form.password,
      });
      const token = res.data?.data?.token;
      if (token) {
        localStorage.setItem("token", token);
        setSuccess("Login successful!");
        setTimeout(() => {
          router.push("/user/dashboard");
        }, 1000);
      } else {
        setError("No token returned from server.");
      }
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
        (err?.response?.data?.errors?.[0]?.msg ?? "Login failed.")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-black">Login</h2>
        <label className="block text-black mb-1">Email</label>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full mb-2 p-2 border border-black rounded text-black bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <label className="block text-black mb-1">Password</label>
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full mb-4 p-2 border border-black rounded text-black bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        {error && <div className="text-red-500 mb-2">{error}</div>}
        {success && <div className="text-green-500 mb-2">{success}</div>}
        <button type="submit" className="w-full bg-black text-white p-2 rounded hover:bg-gray-900 transition" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
