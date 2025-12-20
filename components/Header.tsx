"use client";
import React from "react";

export default function Header({ title = "Admin Console" }: { title?: string }) {
  return (
    <header className="header">
      <h2 style={{ margin: 0 }}>{title}</h2>
      <div style={{ color: "var(--muted)" }}>Mindbend Admin Console</div>
    </header>
  );
}
