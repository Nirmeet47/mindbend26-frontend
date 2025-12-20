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
    <div className="px-8 py-10 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Header title="Events" />
      {loading ? (
        <div className="text-center text-base text-gray-500 py-12">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500 py-12">{error}</div>
      ) : (
        <Table columns={["name", "type", "slug", "isTeamEvent", "prizeMoney"]} data={events} />
      )}
    </div>
  );
}
