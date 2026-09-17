"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Shield,
  Layers,
  ArrowRight,
  CheckCircle2,
  Send,
} from "lucide-react";
import { Group } from "@/lib/types";
import { useAuth } from "@/lib/context/auth-context";
import { CapacityBar } from "./CapacityBar";
import { sendJoinRequest } from "@/lib/api/requests";
import { getAvatarColor, getInitials } from "@/lib/utils";

interface GroupCardProps {
  group: Group;
  variant?: "discover" | "my-groups";
  onRequestSuccess?: () => void;
}

export function GroupCard({ group, variant = "discover", onRequestSuccess }: GroupCardProps) {
  const { user } = useAuth();
  const [isRequesting, setIsRequesting] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [note, setNote] = useState("");

  const currentCount = group.members.length;
  const isFull = currentCount >= group.max_members;
  const isMember = user ? group.members.some((m) => m.user_id === user.id) : false;
  const isAdmin = user ? group.members.some((m) => m.user_id === user.id && m.role === "admin") : false;

  const handleJoinRequest = async () => {
    if (!user) return;
    setIsRequesting(true);
    try {
      await sendJoinRequest(group.id, user.id, note || `Hi, I'd like to join ${group.name}!`);
      setRequestSent(true);
      setShowModal(false);
      onRequestSuccess?.();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to submit join request";
      alert(msg);
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <div
      className={`bg-white dark:bg-[#161B19] rounded-xl border border-stone-200 dark:border-[#293430] shadow-xs hover:shadow-md hover:border-stone-300 dark:hover:border-[#384842] transition-all duration-200 p-6 flex flex-col justify-between ${
        isFull && variant === "discover"
          ? "opacity-85 bg-[#FAF9F6] dark:bg-[#1A211E]"
          : ""
      }`}
    >
      <div>
        {/* Top Header: Domain Badge & Admin/Member Badge */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#FAF8F5] dark:bg-[#1D2421] text-[#153E35] dark:text-[#5CE08D] border border-[#E2E0D7] dark:border-[#293430]">
            <Layers className="w-3 h-3 text-[#153E35] dark:text-[#5CE08D]" />
            <span className="font-semibold">{group.domain}</span>
          </span>

          {isAdmin ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-[#FAF1EC] dark:bg-[#3D1A10] text-[#B8532F] dark:text-[#FF8D66] border border-[#F5D7C7] dark:border-[#5A2616]">
              <Shield className="w-3 h-3" />
              You&apos;re Admin
            </span>
          ) : isMember ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-[#F0F4F8] dark:bg-[#142333] text-[#24425F] dark:text-[#7EB5E6] border border-[#CBDCEB] dark:border-[#1F3D5C]">
              Member
            </span>
          ) : null}
        </div>

        {/* Group Name & Description */}
        <Link
          href={`/groups/${group.id}`}
          className="font-serif-heading text-lg font-semibold text-[#181C1B] dark:text-[#F3F5F4] hover:text-[#153E35] dark:hover:text-[#5CE08D] transition-colors block mb-2"
        >
          {group.name}
        </Link>
        <p className="text-xs sm:text-sm text-[#3F4744] dark:text-[#B0B9B6] line-clamp-3 mb-4 leading-relaxed">
          {group.description}
        </p>

        {/* Requirements Tags */}
        <div className="space-y-1.5 mb-5">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-[#8C9490] dark:text-[#7A8883]">
            Looking for skills:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {group.requirements.map((req) => (
              <span
                key={req}
                className="inline-flex items-center bg-stone-100 dark:bg-[#222B27] text-stone-800 dark:text-[#E2E6E4] border border-stone-200 dark:border-[#2F3C37] font-medium text-xs px-2.5 py-1 rounded-md"
              >
                {req}
              </span>
            ))}
          </div>
        </div>

        {/* Members mini avatar row */}
        <div className="space-y-1.5 mb-4">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2 overflow-hidden">
              {group.members.map((member) => {
                const color = getAvatarColor(member.user_id);
                return (
                  <div
                    key={member.user_id}
                    title={`${member.name} (${member.college})`}
                    className="inline-block h-7 w-7 rounded-full text-[10px] font-bold flex items-center justify-center border-2 border-white dark:border-[#161B19] ring-1 ring-[#E7E5DF] dark:ring-[#293430]"
                    style={{ backgroundColor: color.bg, color: color.text }}
                  >
                    {getInitials(member.name)}
                  </div>
                );
              })}
            </div>
            <span className="text-xs text-[#5C6461] dark:text-[#8C9490]">
              Lead: <strong className="text-[#181C1B] dark:text-[#F3F5F4]">{group.members[0]?.name}</strong> ({group.members[0]?.college})
            </span>
          </div>
        </div>

        {/* Capacity Indicator */}
        <CapacityBar current={currentCount} max={group.max_members} className="mb-4" />
      </div>

      {/* Action Footer */}
      <div className="pt-3.5 border-t border-[#F0EFEA] dark:border-[#222B27] flex items-center justify-between gap-3">
        <Link
          href={`/groups/${group.id}`}
          className="text-xs font-medium text-[#181C1B] dark:text-[#F3F5F4] hover:text-[#153E35] dark:hover:text-[#5CE08D] flex items-center gap-1 transition-colors"
        >
          <span>View Team & Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>

        <div>
          {isMember ? (
            <Link
              href={`/groups/${group.id}`}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#153E35] dark:text-[#5CE08D] bg-[#EDF5F2] dark:bg-[#1C332B] hover:bg-[#DCEDE7] dark:hover:bg-[#234539] transition-colors"
            >
              <span>Manage Group</span>
            </Link>
          ) : requestSent ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-[#EBF7EE] dark:bg-[#153320] text-[#1B5E33] dark:text-[#5CE08D] border border-[#C8EBD1] dark:border-[#235C37]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Request Sent
            </span>
          ) : isFull ? (
            <span className="text-xs text-[#8C9490] font-medium px-2 py-1 bg-[#FAF8F5] dark:bg-[#1D2421] rounded border border-[#E7E5DF] dark:border-[#293430]">
              Team Full
            </span>
          ) : (
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#153E35] dark:bg-[#225C50] hover:bg-[#0E2B25] dark:hover:bg-[#2B7364] transition-colors shadow-2xs cursor-pointer"
            >
              <Send className="w-3 h-3" />
              <span>Request to Join</span>
            </button>
          )}
        </div>
      </div>

      {/* Join Request Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white dark:bg-[#161B19] rounded-2xl border border-[#E7E5DF] dark:border-[#293430] shadow-xl max-w-md w-full p-6 space-y-4">
            <div>
              <h4 className="font-serif-heading text-lg font-semibold text-[#181C1B] dark:text-[#F3F5F4]">
                Request to Join &ldquo;{group.name}&rdquo;
              </h4>
              <p className="text-xs text-[#5C6461] dark:text-[#8C9490] mt-0.5">
                The group admin ({group.members[0]?.name}) will review your profile and project note.
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#181C1B] dark:text-[#F3F5F4] mb-1.5">
                Why are you interested in this capstone? (optional note)
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Explain what skills or domain interest you bring to this capstone project..."
                rows={3}
                className="w-full text-xs p-3 rounded-xl border border-[#E7E5DF] dark:border-[#293430] focus:border-[#153E35] dark:focus:border-[#5CE08D] focus:outline-hidden resize-none bg-[#FAF8F5] dark:bg-[#1D2421] text-[#181C1B] dark:text-[#F3F5F4]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-3.5 py-2 text-xs font-medium text-[#5C6461] dark:text-[#8C9490] hover:text-[#181C1B] dark:hover:text-[#F3F5F4] rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleJoinRequest}
                disabled={isRequesting}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#153E35] dark:bg-[#225C50] hover:bg-[#0E2B25] dark:hover:bg-[#2B7364] rounded-lg transition-colors cursor-pointer disabled:opacity-60"
              >
                {isRequesting ? "Submitting..." : "Send Join Request"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
