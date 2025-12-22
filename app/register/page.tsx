"use client";
import React, { useState } from "react";
import api from "../../lib/api";

export default function RegisterPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    dob: "",
    otp: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Step 1: Send OTP
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await api.post("/auth/send-otp", { email: form.email });
      setSuccess("OTP sent to your email. Please check and enter it below.");
      setStep(2);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP and Register
  const handleVerifyAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/auth/verify-otp", {
        name: form.name,
        email: form.email,
        password: form.password,
        phoneNumber: form.phoneNumber,
        dob: form.dob,
        otp: form.otp,
      });
      setSuccess("Registration successful! You can now login.");
      setStep(1);
      setForm({ name: "", email: "", password: "", confirmPassword: "", phoneNumber: "", dob: "", otp: "" });
    } catch (err: any) {
      setError(err?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black">
      <form
        onSubmit={step === 1 ? handleSendOTP : handleVerifyAndRegister}
        className="bg-white p-8 rounded shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-4 text-black">Register</h2>
        {step === 1 && (
          <>
            <label className="block text-black mb-1">SVNIT Email</label>
            <input
              type="email"
              name="email"
              placeholder="SVNIT Email"
              value={form.email}
              onChange={handleChange}
              className="w-full mb-4 p-2 border border-black rounded text-black bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <button
              type="submit"
              className="w-full bg-black text-white p-2 rounded hover:bg-gray-900 transition"
              disabled={loading}
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </>
        )}
        {step === 2 && (
          <>
            <label className="block text-black mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              className="w-full mb-2 p-2 border border-black rounded text-black bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <label className="block text-black mb-1">SVNIT Email</label>
            <input
              type="email"
              name="email"
              placeholder="SVNIT Email"
              value={form.email}
              onChange={handleChange}
              className="w-full mb-2 p-2 border border-black rounded text-black bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
              disabled
            />
            <label className="block text-black mb-1">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full mb-2 p-2 border border-black rounded text-black bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <label className="block text-black mb-1">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full mb-2 p-2 border border-black rounded text-black bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <label className="block text-black mb-1">Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              placeholder="Phone Number"
              value={form.phoneNumber}
              onChange={handleChange}
              className="w-full mb-2 p-2 border border-black rounded text-black bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <label className="block text-black mb-1">Date of Birth</label>
            <input
              type="date"
              name="dob"
              placeholder="Date of Birth"
              value={form.dob}
              onChange={handleChange}
              className="w-full mb-2 p-2 border border-black rounded text-black bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <label className="block text-black mb-1">OTP</label>
            <input
              type="text"
              name="otp"
              placeholder="OTP"
              value={form.otp}
              onChange={handleChange}
              className="w-full mb-4 p-2 border border-black rounded text-black bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <button
              type="submit"
              className="w-full bg-black text-white p-2 rounded hover:bg-gray-900 transition"
              disabled={loading}
            >
              {loading ? "Registering..." : "Verify & Register"}
            </button>
          </>
        )}
        {error && <div className="text-red-500 mb-2">{error}</div>}
        {success && <div className="text-green-500 mb-2">{success}</div>}
      </form>
    </div>
  );
}
