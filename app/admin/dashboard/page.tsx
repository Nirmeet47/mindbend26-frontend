"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCounts } from "../../../lib/dashboardApi";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, UsersRound, TrendingUp, Activity } from "lucide-react";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [counts, setCounts] = useState<{ users: number; events: number; teams: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        await api.get("/users/profile");
        const data = await getCounts();
        if (!isMounted) return;
        setCounts(data);
        setLoading(false);
      } catch (err: any) {
        if (!isMounted) return;
        const status = err?.response?.status || err?.status;
        if (status === 401 || status === 403) {
          router.replace("/admin");
          return;
        }
        setError("Failed to load dashboard stats");
        setLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, [router]);

  const stats = [
    {
      title: "Total Users",
      value: counts?.users ?? 0,
      icon: Users,
      description: "Registered participants",
      trend: "+12% from last month",
      color: "text-blue-400"
    },
    {
      title: "Total Events",
      value: counts?.events ?? 0,
      icon: Calendar,
      description: "Active competitions",
      trend: "+3 new this week",
      color: "text-purple-400"
    },
    {
      title: "Total Teams",
      value: counts?.teams ?? 0,
      icon: UsersRound,
      description: "Formed teams",
      trend: "+8% from last month",
      color: "text-green-400"
    }
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="border-b border-white/5 bg-[#0a0a0a]/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">Dashboard</h1>
              <p className="text-sm text-gray-400">Welcome back to Mindbend Admin</p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-green-500/10 border border-green-500/20">
              <Activity className="w-4 h-4 text-green-400" />
              <span className="text-xs font-medium text-green-400">System Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              <p className="text-sm text-gray-400">Loading dashboard...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <p className="text-red-400 mb-2">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Try again
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Stats Grid - Using shadcn Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <Card
                    key={index}
                    className="bg-[#0a0a0a] border-white/5 hover:border-white/10 transition-all duration-300 hover:shadow-lg hover:shadow-white/5"
                  >
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-gray-400">
                        {stat.title}
                      </CardTitle>
                      <div className={`p-2 rounded-md bg-white/5 ${stat.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-1">
                        <div className="text-3xl font-bold text-white">
                          {stat.value.toLocaleString()}
                        </div>
                        <p className="text-xs text-gray-500">{stat.description}</p>
                        <div className="flex items-center gap-1 pt-2">
                          <TrendingUp className="w-3 h-3 text-green-400" />
                          <span className="text-xs text-green-400">{stat.trend}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Quick Actions - Using shadcn Card */}
            <Card className="bg-[#0a0a0a] border-white/5">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <button
                    onClick={() => router.push('/admin/dashboard/events')}
                    className="p-4 rounded-md bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all duration-200 text-left group"
                  >
                    <Calendar className="w-5 h-5 text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
                    <p className="text-sm font-medium text-white">Manage Events</p>
                    <p className="text-xs text-gray-400 mt-1">Add or edit events</p>
                  </button>

                  <button
                    onClick={() => router.push('/admin/dashboard/users')}
                    className="p-4 rounded-md bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all duration-200 text-left group"
                  >
                    <Users className="w-5 h-5 text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
                    <p className="text-sm font-medium text-white">View Users</p>
                    <p className="text-xs text-gray-400 mt-1">Manage participants</p>
                  </button>

                  <button
                    onClick={() => router.push('/admin/dashboard/teams')}
                    className="p-4 rounded-md bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all duration-200 text-left group"
                  >
                    <UsersRound className="w-5 h-5 text-green-400 mb-2 group-hover:scale-110 transition-transform" />
                    <p className="text-sm font-medium text-white">View Teams</p>
                    <p className="text-xs text-gray-400 mt-1">Check team formations</p>
                  </button>

                  <button
                    onClick={() => router.push('/admin/dashboard/security')}
                    className="p-4 rounded-md bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all duration-200 text-left group"
                  >
                    <Activity className="w-5 h-5 text-red-400 mb-2 group-hover:scale-110 transition-transform" />
                    <p className="text-sm font-medium text-white">Security</p>
                    <p className="text-xs text-gray-400 mt-1">System settings</p>
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity - Using shadcn Card */}
            <Card className="bg-[#0a0a0a] border-white/5">
              <CardHeader>
                <CardTitle className="text-white">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Activity className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-sm text-gray-400">Activity tracking coming soon</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
