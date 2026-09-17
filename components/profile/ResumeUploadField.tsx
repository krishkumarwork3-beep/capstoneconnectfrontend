"use client";

import React, { useState, useRef } from "react";
import { FileUp, FileText, CheckCircle2, AlertCircle, Download } from "lucide-react";

interface ResumeUploadFieldProps {
  currentResumeUrl?: string;
  onUpload: (file: File) => Promise<void>;
  disabled?: boolean;
}

export function ResumeUploadField({
  currentResumeUrl,
  onUpload,
  disabled = false,
}: ResumeUploadFieldProps) {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      return "Only PDF resumes are supported.";
    }
    const MAX_SIZE_MB = 5;
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      return `Resume file must be under ${MAX_SIZE_MB}MB (yours is ${(file.size / (1024 * 1024)).toFixed(1)}MB).`;
    }
    return null;
  };

  const handleFile = async (file: File) => {
    setError(null);
    setSuccess(false);
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setSelectedFile(file);
    setIsUploading(true);
    try {
      await onUpload(file);
      setSuccess(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to upload resume";
      setError(msg);
    } finally {
      setIsUploading(false);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-[#5C6461] dark:text-[#8C9490]">
          Academic & Technical Resumé (PDF)
        </label>
        {currentResumeUrl && (
          <a
            href={currentResumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-medium text-[#153E35] dark:text-[#5CE08D] hover:underline"
          >
            <Download className="w-3 h-3" />
            Download Current Resumé
          </a>
        )}
      </div>

      {/* Drag & Drop Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer ${
          dragOver
            ? "border-[#153E35] dark:border-[#5CE08D] bg-[#EDF5F2] dark:bg-[#1C332B]"
            : "border-[#E7E5DF] dark:border-[#293430] hover:border-[#D1CEBE] dark:hover:border-[#384842] bg-[#FAF8F5] dark:bg-[#1D2421]"
        } ${disabled ? "opacity-50 pointer-events-none" : ""}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFile(e.target.files[0]);
            }
          }}
        />

        <div className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-white dark:bg-[#161B19] border border-[#E7E5DF] dark:border-[#293430] flex items-center justify-center text-[#153E35] dark:text-[#5CE08D] mb-2 shadow-2xs">
            <FileUp className="w-5 h-5" />
          </div>
          <p className="text-xs font-semibold text-[#181C1B] dark:text-[#F3F5F4]">
            {isUploading ? "Uploading resumé..." : "Drag and drop your PDF resumé here, or browse"}
          </p>
          <p className="text-[11px] text-[#8C9490] dark:text-[#7A8883] mt-1">
            Max file size 5MB • Standard PDF format only
          </p>
        </div>
      </div>

      {/* Upload status feedback */}
      {selectedFile && (
        <div className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-[#161B19] border border-[#E7E5DF] dark:border-[#293430] text-xs">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#153E35] dark:text-[#5CE08D]" />
            <span className="font-medium text-[#181C1B] dark:text-[#F3F5F4]">{selectedFile.name}</span>
            <span className="text-[#8C9490] dark:text-[#7A8883]">({(selectedFile.size / 1024).toFixed(0)} KB)</span>
          </div>
          {success && (
            <span className="inline-flex items-center gap-1 text-[#1B5E33] dark:text-[#5CE08D] font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Uploaded
            </span>
          )}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[#FAF1EC] dark:bg-[#3D1A10] border border-[#F5D7C7] dark:border-[#5A2616] text-xs text-[#8C4020] dark:text-[#FF8D66]">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
