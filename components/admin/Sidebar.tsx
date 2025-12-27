"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logout } from "../../lib/auth";
import { permissions } from "../../lib/permissions";
import api from "@/lib/api";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  
  
  // const token = typeof window !== "undefined" ? localStorage.getItem("mb_admin_token") : null;
  // const user = token ? parseJWT(token) : null;
  

  useEffect(() => {
    let isMounted = true;
    api
      .get("/users/profile")
      .then((res) => {
        if (!isMounted) return;
        setUser(res.data?.user || res.data?.data?.user || null);
        setLoadingUser(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        const status = err?.response?.status;
        if (status === 401 || status === 403) router.replace("/admin");
        setUser(null);
        setLoadingUser(false);
      });
    return () => {
      isMounted = false;
    };
  }, [router]);

  const canViewUsers = user ? permissions.canViewUsers(user.role) : false;
  const canViewTeams = user ? permissions.canViewTeams(user.role) : false;
  const canViewSecurity = user ? permissions.canViewSecurity(user.role) : false;

  async function doLogout() {
    if (!confirm('Are you sure you want to logout?')) return;
    try {
      await logout();
    } finally {
      router.replace("/admin");
    }
  }

  return (
    <aside className="h-screen w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col py-8 px-6">
      <div className="mb-8">
        <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Mindbend Admin</div>
        <div className="text-xs text-gray-500">Signed in as <span className="font-semibold text-gray-700 dark:text-gray-200">{loadingUser ? "..." : user?.role || "Unknown"}</span></div>
      </div>
      <nav className="flex-1 flex flex-col gap-1">
        <Link href="/admin/dashboard" className={`block px-4 py-2 rounded transition text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 ${pathname === "/admin/dashboard" ? "bg-gray-100 dark:bg-gray-800 font-semibold" : ""}`}>Dashboard</Link>
        <Link href="/admin/dashboard/events" className={`block px-4 py-2 rounded transition text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 ${pathname?.startsWith("/admin/dashboard/events") ? "bg-gray-100 dark:bg-gray-800 font-semibold" : ""}`}>Events</Link>
        {canViewUsers && (
          <Link href="/admin/dashboard/users" className={`block px-4 py-2 rounded transition text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 ${pathname?.startsWith("/admin/dashboard/users") ? "bg-gray-100 dark:bg-gray-800 font-semibold" : ""}`}>Users</Link>
        )}
        {canViewTeams && (
          <Link href="/admin/dashboard/teams" className={`block px-4 py-2 rounded transition text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 ${pathname?.startsWith("/admin/dashboard/teams") ? "bg-gray-100 dark:bg-gray-800 font-semibold" : ""}`}>Teams</Link>
        )}
        {canViewSecurity && (
          <Link href="/admin/dashboard/security" className={`block px-4 py-2 rounded transition text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 ${pathname?.startsWith("/admin/dashboard/security") ? "bg-gray-100 dark:bg-gray-800 font-semibold" : ""}`}>Security</Link>
        )}
      </nav>
      <button onClick={doLogout} className="mt-8 w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition font-medium">Logout</button>
    </aside>
  );
}
