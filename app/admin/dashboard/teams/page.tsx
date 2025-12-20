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
    <div style={{ color: "white" }}>
      <Header title="Teams" />
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div style={{ color: "red" }}>{error}</div>
      ) : (
        <Table columns={["name", "members", "isActive"]} data={teams} />
      )}
    </div>
  );
}
