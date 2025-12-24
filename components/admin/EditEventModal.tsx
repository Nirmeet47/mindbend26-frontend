"use client";
import React, { useState } from "react";
import { eventsApi } from "../../lib/dashboardApi";
import { Event } from "@/types";
import Image from "next/image";

export default function EditEventModal({ event, onClose, onSuccess }: { event: Event; onClose: () => void; onSuccess: () => void }) {
  const [form, setForm] = useState({
    name: event.name || "",
    type: event.type || "technical",
    slug: event.slug || "",
    isTeamEvent: event.isTeamEvent || false,
    minTeamSize: event.minTeamSize || 1,
    maxTeamSize: event.maxTeamSize || 1,
    prizeMoney: event.prizeMoney || 0,
    entryFee: event.entryFee || 0,
    aboutEvent: event.aboutEvent || "",
    eventDate: event.eventDate || "",
    registrationDeadline: event.registrationDeadline || "",
    venue: event.venue || "",
    eventPhoto: event.eventPhoto || "",
    hideEvent: event.hideEvent || false,
    stopRegistration: event.stopRegistration || false,
    contact: event.contact || [],
    whatsappGrpLink: event.whatsappGrpLink || "",
    unstopLink: event.unstopLink || "",
    psLink: event.psLink || "",
    prizeDistribution: {
      first: event.prizeDistribution?.first || 0,
      second: event.prizeDistribution?.second || 0,
      third: event.prizeDistribution?.third || 0,
    },
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(event.eventPhoto || "");
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

  function addContact() {
    setForm((prev) => ({
      ...prev,
      contact: [...prev.contact, { name: "", whatsappNo: "" }],
    }));
  }

  function removeContact(index: number) {
    setForm((prev) => ({
      ...prev,
      contact: prev.contact.filter((_, i) => i !== index),
    }));
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (imageFile) {
        const formData = new FormData();
        Object.entries(form).forEach(([key, value]) => {
          if (key !== 'eventPhoto') {
            if (key === 'prizeDistribution' || key === 'contact') {
              formData.append(key, JSON.stringify(value));
            } else {
              formData.append(key, String(value));
            }
          }
        });
        formData.append('eventPhoto', imageFile);
        await eventsApi.update(event._id, formData);
      } else {
        await eventsApi.update(event._id, form);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to update event");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 w-full max-w-lg relative max-h-[90vh] overflow-y-auto">
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
              <label className="block text-sm font-medium mb-1">Min Team Size</label>
              <input name="minTeamSize" type="number" min="1" value={form.minTeamSize} onChange={handleChange} className="w-full border rounded px-3 py-2 bg-gray-50 dark:bg-gray-800" />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Max Team Size</label>
              <input name="maxTeamSize" type="number" min="1" value={form.maxTeamSize} onChange={handleChange} className="w-full border rounded px-3 py-2 bg-gray-50 dark:bg-gray-800" />
            </div>
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
          <div className="border-t pt-4 mt-4">
            <h3 className="text-md font-semibold mb-3">Prize Distribution</h3>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">1st Prize</label>
                <input name="prizeDistribution.first" type="number" value={form.prizeDistribution.first} onChange={handleChange} className="w-full border rounded px-3 py-2 bg-gray-50 dark:bg-gray-800" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">2nd Prize</label>
                <input name="prizeDistribution.second" type="number" value={form.prizeDistribution.second} onChange={handleChange} className="w-full border rounded px-3 py-2 bg-gray-50 dark:bg-gray-800" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">3rd Prize</label>
                <input name="prizeDistribution.third" type="number" value={form.prizeDistribution.third} onChange={handleChange} className="w-full border rounded px-3 py-2 bg-gray-50 dark:bg-gray-800" />
              </div>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Event Date</label>
              <input name="eventDate" type="date" value={form.eventDate?.slice(0,10) || ""} onChange={handleChange} className="w-full border rounded px-3 py-2 bg-gray-50 dark:bg-gray-800" />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Registration Deadline</label>
              <input name="registrationDeadline" type="date" value={form.registrationDeadline?.slice(0,10) || ""} onChange={handleChange} className="w-full border rounded px-3 py-2 bg-gray-50 dark:bg-gray-800" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Venue</label>
            <input name="venue" value={form.venue} onChange={handleChange} className="w-full border rounded px-3 py-2 bg-gray-50 dark:bg-gray-800" />
          </div>
          <div className="border-t pt-4 mt-4">
            <h3 className="text-md font-semibold mb-3">Contact & Links</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium">Contacts</label>
                  <button type="button" onClick={addContact} className="text-sm px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">+ Add Contact</button>
                </div>
                {form.contact.map((contact, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      name={`contact.${index}.name`}
                      value={contact.name}
                      onChange={handleChange}
                      placeholder="Name"
                      className="flex-1 border rounded px-3 py-2 bg-gray-50 dark:bg-gray-800"
                    />
                    <input
                      name={`contact.${index}.whatsappNo`}
                      value={contact.whatsappNo}
                      onChange={handleChange}
                      placeholder="+91XXXXXXXXXX"
                      className="flex-1 border rounded px-3 py-2 bg-gray-50 dark:bg-gray-800"
                    />
                    <button type="button" onClick={() => removeContact(index)} className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600">×</button>
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">WhatsApp Group Link</label>
                <input name="whatsappGrpLink" value={form.whatsappGrpLink} onChange={handleChange} placeholder="https://chat.whatsapp.com/..." className="w-full border rounded px-3 py-2 bg-gray-50 dark:bg-gray-800" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Unstop Link</label>
                <input name="unstopLink" value={form.unstopLink} onChange={handleChange} placeholder="https://unstop.com/..." className="w-full border rounded px-3 py-2 bg-gray-50 dark:bg-gray-800" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Problem Statement Link</label>
                <input name="psLink" value={form.psLink} onChange={handleChange} placeholder="https://..." className="w-full border rounded px-3 py-2 bg-gray-50 dark:bg-gray-800" />
              </div>
            </div>
          </div>
          <div className="border-t pt-4 mt-4">
            <h3 className="text-md font-semibold mb-3">Event Visibility</h3>
            <div className="flex gap-6">
              <div>
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="hideEvent" checked={form.hideEvent} onChange={handleChange} />
                  <span className="text-sm font-medium">Hide Event</span>
                </label>
              </div>
              <div>
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="stopRegistration" checked={form.stopRegistration} onChange={handleChange} />
                  <span className="text-sm font-medium">Stop Registration</span>
                </label>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Event Photo</label>
            {imagePreview && (
              <div className="mb-2 relative w-full h-40 rounded border border-gray-300 dark:border-gray-700 overflow-hidden">
                  <Image
                    src={imagePreview}
                    alt="Event Preview"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full border rounded px-3 py-2 bg-gray-50 dark:bg-gray-800 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-gray-700 dark:file:text-gray-200"
            />
            <p className="text-xs text-gray-500 mt-1">Upload a new image or leave empty to keep current image</p>
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
