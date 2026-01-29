"use client";
import React, { useState } from "react";
import { workshopsApi } from "../../lib/dashboardApi";
import { Workshop } from "@/types";
import Image from "next/image";
import { IMAGES } from "@/constants/assets";

export default function EditWorkshopModal({ workshop, onClose, onSuccess }: { workshop: Workshop; onClose: () => void; onSuccess: () => void }) {
  // Helper function to format date for datetime-local input
  const formatDateForInput = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16); // Returns YYYY-MM-DDTHH:MM format
  };

  const [form, setForm] = useState({
    name: workshop.name || "",
    slug: workshop.slug || "",
    duration: workshop.duration || "",
    entryFee: workshop.entryFee || 0,
    aboutWorkshop: workshop.aboutWorkshop || "",
    prerequisites: workshop.prerequisites || [],
    registrationDeadline: formatDateForInput(workshop.registrationDeadline),
    workshopDate: formatDateForInput(workshop.workshopDate),
    startTime: workshop.startTime || "",
    endTime: workshop.endTime || "",
    venue: workshop.venue || "",
    maxParticipants: workshop.maxParticipants || 0,
    workshopPhoto: workshop.workshopPhoto || "",
    hideWorkshop: workshop.hideWorkshop || false,
    stopRegistration: workshop.stopRegistration || false,
    instructor: {
      name: workshop.instructor?.name || "",
      company: workshop.instructor?.company || "",
      photo: workshop.instructor?.photo || "",
      linkedin: workshop.instructor?.linkedin || "",
    },
    contact: workshop.contact || [],
    whatsappGrpLink: workshop.whatsappGrpLink || "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(workshop.workshopPhoto?.startsWith('http') ? IMAGES.workshopImg : workshop.workshopPhoto || IMAGES.workshopImg);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target;
    let fieldValue: any = value;
    if (type === "checkbox" && "checked" in e.target) {
      fieldValue = (e.target as HTMLInputElement).checked;
    }

    // Handle nested fields using dot notation
    if (name.includes(".")) {
      const keys = name.split(".");
      setForm((prev) => {
        const newForm = { ...prev };
        let current: any = newForm;
        
        for (let i = 0; i < keys.length - 1; i++) {
          if (!current[keys[i]]) current[keys[i]] = {};
          current = current[keys[i]];
        }
        
        current[keys[keys.length - 1]] = fieldValue;
        return newForm;
      });
    } else {
      setForm((prev) => ({ ...prev, [name]: fieldValue }));
    }
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  function handleArrayChange(fieldName: string, index: number, value: string) {
    setForm((prev) => {
      const newArray = [...(prev[fieldName as keyof typeof prev] as string[])];
      newArray[index] = value;
      return { ...prev, [fieldName]: newArray };
    });
  }

  function addArrayItem(fieldName: string) {
    setForm((prev) => ({
      ...prev,
      [fieldName]: [...(prev[fieldName as keyof typeof prev] as string[]), ""],
    }));
  }

  function removeArrayItem(fieldName: string, index: number) {
    setForm((prev) => {
      const newArray = [...(prev[fieldName as keyof typeof prev] as string[])];
      newArray.splice(index, 1);
      return { ...prev, [fieldName]: newArray };
    });
  }

  function addContact() {
    setForm((prev) => ({
      ...prev,
      contact: [...prev.contact, { name: "", whatsappNo: "" }],
    }));
  }

  function updateContact(index: number, field: string, value: string) {
    setForm((prev) => {
      const newContact = [...prev.contact];
      newContact[index] = { ...newContact[index], [field]: value };
      return { ...prev, contact: newContact };
    });
  }

  function removeContact(index: number) {
    setForm((prev) => ({
      ...prev,
      contact: prev.contact.filter((_, i) => i !== index),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log('Submitting form data:', form);
      
      // Prepare the update data - no FormData needed since we're not always uploading files
      const updateData = {
        ...form,
        instructor: form.instructor,
        contact: form.contact,
        prerequisites: form.prerequisites,
      };

      // Only use FormData if we have a file to upload
      if (imageFile) {
        const formData = new FormData();
        
        Object.entries(updateData).forEach(([key, value]) => {
          if (key === "instructor" || key === "contact") {
            formData.append(key, JSON.stringify(value));
          } else if (key === "prerequisites") {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, String(value));
          }
        });
        
        formData.append("workshopPhoto", imageFile);
        await workshopsApi.update(workshop._id, formData);
      } else {
        // Send as JSON if no file upload
        await workshopsApi.update(workshop._id, updateData);
      }

      console.log('Workshop updated successfully');
      onSuccess();
    } catch (err: any) {
      console.error('Update error:', err);
      setError(err.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Edit Workshop</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              ✕
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Workshop Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Slug</label>
              <input
                type="text"
                name="slug"
                value={form.slug}
                onChange={handleChange}
                className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                required
              />
            </div>
          </div>

          {/* Workshop Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Workshop Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
            {(imagePreview || form.workshopPhoto) && (
              <div className="mt-2">
                <Image 
                  src={imagePreview || form.workshopPhoto || IMAGES.workshopImg} 
                  alt="Preview" 
                  width={200} 
                  height={150} 
                  className="rounded object-cover" 
                />
              </div>
            )}
          </div>

          {/* Instructor Info */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Instructor Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Instructor Name</label>
                <input
                  type="text"
                  name="instructor.name"
                  value={form.instructor.name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Company</label>
                <input
                  type="text"
                  name="instructor.company"
                  value={form.instructor.company}
                  onChange={handleChange}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Instructor Photo URL</label>
                <input
                  type="text"
                  name="instructor.photo"
                  value={form.instructor.photo}
                  onChange={handleChange}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">LinkedIn Profile</label>
                <input
                  type="url"
                  name="instructor.linkedin"
                  value={form.instructor.linkedin}
                  onChange={handleChange}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>
          </div>

          {/* Workshop Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Duration</label>
              <input
                type="text"
                name="duration"
                value={form.duration}
                onChange={handleChange}
                placeholder="e.g., 2 hours"
                className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Entry Fee</label>
              <input
                type="number"
                name="entryFee"
                value={form.entryFee}
                onChange={handleChange}
                min="0"
                className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                required
              />
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Workshop Date</label>
              <input
                type="datetime-local"
                name="workshopDate"
                value={form.workshopDate}
                onChange={handleChange}
                className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Start Time</label>
              <input
                type="time"
                name="startTime"
                value={form.startTime}
                onChange={handleChange}
                className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">End Time</label>
              <input
                type="time"
                name="endTime"
                value={form.endTime}
                onChange={handleChange}
                className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                required
              />
            </div>
          </div>

          {/* Venue & Participants */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Venue</label>
              <input
                type="text"
                name="venue"
                value={form.venue}
                onChange={handleChange}
                className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Max Participants</label>
              <input
                type="number"
                name="maxParticipants"
                value={form.maxParticipants}
                onChange={handleChange}
                min="1"
                className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                required
              />
            </div>
          </div>

          {/* Registration Deadline */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Registration Deadline</label>
            <input
              type="datetime-local"
              name="registrationDeadline"
              value={form.registrationDeadline}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              required
            />
          </div>

          {/* About Workshop */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">About Workshop</label>
            <textarea
              name="aboutWorkshop"
              value={form.aboutWorkshop}
              onChange={handleChange}
              rows={4}
              className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              required
            />
          </div>

          {/* Prerequisites */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Prerequisites</label>
            {form.prerequisites.map((prereq, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={prereq}
                  onChange={(e) => handleArrayChange("prerequisites", index, e.target.value)}
                  className="flex-1 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder={`Prerequisite ${index + 1}`}
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem("prerequisites", index)}
                  className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem("prerequisites")}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Add Prerequisite
            </button>
          </div>

          {/* Contact Information */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Contact Information</label>
            {form.contact.map((contact, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
                <input
                  type="text"
                  value={contact.name}
                  onChange={(e) => updateContact(index, "name", e.target.value)}
                  className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Contact Name"
                />
                <input
                  type="text"
                  value={contact.whatsappNo}
                  onChange={(e) => updateContact(index, "whatsappNo", e.target.value)}
                  className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="WhatsApp Number"
                />
                <button
                  type="button"
                  onClick={() => removeContact(index)}
                  className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addContact}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Add Contact
            </button>
          </div>

          {/* WhatsApp Group Link */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">WhatsApp Group Link</label>
            <input
              type="url"
              name="whatsappGrpLink"
              value={form.whatsappGrpLink}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>

          {/* Settings */}
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="hideWorkshop"
                checked={form.hideWorkshop}
                onChange={handleChange}
                className="mr-2"
              />
              <label className="text-sm text-gray-700 dark:text-gray-300">Hide Workshop</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="stopRegistration"
                checked={form.stopRegistration}
                onChange={handleChange}
                className="mr-2"
              />
              <label className="text-sm text-gray-700 dark:text-gray-300">Stop Registration</label>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}