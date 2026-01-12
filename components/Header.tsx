"use client";
import React from "react";

export default function Header({ title = "Admin Console" }: { title?: string }) {
  return (
    <header className="mb-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{title}</h1>
      <p className="text-gray-600 dark:text-gray-400 mt-1">Mindbend Admin Console</p>
    </header>
  );
}
