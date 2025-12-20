"use client";
import React, { useState } from "react";
import { eventsApi } from "../../lib/dashboardApi";

export default function EditEventModal({ event, onClose, onSuccess }: { event: any; onClose: () => void; onSuccess: () => void }) {
  const [form, setForm] = useState({
    name: event.name || "",
    type: event.type || "technical",
    slug: event.slug || "",
    isTeamEvent: event.isTeamEvent || false,
    prizeMoney: event.prizeMoney || 0,
    entryFee: event.entryFee || 0,
    aboutEvent: event.aboutEvent || "",
    eventDate: event.eventDate || "",
    venue: event.venue || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target;
    let fieldValue: any = value;
    if (type === "checkbox" && "checked" in e.target) {
      fieldValue = (e.target as HTMLInputElement).checked;
    }
    setForm((prev) => ({
      ...prev,
      [name]: fieldValue,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await eventsApi.update(event._id, form);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to update event");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 w-full max-w-lg relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">&times;</button>
        <h2 className="text-xl font-semibold mb-4">Edit Event</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input name="name" value={form.name} onChange={handleChange} className="w-full border rounded px-3 py-2 bg-gray-50 dark:bg-gray-800" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Type</label>
            <select name="type" value={form.type} onChange={handleChange} className="w-full border rounded px-3 py-2 bg-gray-50 dark:bg-gray-800">
              <option value="technical">Technical</option>
              <option value="managerial">Managerial</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Slug</label>
            <input name="slug" value={form.slug} onChange={handleChange} className="w-full border rounded px-3 py-2 bg-gray-50 dark:bg-gray-800" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Team Event</label>
            <input type="checkbox" name="isTeamEvent" checked={form.isTeamEvent} onChange={handleChange} className="ml-2" />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Prize Money</label>
              <input name="prizeMoney" type="number" value={form.prizeMoney} onChange={handleChange} className="w-full border rounded px-3 py-2 bg-gray-50 dark:bg-gray-800" />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Entry Fee</label>
              <input name="entryFee" type="number" value={form.entryFee} onChange={handleChange} className="w-full border rounded px-3 py-2 bg-gray-50 dark:bg-gray-800" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">About Event</label>
            <textarea name="aboutEvent" value={form.aboutEvent} onChange={handleChange} className="w-full border rounded px-3 py-2 bg-gray-50 dark:bg-gray-800" rows={3} />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Event Date</label>
              <input name="eventDate" type="date" value={form.eventDate?.slice(0,10) || ""} onChange={handleChange} className="w-full border rounded px-3 py-2 bg-gray-50 dark:bg-gray-800" />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Venue</label>
              <input name="venue" value={form.venue} onChange={handleChange} className="w-full border rounded px-3 py-2 bg-gray-50 dark:bg-gray-800" />
            </div>
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-60">
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
