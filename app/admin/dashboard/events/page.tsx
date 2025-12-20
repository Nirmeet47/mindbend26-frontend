"use client";
import React, { useEffect, useState } from "react";
import { eventsApi } from "../../../../lib/dashboardApi";
import Table from "../../../../components/admin/Table";
import Header from "../../../../components/Header";
import EditEventModal from "../../../../components/admin/EditEventModal";

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [editEvent, setEditEvent] = useState<any | null>(null);

  const fetchEvents = () => {
    setLoading(true);
    setError("");
    eventsApi
      .listAdmin()
      .then((res) => setEvents(res.data?.data?.events || []))
      .catch(() => setError("Failed to load events"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const filteredEvents =
    filter === "all"
      ? events
      : events.filter((e) => e.type === filter);

  const columns = ["name", "type", "slug", "isTeamEvent", "prizeMoney", "edit"];

  return (
    <div className="px-8 py-10 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Header title="Events" />
      <div className="flex items-center gap-4 mb-6">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Filter:</label>
        <select
          className="border border-gray-300 dark:border-gray-700 rounded px-3 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          value={filter}
          onChange={e => setFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="technical">Technical</option>
          <option value="managerial">Managerial</option>
        </select>
      </div>
      {loading ? (
        <div className="text-center text-base text-gray-500 py-12">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500 py-12">{error}</div>
      ) : (
        <div>
          <Table
            columns={columns}
            data={filteredEvents.map((event: any) => ({
              ...event,
              edit: (
                <button
                  className="px-3 py-1 rounded bg-blue-600 text-white text-xs hover:bg-blue-700 transition"
                  onClick={() => setEditEvent(event)}
                >
                  Edit
                </button>
              ),
            }))}
          />
        </div>
      )}
      {editEvent && (
        <EditEventModal
          event={editEvent}
          onClose={() => setEditEvent(null)}
          onSuccess={() => {
            setEditEvent(null);
            fetchEvents();
          }}
        />
      )}
    </div>
  );
}
