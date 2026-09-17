"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  GraduationCap,
  CheckCircle2,
  Send,
  ExternalLink,
  Shield,
} from "lucide-react";
import { GitHubIcon } from "@/components/ui/icons";
import { User } from "@/lib/types";
import { useAuth } from "@/lib/context/auth-context";
import { sendInvitation } from "@/lib/api/requests";
import { getAvatarColor, getInitials } from "@/lib/utils";

interface UserCardProps {
  user: User;
  variant?: "feed" | "compact";
  onInviteSuccess?: () => void;
}

export function UserCard({ user: targetUser, variant = "feed", onInviteSuccess }: UserCardProps) {
  const { user: currentUser } = useAuth();
  const [isInviting, setIsInviting] = useState(false);
  const [inviteStatus, setInviteStatus] = useState<"idle" | "sent">("idle");
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteNote, setInviteNote] = useState("");

  const avatarStyle = getAvatarColor(targetUser.id);
  const isSelf = currentUser?.id === targetUser.id;
  const viewerHasGroup = Boolean(currentUser?.group_id);

  const handleSendInvite = async () => {
    if (!currentUser?.group_id) return;
    setIsInviting(true);
    try {
      await sendInvitation(
        targetUser.id,
        currentUser.group_id,
        currentUser.id,
        inviteNote || `Hey ${targetUser.name.split(" ")[0]}, we'd love for you to join ${currentUser.group_name || "our capstone team"}!`
      );
      setInviteStatus("sent");
      setShowInviteModal(false);
      onInviteSuccess?.();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to send invitation");
    } finally {
      setIsInviting(false);
    }
  };

  if (variant === "compact") {
    return (
      <div className="flex items-center justify-between p-3 rounded-xl border border-stone-200 dark:border-[#293430] shadow-sm hover:shadow-md hover:border-stone-300 dark:hover:border-[#405049] transition-all duration-200 bg-white dark:bg-[#161B19]">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 border"
            style={{
              backgroundColor: avatarStyle.bg,
              color: avatarStyle.text,
              borderColor: avatarStyle.border,
            }}
          >
            {getInitials(targetUser.name)}
          </div>
          <div className="min-w-0">
            <Link
              href={`/profile/${targetUser.id}`}
              className="text-xs font-semibold text-[#181C1B] dark:text-[#F3F5F4] hover:text-[#153E35] dark:hover:text-[#5CE08D] truncate block"
            >
              {targetUser.name}
            </Link>
            <p className="text-[11px] text-[#3F4744] dark:text-[#B0B9B6] truncate">
              {targetUser.college} • &apos;{String(targetUser.passing_year).slice(-2)}
            </p>
          </div>
        </div>
        <Link
          href={`/profile/${targetUser.id}`}
          className="text-xs text-[#3F4744] dark:text-[#B0B9B6] hover:text-[#153E35] dark:hover:text-[#5CE08D] p-1 rounded hover:bg-[#F5F4F0] dark:hover:bg-[#222B27]"
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }  return (
    <article className="group bg-white dark:bg-[#161B19] rounded-xl border border-stone-200 dark:border-[#293430] shadow-sm hover:shadow-md hover:border-stone-300 dark:hover:border-[#405049] transition-all duration-200 p-6 flex flex-col justify-between">
      <div>
        {/* Top bar: Avatar, name, college & Group status badge */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-start gap-3.5 min-w-0">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center font-serif-heading font-bold text-base shrink-0 border mt-0.5 shadow-2xs"
              style={{
                backgroundColor: avatarStyle.bg,
                color: avatarStyle.text,
                borderColor: avatarStyle.border,
              }}
            >
              {getInitials(targetUser.name)}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <Link
                  href={`/profile/${targetUser.id}`}
                  className="font-serif-heading text-base font-semibold text-[#181C1B] dark:text-[#F3F5F4] hover:text-[#153E35] dark:hover:text-[#5CE08D] transition-colors"
                >
                  {targetUser.name}
                </Link>
                <span className="text-xs text-[#8C9490] dark:text-[#74807C] font-normal">
                  Class of &apos;{String(targetUser.passing_year).slice(-2)}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[#3F4744] dark:text-[#B0B9B6] mt-0.5">
                <GraduationCap className="w-3.5 h-3.5 text-[#8C9490] dark:text-[#74807C] shrink-0" />
                <span className="font-medium truncate">{targetUser.college}</span>
                {targetUser.department && (
                  <>
                    <span className="text-[#C5C2B2] dark:text-[#3D4C46]">•</span>
                    <span className="text-[#8C9490] dark:text-[#74807C] truncate">{targetUser.department}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Group status indicator badge */}
          <div className="shrink-0">
            {targetUser.group_id ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 dark:bg-[#11281A] text-emerald-800 dark:text-[#4ADE80] border border-emerald-200/60 dark:border-[#1E442D]">
                <Shield className="w-3 h-3 text-emerald-800 dark:text-[#4ADE80]" />
                <span className="hidden sm:inline">In Group:</span>
                <span className="font-semibold truncate max-w-[120px]">{targetUser.group_name}</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 dark:bg-[#11281A] text-emerald-800 dark:text-[#4ADE80] border border-emerald-200/60 dark:border-[#1E442D]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-700 dark:bg-[#4ADE80] animate-pulse" />
                Looking for Group
              </span>
            )}
          </div>
        </div>

        {/* Bio Snippet */}
        <p className="text-xs sm:text-sm text-[#3F4744] dark:text-[#B0B9B6] line-clamp-2 mb-4 leading-relaxed">
          &ldquo;{targetUser.bio}&rdquo;
        </p>

        {/* Skills Tags */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {targetUser.skills.slice(0, 5).map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center bg-stone-100 dark:bg-[#222B27] text-stone-800 dark:text-[#D1D9D6] border border-stone-200 dark:border-[#293430] font-medium text-xs px-2.5 py-1 rounded-md"
            >
              {skill}
            </span>
          ))}
          {targetUser.skills.length > 5 && (
            <span className="inline-flex items-center bg-stone-100 dark:bg-[#222B27] text-stone-800 dark:text-[#D1D9D6] border border-stone-200 dark:border-[#293430] font-medium text-xs px-2.5 py-1 rounded-md">
              +{targetUser.skills.length - 5}
            </span>
          )}
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="pt-3.5 border-t border-[#F0EFEA] dark:border-[#293430] flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Link
            href={`/profile/${targetUser.id}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#181C1B] dark:text-[#F3F5F4] hover:text-[#153E35] dark:hover:text-[#5CE08D] hover:bg-[#F5F4F0] dark:hover:bg-[#222B27] rounded-lg transition-colors"
          >
            <span>Profile & Resumé</span>
            <ExternalLink className="w-3 h-3 text-[#8C9490] dark:text-[#74807C]" />
          </Link>

          {targetUser.github_url && (
            <a
              href={targetUser.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#8C9490] dark:text-[#74807C] hover:text-[#181C1B] dark:hover:text-white p-1.5 rounded hover:bg-[#F5F4F0] dark:hover:bg-[#222B27] transition-colors"
              title="GitHub Profile"
            >
              <GitHubIcon className="w-3.5 h-3.5" />
            </a>
          )}
        </div>

        {/* Invite / Request to Join Button */}
        <div>
          {isSelf ? (
            <span className="text-xs text-[#8C9490] dark:text-[#74807C] font-medium px-2 py-1">That&apos;s you</span>
          ) : inviteStatus === "sent" ? (
            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#EBF7EE] dark:bg-[#11281A] text-[#1B5E33] dark:text-[#4ADE80] border border-[#C8EBD1] dark:border-[#1E442D]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Invitation Sent
            </span>
          ) : viewerHasGroup ? (
            <button
              onClick={() => setShowInviteModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#153E35] dark:bg-[#225C50] hover:bg-[#0E2B25] dark:hover:bg-[#2B7364] transition-colors shadow-2xs cursor-pointer"
            >
              <Send className="w-3 h-3" />
              <span>Invite to Group</span>
            </button>
          ) : (
            <div className="relative group/tip">
              <button
                disabled
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium text-[#8C9490] dark:text-[#74807C] bg-[#FAF8F5] dark:bg-[#1D2421] border border-[#E2E0D7] dark:border-[#293430] cursor-not-allowed"
              >
                <span>Request to Join</span>
              </button>
              <span className="absolute bottom-full right-0 mb-1.5 hidden group-hover/tip:block z-20 w-48 p-2 text-[11px] leading-tight text-white bg-[#181C1B] rounded-lg shadow-elevated text-center">
                Create or join a capstone group first to recruit teammates.
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white dark:bg-[#161B19] rounded-2xl border border-[#E2E0D7] dark:border-[#293430] shadow-elevated max-w-md w-full p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-serif-heading text-lg font-semibold text-[#181C1B] dark:text-[#F3F5F4]">
                  Invite {targetUser.name}
                </h4>
                <p className="text-xs text-[#3F4744] dark:text-[#B0B9B6] mt-0.5">
                  To join <span className="font-medium text-[#181C1B] dark:text-[#F3F5F4]">{currentUser?.group_name}</span>
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#181C1B] dark:text-[#F3F5F4] mb-1.5">
                Personalized Invitation Note (optional)
              </label>
              <textarea
                value={inviteNote}
                onChange={(e) => setInviteNote(e.target.value)}
                placeholder={`Hi ${targetUser.name.split(" ")[0]}, we saw your profile and skills in ${targetUser.skills.slice(0, 2).join(", ")}. We think you'd be a great fit for our capstone rover project!`}
                rows={3}
                className="w-full text-xs p-3 rounded-xl border border-[#E2E0D7] dark:border-[#293430] focus:border-[#153E35] dark:focus:border-[#5CE08D] focus:outline-hidden resize-none bg-[#FAF8F5] dark:bg-[#1D2421] text-[#181C1B] dark:text-[#F3F5F4]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowInviteModal(false)}
                className="px-3.5 py-2 text-xs font-medium text-[#3F4744] dark:text-[#B0B9B6] hover:text-[#181C1B] dark:hover:text-white rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSendInvite}
                disabled={isInviting}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#153E35] dark:bg-[#225C50] hover:bg-[#0E2B25] dark:hover:bg-[#2B7364] rounded-lg transition-colors cursor-pointer disabled:opacity-60"
              >
                {isInviting ? "Sending..." : "Send Invitation"}
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
