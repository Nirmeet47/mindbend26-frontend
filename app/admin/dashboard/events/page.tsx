"use client";
import React, { useEffect, useState } from "react";
import { eventsApi } from "../../../../lib/dashboardApi";
import Table from "../../../../components/admin/Table";
import Header from "../../../../components/Header";
import EditEventModal from "../../../../components/admin/EditEventModal";
import AddEventModal from "../../../../components/admin/AddEventModal";
import { Button } from "../../../../components/ui/button";
import { Event } from "@/types";
import { Plus } from "lucide-react";

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [editEvent, setEditEvent] = useState<Event | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

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
      <div className="flex items-center justify-between mb-6">
        <Header title="Events Management" />
        <Button onClick={() => setShowAddModal(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Add New Event
        </Button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex items-center gap-4 mb-6">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Filter by type:</label>
          <select
            className="border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={filter}
            onChange={e => setFilter(e.target.value)}
          >
            <option value="all">All Events</option>
            <option value="technical">Technical</option>
            <option value="managerial">Managerial</option>
          </select>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600 dark:text-gray-400">Loading events...</span>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-500 text-lg mb-2">{error}</div>
            <Button onClick={fetchEvents} variant="outline">
              Try Again
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table
              columns={columns}
              data={filteredEvents.map((event: any) => ({
                ...event,
                isTeamEvent: event.isTeamEvent ? "Yes" : "No",
                prizeMoney: event.prizeMoney ? `₹${event.prizeMoney.toLocaleString()}` : "₹0",
                edit: (
                  <Button
                    onClick={() => setEditEvent(event)}
                    variant="outline"
                    size="sm"
                    className="text-blue-600 border-blue-200 hover:bg-blue-50"
                  >
                    Edit
                  </Button>
                ),
              }))}
            />
          </div>
        )}
      </div>

      {/* Add Event Modal */}
      <AddEventModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={() => {
          setShowAddModal(false);
          fetchEvents();
        }}
      />

      {/* Edit Event Modal */}
      {editEvent && (
        <EditEventModal
          event={editEvent}
          open={!!editEvent}
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
