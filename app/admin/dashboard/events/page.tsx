"use client";
import React, { useEffect, useState } from "react";
import { eventsApi } from "../../../../lib/dashboardApi";
import Table from "../../../../components/admin/Table";
import EditEventModal from "../../../../components/admin/EditEventModal";
import AddEventModal from "../../../../components/admin/AddEventModal";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Event } from "@/types";
import { Plus, Filter, RefreshCw } from "lucide-react";

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
      .listAdmin({ page: 1, limit: 1000 })
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
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="border-b border-white/5 bg-[#0a0a0a]/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">Events Management</h1>
              <p className="text-sm text-gray-400">Manage all technical and managerial events</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={fetchEvents}
                variant="outline"
                size="sm"
                className="bg-transparent border-white/10 text-gray-400 hover:text-white hover:bg-white/5"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button
                onClick={() => setShowAddModal(true)}
                className="bg-white text-black hover:bg-gray-200"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Event
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-8 py-8">
        <Card className="bg-[#0a0a0a] border-white/5">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">All Events</CardTitle>
              <div className="flex items-center gap-3">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  className="bg-white/5 border border-white/10 rounded-md px-3 py-1.5 text-sm text-white focus:ring-2 focus:ring-white/20 focus:border-transparent outline-none"
                  value={filter}
                  onChange={e => setFilter(e.target.value)}
                >
                  <option value="all" className="bg-black">All Events</option>
                  <option value="technical" className="bg-black">Technical</option>
                  <option value="managerial" className="bg-black">Managerial</option>
                </select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mb-3" />
                <span className="text-sm text-gray-400">Loading events...</span>
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <div className="text-red-400 text-sm mb-4">{error}</div>
                <Button
                  onClick={fetchEvents}
                  variant="outline"
                  className="bg-transparent border-white/10 text-gray-400 hover:text-white hover:bg-white/5"
                >
                  Try Again
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table
                  columns={columns}
                  data={filteredEvents.map((event: any) => ({
                    ...event,
                    type: (
                      <Badge
                        variant="outline"
                        className={`${event.type === 'technical'
                          ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                          : 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                          }`}
                      >
                        {event.type}
                      </Badge>
                    ),
                    isTeamEvent: event.isTeamEvent ? (
                      <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20">
                        Team
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-gray-500/10 text-gray-400 border-gray-500/20">
                        Solo
                      </Badge>
                    ),
                    prizeMoney: event.prizeMoney ? (
                      <span className="text-green-400 font-medium">₹{event.prizeMoney.toLocaleString()}</span>
                    ) : (
                      <span className="text-gray-500">₹0</span>
                    ),
                    edit: (
                      <Button
                        onClick={() => setEditEvent(event)}
                        variant="outline"
                        size="sm"
                        className="bg-transparent border-white/10 text-gray-400 hover:text-white hover:bg-white/5"
                      >
                        Edit
                      </Button>
                    ),
                  }))}
                />
              </div>
            )}
          </CardContent>
        </Card>
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
