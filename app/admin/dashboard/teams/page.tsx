"use client";
import React, { useEffect, useState } from "react";
import { teamsApi } from "../../../../lib/dashboardApi";
import Table from "../../../../components/admin/Table";
import Header from "../../../../components/Header";

export default function AdminTeamsPage() {
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    teamsApi
      .myTeams()
      .then((res) => setTeams(res.data?.data?.teams || []))
      .catch(() => setError("Failed to load teams"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="px-8 py-10 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Header title="Teams" />
      {loading ? (
        <div className="text-center text-base text-gray-500 py-12">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500 py-12">{error}</div>
      ) : (
        <Table columns={["name", "members", "isActive"]} data={teams} />
      )}
    </div>
  );
}
