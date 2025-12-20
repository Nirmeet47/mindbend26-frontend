"use client";
import React, { useEffect, useState } from "react";
import { usersApi } from "../../../../lib/dashboardApi";
import Table from "../../../../components/admin/Table";
import Header from "../../../../components/Header";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    usersApi
      .list()
      .then((res) => setUsers(res.data?.data?.users || []))
      .catch(() => setError("Failed to load users"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ color: "white" }}>
      <Header title="Users" />
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div style={{ color: "red" }}>{error}</div>
      ) : (
        <Table columns={["name", "email", "role", "isVerified", "isBan"]} data={users} />
      )}
    </div>
  );
}
