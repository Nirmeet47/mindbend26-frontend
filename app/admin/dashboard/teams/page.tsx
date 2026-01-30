"use client";
import React, { useEffect, useState, useCallback } from "react";
import { teamsApi, getTeamStats, getEventTeamStats } from "../../../../lib/dashboardApi";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { Badge } from "../../../../components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../../../../components/ui/dialog";
import { Avatar, AvatarFallback } from "../../../../components/ui/avatar";
import { Separator } from "../../../../components/ui/separator";
import { Search, Filter, Users, UserCheck, UserX, Calendar, Mail, Phone, Eye, Settings, Trash2, AlertTriangle, CheckCircle, BarChart3 } from "lucide-react";

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
  
  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [typeFilter, setTypeFilter] = useState<"all" | "technical" | "managerial" | "workshop">("all");
  const [eventFilter, setEventFilter] = useState("");
  
  // Dialog states
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [showTeamDetails, setShowTeamDetails] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{
    show: boolean;
    team: Team | null;
    action: "activate" | "deactivate";
  }>({ show: false, team: null, action: "activate" });

  const limit = 20;
  const hasActiveFilters = searchTerm || statusFilter !== "all" || typeFilter !== "all" || eventFilter;

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
  }, [fetchTeams]);

  // Handle team status toggle
  const handleStatusToggle = async (team: Team, newStatus: boolean) => {
    try {
      await teamsApi.updateStatus(team._id, newStatus);
      await fetchTeams();
      await fetchStats();
      setConfirmAction({ show: false, team: null, action: "activate" });
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to update team status");
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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">Teams Management</h1>
        <p className="text-gray-400">Manage and monitor all team registrations across events</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-blue-400" />
              <div>
                <p className="text-sm font-medium text-gray-400">Total Teams</p>
                <p className="text-3xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <UserCheck className="h-8 w-8 text-green-400" />
              <div>
                <p className="text-sm font-medium text-gray-400">Active Teams</p>
                <p className="text-3xl font-bold text-green-400">{stats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <UserX className="h-8 w-8 text-red-400" />
              <div>
                <p className="text-sm font-medium text-gray-400">Inactive Teams</p>
                <p className="text-3xl font-bold text-red-400">{stats.inactive}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Filter className="h-8 w-8 text-purple-400" />
              <div>
                <p className="text-sm font-medium text-gray-400">
                  {hasActiveFilters ? "Filtered" : "Displayed"}
                </p>
                <p className="text-3xl font-bold text-purple-400">{filteredTeams.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
              {hasActiveFilters && (
                <Badge variant="outline" className="border-blue-500 text-blue-400">
                  {Object.values({ searchTerm, statusFilter: statusFilter !== "all" ? statusFilter : "", typeFilter: typeFilter !== "all" ? typeFilter : "", eventFilter }).filter(Boolean).length} active
                </Badge>
              )}
            </span>
            <Button variant="outline" size="sm" onClick={clearFilters}>
              Clear All
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search Teams</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Team or leader name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-black border-gray-700"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as "all" | "active" | "inactive")}
                className="w-full px-3 py-2 bg-black border border-gray-700 rounded-md text-white"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Event Type</Label>
              <select
                id="type"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as "all" | "technical" | "managerial" | "workshop")}
                className="w-full px-3 py-2 bg-black border border-gray-700 rounded-md text-white"
              >
                <option value="all">All Types</option>
                <option value="technical">Technical</option>
                <option value="managerial">Managerial</option>
                <option value="workshop">Workshop</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="event">Select Event</Label>
              <select
                id="event"
                value={selectedEvent}
                onChange={(e) => {
                  setSelectedEvent(e.target.value);
                  setEventFilter(e.target.value ? eventStats.find(ev => ev.eventId === e.target.value)?.eventName || "" : "");
                  setPage(1);
                }}
                className="w-full px-3 py-2 bg-black border border-gray-700 rounded-md text-white"
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
        </CardContent>
      </Card>

      {/* Professional Action Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant={showEventStats ? "default" : "outline"}
            onClick={() => setShowEventStats(!showEventStats)}
            className="flex items-center gap-2"
          >
            <BarChart3 className="h-4 w-4" />
            {showEventStats ? "Hide" : "Show"} Event Analytics
          </Button>
          {hasActiveFilters && (
            <Badge variant="secondary" className="bg-blue-600">
              {Object.values({ 
                search: searchTerm, 
                status: statusFilter !== "all" ? statusFilter : "", 
                type: typeFilter !== "all" ? typeFilter : "", 
                event: eventFilter 
              }).filter(Boolean).length} filters active
            </Badge>
          )}
        </div>
        
        {selectedEvent && (
          <Button
            variant="ghost"
            onClick={() => {
              setSelectedEvent("");
              setEventFilter("");
              setShowEventStats(false);
            }}
            className="text-gray-400 hover:text-white"
          >
            Clear Event Filter
          </Button>
        )}
      </div>

      {/* Event Statistics - Only show when toggled */}
      {showEventStats && eventStats.length > 0 && (
        <Card className="bg-gray-900 border-gray-800 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Event Analytics
            </CardTitle>
            <CardDescription>
              {selectedEvent
                ? `Detailed view for ${eventStats.find(e => e.eventId === selectedEvent)?.eventName}`
                : "Click on any event to filter teams and view details"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedEvent ? (
              // Show details for selected event
              (() => {
                const event = eventStats.find(e => e.eventId === selectedEvent);
                return event ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold">{event.eventName}</h3>
                      <Badge
                        variant="outline"
                        className={`${
                          event.eventType === "technical"
                            ? "border-blue-500 text-blue-400"
                            : event.eventType === "managerial"
                            ? "border-purple-500 text-purple-400"
                            : "border-orange-500 text-orange-400"
                        }`}
                      >
                        {event.eventType}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-blue-900/20 rounded-lg border border-blue-800">
                        <p className="text-2xl font-bold text-blue-400">{event.totalTeams}</p>
                        <p className="text-sm text-gray-400">Total Teams</p>
                      </div>
                      <div className="text-center p-4 bg-green-900/20 rounded-lg border border-green-800">
                        <p className="text-2xl font-bold text-green-400">{event.activeTeams}</p>
                        <p className="text-sm text-gray-400">Active Teams</p>
                      </div>
                      <div className="text-center p-4 bg-gray-700/20 rounded-lg border border-gray-600">
                        <p className="text-2xl font-bold text-gray-400">{event.inactiveTeams}</p>
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
                    className="p-4 bg-black/30 rounded-lg border border-gray-700 hover:border-gray-600 cursor-pointer transition-all hover:bg-black/50"
                    onClick={() => {
                      setSelectedEvent(event.eventId);
                      setEventFilter(event.eventName);
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold truncate">{event.eventName}</h4>
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          event.eventType === "technical"
                            ? "border-blue-500 text-blue-400"
                            : event.eventType === "managerial"
                            ? "border-purple-500 text-purple-400"
                            : "border-orange-500 text-orange-400"
                        }`}
                      >
                        {event.eventType}
                      </Badge>
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
          </CardContent>
        </Card>
      )}

      {/* Teams Grid */}
      {error ? (
        <Card className="bg-red-900/20 border-red-800">
          <CardContent className="p-6 text-center">
            <p className="text-red-400">{error}</p>
          </CardContent>
        </Card>
      ) : filteredTeams.length === 0 ? (
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-12 text-center">
            <Users className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No teams found</p>
            {hasActiveFilters && (
              <Button variant="outline" className="mt-4" onClick={clearFilters}>
                Clear filters to see all teams
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTeams.map((team) => (
            <Card key={team._id} className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg truncate">{team.name}</CardTitle>
                    <CardDescription className="truncate">
                      {team.eventId?.name || "No Event"}
                    </CardDescription>
                  </div>
                  <Badge
                    variant={team.isActive ? "default" : "secondary"}
                    className={team.isActive ? "bg-green-600" : "bg-gray-600"}
                  >
                    {team.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={`${
                      team.eventId?.type === "technical"
                        ? "border-blue-500 text-blue-400"
                        : team.eventId?.type === "managerial"
                        ? "border-purple-500 text-purple-400"
                        : "border-orange-500 text-orange-400"
                    }`}
                  >
                    {team.eventId?.type || "N/A"}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarFallback className="bg-blue-600">
                      {team.leader?.name?.charAt(0)?.toUpperCase() || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{team.leader?.name || "Unknown"}</p>
                    <p className="text-sm text-gray-400 truncate">{team.leader?.email || "No email"}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span>{team.members?.length || 0} members</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>{new Date(team.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <Separator className="bg-gray-800" />
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedTeam(team);
                      setShowTeamDetails(true);
                    }}
                    className="flex-1"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                  
                  <Button
                    variant={team.isActive ? "destructive" : "default"}
                    size="sm"
                    onClick={() => {
                      setConfirmAction({
                        show: true,
                        team,
                        action: team.isActive ? "deactivate" : "activate"
                      });
                    }}
                  >
                    {team.isActive ? (
                      <>
                        <UserX className="h-4 w-4 mr-2" />
                        Deactivate
                      </>
                    ) : (
                      <>
                        <UserCheck className="h-4 w-4 mr-2" />
                        Activate
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!hasActiveFilters && totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setPage(1)}
            disabled={page === 1}
            className="px-4 py-2"
          >
            First
          </Button>
          <Button
            variant="outline"
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-4 py-2"
          >
            Previous
          </Button>
          
          <div className="flex items-center gap-1">
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
                <Button
                  key={`page-${pageNum}`}
                  variant={page === pageNum ? "default" : "outline"}
                  onClick={() => setPage(pageNum)}
                  className="w-10 h-10"
                >
                  {pageNum}
                </Button>
              ));
            })()}
          </div>
          
          <Button
            variant="outline"
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="px-4 py-2"
          >
            Next
          </Button>
          <Button
            variant="outline"
            onClick={() => setPage(totalPages)}
            disabled={page === totalPages}
            className="px-4 py-2"
          >
            Last
          </Button>
        </div>
      )}

      {/* Filter Info */}
      {hasActiveFilters && (
        <Card className="bg-blue-900/20 border-blue-800">
          <CardContent className="p-6 text-center">
            <p className="text-blue-400">
              📊 Showing {filteredTeams.length} teams matching your filters. 
              Pagination is disabled when filters are active.
            </p>
            <Button variant="outline" className="mt-3" onClick={clearFilters}>
              Clear filters to return to paginated view
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Team Details Dialog */}
      <Dialog open={showTeamDetails} onOpenChange={setShowTeamDetails}>
        <DialogContent className="bg-gray-900 border-gray-800 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">{selectedTeam?.name}</DialogTitle>
            <DialogDescription>
              Team details and member information
            </DialogDescription>
          </DialogHeader>
          
          {selectedTeam && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Status</Label>
                  <Badge
                    variant={selectedTeam.isActive ? "default" : "secondary"}
                    className={`mt-2 ${selectedTeam.isActive ? "bg-green-600" : "bg-gray-600"}`}
                  >
                    {selectedTeam.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <div>
                  <Label>Event</Label>
                  <p className="mt-2 font-medium">{selectedTeam.eventId?.name || "No Event"}</p>
                </div>
                <div>
                  <Label>Event Type</Label>
                  <Badge
                    variant="outline"
                    className={`mt-2 ${
                      selectedTeam.eventId?.type === "technical"
                        ? "border-blue-500 text-blue-400"
                        : selectedTeam.eventId?.type === "managerial"
                        ? "border-purple-500 text-purple-400"
                        : "border-orange-500 text-orange-400"
                    }`}
                  >
                    {selectedTeam.eventId?.type || "N/A"}
                  </Badge>
                </div>
                <div>
                  <Label>Created</Label>
                  <p className="mt-2">{new Date(selectedTeam.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              
              <Separator className="bg-gray-800" />
              
              <div>
                <Label className="text-lg">Team Leader</Label>
                <div className="mt-3 flex items-center space-x-4 p-4 bg-gray-800 rounded-lg">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-blue-600">
                      {selectedTeam.leader?.name?.charAt(0)?.toUpperCase() || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold">{selectedTeam.leader?.name || "Unknown"}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        {selectedTeam.leader?.email || "No email"}
                      </div>
                      {selectedTeam.leader?.phoneNumber && (
                        <div className="flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          {selectedTeam.leader.phoneNumber}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {selectedTeam.members && selectedTeam.members.length > 0 && (
                <div>
                  <Label className="text-lg">Team Members ({selectedTeam.members.length})</Label>
                  <div className="mt-3 space-y-2">
                    {selectedTeam.members.map((member, index) => (
                      <div key={index} className="flex items-center space-x-4 p-3 bg-gray-800 rounded-lg">
                        <Avatar>
                          <AvatarFallback className="bg-green-600">
                            {member.user?.name?.charAt(0)?.toUpperCase() || "?"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium">{member.user?.name || "Unknown"}</p>
                          <p className="text-sm text-gray-400">{member.user?.email || "No email"}</p>
                        </div>
                        <Badge variant="outline" className={
                          member.status === "accepted" ? "border-green-500 text-green-400" : 
                          member.status === "pending" ? "border-yellow-500 text-yellow-400" :
                          "border-red-500 text-red-400"
                        }>
                          {member.status}
                        </Badge>
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
        <DialogContent className="bg-gray-900 border-gray-800">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {confirmAction.action === "activate" ? (
                <CheckCircle className="h-5 w-5 text-green-400" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-yellow-400" />
              )}
              {confirmAction.action === "activate" ? "Activate Team" : "Deactivate Team"}
            </DialogTitle>
            <DialogDescription>
              {confirmAction.action === "activate"
                ? "This will allow the team to participate in events and show them in active listings."
                : "This will prevent the team from participating in events and hide them from active listings."
              }
            </DialogDescription>
          </DialogHeader>
          
          {confirmAction.team && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-800 rounded-lg">
                <p className="font-medium">{confirmAction.team.name}</p>
                <p className="text-sm text-gray-400">{confirmAction.team.eventId?.name}</p>
              </div>
              
              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setConfirmAction({ show: false, team: null, action: "activate" })}
                >
                  Cancel
                </Button>
                <Button
                  variant={confirmAction.action === "activate" ? "default" : "destructive"}
                  onClick={() => handleStatusToggle(confirmAction.team!, confirmAction.action === "activate")}
                >
                  {confirmAction.action === "activate" ? "Activate" : "Deactivate"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}