"use client";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, X, AlertCircle } from "lucide-react";
import Image from "next/image";

interface PaymentUploadModalProps {
  open: boolean;
  onClose: () => void;
  onUpload: (screenshotUrl: string, transactionId: string) => Promise<void>;
  workshopName: string;
  entryFee: number;
}

export default function PaymentUploadModal({
  open,
  onClose,
  onUpload,
  workshopName,
  entryFee
}: PaymentUploadModalProps) {
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [screenshotUrl, setScreenshotUrl] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [error, setError] = useState("");
  const [uploadMethod, setUploadMethod] = useState<"url" | "file">("url");

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB");
        return;
      }
      // Check file type
      if (!file.type.startsWith("image/")) {
        setError("Please upload an image file");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setError("");
    }
  }

  async function handleSubmit() {
    if (uploadMethod === "url" && !screenshotUrl.trim()) {
      setError("Please enter payment screenshot URL");
      return;
    }
    if (uploadMethod === "file" && !imageFile) {
      setError("Please select a payment screenshot");
      return;
    }
    if (!transactionId.trim()) {
      setError("Please enter transaction ID");
      return;
    }

    setUploading(true);
    setError("");

    try {
      let finalUrl = screenshotUrl;

      // If uploading file, upload to Cloudinary first
      if (uploadMethod === "file" && imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("upload_preset", "ml_default"); // You can configure this in your Cloudinary settings

        const cloudinaryResponse = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!cloudinaryResponse.ok) {
          throw new Error("Failed to upload image to Cloudinary");
        }

        const cloudinaryData = await cloudinaryResponse.json();
        finalUrl = cloudinaryData.secure_url;
      }

      await onUpload(finalUrl, transactionId);
      onClose();
      // Reset form
      setImageFile(null);
      setImagePreview("");
      setScreenshotUrl("");
      setTransactionId("");
    } catch (err: any) {
      setError(err.message || "Failed to upload payment proof");
    } finally {
      setUploading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[#0a0a0a] border border-white/5 shadow-2xl w-[90vw] max-w-2xl max-h-[85vh] overflow-y-auto" data-lenis-prevent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white text-xl">
            <Upload className="h-5 w-5 text-[#33ABB9]" />
            Upload Payment Proof
          </DialogTitle>
          <DialogDescription className="text-gray-400 text-sm">
            Upload payment screenshot for workshop: <span className="text-[#33ABB9] font-bold">{workshopName}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Payment Details */}
          <div className="bg-white/5 border border-white/10 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Workshop Fee:</span>
              <span className="text-2xl font-bold text-[#33ABB9]">₹{entryFee}</span>
            </div>
          </div>

          {/* Info banner */}
          <div className="bg-blue-600/10 border border-blue-500/30 rounded-lg p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
            <div className="text-sm text-blue-300">
              <p className="font-semibold mb-1">Payment Instructions:</p>
              <ul className="list-disc list-inside space-y-1 text-blue-200">
                <li>Complete the payment via UPI/Bank Transfer</li>
                <li>Take a screenshot of the payment confirmation</li>
                <li>Enter your transaction ID below</li>
                <li>Upload the screenshot to complete registration</li>
              </ul>
            </div>
          </div>

          {/* Upload Method Toggle */}
          <div className="space-y-2">
            <Label className="text-white">Upload Method</Label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setUploadMethod("url")}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  uploadMethod === "url"
                    ? "bg-[#33ABB9]/20 border-[#33ABB9] text-[#33ABB9]"
                    : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                }`}
              >
                Image URL
              </button>
              <button
                type="button"
                onClick={() => setUploadMethod("file")}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  uploadMethod === "file"
                    ? "bg-[#33ABB9]/20 border-[#33ABB9] text-[#33ABB9]"
                    : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                }`}
              >
                Upload File
              </button>
            </div>
          </div>

          {/* URL Input */}
          {uploadMethod === "url" && (
            <div className="space-y-2">
              <Label htmlFor="screenshotUrl" className="text-white">
                Payment Screenshot URL *
              </Label>
              <input
                id="screenshotUrl"
                type="url"
                value={screenshotUrl}
                onChange={(e) => setScreenshotUrl(e.target.value)}
                placeholder="https://example.com/payment-screenshot.jpg"
                className="flex h-10 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#33ABB9] focus:border-[#33ABB9]"
              />
            </div>
          )}

          {/* File Upload */}
          {uploadMethod === "file" && (
            <div className="space-y-2">
              <Label htmlFor="screenshotFile" className="text-white">
                Payment Screenshot (Max 5MB) *
              </Label>
              <div className="flex flex-col gap-4">
                <label
                  htmlFor="screenshotFile"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/20 rounded-lg cursor-pointer bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-400">
                      <span className="font-semibold text-[#33ABB9]">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG, JPEG (MAX. 5MB)</p>
                  </div>
                  <input
                    id="screenshotFile"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>

                {imagePreview && (
                  <div className="relative w-full h-64 rounded-lg overflow-hidden border border-white/10">
                    <Image
                      src={imagePreview}
                      alt="Payment screenshot preview"
                      fill
                      className="object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview("");
                      }}
                      className="absolute top-2 right-2 p-1 bg-red-500/80 hover:bg-red-500 rounded-full"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Transaction ID Input */}
          <div className="space-y-2">
            <Label htmlFor="transactionId" className="text-white">
              Transaction ID / UPI Reference Number *
            </Label>
            <input
              id="transactionId"
              type="text"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              placeholder="Enter your payment transaction ID"
              className="flex h-10 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#33ABB9] focus:border-[#33ABB9]"
            />
          </div>

          {error && (
            <div className="bg-red-600/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-white/10">
          <Button
            type="button"
            onClick={onClose}
            variant="outline"
            disabled={uploading}
            className="bg-transparent border-white/10 text-gray-400 hover:text-white hover:bg-white/5"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={uploading || !transactionId.trim() || (uploadMethod === "url" ? !screenshotUrl.trim() : !imageFile)}
            className="bg-[#33ABB9] text-black hover:bg-[#2a9aa5] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? "Uploading..." : "Submit Payment Proof"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
