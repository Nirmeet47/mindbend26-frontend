"use client";
import React, { useState } from "react";
import { eventsApi } from "../../lib/dashboardApi";
import { Event, StructuredRule } from "@/types";
import Image from "next/image";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, X, Upload, ChevronUp, ChevronDown } from "lucide-react";

function formatDateTimeLocal(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const pad = (n: number) => String(n).padStart(2, "0");
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

interface EditEventModalProps {
  event: Event;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditEventModal({ event, open, onClose, onSuccess }: EditEventModalProps) {
  const [form, setForm] = useState({
    name: event.name || "",
    type: event.type || "technical" as "technical" | "managerial" | "esports",
    slug: event.slug || "",
    isTeamEvent: event.isTeamEvent || false,
    minTeamSize: event.minTeamSize || 1,
    maxTeamSize: event.maxTeamSize || 1,
    prizeMoney: event.prizeMoney || 0,
    entryFee: event.entryFee || 0,
    aboutEvent: event.aboutEvent || "",
    eventDate: formatDateTimeLocal(event.eventDate),
    registrationDeadline: formatDateTimeLocal(event.registrationDeadline),
    venue: event.venue || "",
    hideEvent: event.hideEvent || false,
    stopRegistration: event.stopRegistration || false,
    contact: event.contact || [] as { name: string; whatsappNo: string }[],
    whatsappGrpLink: event.whatsappGrpLink || "",
    unstopLink: event.unstopLink || "",
    psLink: event.psLink || "",
    prizeDistribution: {
      first: event.prizeDistribution?.first || 0,
      second: event.prizeDistribution?.second || 0,
      third: event.prizeDistribution?.third || 0,
    },
    rules: event.rules || [] as { heading: string; content: string }[],
    structuredRules: event.structuredRules || [] as StructuredRule[],
    structure: event.structure || [] as StructuredRule[],
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
    console.log(name, fieldValue);
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
      rules: [...(prev.rules || []), { heading: "", content: "" }],
    }));
  }

  function removeRule(index: number) {
    setForm((prev) => ({
      ...prev,
      rules: prev.rules.filter((_, i) => i !== index),
    }));
  }

  function handleRuleChange(index: number, field: 'heading' | 'content', value: string) {
    setForm((prev) => {
      const updatedRules = [...(prev.rules || [])];
      updatedRules[index] = { ...updatedRules[index], [field]: value };
      return { ...prev, rules: updatedRules };
    });
  }

  function addStructuredRuleSection() {
    setForm((prev) => ({
      ...prev,
      structuredRules: [...(prev.structuredRules || []), { heading: "", content: [""] }],
    }));
  }

  function removeStructuredRuleSection(index: number) {
    setForm((prev) => ({
      ...prev,
      structuredRules: prev.structuredRules.filter((_, i) => i !== index),
    }));
  }

  function updateStructuredRuleHeading(sectionIndex: number, heading: string) {
    setForm((prev) => {
      const updatedStructuredRules = [...(prev.structuredRules || [])];
      updatedStructuredRules[sectionIndex].heading = heading;
      return { ...prev, structuredRules: updatedStructuredRules };
    });
  }

  function addStructuredRuleContent(sectionIndex: number) {
    setForm((prev) => {
      const updatedStructuredRules = [...(prev.structuredRules || [])];
      updatedStructuredRules[sectionIndex].content.push("");
      return { ...prev, structuredRules: updatedStructuredRules };
    });
  }

  function updateStructuredRuleContent(sectionIndex: number, contentIndex: number, value: string) {
    setForm((prev) => {
      const updatedStructuredRules = [...(prev.structuredRules || [])];
      updatedStructuredRules[sectionIndex].content[contentIndex] = value;
      return { ...prev, structuredRules: updatedStructuredRules };
    });
  }

  function removeStructuredRuleContent(sectionIndex: number, contentIndex: number) {
    setForm((prev) => {
      const updatedStructuredRules = [...(prev.structuredRules || [])];
      updatedStructuredRules[sectionIndex].content = updatedStructuredRules[sectionIndex].content.filter((_, i) => i !== contentIndex);
      return { ...prev, structuredRules: updatedStructuredRules };
    });
  }

  // Structure management functions
  function addStructureSection() {
    setForm((prev) => ({
      ...prev,
      structure: [...(prev.structure || []), { heading: "", content: [""] }],
    }));
  }

  function removeStructureSection(index: number) {
    setForm((prev) => ({
      ...prev,
      structure: prev.structure.filter((_, i) => i !== index),
    }));
  }

  function updateStructureHeading(sectionIndex: number, heading: string) {
    setForm((prev) => {
      const updatedStructure = [...(prev.structure || [])];
      updatedStructure[sectionIndex].heading = heading;
      return { ...prev, structure: updatedStructure };
    });
  }

  function addStructureContent(sectionIndex: number) {
    setForm((prev) => {
      const updatedStructure = [...(prev.structure || [])];
      updatedStructure[sectionIndex].content.push("");
      return { ...prev, structure: updatedStructure };
    });
  }

  function updateStructureContent(sectionIndex: number, contentIndex: number, value: string) {
    setForm((prev) => {
      const updatedStructure = [...(prev.structure || [])];
      updatedStructure[sectionIndex].content[contentIndex] = value;
      return { ...prev, structure: updatedStructure };
    });
  }

  function removeStructureContent(sectionIndex: number, contentIndex: number) {
    setForm((prev) => {
      const updatedStructure = [...(prev.structure || [])];
      updatedStructure[sectionIndex].content = updatedStructure[sectionIndex].content.filter((_, i) => i !== contentIndex);
      return { ...prev, structure: updatedStructure };
    });
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
            if (key === 'prizeDistribution' || key === 'contact' || key === 'rules' || key === 'structuredRules' || key === 'structure') {
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
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[#0a0a0a] border border-white/5 shadow-2xl w-[90vw] max-w-6xl max-h-[85vh] overflow-y-auto" data-lenis-prevent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white text-xl">
            <Upload className="h-5 w-5 text-blue-400" />
            Edit Event: {event.name}
          </DialogTitle>
          <DialogDescription className="text-gray-400 text-sm">
            Update the event details and configurations.
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
                  <option value="esports">Esports</option>
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
                  type="datetime-local"
                  value={form.eventDate}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="registrationDeadline">Registration Deadline</Label>
                <Input
                  id="registrationDeadline"
                  name="registrationDeadline"
                  type="datetime-local"
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
              <Label htmlFor="eventPhoto">Upload New Event Image</Label>
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
              <p className="text-xs text-gray-500">Leave empty to keep current image</p>
            </div>
          </div>

          {/* Rules */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Event Rules</h3>
              <div className="flex gap-2">
                <Button type="button" onClick={addRule} variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Simple Rule
                </Button>
                <Button type="button" onClick={addStructuredRuleSection} variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Section
                </Button>
              </div>
            </div>

            {/* Simple Rules */}
            {form.rules?.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-md font-medium text-gray-800 dark:text-gray-200">Simple Rules</h4>
                {form.rules.map((rule, index) => (
                  <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Rule {index + 1}</span>
                      <Button
                        type="button"
                        onClick={() => removeRule(index)}
                        variant="destructive"
                        size="sm"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <Input
                        value={rule.heading}
                        onChange={(e) => handleRuleChange(index, 'heading', e.target.value)}
                        placeholder="Rule heading (e.g., ROBOT SPECIFICATION:)"
                        className="font-semibold"
                      />
                      <Textarea
                        value={rule.content}
                        onChange={(e) => handleRuleChange(index, 'content', e.target.value)}
                        placeholder="Rule content..."
                        rows={3}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Structured Rules */}
            {form.structuredRules?.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-md font-medium text-gray-800 dark:text-gray-200">Structured Rules (Sections)</h4>
                {form.structuredRules.map((section, sectionIndex) => (
                  <div key={sectionIndex} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 mr-2">
                        <Label htmlFor={`section-heading-${sectionIndex}`}>Section Heading</Label>
                        <Input
                          id={`section-heading-${sectionIndex}`}
                          value={section.heading}
                          onChange={(e) => updateStructuredRuleHeading(sectionIndex, e.target.value)}
                          placeholder="e.g., JUDGING CRITERIA, GENERAL RULES"
                          className="font-semibold"
                        />
                      </div>
                      <Button
                        type="button"
                        onClick={() => removeStructuredRuleSection(sectionIndex)}
                        variant="destructive"
                        size="sm"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Rules in this section</Label>
                        <Button
                          type="button"
                          onClick={() => addStructuredRuleContent(sectionIndex)}
                          variant="outline"
                          size="sm"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Add Rule
                        </Button>
                      </div>
                      
                      {section.content.map((content, contentIndex) => (
                        <div key={contentIndex} className="flex items-center space-x-2">
                          <Textarea
                            value={content}
                            onChange={(e) => updateStructuredRuleContent(sectionIndex, contentIndex, e.target.value)}
                            placeholder={`Rule ${contentIndex + 1} in ${section.heading || 'this section'}`}
                            rows={2}
                            className="resize-none"
                          />
                          <Button
                            type="button"
                            onClick={() => removeStructuredRuleContent(sectionIndex, contentIndex)}
                            variant="destructive"
                            size="sm"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {form.rules?.length === 0 && form.structuredRules?.length === 0 && (
              <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                <p>No rules added yet. Click "Add Simple Rule" for basic rules or "Add Section" for organized rule sections.</p>
              </div>
            )}
          </div>

          {/* Event Structure */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Event Structure</h3>
              <Button type="button" onClick={addStructureSection} variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Structure Section
              </Button>
            </div>

            {form.structure?.length > 0 && (
              <div className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Add sections like "Event Rounds", "Technical Specifications", "Team Specifications", etc.
                </p>
                {form.structure.map((section, sectionIndex) => (
                  <div key={sectionIndex} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 mr-2">
                        <Label htmlFor={`structure-heading-${sectionIndex}`}>Section Heading</Label>
                        <Input
                          id={`structure-heading-${sectionIndex}`}
                          value={section.heading}
                          onChange={(e) => updateStructureHeading(sectionIndex, e.target.value)}
                          placeholder="e.g., Event Rounds, Technical Specifications, Team Specifications"
                          className="font-semibold"
                        />
                      </div>
                      <Button
                        type="button"
                        onClick={() => removeStructureSection(sectionIndex)}
                        variant="destructive"
                        size="sm"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Content in this section</Label>
                        <Button
                          type="button"
                          onClick={() => addStructureContent(sectionIndex)}
                          variant="outline"
                          size="sm"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Add Content
                        </Button>
                      </div>
                      
                      {section.content.map((content, contentIndex) => (
                        <div key={contentIndex} className="flex items-center space-x-2">
                          <Textarea
                            value={content}
                            onChange={(e) => updateStructureContent(sectionIndex, contentIndex, e.target.value)}
                            placeholder={`Content ${contentIndex + 1} for ${section.heading || 'this section'}`}
                            rows={3}
                            className="resize-none"
                          />
                          <Button
                            type="button"
                            onClick={() => removeStructureContent(sectionIndex, contentIndex)}
                            variant="destructive"
                            size="sm"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {form.structure?.length === 0 && (
              <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                <p>No structure sections added yet. Click "Add Structure Section" to organize event information like rounds, specifications, etc.</p>
              </div>
            )}
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
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-2 justify-end pt-6 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium rounded-lg border transition-all duration-200 bg-blue-500/20 border-blue-500/30 text-blue-400 hover:bg-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Updating..." : "Update Event"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
