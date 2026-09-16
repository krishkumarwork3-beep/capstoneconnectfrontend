"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Shield,
  Layers,
  ArrowRight,
  CheckCircle2,
  Clock,
  Send,
  AlertCircle,
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
    } catch (err: any) {
      alert(err.message || "Failed to submit join request");
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <div
      className={`bg-white rounded-xl border p-5 sm:p-6 flex flex-col justify-between transition-all ${
        isFull && variant === "discover"
          ? "opacity-85 border-[#E7E5DF] bg-[#FCFCFB]"
          : "border-[#E7E5DF] hover:border-[#D1CEBE] hover:shadow-xs"
      }`}
    >
      <div>
        {/* Top Header: Domain Badge & Admin/Member Badge */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#FAF8F5] text-[#153E35] border border-[#E7E5DF]">
            <Layers className="w-3 h-3 text-[#153E35]" />
            <span className="font-semibold">{group.domain}</span>
          </span>

          {isAdmin ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-[#FAF1EC] text-[#B8532F] border border-[#F5D7C7]">
              <Shield className="w-3 h-3" />
              You&apos;re Admin
            </span>
          ) : isMember ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-[#F0F4F8] text-[#24425F] border border-[#CBDCEB]">
              Member
            </span>
          ) : null}
        </div>

        {/* Group Name & Description */}
        <Link
          href={`/groups/${group.id}`}
          className="font-serif-heading text-lg font-semibold text-[#181C1B] hover:text-[#153E35] transition-colors block mb-2"
        >
          {group.name}
        </Link>
        <p className="text-xs sm:text-sm text-[#5C6461] line-clamp-3 mb-4 leading-relaxed">
          {group.description}
        </p>

        {/* Requirements Tags */}
        <div className="space-y-1.5 mb-5">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-[#8C9490]">
            Looking for skills:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {group.requirements.map((req) => (
              <span
                key={req}
                className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-[#FAF8F5] text-[#181C1B] border border-[#E7E5DF]"
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
                    className="inline-block h-7 w-7 rounded-full text-[10px] font-bold flex items-center justify-center border-2 border-white ring-1 ring-[#E7E5DF]"
                    style={{ backgroundColor: color.bg, color: color.text }}
                  >
                    {getInitials(member.name)}
                  </div>
                );
              })}
            </div>
            <span className="text-xs text-[#5C6461]">
              Lead: <strong className="text-[#181C1B]">{group.members[0]?.name}</strong> ({group.members[0]?.college})
            </span>
          </div>
        </div>

        {/* Capacity Indicator */}
        <CapacityBar current={currentCount} max={group.max_members} className="mb-4" />
      </div>

      {/* Action Footer */}
      <div className="pt-3.5 border-t border-[#F0EFEA] flex items-center justify-between gap-3">
        <Link
          href={`/groups/${group.id}`}
          className="text-xs font-medium text-[#181C1B] hover:text-[#153E35] flex items-center gap-1 transition-colors"
        >
          <span>View Team & Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>

        <div>
          {isMember ? (
            <Link
              href={`/groups/${group.id}`}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#153E35] bg-[#EDF5F2] hover:bg-[#DCEDE7] transition-colors"
            >
              <span>Manage Group</span>
            </Link>
          ) : requestSent ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-[#EBF7EE] text-[#1B5E33] border border-[#C8EBD1]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Request Sent
            </span>
          ) : isFull ? (
            <span className="text-xs text-[#8C9490] font-medium px-2 py-1 bg-[#FAF8F5] rounded border border-[#E7E5DF]">
              Team Full
            </span>
          ) : (
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#153E35] hover:bg-[#0E2B25] transition-colors shadow-2xs cursor-pointer"
            >
              <Send className="w-3 h-3" />
              <span>Request to Join</span>
            </button>
          )}
        </div>
      </div>

      {/* Join Request Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl border border-[#E7E5DF] shadow-elevated max-w-md w-full p-6 space-y-4">
            <div>
              <h4 className="font-serif-heading text-lg font-semibold text-[#181C1B]">
                Request to Join &ldquo;{group.name}&rdquo;
              </h4>
              <p className="text-xs text-[#5C6461] mt-0.5">
                The group admin ({group.members[0]?.name}) will review your profile and project note.
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#181C1B] mb-1.5">
                Why are you interested in this capstone? (optional note)
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Explain what skills or domain interest you bring to this capstone project..."
                rows={3}
                className="w-full text-xs p-3 rounded-xl border border-[#E7E5DF] focus:border-[#153E35] focus:outline-hidden resize-none bg-[#FAF8F5]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-3.5 py-2 text-xs font-medium text-[#5C6461] hover:text-[#181C1B] rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleJoinRequest}
                disabled={isRequesting}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#153E35] hover:bg-[#0E2B25] rounded-lg transition-colors cursor-pointer disabled:opacity-60"
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
