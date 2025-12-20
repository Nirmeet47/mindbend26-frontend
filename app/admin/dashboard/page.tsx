
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
    <div style={{ color: "white" }}>
      <Header title="Admin Dashboard" />
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div style={{ color: "red" }}>{error}</div>
      ) : (
        <div style={{ display: "flex", gap: 32, marginTop: 32 }}>
          <div className="card" style={{ minWidth: 180 }}>
            <h3>Users</h3>
            <div style={{ fontSize: 32 }}>{counts?.users ?? 0}</div>
          </div>
          <div className="card" style={{ minWidth: 180 }}>
            <h3>Events</h3>
            <div style={{ fontSize: 32 }}>{counts?.events ?? 0}</div>
          </div>
          <div className="card" style={{ minWidth: 180 }}>
            <h3>Teams</h3>
            <div style={{ fontSize: 32 }}>{counts?.teams ?? 0}</div>
          </div>
        </div>
      )}
    </div>
  );
}
