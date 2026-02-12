"use client";
import React, { useEffect, useState, useCallback } from "react";
import { teamsApi, getTeamStats, getEventTeamStats, getAdminInfo } from "../../../../lib/dashboardApi";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../../../components/ui/dialog";
import { Search, Filter, Users, UserCheck, UserX, Calendar, Eye, Trash2, BarChart3, X } from "lucide-react";

interface Team {
  _id: string;
  name: string;
  isActive: boolean;
  eventId: {
    _id: string;
    name: string;
    type: string;
    isTeamEvent: boolean;
    whatsappGrpLink?: string;
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
  gfgLink?: string;
  isCodeWarsTeam?: boolean;
}

interface TeamStats {
  total: number;
  active: number;
  inactive: number;
}

interface EventTeamStats {
  eventId: string;
  eventName: string;
  eventType: string;
  totalTeams: number;
  activeTeams: number;
  inactiveTeams: number;
}

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [filteredTeams, setFilteredTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState<TeamStats>({ total: 0, active: 0, inactive: 0 });
  const [eventStats, setEventStats] = useState<EventTeamStats[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<string>("");
  const [showEventStats, setShowEventStats] = useState(false);
  const [userRole, setUserRole] = useState<string>("");
  
  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [typeFilter, setTypeFilter] = useState<"all" | "technical" | "managerial" | "esports" | "workshop">("all");
  const [eventFilter, setEventFilter] = useState("");
  
  // Dialog states
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [showTeamDetails, setShowTeamDetails] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{
    show: boolean;
    team: Team | null;
    action: "delete";
  }>({ show: false, team: null, action: "delete" });

  const limit = 20;
  const hasActiveFilters = searchTerm || statusFilter !== "all" || typeFilter !== "all" || eventFilter;
  const isSuperAdmin = userRole === "superAdmin" || userRole === "dev";

  // Fetch admin info to get user role
  const fetchAdminInfo = async () => {
    try {
      const adminInfo = await getAdminInfo();
      setUserRole(adminInfo?.role || "");
    } catch (err) {
      console.error("Failed to fetch admin info:", err);
    }
  };

  // Fetch team statistics
  const fetchStats = async () => {
    try {
      const data = await getTeamStats();
      setStats(data);
    } catch (err) {
      console.error("Failed to fetch team stats:", err);
    }
  };

  // Fetch event statistics
  const fetchEventStats = async () => {
    try {
      const data = await getEventTeamStats();
      setEventStats(data);
    } catch (err) {
      console.error("Failed to fetch event team stats:", err);
    }
  };

  // Fetch teams
  const fetchTeams = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      if (hasActiveFilters) {
        // Fetch all teams for filtering
        const response = await teamsApi.listAdmin({
          page: 1,
          limit: 1000,
          filter: {},
          sortBy: { createdAt: -1 },
        });
        
        let allTeams = response.data?.data?.teams || [];
        
        // Apply filters
        if (searchTerm) {
          allTeams = allTeams.filter((team: Team) =>
            team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            team.leader?.name.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        
        if (statusFilter !== "all") {
          allTeams = allTeams.filter((team: Team) =>
            team.isActive === (statusFilter === "active")
          );
        }
        
        if (typeFilter !== "all") {
          allTeams = allTeams.filter((team: Team) =>
            team.eventId?.type === typeFilter
          );
        }
        
        if (eventFilter) {
          allTeams = allTeams.filter((team: Team) =>
            team.eventId?.name.toLowerCase().includes(eventFilter.toLowerCase())
          );
        }
        
        setTeams(allTeams);
        setFilteredTeams(allTeams);
        setTotalPages(1);
      } else {
        // Paginated fetch
        const response = await teamsApi.listAdmin({
          page,
          limit,
          filter: {},
          sortBy: { createdAt: -1 },
        });
        
        const fetchedTeams = response.data?.data?.teams || [];
        setTeams(fetchedTeams);
        setFilteredTeams(fetchedTeams);
        setTotalPages(response.data?.totalPages || 1);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load teams");
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm, statusFilter, typeFilter, eventFilter, hasActiveFilters]);

  useEffect(() => {
    fetchTeams();
    fetchStats();
    fetchEventStats();
    fetchAdminInfo();
  }, [fetchTeams]);

  // Handle permanent team deletion (SuperAdmin only)
  const handleDeleteTeam = async (team: Team) => {
    try {
      const isCodeWars = (team as any).isCodeWarsTeam || false;
      await teamsApi.adminDelete(team._id, isCodeWars);
      await fetchTeams();
      await fetchStats();
      setConfirmAction({ show: false, team: null, action: "delete" });
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete team");
    }
  };

  // Clear filters
  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setTypeFilter("all");
    setEventFilter("");
    setPage(1);
  };

  if (loading && teams.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading teams data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="border-b border-white/5 bg-[#0a0a0a]/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">Team Management</h1>
              <p className="text-sm text-gray-400">Manage and monitor all team registrations across events</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-8 py-8">

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400 mb-1">Total Teams</p>
              <p className="text-3xl font-bold text-white">{stats.total}</p>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-xl">
              <Users className="h-6 w-6 text-blue-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400 mb-1">Active Teams</p>
              <p className="text-3xl font-bold text-green-400">{stats.active}</p>
              <p className="text-xs text-gray-500 mt-1">Can participate in events</p>
            </div>
            <div className="p-3 bg-green-500/10 rounded-xl">
              <UserCheck className="h-6 w-6 text-green-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400 mb-1">Inactive Teams</p>
              <p className="text-3xl font-bold text-red-400">{stats.inactive}</p>
              <p className="text-xs text-gray-500 mt-1">Cannot participate</p>
            </div>
            <div className="p-3 bg-red-500/10 rounded-xl">
              <UserX className="h-6 w-6 text-red-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400 mb-1">
                {hasActiveFilters ? "Filtered Results" : "Displayed"}
              </p>
              <p className="text-3xl font-bold text-purple-400">{filteredTeams.length}</p>
              <p className="text-xs text-gray-500 mt-1">
                {hasActiveFilters ? "Total matching filters" : "Current page"}
              </p>
            </div>
            <div className="p-3 bg-purple-500/10 rounded-xl">
              <Filter className="h-6 w-6 text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 shadow-xl mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Filter className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Filters</h2>
              {hasActiveFilters && (
                <p className="text-sm text-gray-400">
                  {Object.values({ searchTerm, statusFilter: statusFilter !== "all" ? statusFilter : "", typeFilter: typeFilter !== "all" ? typeFilter : "", eventFilter }).filter(Boolean).length} active filters
                </p>
              )}
            </div>
          </div>
          <button
            onClick={clearFilters}
            className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg transition-all duration-200"
          >
            Clear All
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label htmlFor="search" className="text-sm font-medium text-gray-300">Search Teams</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                id="search"
                type="text"
                placeholder="Team or leader name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 bg-black/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-blue-400 focus:outline-none transition-colors"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="status" className="text-sm font-medium text-gray-300">Status</label>
            <select
              id="status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as "all" | "active" | "inactive")}
              className="w-full px-3 py-2.5 bg-black/50 border border-white/10 rounded-lg text-white focus:border-blue-400 focus:outline-none transition-colors"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="type" className="text-sm font-medium text-gray-300">Event Type</label>
            <select
              id="type"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as "all" | "technical" | "managerial" | "esports" | "workshop")}
              className="w-full px-3 py-2.5 bg-black/50 border border-white/10 rounded-lg text-white focus:border-blue-400 focus:outline-none transition-colors"
            >
              <option value="all">All Types</option>
              <option value="technical">Technical</option>
              <option value="managerial">Managerial</option>
              <option value="esports">Esports</option>
              <option value="workshop">Workshop</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="event" className="text-sm font-medium text-gray-300">Select Event</label>
            <select
              id="event"
              value={selectedEvent}
              onChange={(e) => {
                setSelectedEvent(e.target.value);
                setEventFilter(e.target.value ? eventStats.find(ev => ev.eventId === e.target.value)?.eventName || "" : "");
                setPage(1);
              }}
              className="w-full px-3 py-2.5 bg-black/50 border border-white/10 rounded-lg text-white focus:border-blue-400 focus:outline-none transition-colors"
            >
              <option value="">All Events</option>
              {eventStats.map((event) => (
                <option key={event.eventId} value={event.eventId}>
                  {event.eventName} ({event.totalTeams} teams)
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Professional Action Bar */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowEventStats(!showEventStats)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              showEventStats
                ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-white"
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            {showEventStats ? "Hide" : "Show"} Event Analytics
          </button>
          {hasActiveFilters && (
            <div className="px-3 py-1.5 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg text-sm font-medium">
              {Object.values({ 
                search: searchTerm, 
                status: statusFilter !== "all" ? statusFilter : "", 
                type: typeFilter !== "all" ? typeFilter : "", 
                event: eventFilter 
              }).filter(Boolean).length} filters active
            </div>
          )}
        </div>
        
        {selectedEvent && (
          <button
            onClick={() => {
              setSelectedEvent("");
              setEventFilter("");
              setShowEventStats(false);
            }}
            className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white text-sm transition-colors"
          >
            <X className="h-4 w-4" />
            Clear Event Filter
          </button>
        )}
      </div>

      {/* Event Statistics - Only show when toggled */}
      {showEventStats && eventStats.length > 0 && (
        <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 shadow-xl mb-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-400" />
              Event Analytics
            </h2>
            <p className="text-sm text-gray-400">
              {selectedEvent
                ? `Detailed view for ${eventStats.find(e => e.eventId === selectedEvent)?.eventName}`
                : "Click on any event to filter teams and view details"}
            </p>
          </div>
          
          <div>
            {selectedEvent ? (
              // Show details for selected event
              (() => {
                const event = eventStats.find(e => e.eventId === selectedEvent);
                return event ? (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-white">{event.eventName}</h3>
                      <div className={`px-3 py-1 rounded-lg text-xs font-medium border ${
                        event.eventType === "technical"
                          ? "bg-blue-500/10 border-blue-500/30 text-blue-400"
                          : event.eventType === "managerial"
                          ? "bg-purple-500/10 border-purple-500/30 text-purple-400"
                          : "bg-orange-500/10 border-orange-500/30 text-orange-400"
                      }`}>
                        {event.eventType}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center p-6 bg-blue-500/5 rounded-xl border border-blue-500/20">
                        <p className="text-3xl font-bold text-blue-400 mb-1">{event.totalTeams}</p>
                        <p className="text-sm text-gray-400">Total Teams</p>
                      </div>
                      <div className="text-center p-6 bg-green-500/5 rounded-xl border border-green-500/20">
                        <p className="text-3xl font-bold text-green-400 mb-1">{event.activeTeams}</p>
                        <p className="text-sm text-gray-400">Active Teams</p>
                      </div>
                      <div className="text-center p-6 bg-gray-500/5 rounded-xl border border-gray-500/20">
                        <p className="text-3xl font-bold text-gray-400 mb-1">{event.inactiveTeams}</p>
                        <p className="text-sm text-gray-400">Inactive Teams</p>
                      </div>
                    </div>
                  </div>
                ) : null;
              })()
            ) : (
              // Show overview of all events
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {eventStats.map((event) => (
                  <div
                    key={event.eventId}
                    className="p-4 bg-black/40 rounded-xl border border-white/5 hover:border-white/20 cursor-pointer transition-all duration-200 hover:bg-black/60 group"
                    onClick={() => {
                      setSelectedEvent(event.eventId);
                      setEventFilter(event.eventName);
                    }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-white truncate group-hover:text-blue-400 transition-colors">{event.eventName}</h4>
                      <div className={`px-2 py-1 rounded text-xs font-medium border ${
                        event.eventType === "technical"
                          ? "bg-blue-500/10 border-blue-500/30 text-blue-400"
                          : event.eventType === "managerial"
                          ? "bg-purple-500/10 border-purple-500/30 text-purple-400"
                          : "bg-orange-500/10 border-orange-500/30 text-orange-400"
                      }`}>
                        {event.eventType}
                      </div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <div>
                        <span className="text-blue-400 font-semibold">{event.totalTeams}</span>
                        <span className="text-gray-400 ml-1">teams</span>
                      </div>
                      <div>
                        <span className="text-green-400 font-semibold">{event.activeTeams}</span>
                        <span className="text-gray-400 mx-1">/</span>
                        <span className="text-gray-500">{event.inactiveTeams}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Teams Grid */}
      {error ? (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 text-center">
          <p className="text-red-400 text-lg">{error}</p>
        </div>
      ) : filteredTeams.length === 0 ? (
        <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-12 text-center shadow-xl">
          <div className="p-4 bg-gray-500/10 rounded-xl inline-block mb-4">
            <Users className="h-12 w-12 text-gray-500" />
          </div>
          <p className="text-gray-400 text-lg mb-4">No teams found</p>
          <p className="text-gray-500 text-sm mb-6">
            {hasActiveFilters 
              ? "Try adjusting your filters to see more results"
              : "Teams will appear here once they register for events"
            }
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg hover:bg-blue-500/30 transition-all duration-200"
            >
              Clear filters to see all teams
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTeams.map((team) => (
            <div key={team._id} className="bg-[#0a0a0a] border border-white/5 rounded-2xl shadow-xl hover:border-white/20 transition-all duration-200 overflow-hidden">
              {/* Card Header */}
              <div className="p-6 pb-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold text-white truncate">{team.name}</h3>
                      {(team as any).isCodeWarsTeam && (
                        <span className="px-2 py-0.5 bg-orange-500/20 border border-orange-500/40 text-orange-400 text-[10px] font-bold rounded tracking-wider shrink-0">
                          CODEWARS
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-400 truncate">{team.eventId?.name || "No Event"}</p>
                  </div>
                  <div className={`px-2.5 py-1 rounded-lg text-xs font-medium border shrink-0 ml-3 ${
                    team.isActive 
                      ? "bg-green-500/20 border-green-500/30 text-green-400" 
                      : "bg-gray-500/20 border-gray-500/30 text-gray-400"
                  }`}>
                    {team.isActive ? "Active" : "Inactive"}
                  </div>
                </div>
                
                <div className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-medium border ${
                  team.eventId?.type === "technical"
                    ? "bg-blue-500/10 border-blue-500/30 text-blue-400"
                    : team.eventId?.type === "managerial"
                    ? "bg-purple-500/10 border-purple-500/30 text-purple-400"
                    : "bg-orange-500/10 border-orange-500/30 text-orange-400"
                }`}>
                  {team.eventId?.type || "N/A"}
                </div>
              </div>
              
              {/* Card Content */}
              <div className="px-6 pb-6 space-y-4">
                {/* Team Leader */}
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center border border-blue-500/30">
                    <span className="text-blue-400 font-semibold">
                      {team.leader?.name?.charAt(0)?.toUpperCase() || "?"}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white truncate">{team.leader?.name || "Unknown"}</p>
                    <p className="text-sm text-gray-400 truncate">{team.leader?.email || "No email"}</p>
                  </div>
                </div>
                
                {/* Team Info */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Users className="h-4 w-4" />
                    <span>{team.members?.length || 0} members</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(team.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                
                {/* Divider */}
                <div className="border-t border-white/10"></div>
                
                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedTeam(team);
                      setShowTeamDetails(true);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg text-sm font-medium text-gray-300 hover:text-white transition-all duration-200"
                  >
                    <Eye className="h-4 w-4" />
                    View Details
                  </button>
                  
                  {isSuperAdmin && (
                    <button
                      onClick={() => {
                        setConfirmAction({
                          show: true,
                          team,
                          action: "delete"
                        });
                      }}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600/20 border-red-600/30 text-red-500 hover:bg-red-600/30 rounded-lg text-sm font-medium transition-all duration-200"
                      title="Permanently delete team (SuperAdmin only)"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!hasActiveFilters && totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-8">
          <button
            onClick={() => setPage(1)}
            disabled={page === 1}
            className="px-4 py-2 text-sm font-medium bg-white/5 hover:bg-white/10 disabled:bg-white/5 border border-white/10 hover:border-white/20 disabled:border-white/5 text-white hover:text-white disabled:text-gray-500 rounded-lg transition-all duration-200"
          >
            First
          </button>
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-4 py-2 text-sm font-medium bg-white/5 hover:bg-white/10 disabled:bg-white/5 border border-white/10 hover:border-white/20 disabled:border-white/5 text-white hover:text-white disabled:text-gray-500 rounded-lg transition-all duration-200"
          >
            Previous
          </button>
          
          <div className="flex items-center gap-2">
            {(() => {
              const pages = [];
              const maxVisible = 5;
              
              if (totalPages <= maxVisible) {
                // Show all pages if total is small
                for (let i = 1; i <= totalPages; i++) {
                  pages.push(i);
                }
              } else {
                // Smart pagination logic
                if (page <= 3) {
                  // Show 1, 2, 3, 4, 5
                  for (let i = 1; i <= 5; i++) {
                    pages.push(i);
                  }
                } else if (page >= totalPages - 2) {
                  // Show last 5 pages
                  for (let i = totalPages - 4; i <= totalPages; i++) {
                    pages.push(i);
                  }
                } else {
                  // Show pages around current page
                  for (let i = page - 2; i <= page + 2; i++) {
                    pages.push(i);
                  }
                }
              }
              
              return pages.map((pageNum) => (
                <button
                  key={`page-${pageNum}`}
                  onClick={() => setPage(pageNum)}
                  className={`w-10 h-10 text-sm font-medium rounded-lg border transition-all duration-200 ${
                    page === pageNum
                      ? "bg-blue-500/20 border-blue-500/30 text-blue-400"
                      : "bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/20 text-gray-300 hover:text-white"
                  }`}
                >
                  {pageNum}
                </button>
              ));
            })()}
          </div>
          
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 text-sm font-medium bg-white/5 hover:bg-white/10 disabled:bg-white/5 border border-white/10 hover:border-white/20 disabled:border-white/5 text-white hover:text-white disabled:text-gray-500 rounded-lg transition-all duration-200"
          >
            Next
          </button>
          <button
            onClick={() => setPage(totalPages)}
            disabled={page === totalPages}
            className="px-4 py-2 text-sm font-medium bg-white/5 hover:bg-white/10 disabled:bg-white/5 border border-white/10 hover:border-white/20 disabled:border-white/5 text-white hover:text-white disabled:text-gray-500 rounded-lg transition-all duration-200"
          >
            Last
          </button>
        </div>
      )}

      {/* Filter Info */}
      {hasActiveFilters && (
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6 text-center mt-8">
          <p className="text-blue-400 mb-3">
            📊 Showing {filteredTeams.length} teams matching your filters. 
            Pagination is disabled when filters are active.
          </p>
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg hover:bg-blue-500/30 transition-all duration-200"
          >
            Clear filters to return to paginated view
          </button>
        </div>
      )}
      
      </div>

      {/* Team Details Dialog */}
      <Dialog open={showTeamDetails} onOpenChange={setShowTeamDetails}>
        <DialogContent className="bg-[#0a0a0a] border border-white/5 shadow-2xl w-[75vw] max-w-6xl max-h-[80vh] overflow-y-auto" data-lenis-prevent>
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-white">{selectedTeam?.name}</DialogTitle>
            <DialogDescription className="text-sm text-gray-400">
              Team information
            </DialogDescription>
          </DialogHeader>
          
          {selectedTeam && (
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Status</label>
                  <div className={`mt-1 inline-flex px-2 py-1 rounded text-xs font-medium border ${
                    selectedTeam.isActive 
                      ? "bg-green-500/20 border-green-500/30 text-green-400" 
                      : "bg-gray-500/20 border-gray-500/30 text-gray-400"
                  }`}>
                    {selectedTeam.isActive ? "Active" : "Inactive"}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Event</label>
                  <p className="mt-1 text-sm font-medium text-white truncate">{selectedTeam.eventId?.name || "No Event"}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Type</label>
                  <div className={`mt-1 inline-flex px-2 py-1 rounded text-xs font-medium border ${
                    selectedTeam.eventId?.type === "technical"
                      ? "bg-blue-500/10 border-blue-500/30 text-blue-400"
                      : selectedTeam.eventId?.type === "managerial"
                      ? "bg-purple-500/10 border-purple-500/30 text-purple-400"
                      : "bg-orange-500/10 border-orange-500/30 text-orange-400"
                  }`}>
                    {selectedTeam.eventId?.type || "N/A"}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Created</label>
                  <p className="mt-1 text-sm text-white">{new Date(selectedTeam.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              
              {/* CodeWars GFG Link - Only for CodeWars teams */}
              {(selectedTeam as any).isCodeWarsTeam && (selectedTeam as any).gfgLink && (
                <div className="border-t border-white/10 pt-4">
                  <label className="text-sm font-semibold text-white mb-2 block flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-orange-500/20 border border-orange-500/40 text-orange-400 text-[10px] font-bold rounded tracking-wider">
                      CODEWARS
                    </span>
                    GFG Contest Link
                  </label>
                  <div className="p-3 bg-orange-500/5 rounded-lg border border-orange-500/20">
                    <a 
                      href={(selectedTeam as any).gfgLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-orange-400 hover:text-orange-300 text-sm break-all underline"
                    >
                      {(selectedTeam as any).gfgLink}
                    </a>
                  </div>
                </div>
              )}
              
              {/* WhatsApp Group Link */}
              {selectedTeam.eventId?.whatsappGrpLink && (
                <div className="border-t border-white/10 pt-4">
                  <label className="text-sm font-semibold text-white mb-2 block">WhatsApp Group</label>
                  <div className="p-3 bg-green-500/5 rounded-lg border border-green-500/20">
                    <a 
                      href={selectedTeam.eventId.whatsappGrpLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-green-400 hover:text-green-300 text-sm break-all underline"
                    >
                      {selectedTeam.eventId.whatsappGrpLink}
                    </a>
                  </div>
                </div>
              )}
              
              <div className="border-t border-white/10 pt-4">
                <label className="text-sm font-semibold text-white mb-2 block">Team Leader</label>
                <div className="flex items-center space-x-3 p-3 bg-black/40 rounded-lg border border-white/10">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center border border-blue-500/30 shrink-0">
                    <span className="text-blue-400 font-semibold text-sm">
                      {selectedTeam.leader?.name?.charAt(0)?.toUpperCase() || "?"}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0 grid grid-cols-3 gap-4">
                    <div>
                      <p className="font-medium text-white text-sm">{selectedTeam.leader?.name || "Unknown"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">{selectedTeam.leader?.email || "No email"}</p>
                    </div>
                    <div>
                      {selectedTeam.leader?.phoneNumber && (
                        <p className="text-xs text-gray-500">{selectedTeam.leader.phoneNumber}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {selectedTeam.members && selectedTeam.members.length > 0 && (
                <div>
                  <label className="text-sm font-semibold text-white mb-2 block">Members ({selectedTeam.members.length})</label>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {selectedTeam.members.map((member, index) => (
                      <div key={index} className="flex items-center space-x-3 p-2 bg-black/40 rounded-lg border border-white/10">
                        <div className="w-7 h-7 bg-green-500/20 rounded-lg flex items-center justify-center border border-green-500/30 shrink-0">
                          <span className="text-green-400 font-semibold text-xs">
                            {member.user?.name?.charAt(0)?.toUpperCase() || "?"}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0 grid grid-cols-3 gap-4">
                          <div>
                            <p className="font-medium text-white text-xs">{member.user?.name || "Unknown"}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">{member.user?.email || "No email"}</p>
                          </div>
                          <div className="flex justify-end">
                            <div className={`px-1.5 py-0.5 rounded text-xs font-medium border ${
                              member.status === "accepted" ? "bg-green-500/20 border-green-500/30 text-green-400" : 
                              member.status === "pending" ? "bg-yellow-500/20 border-yellow-500/30 text-yellow-400" :
                              "bg-red-500/20 border-red-500/30 text-red-400"
                            }`}>
                              {member.status}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={confirmAction.show} onOpenChange={(open) => 
        setConfirmAction({ ...confirmAction, show: open })
      }>
        <DialogContent className="bg-[#0a0a0a] border border-white/5 shadow-2xl max-w-sm" data-lenis-prevent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-white text-lg">
              <Trash2 className="h-5 w-5 text-red-500" />
              Permanently Delete Team
            </DialogTitle>
            <DialogDescription className="text-gray-400 text-sm">
              ⚠️ Warning: This will PERMANENTLY delete the team from the database. This action cannot be undone!
            </DialogDescription>
          </DialogHeader>
          
          {confirmAction.team && (
            <div className="space-y-3">
              <div className="p-3 bg-black/40 rounded-lg border border-white/10">
                <p className="font-medium text-white text-sm">{confirmAction.team.name}</p>
                <p className="text-xs text-gray-400">{confirmAction.team.eventId?.name}</p>
                {(confirmAction.team as any).isCodeWarsTeam && (
                  <span className="inline-block mt-1 px-2 py-0.5 bg-orange-500/20 border border-orange-500/40 text-orange-400 text-[10px] font-bold rounded tracking-wider">
                    CODEWARS
                  </span>
                )}
              </div>
              
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setConfirmAction({ show: false, team: null, action: "delete" })}
                  className="px-3 py-2 text-xs font-medium text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteTeam(confirmAction.team!)}
                  className="px-3 py-2 text-xs font-medium rounded-lg border transition-all duration-200 bg-red-600/20 border-red-600/30 text-red-500 hover:bg-red-600/30"
                >
                  Permanently Delete
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}