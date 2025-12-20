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
    <div className="px-8 py-10 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Header title="Security" />
      {loading ? (
        <div className="text-center text-base text-gray-500 py-12">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500 py-12">{error}</div>
      ) : (
        <pre className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 text-sm text-gray-700 dark:text-gray-200 overflow-x-auto border border-gray-200 dark:border-gray-700">
          {JSON.stringify(status, null, 2)}
        </pre>
      )}
    </div>
  );
}
