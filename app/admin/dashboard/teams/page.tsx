"use client";
import React, { useEffect, useState, useCallback } from "react";
import { teamsApi } from "../../../../lib/dashboardApi";
import Header from "../../../../components/Header";

interface Team {
  _id: string;
  name: string;
  isActive: boolean;
  eventId: {
    _id: string;
    name: string;
    type: string;
    isTeamEvent: boolean;
  };
  leader: {
    _id: string;
    name: string;
    email: string;
    phoneNumber?: string;
  };
  members: Array<{
    user: {
      _id: string;
      name: string;
      email: string;
    };
    status: string;
  }>;
  createdAt: string;
}

export default function AdminTeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const limit = 20;

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [teamSizeFilter, setTeamSizeFilter] = useState<string>("all");
  const [eventNameFilter, setEventNameFilter] = useState<string>("");

  const fetchTeams = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const filter: any = {};
      
      // Apply filters
      if (statusFilter !== "all") {
        filter.isActive = statusFilter === "active";
      }
      
      if (searchTerm) {
        filter.name = { $regex: searchTerm, $options: "i" };
      }

      const sortBy = { createdAt: -1 };
      
      const response = await teamsApi.listAdmin({
        page,
        limit,
        filter,
        sortBy,
      });

      let fetchedTeams = response.data?.data?.teams || [];

      // Client-side filtering for complex filters
      if (typeFilter !== "all") {
        fetchedTeams = fetchedTeams.filter(
          (team: Team) => team.eventId?.type === typeFilter
        );
      }

      if (teamSizeFilter !== "all") {
        fetchedTeams = fetchedTeams.filter((team: Team) => {
          const size = team.members?.length || 0;
          if (teamSizeFilter === "1") return size === 1;
          if (teamSizeFilter === "2-3") return size >= 2 && size <= 3;
          if (teamSizeFilter === "4+") return size >= 4;
          return true;
        });
      }

      if (eventNameFilter) {
        fetchedTeams = fetchedTeams.filter((team: Team) =>
          team.eventId?.name?.toLowerCase().includes(eventNameFilter.toLowerCase())
        );
      }

      setTeams(fetchedTeams);
      setTotalPages(response.data?.totalPages || 1);
      setTotalResults(response.data?.totalResults || 0);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load teams");
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm, statusFilter, typeFilter, teamSizeFilter, eventNameFilter]);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  const handleStatusToggle = async (teamId: string, currentStatus: boolean) => {
    if (!confirm(`Are you sure you want to ${currentStatus ? "deactivate" : "activate"} this team?`)) {
      return;
    }
    
    try {
      await teamsApi.updateStatus(teamId, !currentStatus);
      fetchTeams(); // Refresh the list
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to update team status");
    }
  };

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setTypeFilter("all");
    setTeamSizeFilter("all");
    setEventNameFilter("");
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">
          Teams Management
        </h1>
        <p className="text-slate-400">
          Manage and monitor all team registrations across events
        </p>
      </div>
      
      {/* Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-linear-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-6 shadow-xl">
          <div className="text-slate-400 text-sm font-medium mb-1">Total Teams</div>
          <div className="text-3xl font-bold text-white">{totalResults}</div>
        </div>
        <div className="bg-linear-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-6 shadow-xl">
          <div className="text-slate-400 text-sm font-medium mb-1">Active Teams</div>
          <div className="text-3xl font-bold text-white">
            {teams.filter(t => t.isActive).length}
          </div>
        </div>
        <div className="bg-linear-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-6 shadow-xl">
          <div className="text-slate-400 text-sm font-medium mb-1">Inactive Teams</div>
          <div className="text-3xl font-bold text-white">
            {teams.filter(t => !t.isActive).length}
          </div>
        </div>
        <div className="bg-linear-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-6 shadow-xl">
          <div className="text-slate-400 text-sm font-medium mb-1">Displayed</div>
          <div className="text-3xl font-bold text-white">{teams.length}</div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-linear-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-6 mb-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
          <h2 className="text-xl font-semibold text-white">
            Filter Options
          </h2>
          <button
            onClick={resetFilters}
            className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-slate-300 bg-slate-700 hover:bg-slate-600 rounded-xl transition-colors"
          >
            Clear Filters
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {/* Team Name Search */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Team Name
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              placeholder="Search teams..."
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          {/* Event Name Search */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Event Name
            </label>
            <input
              type="text"
              value={eventNameFilter}
              onChange={(e) => {
                setEventNameFilter(e.target.value);
                setPage(1);
              }}
              placeholder="Search events..."
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500 transition-colors"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Type Filter */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Event Type
            </label>
            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500 transition-colors"
            >
              <option value="all">All Types</option>
              <option value="technical">Technical</option>
              <option value="managerial">Managerial</option>
              <option value="workshop">Workshop</option>
            </select>
          </div>

          {/* Team Size Filter */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Team Size
            </label>
            <select
              value={teamSizeFilter}
              onChange={(e) => {
                setTeamSizeFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500 transition-colors"
            >
              <option value="all">All Sizes</option>
              <option value="1">Solo</option>
              <option value="2-3">2-3 Members</option>
              <option value="4+">4+ Members</option>
            </select>
          </div>
        </div>
      </div>

      {/* Teams Display */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-8 text-center">
          <p className="text-red-400 text-lg">{error}</p>
        </div>
      ) : teams.length === 0 ? (
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-12 text-center">
          <p className="text-slate-400 text-lg">No teams found</p>
        </div>
      ) : (
        <>
          {/* Teams Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
            {teams.map((team) => (
              <div 
                key={team._id}
                className="bg-linear-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl overflow-hidden hover:border-purple-500/50 transition-all shadow-xl"
              >
                {/* Card Header */}
                <div className="bg-slate-800/50 p-5 border-b border-slate-700">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-white truncate mb-1">
                        {team.name}
                      </h3>
                      <p className="text-sm text-slate-400 truncate">
                        {team.eventId?.name || "No Event Associated"}
                      </p>
                    </div>
                    <span
                      className={`ml-3 px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap ${
                        team.isActive
                          ? "bg-green-500/20 text-green-400 border border-green-500/30"
                          : "bg-slate-600/20 text-slate-400 border border-slate-600/30"
                      }`}
                    >
                      {team.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  
                  {/* Event Type Badge */}
                  <span
                    className={`inline-block px-3 py-1 rounded-lg text-xs font-medium ${
                      team.eventId?.type === "technical"
                        ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                        : team.eventId?.type === "managerial"
                        ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                        : "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                    }`}
                  >
                    {team.eventId?.type || "N/A"}
                  </span>
                </div>

                {/* Card Body */}
                <div className="p-5 space-y-4">
                  {/* Leader Info */}
                  <div>
                    <div className="text-xs font-medium text-slate-400 mb-3">
                      Team Leader
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-linear-to-br from-black-500 to-gray-500 flex items-center justify-center text-white font-semibold text-sm shadow-lg">
                        {team.leader?.name?.charAt(0).toUpperCase() || "?"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">
                          {team.leader?.name || "Unknown"}
                        </p>
                        <p className="text-xs text-slate-400 truncate">
                          {team.leader?.email || "No email"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Team Stats */}
                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-700">
                    <div className="bg-slate-900/50 rounded-xl p-3 border border-slate-700">
                      <div className="text-xs text-slate-400 mb-1">
                        Members
                      </div>
                      <div className="text-xl font-bold text-white">
                        {team.members?.length || 0}
                      </div>
                    </div>
                    <div className="bg-slate-900/50 rounded-xl p-3 border border-slate-700">
                      <div className="text-xs text-slate-400 mb-1">
                        Created
                      </div>
                      <div className="text-sm font-semibold text-white">
                        {new Date(team.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => handleStatusToggle(team._id, team.isActive)}
                    className={`w-full py-2.5 rounded-xl font-medium text-sm transition-all ${
                      team.isActive
                        ? "bg-red-600 hover:bg-red-700 text-white"
                        : "bg-green-600 hover:bg-green-700 text-white"
                    }`}
                  >
                    {team.isActive ? "Deactivate Team" : "Activate Team"}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setPage(1)}
                disabled={page === 1}
                className="px-4 py-2 bg-slate-800 border border-slate-700 text-white rounded-lg hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                First
              </button>
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="px-4 py-2 bg-slate-800 border border-slate-700 text-white rounded-lg hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Prev
              </button>
              
              {/* Page Numbers */}
              <div className="flex items-center gap-2">
                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                        page === pageNum
                          ? "bg-linear-to-r from-purple-600 to-gray-600 text-white"
                          : "bg-slate-800 border border-slate-700 text-slate-400 hover:bg-slate-700"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
                className="px-4 py-2 bg-slate-800 border border-slate-700 text-white rounded-lg hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
              <button
                onClick={() => setPage(totalPages)}
                disabled={page === totalPages}
                className="px-4 py-2 bg-slate-800 border border-slate-700 text-white rounded-lg hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Last
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
