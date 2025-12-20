
"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { parseJWT } from "../../../lib/auth";
import { getCounts } from "../../../lib/dashboardApi";
import Header from "../../../components/Header";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [counts, setCounts] = useState<{ users: number; events: number; teams: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("mb_admin_token") : null;
    if (!token || !parseJWT(token)) {
      router.replace("/admin");
      return;
    }
    getCounts()
      .then((data) => {
        setCounts(data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load dashboard stats");
        setLoading(false);
      });
  }, [router]);

  return (
    <div className="px-8 py-10 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Header title="Admin Dashboard" />
      {loading ? (
        <div className="text-center text-base text-gray-500 py-12">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500 py-12">{error}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-12">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow p-8 flex flex-col items-center">
            <span className="text-gray-500 text-xs mb-2">Total Users</span>
            <span className="text-3xl font-semibold text-gray-900 dark:text-white">{counts?.users ?? 0}</span>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow p-8 flex flex-col items-center">
            <span className="text-gray-500 text-xs mb-2">Total Events</span>
            <span className="text-3xl font-semibold text-gray-900 dark:text-white">{counts?.events ?? 0}</span>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow p-8 flex flex-col items-center">
            <span className="text-gray-500 text-xs mb-2">Total Teams</span>
            <span className="text-3xl font-semibold text-gray-900 dark:text-white">{counts?.teams ?? 0}</span>
          </div>
        </div>
      )}
    </div>
  );
}
