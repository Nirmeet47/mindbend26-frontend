"use client";
import React, { useState } from "react";
import { workshopsApi } from "../../lib/dashboardApi";
import Image from "next/image";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, X, Upload } from "lucide-react";

interface AddWorkshopModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddWorkshopModal({ open, onClose, onSuccess }: AddWorkshopModalProps) {
  const [form, setForm] = useState({
    name: "",
    slug: "",
    entryFee: 0,
    isFree: true,
    aboutWorkshop: "",
    prerequisites: [] as string[],
    registrationDeadline: "",
    workshopDate: "",
    venue: "",
    workshopPhoto: "",
    hideWorkshop: false,
    stopRegistration: false,
    contact: [] as { name: string; whatsappNo: string }[],
    whatsappGrpLink: "",
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

  function updateContact(index: number, field: "name" | "whatsappNo", value: string) {
    setForm((prev) => {
      const updatedContact = [...prev.contact];
      updatedContact[index] = { ...updatedContact[index], [field]: value };
      return { ...prev, contact: updatedContact };
    });
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

  function addPrerequisite() {
    setForm((prev) => ({
      ...prev,
      prerequisites: [...prev.prerequisites, ""],
    }));
  }

  function removePrerequisite(index: number) {
    setForm((prev) => ({
      ...prev,
      prerequisites: prev.prerequisites.filter((_, i) => i !== index),
    }));
  }

  function updatePrerequisite(index: number, value: string) {
    setForm((prev) => {
      const updatedPrereqs = [...prev.prerequisites];
      updatedPrereqs[index] = value;
      return { ...prev, prerequisites: updatedPrereqs };
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key !== 'workshopPhoto') {
          if (key === 'contact' || key === 'prerequisites') {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, String(value));
          }
        }
      });
      
      if (imageFile) {
        formData.append('workshopPhoto', imageFile);
      }
      
      await workshopsApi.create(formData);
      onSuccess();
      onClose();
      
      // Reset form
      setForm({
        name: "",
        slug: "",
        entryFee: 0,
        isFree: true,
        aboutWorkshop: "",
        prerequisites: [],
        registrationDeadline: "",
        workshopDate: "",
        venue: "",
        workshopPhoto: "",
        hideWorkshop: false,
        stopRegistration: false,
        contact: [],
        whatsappGrpLink: "",
      });
      setImageFile(null);
      setImagePreview("");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to create workshop");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[#0a0a0a] border border-white/5 shadow-2xl w-[90vw] max-w-6xl max-h-[85vh] overflow-y-auto" data-lenis-prevent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white text-xl">
            <Plus className="h-5 w-5 text-green-400" />
            Add New Workshop
          </DialogTitle>
          <DialogDescription className="text-gray-400 text-sm">
            Create a new workshop with all necessary details and configurations.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Workshop Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter workshop name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug *</Label>
                <Input
                  id="slug"
                  name="slug"
                  value={form.slug}
                  onChange={handleChange}
                  placeholder="workshop-url-slug"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="venue">Venue</Label>
              <Input
                id="venue"
                name="venue"
                value={form.venue}
                onChange={handleChange}
                placeholder="Workshop venue"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="aboutWorkshop">About Workshop</Label>
              <Textarea
                id="aboutWorkshop"
                name="aboutWorkshop"
                value={form.aboutWorkshop}
                onChange={handleChange}
                placeholder="Describe the workshop..."
                rows={3}
              />
            </div>
          </div>

          {/* Financial Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Financial Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <div className="flex items-center space-x-2 pt-8">
                <input
                  type="checkbox"
                  id="isFree"
                  name="isFree"
                  checked={form.isFree}
                  onChange={handleChange}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="isFree">Free Workshop (Free for all users)</Label>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Important Dates</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="workshopDate">Workshop Date</Label>
                <Input
                  id="workshopDate"
                  name="workshopDate"
                  type="date"
                  value={form.workshopDate}
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

          {/* Prerequisites */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Prerequisites</h3>
              <Button type="button" onClick={addPrerequisite} variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Prerequisite
              </Button>
            </div>
            
            {form.prerequisites.length > 0 && (
              <div className="space-y-2">
                {form.prerequisites.map((prereq, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={prereq}
                      onChange={(e) => updatePrerequisite(index, e.target.value)}
                      placeholder={`Prerequisite ${index + 1}`}
                    />
                    <Button
                      type="button"
                      onClick={() => removePrerequisite(index)}
                      variant="destructive"
                      size="sm"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {form.prerequisites.length === 0 && (
              <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                <p>No prerequisites added yet. Click "Add Prerequisite" to add one.</p>
              </div>
            )}
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
                    value={contact.name}
                    onChange={(e) => updateContact(index, "name", e.target.value)}
                    placeholder="Contact person name"
                  />
                </div>
                <div className="space-y-2 flex items-end">
                  <div className="flex-1">
                    <Label htmlFor={`contact-whatsapp-${index}`}>WhatsApp Number</Label>
                    <Input
                      id={`contact-whatsapp-${index}`}
                      value={contact.whatsappNo}
                      onChange={(e) => updateContact(index, "whatsappNo", e.target.value)}
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
          </div>

          {/* Workshop Photo */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Workshop Photo</h3>
            {imagePreview && (
              <div className="relative w-full h-48 rounded-lg border border-gray-300 dark:border-gray-700 overflow-hidden">
                <Image
                  src={imagePreview}
                  alt="Workshop Preview"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="workshopPhoto">Upload Workshop Image</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="workshopPhoto"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-gray-700 dark:file:text-gray-200"
                />
                <Upload className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Workshop Visibility */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Workshop Visibility</h3>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="hideWorkshop"
                  name="hideWorkshop"
                  checked={form.hideWorkshop}
                  onChange={handleChange}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="hideWorkshop">Hide Workshop</Label>
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
              className="px-4 py-2 text-sm font-medium rounded-lg border transition-all duration-200 bg-green-500/20 border-green-500/30 text-green-400 hover:bg-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating..." : "Create Workshop"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
