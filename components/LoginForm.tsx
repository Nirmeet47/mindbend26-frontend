
"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }
    setLoading(true);
    try {

      const res = await api.post("/auth/login", { email, password });

      // const res = await axios.post(
      //   process.env.NEXT_PUBLIC_API_URL + "/auth/login",
      //   { email, password }, { withCredentials: true }
      // );
      // const token = res.data?.data?.token;
      // if (token) {
        
        // localStorage.setItem("mb_admin_token", token);

        router.push("/admin/dashboard");
      // } else {
      //   setError("No token returned from server.");
      // }
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
        (err?.response?.data?.errors?.[0]?.msg ?? "Login failed.")
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 24, maxWidth: 400, margin: "0 auto" }}>
      <h2>Admin Login</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ width: "100%", padding: 8, marginTop: 6, borderRadius: 6 }}
            autoComplete="username"
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ width: "100%", padding: 8, marginTop: 6, borderRadius: 6 }}
            autoComplete="current-password"
          />
        </div>
        {error && <div style={{ color: "red", marginBottom: 12 }}>{error}</div>}
        <button type="submit" disabled={loading} style={{ width: "100%", padding: 10 }}>
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}
