"use client";
import React, { useEffect, useState, useCallback } from "react";
import { usersApi } from "../../../../lib/dashboardApi";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../../../components/ui/dialog";
import { Search, Filter, Users, UserCheck, UserX, Calendar, Mail, Phone, Eye, Settings, Trash2, AlertTriangle, CheckCircle, BarChart3, X, UserPlus, Shield, Ban, Building, GraduationCap } from "lucide-react";

interface User {
  _id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  role: string;
  college_name?: string;
  year_of_study?: number;
  dob?: string;
  isVerified: boolean;
  isBan: boolean;
  banReason?: string;
  bannedAt?: string;
  isProfile_completed: boolean;
  createdAt: string;
  bannedBy?: {
    _id: string;
    name: string;
    email: string;
  };
}

interface UserStats {
  total: number;
  verified: number;
  banned: number;
  profileComplete: number;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState<UserStats>({ total: 0, verified: 0, banned: 0, profileComplete: 0 });
  
  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "user" | "technical" | "managerial" | "superAdmin">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "banned">("all");
  const [verificationFilter, setVerificationFilter] = useState<"all" | "verified" | "unverified">("all");
  
  // Dialog states
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showBanModal, setShowBanModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  
  // Form states
  const [banReason, setBanReason] = useState("");
  const [newRole, setNewRole] = useState("");
  const [createForm, setCreateForm] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    role: "user",
    college_name: "",
    year_of_study: "",
    dob: ""
  });

  const limit = 20;
  const hasActiveFilters = searchTerm || roleFilter !== "all" || statusFilter !== "all" || verificationFilter !== "all";

  // Fetch users with smart filtering like teams page
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      if (hasActiveFilters) {
        // Fetch all users for filtering
        const response = await usersApi.list({
          page: 1,
          limit: 1000,
        });
        
        let allUsers = response.data?.data?.users || [];
        
        // Apply filters
        if (searchTerm) {
          allUsers = allUsers.filter((user: User) =>
            user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.phoneNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.college_name?.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        
        if (roleFilter !== "all") {
          allUsers = allUsers.filter((user: User) =>
            user.role === roleFilter
          );
        }
        
        if (statusFilter !== "all") {
          allUsers = allUsers.filter((user: User) =>
            statusFilter === "banned" ? user.isBan : !user.isBan
          );
        }
        
        if (verificationFilter !== "all") {
          allUsers = allUsers.filter((user: User) =>
            verificationFilter === "verified" ? user.isVerified : !user.isVerified
          );
        }
        
        setUsers(allUsers);
        setFilteredUsers(allUsers);
        setTotalPages(1);
        
        // Calculate stats from filtered data
        setStats({
          total: allUsers.length,
          verified: allUsers.filter((u: User) => u.isVerified).length,
          banned: allUsers.filter((u: User) => u.isBan).length,
          profileComplete: allUsers.filter((u: User) => u.isProfile_completed).length
        });
      } else {
        // Paginated fetch
        const response = await usersApi.list({
          page,
          limit,
        });
        
        const fetchedUsers = response.data?.data?.users || [];
        setUsers(fetchedUsers);
        setFilteredUsers(fetchedUsers);
        setTotalPages(response.data?.totalPages || 1);
        
        // For paginated view, get total stats
        const totalResponse = await usersApi.list({
          page: 1,
          limit: 1000,
        });
        const allUsers = totalResponse.data?.data?.users || [];
        setStats({
          total: totalResponse.data?.totalResults || 0,
          verified: allUsers.filter((u: User) => u.isVerified).length,
          banned: allUsers.filter((u: User) => u.isBan).length,
          profileComplete: allUsers.filter((u: User) => u.isProfile_completed).length
        });
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm, roleFilter, statusFilter, verificationFilter, hasActiveFilters]);

  // Clear filters
  const clearFilters = () => {
    setSearchTerm("");
    setRoleFilter("all");
    setStatusFilter("all");
    setVerificationFilter("all");
    setPage(1);
  };

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Handle user actions
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await usersApi.create({
        ...createForm,
        year_of_study: createForm.year_of_study ? parseInt(createForm.year_of_study) : undefined
      });
      setShowCreateModal(false);
      setCreateForm({
        name: "",
        email: "",
        password: "",
        phoneNumber: "",
        role: "user",
        college_name: "",
        year_of_study: "",
        dob: ""
      });
      fetchUsers();
      alert("User created successfully!");
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to create user");
    }
  };

  const handleBanUser = async (action: "ban" | "unban") => {
    if (!selectedUser) return;
    if (action === "ban" && !banReason.trim()) {
      alert("Ban reason is required");
      return;
    }
    
    try {
      await usersApi.ban(selectedUser._id, action, banReason);
      setShowBanModal(false);
      setBanReason("");
      setSelectedUser(null);
      fetchUsers();
      alert(`User ${action === "ban" ? "banned" : "unbanned"} successfully!`);
    } catch (err: any) {
      alert(err?.response?.data?.message || `Failed to ${action} user`);
    }
  };

  const handleChangeRole = async () => {
    if (!selectedUser || !newRole) return;
    
    try {
      await usersApi.changeRole(selectedUser._id, newRole);
      setShowRoleModal(false);
      setNewRole("");
      setSelectedUser(null);
      fetchUsers();
      alert("User role changed successfully!");
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to change user role");
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "dev": return "bg-black/20 border-black/30 text-black";
      case "superAdmin": return "bg-red-500/20 border-red-500/30 text-red-400";
      case "managerial": return "bg-purple-500/20 border-purple-500/30 text-purple-400";
      case "technical": return "bg-green-500/20 border-green-500/30 text-green-400";
      default: return "bg-blue-500/20 border-blue-500/30 text-blue-400";
    }
  };

  if (loading && users.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading users data...</p>
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
              <h1 className="text-2xl font-bold text-white mb-1">User Management</h1>
              <p className="text-sm text-gray-400">Manage and monitor all registered users</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30"
            >
              <UserPlus className="h-4 w-4" />
              Create User
            </button>
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
                <p className="text-sm font-medium text-gray-400 mb-1">Total Users</p>
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
                <p className="text-sm font-medium text-gray-400 mb-1">Verified Users</p>
                <p className="text-3xl font-bold text-green-400">{stats.verified}</p>
                <p className="text-xs text-gray-500 mt-1">Email confirmed</p>
              </div>
              <div className="p-3 bg-green-500/10 rounded-xl">
                <UserCheck className="h-6 w-6 text-green-400" />
              </div>
            </div>
          </div>
          
          <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">Banned Users</p>
                <p className="text-3xl font-bold text-red-400">{stats.banned}</p>
                <p className="text-xs text-gray-500 mt-1">Restricted access</p>
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
                  {hasActiveFilters ? "Filtered Results" : "Complete Profiles"}
                </p>
                <p className="text-3xl font-bold text-purple-400">
                  {hasActiveFilters ? filteredUsers.length : stats.profileComplete}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {hasActiveFilters ? "Total matching filters" : "Profile completed"}
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
                    {Object.values({ searchTerm, roleFilter: roleFilter !== "all" ? roleFilter : "", statusFilter: statusFilter !== "all" ? statusFilter : "", verificationFilter: verificationFilter !== "all" ? verificationFilter : "" }).filter(Boolean).length} active filters
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
              <label htmlFor="search" className="text-sm font-medium text-gray-300">Search Users</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input
                  id="search"
                  type="text"
                  placeholder="Name, email, phone, college..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 bg-black/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-blue-400 focus:outline-none transition-colors"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="role" className="text-sm font-medium text-gray-300">Role</label>
              <select
                id="role"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value as any)}
                className="w-full px-3 py-2.5 bg-black/50 border border-white/10 rounded-lg text-white focus:border-blue-400 focus:outline-none transition-colors"
              >
                <option value="all">All Roles</option>
                <option value="user">User</option>
                <option value="technical">Technical</option>
                <option value="managerial">Managerial</option>
                <option value="superAdmin">Super Admin</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="status" className="text-sm font-medium text-gray-300">Status</label>
              <select
                id="status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="w-full px-3 py-2.5 bg-black/50 border border-white/10 rounded-lg text-white focus:border-blue-400 focus:outline-none transition-colors"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="banned">Banned</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="verification" className="text-sm font-medium text-gray-300">Verification</label>
              <select
                id="verification"
                value={verificationFilter}
                onChange={(e) => setVerificationFilter(e.target.value as any)}
                className="w-full px-3 py-2.5 bg-black/50 border border-white/10 rounded-lg text-white focus:border-blue-400 focus:outline-none transition-colors"
              >
                <option value="all">All Verification</option>
                <option value="verified">Verified</option>
                <option value="unverified">Unverified</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-400 mx-auto mb-4"></div>
              <p className="text-gray-400">Loading users...</p>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">Error Loading Users</h3>
            <p className="text-gray-400 mb-4">{error}</p>
            <button
              onClick={fetchUsers}
              className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg transition-all duration-200"
            >
              Try Again
            </button>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-20">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No Users Found</h3>
            <p className="text-gray-400">No users match your current filters.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUsers.map((user) => (
                <div
                  key={user._id}
                  className="bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden shadow-xl hover:border-white/20 transition-all duration-200 group"
                >
                  {/* Card Header */}
                  <div className="px-6 py-4 border-b border-white/10">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-white text-lg truncate group-hover:text-blue-400 transition-colors">
                        {user.name || 'Unnamed User'}
                      </h3>
                      
                      <div className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-medium border ${getRoleBadgeColor(user.role)}`}>
                        {user.role}
                      </div>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="px-6 pb-6 space-y-4">
                    {/* User Avatar & Status */}
                    <div className="flex items-center space-x-3 pt-4">
                      <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center border border-blue-500/30">
                        <span className="text-blue-400 font-semibold">
                          {user.name?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-400 truncate">{user.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {user.isVerified && (
                            <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-500/10 border border-green-500/20 rounded text-xs text-green-400">
                              <CheckCircle className="w-3 h-3" />
                              Verified
                            </div>
                          )}
                          {user.isBan && (
                            <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-500/10 border border-red-500/20 rounded text-xs text-red-400">
                              <Ban className="w-3 h-3" />
                              Banned
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* User Details */}
                    <div className="space-y-2 text-sm">
                      {user.phoneNumber && (
                        <div className="flex items-center gap-2 text-gray-400">
                          <Phone className="w-4 h-4" />
                          <span>{user.phoneNumber}</span>
                        </div>
                      )}
                      {user.college_name && (
                        <div className="flex items-center gap-2 text-gray-400">
                          <Building className="w-4 h-4" />
                          <span className="truncate">{user.college_name}</span>
                        </div>
                      )}
                      {user.year_of_study && (
                        <div className="flex items-center gap-2 text-gray-400">
                          <GraduationCap className="w-4 h-4" />
                          <span>Year {user.year_of_study}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    {/* Divider */}
                    <div className="border-t border-white/10"></div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowUserDetails(true);
                        }}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg text-sm font-medium text-gray-300 hover:text-white transition-all duration-200"
                      >
                        <Eye className="h-4 w-4" />
                        View Details
                      </button>
                      
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setNewRole(user.role);
                          setShowRoleModal(true);
                        }}
                        className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium border transition-all duration-200 bg-blue-500/20 border-blue-500/30 text-blue-400 hover:bg-blue-500/30"
                      >
                        <Shield className="h-4 w-4" />
                        Role
                      </button>
                      
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowBanModal(true);
                        }}
                        className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium border transition-all duration-200 ${
                          user.isBan 
                            ? 'bg-green-500/20 border-green-500/30 text-green-400 hover:bg-green-500/30' 
                            : 'bg-red-500/20 border-red-500/30 text-red-400 hover:bg-red-500/30'
                        }`}
                      >
                        <Ban className="h-4 w-4" />
                        {user.isBan ? 'Unban' : 'Ban'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination - only show when no active filters */}
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
          </>
        )}
      </div>

      {/* Create User Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="bg-[#0a0a0a] border border-white/5 shadow-2xl max-w-2xl" data-lenis-prevent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-white text-lg">
              <UserPlus className="h-5 w-5 text-blue-400" />
              Create New User
            </DialogTitle>
            <DialogDescription className="text-gray-400 text-sm">
              Create a new user account with the specified details.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateUser} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Name *</label>
                <input
                  type="text"
                  required
                  value={createForm.name}
                  onChange={(e) => setCreateForm({...createForm, name: e.target.value})}
                  className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-blue-400 focus:outline-none transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Email *</label>
                <input
                  type="email"
                  required
                  value={createForm.email}
                  onChange={(e) => setCreateForm({...createForm, email: e.target.value})}
                  className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-blue-400 focus:outline-none transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Password *</label>
                <input
                  type="password"
                  required
                  value={createForm.password}
                  onChange={(e) => setCreateForm({...createForm, password: e.target.value})}
                  className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-blue-400 focus:outline-none transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Phone Number</label>
                <input
                  type="tel"
                  value={createForm.phoneNumber}
                  onChange={(e) => setCreateForm({...createForm, phoneNumber: e.target.value})}
                  className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-blue-400 focus:outline-none transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Role</label>
                <select
                  value={createForm.role}
                  onChange={(e) => setCreateForm({...createForm, role: e.target.value})}
                  className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white focus:border-blue-400 focus:outline-none transition-colors"
                >
                  <option value="user">User</option>
                  <option value="technical">Technical</option>
                  <option value="managerial">Managerial</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">College Name</label>
                <input
                  type="text"
                  value={createForm.college_name}
                  onChange={(e) => setCreateForm({...createForm, college_name: e.target.value})}
                  className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-blue-400 focus:outline-none transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Year of Study</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={createForm.year_of_study}
                  onChange={(e) => setCreateForm({...createForm, year_of_study: e.target.value})}
                  className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-blue-400 focus:outline-none transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Date of Birth</label>
                <input
                  type="date"
                  value={createForm.dob}
                  onChange={(e) => setCreateForm({...createForm, dob: e.target.value})}
                  className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-blue-400 focus:outline-none transition-colors"
                />
              </div>
            </div>
            
            <div className="flex gap-2 justify-end pt-6">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-3 py-2 text-xs font-medium text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-2 text-xs font-medium rounded-lg border transition-all duration-200 bg-blue-500/20 border-blue-500/30 text-blue-400 hover:bg-blue-500/30"
              >
                Create User
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* User Details Modal */}
      <Dialog open={showUserDetails} onOpenChange={setShowUserDetails}>
        <DialogContent className="bg-[#0a0a0a] border border-white/5 shadow-2xl w-[75vw] max-w-4xl max-h-[80vh] overflow-y-auto" data-lenis-prevent>
          {selectedUser && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-white text-lg">
                  <Eye className="h-5 w-5 text-blue-400" />
                  User Details
                </DialogTitle>
                <DialogDescription className="text-gray-400 text-sm">
                  Detailed information about {selectedUser.name}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4 pb-6 border-b border-white/10">
                  <div className="w-16 h-16 bg-blue-500/20 rounded-xl flex items-center justify-center border border-blue-500/30">
                    <span className="text-blue-400 font-semibold text-2xl">
                      {selectedUser.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{selectedUser.name}</h3>
                    <div className={`mt-1 inline-flex px-2.5 py-1 rounded-lg text-sm font-medium border ${getRoleBadgeColor(selectedUser.role)}`}>
                      {selectedUser.role}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Email</label>
                    <p className="mt-1 text-sm font-medium text-white">{selectedUser.email}</p>
                  </div>
                  {selectedUser.phoneNumber && (
                    <div>
                      <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Phone</label>
                      <p className="mt-1 text-sm font-medium text-white">{selectedUser.phoneNumber}</p>
                    </div>
                  )}
                  {selectedUser.college_name && (
                    <div>
                      <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">College</label>
                      <p className="mt-1 text-sm font-medium text-white">{selectedUser.college_name}</p>
                    </div>
                  )}
                  {selectedUser.year_of_study && (
                    <div>
                      <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Year of Study</label>
                      <p className="mt-1 text-sm font-medium text-white">Year {selectedUser.year_of_study}</p>
                    </div>
                  )}
                  <div>
                    <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Status</label>
                    <div className={`mt-1 inline-flex px-2 py-1 rounded text-xs font-medium border ${
                      selectedUser.isBan 
                        ? "bg-red-500/20 border-red-500/30 text-red-400" 
                        : "bg-green-500/20 border-green-500/30 text-green-400"
                    }`}>
                      {selectedUser.isBan ? "Banned" : "Active"}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Verification Status</label>
                    <div className={`mt-1 inline-flex px-2 py-1 rounded text-xs font-medium border ${
                      selectedUser.isVerified 
                        ? "bg-green-500/20 border-green-500/30 text-green-400" 
                        : "bg-yellow-500/20 border-yellow-500/30 text-yellow-400"
                    }`}>
                      {selectedUser.isVerified ? "Verified" : "Unverified"}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Profile Complete</label>
                    <p className="mt-1 text-sm text-white">{selectedUser.isProfile_completed ? "Yes" : "No"}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Joined</label>
                    <p className="mt-1 text-sm text-white">{new Date(selectedUser.createdAt).toLocaleString()}</p>
                  </div>
                  {selectedUser.isBan && selectedUser.banReason && (
                    <div className="md:col-span-2">
                      <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Ban Reason</label>
                      <p className="mt-1 text-sm text-red-400">{selectedUser.banReason}</p>
                    </div>
                  )}
                  {selectedUser.bannedAt && (
                    <div>
                      <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Banned At</label>
                      <p className="mt-1 text-sm text-white">{new Date(selectedUser.bannedAt).toLocaleString()}</p>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2 justify-end pt-6 border-t border-white/10">
                  <button
                    onClick={() => setShowUserDetails(false)}
                    className="px-3 py-2 text-xs font-medium text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg transition-all duration-200"
                  >
                    Close
                  </button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Ban/Unban Modal */}
      <Dialog open={showBanModal} onOpenChange={setShowBanModal}>
        <DialogContent className="bg-[#0a0a0a] border border-white/5 shadow-2xl max-w-sm" data-lenis-prevent>
          {selectedUser && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-white text-lg">
                  {selectedUser.isBan ? (
                    <CheckCircle className="h-5 w-5 text-green-400" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-red-400" />
                  )}
                  {selectedUser.isBan ? 'Unban User' : 'Ban User'}
                </DialogTitle>
                <DialogDescription className="text-gray-400 text-sm">
                  Are you sure you want to {selectedUser.isBan ? 'unban' : 'ban'} {selectedUser.name}?
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-3">
                <div className="p-3 bg-black/40 rounded-lg border border-white/10">
                  <p className="font-medium text-white text-sm">{selectedUser.name}</p>
                  <p className="text-xs text-gray-400">{selectedUser.email}</p>
                </div>
                
                {!selectedUser.isBan && (
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Ban Reason *</label>
                    <textarea
                      value={banReason}
                      onChange={(e) => setBanReason(e.target.value)}
                      placeholder="Provide a reason for banning this user..."
                      className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-blue-400 focus:outline-none transition-colors resize-none"
                      rows={4}
                    />
                  </div>
                )}
                
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => setShowBanModal(false)}
                    className="px-3 py-2 text-xs font-medium text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleBanUser(selectedUser.isBan ? 'unban' : 'ban')}
                    className={`px-3 py-2 text-xs font-medium rounded-lg border transition-all duration-200 ${
                      selectedUser.isBan 
                        ? 'bg-green-500/20 border-green-500/30 text-green-400 hover:bg-green-500/30' 
                        : 'bg-red-500/20 border-red-500/30 text-red-400 hover:bg-red-500/30'
                    }`}
                  >
                    {selectedUser.isBan ? 'Unban' : 'Ban'}
                  </button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Change Role Modal */}
      <Dialog open={showRoleModal} onOpenChange={setShowRoleModal}>
        <DialogContent className="bg-[#0a0a0a] border border-white/5 shadow-2xl max-w-sm" data-lenis-prevent>
          {selectedUser && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-white text-lg">
                  <Shield className="h-5 w-5 text-blue-400" />
                  Change User Role
                </DialogTitle>
                <DialogDescription className="text-gray-400 text-sm">
                  Change role for {selectedUser.name}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-3">
                <div className="p-3 bg-black/40 rounded-lg border border-white/10">
                  <p className="font-medium text-white text-sm">{selectedUser.name}</p>
                  <p className="text-xs text-gray-400">{selectedUser.email}</p>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Select Role</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white focus:border-blue-400 focus:outline-none transition-colors"
                  >
                    <option value="user">User</option>
                    <option value="technical">Technical</option>
                    <option value="managerial">Managerial</option>
                    <option value="superAdmin">Super Admin</option>
                  </select>
                </div>
                
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => setShowRoleModal(false)}
                    className="px-3 py-2 text-xs font-medium text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleChangeRole}
                    className="px-3 py-2 text-xs font-medium rounded-lg border transition-all duration-200 bg-blue-500/20 border-blue-500/30 text-blue-400 hover:bg-blue-500/30"
                  >
                    Change Role
                  </button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
