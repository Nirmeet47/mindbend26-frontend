"use client";
import React, { useEffect, useState } from "react";
import { usersApi } from "../../../../lib/dashboardApi";
import { Search, UserPlus, Shield, Ban, Eye, X, CheckCircle, XCircle, Calendar, Mail, Phone, Building, GraduationCap } from "lucide-react";
import { FaUsers } from "react-icons/fa";

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
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [verifiedFilter, setVerifiedFilter] = useState("");
  
  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showBanModal, setShowBanModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
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

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const filter: any = {};
      
      if (roleFilter) filter.role = roleFilter;
      if (statusFilter === "banned") filter.isBan = true;
      if (statusFilter === "active") filter.isBan = false;
      if (verifiedFilter === "verified") filter.isVerified = true;
      if (verifiedFilter === "unverified") filter.isVerified = false;
      
      const payload = {
        page: currentPage,
        limit: 12,
        filter,
        sortBy: { createdAt: -1 }
      };
      
      const res = await usersApi.list(payload);
      setUsers(res.data?.data?.users || []);
      setTotalPages(res.data?.totalPages || 1);
      setTotalResults(res.data?.totalResults || 0);
      setError("");
    } catch (err) {
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, roleFilter, statusFilter, verifiedFilter]);

  const filteredUsers = users.filter(user => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      user.name?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query) ||
      user.phoneNumber?.toLowerCase().includes(query) ||
      user.college_name?.toLowerCase().includes(query)
    );
  });

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
      case "dev": return "bg-black-100 text-black-800 border-black-300";
      case "superAdmin": return "bg-red-100 text-red-800 border-red-300";
      case "managerial": return "bg-blue-100 text-blue-800 border-blue-300";
      case "technical": return "bg-green-100 text-green-800 border-green-300";
      default: return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const stats = {
    total: totalResults,
    verified: users.filter(u => u.isVerified).length,
    banned: users.filter(u => u.isBan).length,
    profileComplete: users.filter(u => u.isProfile_completed).length
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">User Management</h1>
        <p className="text-slate-400">Manage and monitor all registered users</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-linear-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium mb-1">Total Users</p>
              <p className="text-3xl font-bold text-white">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <FaUsers className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-linear-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium mb-1">Verified</p>
              <p className="text-3xl font-bold text-white">{stats.verified}</p>
            </div>
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-linear-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium mb-1">Banned</p>
              <p className="text-3xl font-bold text-white">{stats.banned}</p>
            </div>
            <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
              <Ban className="w-6 h-6 text-red-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-linear-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium mb-1">Profile Complete</p>
              <p className="text-3xl font-bold text-white">{stats.profileComplete}</p>
            </div>
            <div className="w-12 h-12 bg-black-500/20 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-black-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-linear-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-6 mb-8 shadow-xl">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, email, phone, or college..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-black-500 transition-colors"
              />
            </div>
          </div>

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-black-500 transition-colors"
          >
            <option value="">All Roles</option>
            <option value="user">User</option>
            <option value="technical">Technical</option>
            <option value="managerial">Managerial</option>
            <option value="superAdmin">Super Admin</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-black-500 transition-colors"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="banned">Banned</option>
          </select>

          {/* Verified Filter */}
          <select
            value={verifiedFilter}
            onChange={(e) => setVerifiedFilter(e.target.value)}
            className="px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-black-500 transition-colors"
          >
            <option value="">All Verification</option>
            <option value="verified">Verified</option>
            <option value="unverified">Unverified</option>
          </select>

          {/* Create User Button */}
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-linear-to-r from-black-600 to-gray-600 hover:from-black-700 hover:to-gray-700 text-white rounded-xl font-medium flex items-center gap-2 transition-all shadow-lg shadow-black-500/30"
          >
            <UserPlus className="w-5 h-5" />
            Create User
          </button>
        </div>
      </div>

      {/* Users Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-8 text-center">
          <p className="text-red-400 text-lg">{error}</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-12 text-center">
          <p className="text-slate-400 text-lg">No users found</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
            {filteredUsers.map((user) => (
              <div
                key={user._id}
                className="bg-linear-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-6 hover:border-black-500/50 transition-all shadow-xl"
              >
                {/* User Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-linear-to-br from-black-500 to-gray-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-lg">{user.name}</h3>
                      <span className={`inline-block px-3 py-1 rounded-lg text-xs font-medium border ${getRoleBadgeColor(user.role)}`}>
                        {user.role}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {user.isVerified ? (
                      <div className="w-6 h-6 bg-green-500/20 rounded-lg flex items-center justify-center" title="Verified">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 bg-yellow-500/20 rounded-lg flex items-center justify-center" title="Not Verified">
                        <XCircle className="w-4 h-4 text-yellow-400" />
                      </div>
                    )}
                    {user.isBan && (
                      <div className="w-6 h-6 bg-red-500/20 rounded-lg flex items-center justify-center" title="Banned">
                        <Ban className="w-4 h-4 text-red-400" />
                      </div>
                    )}
                  </div>
                </div>

                {/* User Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{user.email}</span>
                  </div>
                  {user.phoneNumber && (
                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                      <Phone className="w-4 h-4" />
                      <span>{user.phoneNumber}</span>
                    </div>
                  )}
                  {user.college_name && (
                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                      <Building className="w-4 h-4" />
                      <span className="truncate">{user.college_name}</span>
                    </div>
                  )}
                  {user.year_of_study && (
                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                      <GraduationCap className="w-4 h-4" />
                      <span>Year {user.year_of_study}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t border-slate-700">
                  <button
                    onClick={() => {
                      setSelectedUser(user);
                      setShowDetailsModal(true);
                    }}
                    className="flex-1 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                  <button
                    onClick={() => {
                      setSelectedUser(user);
                      setNewRole(user.role);
                      setShowRoleModal(true);
                    }}
                    className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                  >
                    <Shield className="w-4 h-4" />
                    Role
                  </button>
                  <button
                    onClick={() => {
                      setSelectedUser(user);
                      setShowBanModal(true);
                    }}
                    className={`flex-1 px-3 py-2 ${user.isBan ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'} text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors`}
                  >
                    <Ban className="w-4 h-4" />
                    {user.isBan ? 'Unban' : 'Ban'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-slate-800 border border-slate-700 text-white rounded-lg hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <div className="flex gap-2">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let page;
                  if (totalPages <= 5) {
                    page = i + 1;
                  } else if (currentPage <= 3) {
                    page = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    page = totalPages - 4 + i;
                  } else {
                    page = currentPage - 2 + i;
                  }
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                        currentPage === page
                          ? 'bg-linear-to-r from-black-600 to-gray-600 text-white'
                          : 'bg-slate-800 border border-slate-700 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-slate-800 border border-slate-700 text-white rounded-lg hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Create New User</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">Name *</label>
                  <input
                    type="text"
                    required
                    value={createForm.name}
                    onChange={(e) => setCreateForm({...createForm, name: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-black-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">Email *</label>
                  <input
                    type="email"
                    required
                    value={createForm.email}
                    onChange={(e) => setCreateForm({...createForm, email: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-black-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">Password *</label>
                  <input
                    type="password"
                    required
                    value={createForm.password}
                    onChange={(e) => setCreateForm({...createForm, password: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-black-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={createForm.phoneNumber}
                    onChange={(e) => setCreateForm({...createForm, phoneNumber: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-black-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">Role</label>
                  <select
                    value={createForm.role}
                    onChange={(e) => setCreateForm({...createForm, role: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-black-500 transition-colors"
                  >
                    <option value="user">User</option>
                    <option value="technical">Technical</option>
                    <option value="managerial">Managerial</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">College Name</label>
                  <input
                    type="text"
                    value={createForm.college_name}
                    onChange={(e) => setCreateForm({...createForm, college_name: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-black-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">Year of Study</label>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    value={createForm.year_of_study}
                    onChange={(e) => setCreateForm({...createForm, year_of_study: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-black-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">Date of Birth</label>
                  <input
                    type="date"
                    value={createForm.dob}
                    onChange={(e) => setCreateForm({...createForm, dob: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-black-500 transition-colors"
                  />
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-linear-to-r from-black-600 to-gray-600 hover:from-black-700 hover:to-gray-700 text-white rounded-xl font-medium transition-all shadow-lg shadow-black-500/30"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User Details Modal */}
      {showDetailsModal && selectedUser && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">User Details</h2>
              <button onClick={() => setShowDetailsModal(false)} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4 pb-6 border-b border-slate-700">
                <div className="w-16 h-16 bg-linear-to-br from-black-500 to-gray-500 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                  {selectedUser.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-white font-bold text-xl">{selectedUser.name}</h3>
                  <span className={`inline-block px-3 py-1 rounded-lg text-sm font-medium border ${getRoleBadgeColor(selectedUser.role)}`}>
                    {selectedUser.role}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 text-sm mb-1">Email</label>
                  <p className="text-white">{selectedUser.email}</p>
                </div>
                {selectedUser.phoneNumber && (
                  <div>
                    <label className="block text-slate-400 text-sm mb-1">Phone</label>
                    <p className="text-white">{selectedUser.phoneNumber}</p>
                  </div>
                )}
                {selectedUser.college_name && (
                  <div>
                    <label className="block text-slate-400 text-sm mb-1">College</label>
                    <p className="text-white">{selectedUser.college_name}</p>
                  </div>
                )}
                {selectedUser.year_of_study && (
                  <div>
                    <label className="block text-slate-400 text-sm mb-1">Year of Study</label>
                    <p className="text-white">Year {selectedUser.year_of_study}</p>
                  </div>
                )}
                {selectedUser.dob && (
                  <div>
                    <label className="block text-slate-400 text-sm mb-1">Date of Birth</label>
                    <p className="text-white">{new Date(selectedUser.dob).toLocaleDateString()}</p>
                  </div>
                )}
                <div>
                  <label className="block text-slate-400 text-sm mb-1">Verified</label>
                  <p className="text-white">{selectedUser.isVerified ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-1">Profile Complete</label>
                  <p className="text-white">{selectedUser.isProfile_completed ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-1">Account Status</label>
                  <p className={`font-medium ${selectedUser.isBan ? 'text-red-400' : 'text-green-400'}`}>
                    {selectedUser.isBan ? 'Banned' : 'Active'}
                  </p>
                </div>
                {selectedUser.isBan && selectedUser.banReason && (
                  <div className="md:col-span-2">
                    <label className="block text-slate-400 text-sm mb-1">Ban Reason</label>
                    <p className="text-red-400">{selectedUser.banReason}</p>
                  </div>
                )}
                {selectedUser.bannedAt && (
                  <div>
                    <label className="block text-slate-400 text-sm mb-1">Banned At</label>
                    <p className="text-white">{new Date(selectedUser.bannedAt).toLocaleString()}</p>
                  </div>
                )}
                <div>
                  <label className="block text-slate-400 text-sm mb-1">Joined</label>
                  <p className="text-white">{new Date(selectedUser.createdAt).toLocaleString()}</p>
                </div>
              </div>
              
              <div className="flex gap-3 pt-6 border-t border-slate-700">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ban/Unban Modal */}
      {showBanModal && selectedUser && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                {selectedUser.isBan ? 'Unban User' : 'Ban User'}
              </h2>
              <button onClick={() => setShowBanModal(false)} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="mb-6">
              <p className="text-slate-300 mb-4">
                Are you sure you want to {selectedUser.isBan ? 'unban' : 'ban'} <strong>{selectedUser.name}</strong>?
              </p>
              
              {!selectedUser.isBan && (
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">Ban Reason *</label>
                  <textarea
                    value={banReason}
                    onChange={(e) => setBanReason(e.target.value)}
                    placeholder="Enter reason for banning this user..."
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-black-500 transition-colors resize-none"
                    rows={4}
                  />
                </div>
              )}
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowBanModal(false)}
                className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleBanUser(selectedUser.isBan ? 'unban' : 'ban')}
                className={`flex-1 px-6 py-3 ${selectedUser.isBan ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'} text-white rounded-xl font-medium transition-colors`}
              >
                {selectedUser.isBan ? 'Unban' : 'Ban'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Role Modal */}
      {showRoleModal && selectedUser && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Change User Role</h2>
              <button onClick={() => setShowRoleModal(false)} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="mb-6">
              <p className="text-slate-300 mb-4">
                Change role for <strong>{selectedUser.name}</strong>
              </p>
              
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Select Role</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-black-500 transition-colors"
                >
                  <option value="user">User</option>
                  <option value="technical">Technical</option>
                  <option value="managerial">Managerial</option>
                  <option value="superAdmin">Super Admin</option>
                </select>
                <p className="text-slate-400 text-xs mt-2">
                  Current role: <strong>{selectedUser.role}</strong>
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowRoleModal(false)}
                className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleChangeRole}
                className="flex-1 px-6 py-3 bg-linear-to-r from-black-600 to-gray-600 hover:from-black-700 hover:to-gray-700 text-white rounded-xl font-medium transition-all shadow-lg shadow-black-500/30"
              >
                Change Role
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
