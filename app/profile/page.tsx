"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  User as UserIcon,
  GraduationCap,
  Calendar,
  Phone,
  Save,
  CheckCircle2,
  ExternalLink,
  Shield,
  Plus,
  X,
} from "lucide-react";
import { GitHubIcon } from "@/components/ui/icons";
import { useAuth } from "@/lib/context/auth-context";
import { updateUser, uploadResume } from "@/lib/api/users";
import { ResumeUploadField } from "@/components/profile/ResumeUploadField";
import { getAvatarColor, getInitials } from "@/lib/utils";

const COLLEGES = [
  "IIT Bombay",
  "BITS Pilani",
  "NIT Trichy",
  "IIIT Hyderabad",
  "COEP Pune",
  "IIT Madras",
  "DTU Delhi",
  "RVCE Bangalore",
  "Jadavpur University",
  "IIT Delhi",
  "Other Institution",
];

export default function OwnProfilePage() {
  const { user, refreshUser } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    college: "",
    department: "",
    passing_year: 2026,
    phone: "",
    bio: "",
    github_url: "",
    skills: [] as string[],
  });

  const [skillInput, setSkillInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        college: user.college || "IIT Bombay",
        department: user.department || "",
        passing_year: user.passing_year || 2026,
        phone: user.phone || "",
        bio: user.bio || "",
        github_url: user.github_url || "",
        skills: user.skills || [],
      });
    }
  }, [user]);

  const handleAddSkill = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ("key" in e && e.key !== "Enter") return;
    e.preventDefault();
    if (!skillInput.trim()) return;
    if (!formData.skills.includes(skillInput.trim())) {
      setFormData({ ...formData, skills: [...formData.skills, skillInput.trim()] });
    }
    setSkillInput("");
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((s) => s !== skillToRemove),
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setSavedSuccess(false);
    try {
      await updateUser(user.id, {
        name: formData.name,
        college: formData.college,
        department: formData.department,
        passing_year: Number(formData.passing_year),
        bio: formData.bio,
        github_url: formData.github_url,
        skills: formData.skills,
      });
      await refreshUser();
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleResumeUpload = async (file: File) => {
    if (!user) return;
    await uploadResume(user.id, file);
    await refreshUser();
  };

  if (!user) {
    return (
      <div className="text-center py-16">
        <p className="text-sm text-[#5C6461]">Loading profile...</p>
      </div>
    );
  }

  const avatarStyle = getAvatarColor(user.id);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-[#E7E5DF] p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xs">
        <div className="flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center font-serif-heading font-bold text-2xl border shadow-2xs"
            style={{
              backgroundColor: avatarStyle.bg,
              color: avatarStyle.text,
              borderColor: avatarStyle.border,
            }}
          >
            {getInitials(user.name)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif-heading text-2xl font-bold text-[#181C1B]">
                {user.name}
              </h1>
              {user.group_role && (
                <span className="text-xs px-2 py-0.5 rounded bg-[#FAF1EC] text-[#B8532F] font-semibold border border-[#F5D7C7] capitalize">
                  {user.group_role}
                </span>
              )}
            </div>
            <p className="text-xs text-[#5C6461] mt-0.5">
              {user.college} • Class of &apos;{String(user.passing_year).slice(-2)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/profile/${user.id}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#181C1B] bg-[#FAF8F5] border border-[#E7E5DF] hover:bg-[#F5F4F0] rounded-xl transition-colors cursor-pointer"
          >
            <span>View Public Profile</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#8C9490]" />
          </Link>
        </div>
      </div>

      {/* Edit Profile Form */}
      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-[#E7E5DF] p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#F0EFEA]">
          <div>
            <h2 className="font-serif-heading text-lg font-semibold text-[#181C1B]">
              Edit Personal & Academic Details
            </h2>
            <p className="text-xs text-[#5C6461]">
              Keep your profile updated so capstone recruiters and project leads can discover your skills.
            </p>
          </div>

          {savedSuccess && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#1B5E33] bg-[#EBF7EE] px-3 py-1.5 rounded-lg border border-[#C8EBD1]">
              <CheckCircle2 className="w-4 h-4" />
              Saved successfully
            </span>
          )}
        </div>

        {/* Row 1: Name & Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#181C1B] mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-[#FAF8F5] border border-[#E7E5DF] rounded-xl focus:border-[#153E35] focus:outline-hidden text-[#181C1B]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#181C1B] mb-1.5">
              Contact Phone (read-only)
            </label>
            <input
              type="text"
              disabled
              value={formData.phone}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-[#F5F4F0] border border-[#E7E5DF] rounded-xl text-[#8C9490] cursor-not-allowed"
            />
          </div>
        </div>

        {/* Row 2: College, Department, Passing Year */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#181C1B] mb-1.5">
              College / University
            </label>
            <select
              value={formData.college}
              onChange={(e) => setFormData({ ...formData, college: e.target.value })}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-[#FAF8F5] border border-[#E7E5DF] rounded-xl focus:border-[#153E35] focus:outline-hidden text-[#181C1B] cursor-pointer"
            >
              {COLLEGES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#181C1B] mb-1.5">
              Department / Major
            </label>
            <input
              type="text"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              placeholder="e.g. Computer Science & Engg"
              className="w-full px-3 py-2 text-xs sm:text-sm bg-[#FAF8F5] border border-[#E7E5DF] rounded-xl focus:border-[#153E35] focus:outline-hidden text-[#181C1B]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#181C1B] mb-1.5">
              Passing Year
            </label>
            <select
              value={formData.passing_year}
              onChange={(e) => setFormData({ ...formData, passing_year: Number(e.target.value) })}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-[#FAF8F5] border border-[#E7E5DF] rounded-xl focus:border-[#153E35] focus:outline-hidden text-[#181C1B] cursor-pointer"
            >
              <option value={2024}>2024</option>
              <option value={2025}>2025</option>
              <option value={2026}>2026</option>
              <option value={2027}>2027</option>
              <option value={2028}>2028</option>
            </select>
          </div>
        </div>

        {/* Bio */}
        <div>
          <label className="block text-xs font-semibold text-[#181C1B] mb-1.5">
            Technical Bio / Research Focus
          </label>
          <textarea
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            rows={3}
            placeholder="Describe what you specialize in, what problems you want to solve for your capstone project, and what roles you are seeking."
            className="w-full p-3 text-xs sm:text-sm bg-[#FAF8F5] border border-[#E7E5DF] rounded-xl focus:border-[#153E35] focus:outline-hidden text-[#181C1B] resize-none"
          />
        </div>

        {/* GitHub Link */}
        <div>
          <label className="block text-xs font-semibold text-[#181C1B] mb-1.5">
            GitHub Profile URL
          </label>
          <div className="relative">
            <GitHubIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C9490]" />
            <input
              type="url"
              value={formData.github_url}
              onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
              placeholder="https://github.com/your-username"
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-[#FAF8F5] border border-[#E7E5DF] rounded-xl focus:border-[#153E35] focus:outline-hidden text-[#181C1B]"
            />
          </div>
          <p className="text-[11px] text-[#8C9490] mt-1">
            We display your featured capstone repos, commit stats, and language distribution on your public profile.
          </p>
        </div>

        {/* Skills Tag Manager */}
        <div>
          <label className="block text-xs font-semibold text-[#181C1B] mb-1.5">
            Key Technical Skills & Tools
          </label>
          <div className="flex items-center gap-2 mb-2.5">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleAddSkill}
              placeholder="Type a skill (e.g. ROS 2, PyTorch, C++) and press Enter"
              className="flex-1 px-3 py-2 text-xs sm:text-sm bg-[#FAF8F5] border border-[#E7E5DF] rounded-xl focus:border-[#153E35] focus:outline-hidden text-[#181C1B]"
            />
            <button
              type="button"
              onClick={handleAddSkill}
              className="inline-flex items-center gap-1 px-3.5 py-2 text-xs font-semibold text-[#153E35] bg-[#EDF5F2] hover:bg-[#DCEDE7] rounded-xl transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Add
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {formData.skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-[#FAF8F5] text-[#181C1B] border border-[#E7E5DF]"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="text-[#8C9490] hover:text-[#B8532F]"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Resume Upload Field */}
        <div className="pt-2 border-t border-[#F0EFEA]">
          <ResumeUploadField
            currentResumeUrl={user.resume_url}
            onUpload={handleResumeUpload}
          />
        </div>

        {/* Save CTA */}
        <div className="flex justify-end pt-4 border-t border-[#F0EFEA]">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#153E35] hover:bg-[#0E2B25] transition-colors cursor-pointer shadow-xs disabled:opacity-60"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saving Changes..." : "Save Profile Updates"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
