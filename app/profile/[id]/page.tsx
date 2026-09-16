"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  GraduationCap,
  Calendar,
  Download,
  Shield,
  Send,
  CheckCircle2,
  ChevronLeft,
  Mail,
  FileText,
} from "lucide-react";
import { User } from "@/lib/types";
import { getUserById } from "@/lib/api/users";
import { sendInvitation } from "@/lib/api/requests";
import { useAuth } from "@/lib/context/auth-context";
import { GitHubActivityPanel } from "@/components/profile/GitHubActivityPanel";
import { Skeleton } from "@/components/common/LoadingSkeleton";
import { ErrorState } from "@/components/common/ErrorState";
import { getAvatarColor, getInitials } from "@/lib/utils";

export default function PublicProfilePage() {
  const params = useParams();
  const router = useRouter();
  const userId = params?.id as string;
  const { user: currentUser } = useAuth();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [isInviting, setIsInviting] = useState(false);
  const [inviteSent, setInviteSent] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteNote, setInviteNote] = useState("");

  useEffect(() => {
    let isMounted = true;
    async function loadUser() {
      if (!userId) return;
      setLoading(true);
      setError(false);
      try {
        const data = await getUserById(userId);
        if (isMounted) setUser(data);
      } catch {
        if (isMounted) setError(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadUser();
    return () => {
      isMounted = false;
    };
  }, [userId]);

  const handleSendInvite = async () => {
    if (!currentUser?.group_id || !user) return;
    setIsInviting(true);
    try {
      await sendInvitation(
        user.id,
        currentUser.group_id,
        currentUser.id,
        inviteNote || `Hey ${user.name.split(" ")[0]}, we'd love for you to collaborate with ${currentUser.group_name}!`
      );
      setInviteSent(true);
      setShowInviteModal(false);
    } catch (err: any) {
      alert(err.message || "Failed to send invitation");
    } finally {
      setIsInviting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Skeleton variant="rectangular" className="w-full h-48 rounded-2xl" />
        <Skeleton variant="rectangular" className="w-full h-64 rounded-2xl" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="max-w-md mx-auto py-12">
        <ErrorState
          title="Student Profile Not Found"
          message="This student profile could not be found or has been removed."
          onRetry={() => router.push("/")}
        />
      </div>
    );
  }

  const avatarStyle = getAvatarColor(user.id);
  const isSelf = currentUser?.id === user.id;
  const viewerHasGroup = Boolean(currentUser?.group_id);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Back to discover navigation */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5C6461] hover:text-[#181C1B] transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Collaborators Feed</span>
        </Link>
      </div>

      {/* Profile Overview Card */}
      <section className="bg-white rounded-2xl border border-[#E7E5DF] p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center font-serif-heading font-bold text-3xl border shadow-2xs shrink-0"
              style={{
                backgroundColor: avatarStyle.bg,
                color: avatarStyle.text,
                borderColor: avatarStyle.border,
              }}
            >
              {getInitials(user.name)}
            </div>

            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#181C1B]">
                  {user.name}
                </h1>
                {user.group_name ? (
                  <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full font-semibold bg-[#F0F4F8] text-[#24425F] border border-[#CBDCEB]">
                    <Shield className="w-3 h-3" />
                    In Group: {user.group_name}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-0.5 rounded-full font-semibold bg-[#EBF7EE] text-[#1B5E33] border border-[#C8EBD1]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1B5E33]" />
                    Looking for Group
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-[#5C6461] pt-0.5">
                <span className="flex items-center gap-1 font-medium text-[#181C1B]">
                  <GraduationCap className="w-4 h-4 text-[#8C9490]" />
                  {user.college}
                </span>
                {user.department && (
                  <>
                    <span className="text-[#D1CEBE]">•</span>
                    <span>{user.department}</span>
                  </>
                )}
                <span className="text-[#D1CEBE]">•</span>
                <span className="flex items-center gap-1 text-[#8C9490]">
                  <Calendar className="w-3.5 h-3.5" />
                  Class of &apos;{String(user.passing_year).slice(-2)}
                </span>
              </div>
            </div>
          </div>

          {/* Action CTAs: Invite to Group / Download Resume */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {user.resume_url && (
              <a
                href={user.resume_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-[#181C1B] bg-[#FAF8F5] border border-[#E7E5DF] hover:bg-[#F5F4F0] transition-colors cursor-pointer shadow-2xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Resumé</span>
              </a>
            )}

            {isSelf ? (
              <Link
                href="/profile"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-[#153E35] hover:bg-[#0E2B25] transition-colors"
              >
                <span>Edit Your Profile</span>
              </Link>
            ) : inviteSent ? (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium bg-[#EBF7EE] text-[#1B5E33] border border-[#C8EBD1]">
                <CheckCircle2 className="w-4 h-4" />
                Invitation Sent
              </span>
            ) : viewerHasGroup ? (
              <button
                onClick={() => setShowInviteModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#153E35] hover:bg-[#0E2B25] transition-colors cursor-pointer shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Invite to {currentUser?.group_name}</span>
              </button>
            ) : null}
          </div>
        </div>

        {/* Bio */}
        <div className="space-y-1.5 pt-2 border-t border-[#F0EFEA]">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#8C9490]">
            Research & Capstone Interests
          </h2>
          <p className="text-xs sm:text-sm text-[#5C6461] leading-relaxed max-w-3xl">
            {user.bio}
          </p>
        </div>

        {/* Skills */}
        <div className="space-y-2">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#8C9490]">
            Technical Competencies
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {user.skills.map((s) => (
              <span
                key={s}
                className="px-3 py-1 rounded-lg text-xs font-medium bg-[#FAF8F5] text-[#181C1B] border border-[#E7E5DF]"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* GitHub Integration Panel (Isolated Loading / Error Boundary) */}
      <GitHubActivityPanel userId={user.id} githubUrl={user.github_url} />

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl border border-[#E7E5DF] shadow-elevated max-w-md w-full p-6 space-y-4">
            <div>
              <h4 className="font-serif-heading text-lg font-semibold text-[#181C1B]">
                Invite {user.name} to {currentUser?.group_name}
              </h4>
              <p className="text-xs text-[#5C6461] mt-0.5">
                Send a personalized invitation note explaining how their skills align with your capstone.
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#181C1B] mb-1.5">
                Invitation Note (optional)
              </label>
              <textarea
                value={inviteNote}
                onChange={(e) => setInviteNote(e.target.value)}
                placeholder={`Hi ${user.name.split(" ")[0]}, we would love to have you join our capstone group!`}
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
    </div>
  );
}
