"use client";
import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logout, parseJWT } from "../lib/auth";
import { permissions } from "../lib/permissions";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const token = typeof window !== "undefined" ? localStorage.getItem("mb_admin_token") : null;
  const user = token ? parseJWT(token) : null;

  const canViewUsers = user ? permissions.canViewUsers(user.role) : false;
  const canViewTeams = user ? permissions.canViewTeams(user.role) : false;
  const canViewSecurity = user ? permissions.canViewSecurity(user.role) : false;

  function doLogout() {
    logout();
    router.push("/admin");
  }

  return (
    <aside className="sidebar">
      <div className="logo">Mindbend Admin</div>
      <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 12 }}>
        Signed in as <b style={{ color: "var(--text)" }}>{user?.role || "Unknown"}</b>
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
