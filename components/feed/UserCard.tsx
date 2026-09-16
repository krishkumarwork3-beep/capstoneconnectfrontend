"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  GraduationCap,
  Sparkles,
  CheckCircle2,
  Clock,
  Send,
  ExternalLink,
  Shield,
  FileText,
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
  const viewerIsAdmin = currentUser?.group_role === "admin";

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
    } catch (err: any) {
      alert(err.message || "Failed to send invitation");
    } finally {
      setIsInviting(false);
    }
  };

  if (variant === "compact") {
    return (
      <div className="flex items-center justify-between p-3 rounded-xl border border-[#E7E5DF] bg-white hover:border-[#D1CEBE] transition-colors">
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
              className="text-xs font-semibold text-[#181C1B] hover:text-[#153E35] truncate block"
            >
              {targetUser.name}
            </Link>
            <p className="text-[11px] text-[#5C6461] truncate">
              {targetUser.college} • &apos;{String(targetUser.passing_year).slice(-2)}
            </p>
          </div>
        </div>
        <Link
          href={`/profile/${targetUser.id}`}
          className="text-xs text-[#5C6461] hover:text-[#153E35] p-1 rounded hover:bg-[#F5F4F0]"
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  return (
    <article className="group bg-white rounded-xl border border-[#E7E5DF] p-5 sm:p-6 flex flex-col justify-between hover:border-[#D1CEBE] hover:shadow-xs transition-all">
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
                  className="font-serif-heading text-base font-semibold text-[#181C1B] hover:text-[#153E35] transition-colors"
                >
                  {targetUser.name}
                </Link>
                <span className="text-xs text-[#8C9490] font-normal">
                  Class of &apos;{String(targetUser.passing_year).slice(-2)}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[#5C6461] mt-0.5">
                <GraduationCap className="w-3.5 h-3.5 text-[#8C9490] shrink-0" />
                <span className="font-medium truncate">{targetUser.college}</span>
                {targetUser.department && (
                  <>
                    <span className="text-[#D1CEBE]">•</span>
                    <span className="text-[#8C9490] truncate">{targetUser.department}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Group status indicator badge */}
          <div className="shrink-0">
            {targetUser.group_id ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#F0F4F8] text-[#24425F] border border-[#CBDCEB]">
                <Shield className="w-3 h-3 text-[#24425F]" />
                <span className="hidden sm:inline">In Group:</span>
                <span className="font-semibold truncate max-w-[120px]">{targetUser.group_name}</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#EBF7EE] text-[#1B5E33] border border-[#C8EBD1]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1B5E33] animate-pulse" />
                Looking for Group
              </span>
            )}
          </div>
        </div>

        {/* Bio Snippet */}
        <p className="text-xs sm:text-sm text-[#5C6461] line-clamp-2 mb-4 leading-relaxed">
          &ldquo;{targetUser.bio}&rdquo;
        </p>

        {/* Skills Tags */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {targetUser.skills.slice(0, 5).map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-[#FAF8F5] text-[#181C1B] border border-[#E7E5DF]"
            >
              {skill}
            </span>
          ))}
          {targetUser.skills.length > 5 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs text-[#8C9490] bg-[#FAF8F5]">
              +{targetUser.skills.length - 5}
            </span>
          )}
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="pt-3.5 border-t border-[#F0EFEA] flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Link
            href={`/profile/${targetUser.id}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#181C1B] hover:text-[#153E35] hover:bg-[#F5F4F0] rounded-lg transition-colors"
          >
            <span>Profile & Resumé</span>
            <ExternalLink className="w-3 h-3 text-[#8C9490]" />
          </Link>

          {targetUser.github_url && (
            <a
              href={targetUser.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#8C9490] hover:text-[#181C1B] p-1.5 rounded hover:bg-[#F5F4F0] transition-colors"
              title="GitHub Profile"
            >
              <GitHubIcon className="w-3.5 h-3.5" />
            </a>
          )}
        </div>

        {/* Invite / Request to Join Button */}
        <div>
          {isSelf ? (
            <span className="text-xs text-[#8C9490] font-medium px-2 py-1">That&apos;s you</span>
          ) : inviteStatus === "sent" ? (
            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#EBF7EE] text-[#1B5E33] border border-[#C8EBD1]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Invitation Sent
            </span>
          ) : viewerHasGroup ? (
            <button
              onClick={() => setShowInviteModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#153E35] hover:bg-[#0E2B25] transition-colors shadow-2xs cursor-pointer"
            >
              <Send className="w-3 h-3" />
              <span>Invite to Group</span>
            </button>
          ) : (
            <div className="relative group/tip">
              <button
                disabled
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#8C9490] bg-[#FAF8F5] border border-[#E7E5DF] cursor-not-allowed"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl border border-[#E7E5DF] shadow-elevated max-w-md w-full p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-serif-heading text-lg font-semibold text-[#181C1B]">
                  Invite {targetUser.name}
                </h4>
                <p className="text-xs text-[#5C6461] mt-0.5">
                  To join <span className="font-medium text-[#181C1B]">{currentUser?.group_name}</span>
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#181C1B] mb-1.5">
                Personalized Invitation Note (optional)
              </label>
              <textarea
                value={inviteNote}
                onChange={(e) => setInviteNote(e.target.value)}
                placeholder={`Hi ${targetUser.name.split(" ")[0]}, we saw your profile and skills in ${targetUser.skills.slice(0, 2).join(", ")}. We think you'd be a great fit for our capstone rover project!`}
                rows={3}
                className="w-full text-xs p-3 rounded-xl border border-[#E7E5DF] focus:border-[#153E35] focus:outline-hidden resize-none bg-[#FAF8F5]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowInviteModal(false)}
                className="px-3.5 py-2 text-xs font-medium text-[#5C6461] hover:text-[#181C1B] rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSendInvite}
                disabled={isInviting}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#153E35] hover:bg-[#0E2B25] rounded-lg transition-colors cursor-pointer disabled:opacity-60"
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
