import Sidebar from "../../../components/admin/Sidebar";
import { ReactNode } from "react";

export default function AdminDashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <main style={{ flex: 1, background: "#181830", padding: 32 }}>{children}</main>
    </div>
  );
}
