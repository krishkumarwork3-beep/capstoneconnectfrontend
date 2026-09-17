"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft,
  Sparkles,
  Plus,
  X,
  ArrowRight,
} from "lucide-react";
import { createGroup } from "@/lib/api/groups";
import { useAuth } from "@/lib/context/auth-context";

const DOMAINS = [
  "Robotics & Computer Vision",
  "Biomedical & Edge AI",
  "Aerospace & Embedded Systems",
  "CleanTech & Power Electronics",
  "Cryptography & Web3",
  "Quantum Computing & Web Graphics",
  "Autonomous Vehicles & SLAM",
  "Indic NLP & Generative AI",
];

export default function CreateGroupPage() {
  const router = useRouter();
  const { user, refreshUser } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    domain: DOMAINS[0],
    description: "",
    max_members: 4,
  });

  const [requirements, setRequirements] = useState<string[]>(["C++", "ROS 2"]);
  const [skillInput, setSkillInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddRequirement = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ("key" in e && e.key !== "Enter") return;
    e.preventDefault();
    if (!skillInput.trim()) return;
    if (!requirements.includes(skillInput.trim())) {
      setRequirements([...requirements, skillInput.trim()]);
    }
    setSkillInput("");
  };

  const handleRemoveRequirement = (req: string) => {
    setRequirements(requirements.filter((r) => r !== req));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError("Please log in first to create a capstone team.");
      return;
    }
    if (requirements.length === 0) {
      setError("Please specify at least one skill requirement for your capstone project.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const newGroup = await createGroup(user.id, {
        name: formData.name,
        domain: formData.domain,
        description: formData.description,
        max_members: Number(formData.max_members),
        requirements,
      });
      await refreshUser();
      router.push(`/groups/${newGroup.id}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to create capstone group";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <Link
          href="/groups"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5C6461] dark:text-[#8C9490] hover:text-[#181C1B] dark:hover:text-[#F3F5F4] transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Groups</span>
        </Link>
      </div>

      <div className="bg-white dark:bg-[#161B19] rounded-2xl border border-[#E7E5DF] dark:border-[#293430] p-6 sm:p-8 shadow-xs space-y-6">
        <div className="space-y-1.5 pb-4 border-b border-[#F0EFEA] dark:border-[#222B27]">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-[#FAF8F5] dark:bg-[#1D2421] text-[#153E35] dark:text-[#5CE08D] border border-[#E7E5DF] dark:border-[#293430]">
            <Sparkles className="w-3.5 h-3.5 text-[#B8532F] dark:text-[#FF8D66]" />
            <span>Launch Capstone Collaboration</span>
          </div>
          <h1 className="font-serif-heading text-2xl font-bold text-[#181C1B] dark:text-[#F3F5F4]">
            Register a New Capstone Project
          </h1>
          <p className="text-xs text-[#5C6461] dark:text-[#B0B9B6]">
            Define project scope, configure team size limit, and broadcast skill requirements to recruit student partners.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-[#FAF1EC] dark:bg-[#3D1A10] border border-[#F5D7C7] dark:border-[#5A2616] text-xs text-[#8C4020] dark:text-[#FF8D66]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Project Title */}
          <div>
            <label className="block text-xs font-semibold text-[#181C1B] dark:text-[#F3F5F4] mb-1.5">
              Capstone Project Title
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Autonomous Precision Weed-Detection Rover"
              className="w-full px-3 py-2 text-xs sm:text-sm bg-[#FAF8F5] dark:bg-[#1D2421] border border-[#E7E5DF] dark:border-[#293430] rounded-xl focus:border-[#153E35] dark:focus:border-[#5CE08D] focus:outline-hidden text-[#181C1B] dark:text-[#F3F5F4]"
            />
          </div>

          {/* Domain & Max Members */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#181C1B] dark:text-[#F3F5F4] mb-1.5">
                Primary Domain / Field
              </label>
              <select
                value={formData.domain}
                onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-[#FAF8F5] dark:bg-[#1D2421] border border-[#E7E5DF] dark:border-[#293430] rounded-xl focus:border-[#153E35] dark:focus:border-[#5CE08D] focus:outline-hidden text-[#181C1B] dark:text-[#F3F5F4] cursor-pointer"
              >
                {DOMAINS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#181C1B] dark:text-[#F3F5F4] mb-1.5">
                Maximum Team Capacity
              </label>
              <select
                value={formData.max_members}
                onChange={(e) => setFormData({ ...formData, max_members: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-[#FAF8F5] dark:bg-[#1D2421] border border-[#E7E5DF] dark:border-[#293430] rounded-xl focus:border-[#153E35] dark:focus:border-[#5CE08D] focus:outline-hidden text-[#181C1B] dark:text-[#F3F5F4] cursor-pointer"
              >
                <option value={2}>2 Members (Tightly focused pair)</option>
                <option value={3}>3 Members</option>
                <option value={4}>4 Members (Standard capstone team)</option>
                <option value={5}>5 Members</option>
                <option value={6}>6 Members (Cross-departmental)</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-[#181C1B] dark:text-[#F3F5F4] mb-1.5">
              Project Abstract & Scope
            </label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Outline the core engineering challenge, hardware/software architecture, conference or thesis goals, and what parts are currently in progress."
              className="w-full p-3 text-xs sm:text-sm bg-[#FAF8F5] dark:bg-[#1D2421] border border-[#E7E5DF] dark:border-[#293430] rounded-xl focus:border-[#153E35] dark:focus:border-[#5CE08D] focus:outline-hidden text-[#181C1B] dark:text-[#F3F5F4] resize-none"
            />
          </div>

          {/* Requirements Tags */}
          <div>
            <label className="block text-xs font-semibold text-[#181C1B] dark:text-[#F3F5F4] mb-1.5">
              Required Skills & Technologies for Recruits
            </label>
            <div className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleAddRequirement}
                placeholder="e.g. PyTorch, Embedded C, ROS 2, PCB Design"
                className="flex-1 px-3 py-2 text-xs sm:text-sm bg-[#FAF8F5] dark:bg-[#1D2421] border border-[#E7E5DF] dark:border-[#293430] rounded-xl focus:border-[#153E35] dark:focus:border-[#5CE08D] focus:outline-hidden text-[#181C1B] dark:text-[#F3F5F4]"
              />
              <button
                type="button"
                onClick={handleAddRequirement}
                className="inline-flex items-center gap-1 px-3.5 py-2 text-xs font-semibold text-[#153E35] dark:text-[#5CE08D] bg-[#EDF5F2] dark:bg-[#1C332B] hover:bg-[#DCEDE7] dark:hover:bg-[#234539] rounded-xl transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {requirements.map((req) => (
                <span
                  key={req}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-[#FAF8F5] dark:bg-[#1D2421] text-[#181C1B] dark:text-[#F3F5F4] border border-[#E7E5DF] dark:border-[#293430]"
                >
                  <span>{req}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveRequirement(req)}
                    className="text-[#8C9490] hover:text-[#B8532F] dark:hover:text-[#FF8D66]"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-[#F0EFEA] dark:border-[#222B27]">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#153E35] dark:bg-[#225C50] hover:bg-[#0E2B25] dark:hover:bg-[#2B7364] transition-colors cursor-pointer shadow-xs disabled:opacity-60"
            >
              <span>{loading ? "Creating Capstone..." : "Publish & Open for Recruitment"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
