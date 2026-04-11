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
import { Plus, Filter, RefreshCw, Download, CheckCircle, AlertCircle, FileSpreadsheet, Loader2 } from "lucide-react";

interface DownloadStatus {
  [eventId: string]: "idle" | "downloading" | "done" | "error";
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [editEvent, setEditEvent] = useState<Event | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState<DownloadStatus>({});
  const [downloadingAll, setDownloadingAll] = useState(false);
  const [allExportDone, setAllExportDone] = useState(false);

  const setStatus = (id: string, status: "idle" | "downloading" | "done" | "error") => {
    setDownloadStatus((prev) => ({ ...prev, [id]: status }));
  };

  const downloadCSV = async (eventId: string, eventName: string): Promise<boolean> => {
    try {
      setStatus(eventId, "downloading");
      const response = await eventsApi.exportTeamsCSV(eventId);
      const blob = new Blob([response.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const sanitizedName = eventName.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();
      link.download = `${sanitizedName}_teams_${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      setStatus(eventId, "done");
      // Reset to idle after 3 seconds
      setTimeout(() => setStatus(eventId, "idle"), 3000);
      return true;
    } catch (err: any) {
      setStatus(eventId, "error");
      setTimeout(() => setStatus(eventId, "idle"), 3000);
      let msg = "Failed to download CSV. No teams might be registered for this event.";
      if (err?.response?.data instanceof Blob) {
        const text = await err.response.data.text();
        try {
          const json = JSON.parse(text);
          msg = json.message || msg;
        } catch {}
      }
      console.error(`CSV export error for ${eventName}:`, msg);
      return false;
    }
  };

  const downloadAllCSV = async () => {
    setDownloadingAll(true);
    setAllExportDone(false);
    const teamEvents = filteredEvents.filter((e) => e.isTeamEvent);
    const soloEvents = filteredEvents.filter((e) => !e.isTeamEvent);
    const allEventsToExport = [...teamEvents, ...soloEvents];
    for (const event of allEventsToExport) {
      await downloadCSV(event._id, event.name);
    }
    setDownloadingAll(false);
    setAllExportDone(true);
    setTimeout(() => setAllExportDone(false), 4000);
  };

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
    filter === "all" ? events : events.filter((e) => e.type === filter);

  const columns = ["name", "type", "slug", "isTeamEvent", "prizeMoney", "actions"];

  const getDownloadButton = (event: any) => {
    const status = downloadStatus[event._id] || "idle";
    if (status === "downloading") {
      return (
        <Button
          disabled
          variant="outline"
          size="sm"
          className="bg-emerald-500/10 border-emerald-500/20 text-emerald-400 gap-1.5 min-w-[130px]"
        >
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          Exporting...
        </Button>
      );
    }
    if (status === "done") {
      return (
        <Button
          disabled
          variant="outline"
          size="sm"
          className="bg-green-500/10 border-green-500/20 text-green-400 gap-1.5 min-w-[130px]"
        >
          <CheckCircle className="w-3.5 h-3.5" />
          Downloaded!
        </Button>
      );
    }
    if (status === "error") {
      return (
        <Button
          onClick={() => downloadCSV(event._id, event.name)}
          variant="outline"
          size="sm"
          className="bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20 gap-1.5 min-w-[130px]"
        >
          <AlertCircle className="w-3.5 h-3.5" />
          No Teams
        </Button>
      );
    }
    return (
      <Button
        onClick={() => downloadCSV(event._id, event.name)}
        variant="outline"
        size="sm"
        className="bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/20 gap-1.5 min-w-[130px]"
      >
        <FileSpreadsheet className="w-3.5 h-3.5" />
        Export CSV
      </Button>
    );
  };

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
      <div className="px-8 py-8 space-y-6">

        {/* CSV Export Panel */}
        <div className="bg-[#0a0a0a] border border-emerald-500/20 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                <FileSpreadsheet className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-white">Export Teams Data as CSV</h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Download team registrations for individual events or all at once.
                  Use the <span className="text-emerald-400 font-medium">Export CSV</span> button in each row, or bulk-export below.
                </p>
              </div>
            </div>
            <Button
              onClick={downloadAllCSV}
              disabled={downloadingAll || filteredEvents.length === 0}
              className={`gap-2 text-sm font-medium px-5 transition-all ${
                allExportDone
                  ? "bg-green-500/20 border border-green-500/30 text-green-400 hover:bg-green-500/30"
                  : "bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/30"
              }`}
            >
              {downloadingAll ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Exporting All...
                </>
              ) : allExportDone ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  All Exported!
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Export All Events CSV
                </>
              )}
            </Button>
          </div>
        </div>

        <Card className="bg-[#0a0a0a] border-white/5">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">All Events</CardTitle>
              <div className="flex items-center gap-3">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  className="bg-white/5 border border-white/10 rounded-md px-3 py-1.5 text-sm text-white focus:ring-2 focus:ring-white/20 focus:border-transparent outline-none"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="all" className="bg-black">All Events</option>
                  <option value="technical" className="bg-black">Technical</option>
                  <option value="managerial" className="bg-black">Managerial</option>
                  <option value="esports" className="bg-black">Esports</option>
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
                        className={`${
                          event.type === "technical"
                            ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                            : event.type === "esports"
                            ? "bg-orange-500/10 text-orange-400 border-orange-500/20"
                            : "bg-purple-500/10 text-purple-400 border-purple-500/20"
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
                    actions: (
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => setEditEvent(event)}
                          variant="outline"
                          size="sm"
                          className="bg-transparent border-white/10 text-gray-400 hover:text-white hover:bg-white/5"
                        >
                          Edit
                        </Button>
                        {getDownloadButton(event)}
                      </div>
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
