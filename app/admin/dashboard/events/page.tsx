"use client";
import React, { useEffect, useState } from "react";
import { eventsApi } from "../../../../lib/dashboardApi";
import Table from "../../../../components/admin/Table";
import Header from "../../../../components/Header";

export default function AdminEventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    eventsApi
      .listAdmin()
      .then((res) => setEvents(res.data?.data?.events || []))
      .catch(() => setError("Failed to load events"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ color: "white" }}>
      <Header title="Events" />
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div style={{ color: "red" }}>{error}</div>
      ) : (
        <Table columns={["name", "type", "slug", "isTeamEvent", "prizeMoney"]} data={events} />
      )}
    </div>
  );
}
