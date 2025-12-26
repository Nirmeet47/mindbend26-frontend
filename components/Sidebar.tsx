"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logout } from "../lib/auth";
import { permissions } from "../lib/permissions";
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
    try {
      await logout();
    } finally {
      router.replace("/admin");
    }
  }

  return (
    <aside className="sidebar">
      <div className="logo">Mindbend Admin</div>
      <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 12 }}>
        Signed in as <b style={{ color: "var(--text)" }}>{loadingUser ? "..." : user?.role || "Unknown"}</b>
      </div>
      <Link className={`nav-link ${pathname === "/admin/dashboard" ? "active" : ""}`} href="/admin/dashboard">Dashboard</Link>
      <Link className={`nav-link ${pathname?.startsWith("/admin/dashboard/events") ? "active" : ""}`} href="/admin/dashboard/events">Events</Link>
      {canViewUsers && (
        <Link className={`nav-link ${pathname?.startsWith("/admin/dashboard/users") ? "active" : ""}`} href="/admin/dashboard/users">Users</Link>
      )}
      {canViewTeams && (
        <Link className={`nav-link ${pathname?.startsWith("/admin/dashboard/teams") ? "active" : ""}`} href="/admin/dashboard/teams">Teams</Link>
      )}
      {canViewSecurity && (
        <Link className={`nav-link ${pathname?.startsWith("/admin/dashboard/security") ? "active" : ""}`} href="/admin/dashboard/security">Security</Link>
      )}
      <button onClick={doLogout} style={{ marginTop: 24, width: "100%" }}>Logout</button>
    </aside>
  );
}
