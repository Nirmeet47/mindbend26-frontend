
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { parseJWT } from "../../../lib/auth";

export default function AdminDashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("mb_admin_token") : null;
    if (!token || !parseJWT(token)) {
      router.replace("/admin");
    }
  }, [router]);

  return (
    <div style={{ color: "white", padding: 32 }}>
      <h1>Admin Dashboard</h1>
      <p>Welcome, Admin!</p>
      {/* Add dashboard widgets/components here */}
    </div>
  );
}
