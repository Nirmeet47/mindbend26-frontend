import { ReactNode } from "react";
import AdminSidebar from "@/components/admin/Sidebar";

export default function AdminDashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <AdminSidebar />
      <main style={{ flex: 1, background: "#000000" }}>{children}</main>
    </div>
  );
}
