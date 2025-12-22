"use client";
import React, { useEffect, useState } from "react";
import api from "../../../lib/api";

type EventType = "technical" | "managerial";

type Team = {
  _id: string;
  name: string;
  eventId: {
    _id: string;
    name: string;
    type: EventType;
    venue?: string;
    eventDate?: string;
  };
  leader: { name: string; email: string };
  members: { user: { name: string; email: string } }[];
};

export default function UserDashboard() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<EventType>("technical");

  useEffect(() => {
    const fetchTeams = async () => {
      setLoading(true);
      setError("");
      try {
        // Use the correct token key (mb_admin_token) for consistency with api.ts
        const token = typeof window !== "undefined" ? localStorage.getItem("mb_admin_token") : null;
        if (!token) {
          setError("You are not logged in. Please login to view your dashboard.");
          setTeams([]);
          return;
        }
        const res = await api.get("/teams", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTeams(res.data?.data?.teams || []);
      } catch (err: any) {
        // If 400 error, show a friendly message
        if (err?.response?.status === 400) {
          setError("You have not registered for any events yet.");
        } else {
          setError(err?.response?.data?.message || err.message || "Failed to load events");
        }
        setTeams([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTeams();
  }, []);

  const grouped = {
    technical: teams.filter((t) => t.eventId.type === "technical"),
    managerial: teams.filter((t) => t.eventId.type === "managerial"),
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center py-12">
      <div className="bg-white rounded shadow-md w-full max-w-3xl p-8">
        <h2 className="text-3xl font-bold mb-6 text-black">Your Registered Events</h2>
        <div className="flex gap-4 mb-6">
          <button
            className={`px-4 py-2 rounded font-semibold border-b-2 transition-colors ${tab === "technical" ? "border-blue-600 text-blue-600 bg-blue-50" : "border-transparent text-gray-600 bg-gray-100 hover:bg-gray-200"}`}
            onClick={() => setTab("technical")}
          >
            Technical
          </button>
          <button
            className={`px-4 py-2 rounded font-semibold border-b-2 transition-colors ${tab === "managerial" ? "border-green-600 text-green-600 bg-green-50" : "border-transparent text-gray-600 bg-gray-100 hover:bg-gray-200"}`}
            onClick={() => setTab("managerial")}
          >
            Managerial
          </button>
        </div>
        {loading ? (
          <div className="text-center text-gray-500">Loading events...</div>
        ) : error ? (
          <div className="text-red-500 text-center mb-4">{error}</div>
        ) : grouped[tab].length === 0 ? (
          <div className="text-gray-500 text-center text-lg py-8">
            You have not registered for any {tab} events yet.<br />
            <span className="text-sm text-gray-400">Go to the events page to register!</span>
          </div>
        ) : (
          <div className="space-y-4">
            {grouped[tab].map((team) => (
              <div key={team._id} className="border rounded p-4 bg-gray-50 flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="text-lg font-semibold text-black">{team.eventId.name}</div>
                  <div className="text-sm text-gray-600">Team: <span className="font-mono">{team.name}</span></div>
                  <div className="text-xs text-gray-500">Venue: {team.eventId.venue || "TBA"} | Date: {team.eventId.eventDate ? new Date(team.eventId.eventDate).toLocaleDateString() : "TBA"}</div>
                </div>
                <div className="mt-2 md:mt-0 flex flex-col items-end">
                  <div className="text-xs text-gray-700">Leader: {team.leader.name}</div>
                  <div className="text-xs text-gray-700">Members: {team.members.map(m => m.user.name).join(", ")}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
