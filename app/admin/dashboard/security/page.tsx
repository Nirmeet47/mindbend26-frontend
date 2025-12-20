"use client";
import React, { useEffect, useState } from "react";
import { securityApi } from "../../../../lib/dashboardApi";
import Header from "../../../../components/Header";

export default function AdminSecurityPage() {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    securityApi
      .status()
      .then((res) => setStatus(res.data?.data || {}))
      .catch(() => setError("Failed to load security status"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ color: "white" }}>
      <Header title="Security" />
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div style={{ color: "red" }}>{error}</div>
      ) : (
        <pre style={{ background: "#222", padding: 16, borderRadius: 8 }}>
          {JSON.stringify(status, null, 2)}
        </pre>
      )}
    </div>
  );
}
