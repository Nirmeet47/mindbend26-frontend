"use client";
import React, { useState } from "react";
import { eventsApi } from "../../lib/dashboardApi";
import { Event } from "@/types";
import Image from "next/image";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, X, Upload } from "lucide-react";

interface AddEventModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddEventModal({ open, onClose, onSuccess }: AddEventModalProps) {
  const [form, setForm] = useState({
    name: "",
    type: "technical" as "technical" | "managerial",
    slug: "",
    isTeamEvent: false,
    minTeamSize: 1,
    maxTeamSize: 1,
    prizeMoney: 0,
    entryFee: 0,
    aboutEvent: "",
    eventDate: "",
    registrationDeadline: "",
    venue: "",
    eventPhoto: "",
    hideEvent: false,
    stopRegistration: false,
    contact: [] as { name: string; whatsappNo: string }[],
    whatsappGrpLink: "",
    unstopLink: "",
    psLink: "",
    prizeDistribution: {
      first: 0,
      second: 0,
      third: 0,
    },
    rules: [] as string[],
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target;
    let fieldValue: any = value;
    if (type === "checkbox" && "checked" in e.target) {
      fieldValue = (e.target as HTMLInputElement).checked;
    }

    // Handle nested fields using dot notation with type safety
    if (name.includes(".")) {
      const keys = name.split(".") as (keyof typeof form)[];
      setForm((prev) => {
        const updatedForm = { ...prev };
        let current: any = updatedForm;
        for (let i = 0; i < keys.length - 1; i++) {
          current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = fieldValue;
        return updatedForm;
      });
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: fieldValue,
      }));
    }
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

  function addRule() {
    setForm((prev) => ({
      ...prev,
      rules: [...(prev.rules || []), ""],
    }));
  }

  function removeRule(index: number) {
    setForm((prev) => ({
      ...prev,
      rules: prev.rules.filter((_, i) => i !== index),
    }));
  }

  function handleRuleChange(index: number, value: string) {
    setForm((prev) => {
      const updatedRules = [...(prev.rules || [])];
      updatedRules[index] = value;
      return { ...prev, rules: updatedRules };
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key !== 'eventPhoto') {
          if (key === 'prizeDistribution' || key === 'contact' || key === 'rules') {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, String(value));
          }
        }
      });
      
      if (imageFile) {
        formData.append('eventPhoto', imageFile);
      }
      
      await eventsApi.create(formData);
      onSuccess();
      onClose();
      
      // Reset form
      setForm({
        name: "",
        type: "technical",
        slug: "",
        isTeamEvent: false,
        minTeamSize: 1,
        maxTeamSize: 1,
        prizeMoney: 0,
        entryFee: 0,
        aboutEvent: "",
        eventDate: "",
        registrationDeadline: "",
        venue: "",
        eventPhoto: "",
        hideEvent: false,
        stopRegistration: false,
        contact: [],
        whatsappGrpLink: "",
        unstopLink: "",
        psLink: "",
        prizeDistribution: { first: 0, second: 0, third: 0 },
        rules: [],
      });
      setImageFile(null);
      setImagePreview("");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to create event");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Add New Event
          </DialogTitle>
          <DialogDescription>
            Create a new event with all necessary details and configurations.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Event Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter event name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Event Type *</Label>
                <select
                  id="type"
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                >
                  <option value="technical">Technical</option>
                  <option value="managerial">Managerial</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug *</Label>
                <Input
                  id="slug"
                  name="slug"
                  value={form.slug}
                  onChange={handleChange}
                  placeholder="event-url-slug"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="venue">Venue</Label>
                <Input
                  id="venue"
                  name="venue"
                  value={form.venue}
                  onChange={handleChange}
                  placeholder="Event venue"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="aboutEvent">About Event</Label>
              <Textarea
                id="aboutEvent"
                name="aboutEvent"
                value={form.aboutEvent}
                onChange={handleChange}
                placeholder="Describe the event..."
                rows={3}
              />
            </div>
          </div>

          {/* Team Configuration */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Team Configuration</h3>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isTeamEvent"
                name="isTeamEvent"
                checked={form.isTeamEvent}
                onChange={handleChange}
                className="rounded border-gray-300"
              />
              <Label htmlFor="isTeamEvent">This is a team event</Label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="minTeamSize">Minimum Team Size</Label>
                <Input
                  id="minTeamSize"
                  name="minTeamSize"
                  type="number"
                  min="1"
                  value={form.minTeamSize}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxTeamSize">Maximum Team Size</Label>
                <Input
                  id="maxTeamSize"
                  name="maxTeamSize"
                  type="number"
                  min="1"
                  value={form.maxTeamSize}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Financial Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Financial Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="prizeMoney">Total Prize Money (₹)</Label>
                <Input
                  id="prizeMoney"
                  name="prizeMoney"
                  type="number"
                  min="0"
                  value={form.prizeMoney}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="entryFee">Entry Fee (₹)</Label>
                <Input
                  id="entryFee"
                  name="entryFee"
                  type="number"
                  min="0"
                  value={form.entryFee}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Prize Distribution */}
            <div className="space-y-2">
              <Label>Prize Distribution (₹)</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="first">1st Prize</Label>
                  <Input
                    id="first"
                    name="prizeDistribution.first"
                    type="number"
                    min="0"
                    value={form.prizeDistribution.first}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="second">2nd Prize</Label>
                  <Input
                    id="second"
                    name="prizeDistribution.second"
                    type="number"
                    min="0"
                    value={form.prizeDistribution.second}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="third">3rd Prize</Label>
                  <Input
                    id="third"
                    name="prizeDistribution.third"
                    type="number"
                    min="0"
                    value={form.prizeDistribution.third}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Important Dates</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="eventDate">Event Date</Label>
                <Input
                  id="eventDate"
                  name="eventDate"
                  type="date"
                  value={form.eventDate}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="registrationDeadline">Registration Deadline</Label>
                <Input
                  id="registrationDeadline"
                  name="registrationDeadline"
                  type="date"
                  value={form.registrationDeadline}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Contact Information</h3>
              <Button type="button" onClick={addContact} variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Contact
              </Button>
            </div>
            
            {form.contact.map((contact, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg">
                <div className="space-y-2">
                  <Label htmlFor={`contact-name-${index}`}>Name</Label>
                  <Input
                    id={`contact-name-${index}`}
                    name={`contact.${index}.name`}
                    value={contact.name}
                    onChange={handleChange}
                    placeholder="Contact person name"
                  />
                </div>
                <div className="space-y-2 flex items-end">
                  <div className="flex-1">
                    <Label htmlFor={`contact-whatsapp-${index}`}>WhatsApp Number</Label>
                    <Input
                      id={`contact-whatsapp-${index}`}
                      name={`contact.${index}.whatsappNo`}
                      value={contact.whatsappNo}
                      onChange={handleChange}
                      placeholder="+91XXXXXXXXXX"
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={() => removeContact(index)}
                    variant="destructive"
                    size="sm"
                    className="ml-2"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Additional Links</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="whatsappGrpLink">WhatsApp Group Link</Label>
                <Input
                  id="whatsappGrpLink"
                  name="whatsappGrpLink"
                  value={form.whatsappGrpLink}
                  onChange={handleChange}
                  placeholder="https://chat.whatsapp.com/..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unstopLink">Unstop Link</Label>
                <Input
                  id="unstopLink"
                  name="unstopLink"
                  value={form.unstopLink}
                  onChange={handleChange}
                  placeholder="https://unstop.com/..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="psLink">Problem Statement Link</Label>
                <Input
                  id="psLink"
                  name="psLink"
                  value={form.psLink}
                  onChange={handleChange}
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>

          {/* Event Photo */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Event Photo</h3>
            {imagePreview && (
              <div className="relative w-full h-48 rounded-lg border border-gray-300 dark:border-gray-700 overflow-hidden">
                <Image
                  src={imagePreview}
                  alt="Event Preview"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="eventPhoto">Upload Event Image</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="eventPhoto"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-gray-700 dark:file:text-gray-200"
                />
                <Upload className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Rules */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Event Rules</h3>
              <Button type="button" onClick={addRule} variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Rule
              </Button>
            </div>
            
            {form.rules?.map((rule, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  value={rule}
                  onChange={(e) => handleRuleChange(index, e.target.value)}
                  placeholder={`Rule ${index + 1}`}
                />
                <Button
                  type="button"
                  onClick={() => removeRule(index)}
                  variant="destructive"
                  size="sm"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Event Visibility */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Event Visibility</h3>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="hideEvent"
                  name="hideEvent"
                  checked={form.hideEvent}
                  onChange={handleChange}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="hideEvent">Hide Event</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="stopRegistration"
                  name="stopRegistration"
                  checked={form.stopRegistration}
                  onChange={handleChange}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="stopRegistration">Stop Registration</Label>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Event"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}