"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft,
  Shield,
  Layers,
  Users2,
  Calendar,
  LogOut,
  Mail,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Sparkles,
  AlertCircle,
  Send,
} from "lucide-react";
import { Group, JoinRequest, RequestStatus } from "@/lib/types";
import { getGroupById, leaveGroup } from "@/lib/api/groups";
import { getRequests, respondRequest, sendJoinRequest } from "@/lib/api/requests";
import { useAuth } from "@/lib/context/auth-context";
import { CapacityBar } from "@/components/groups/CapacityBar";
import { AdminOnlyGate } from "@/components/common/AdminOnlyGate";
import { Skeleton } from "@/components/common/LoadingSkeleton";
import { ErrorState } from "@/components/common/ErrorState";
import { formatDate, getAvatarColor, getInitials } from "@/lib/utils";

export default function GroupDetailPage() {
  const params = useParams();
  const router = useRouter();
  const groupId = params?.id as string;
  const { user, refreshUser } = useAuth();

  const [group, setGroup] = useState<Group | null>(null);
  const [requests, setRequests] = useState<JoinRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [isLeaving, setIsLeaving] = useState(false);
  const [isRequestingJoin, setIsRequestingJoin] = useState(false);
  const [joinRequested, setJoinRequested] = useState(false);

  const loadData = useCallback(async () => {
    if (!groupId) return;
    setLoading(true);
    setError(false);
    try {
      const g = await getGroupById(groupId);
      setGroup(g);

      if (user) {
        const reqs = await getRequests(user.id, "received");
        setRequests(reqs.filter((r) => r.group_id === groupId));
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [groupId, user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRespondRequest = async (requestId: string, status: RequestStatus) => {
    try {
      await respondRequest(requestId, status);
      await loadData();
      await refreshUser();
    } catch (err: any) {
      alert(err.message || "Failed to respond to request");
    }
  };

  const handleLeaveGroup = async () => {
    if (!user || !group) return;
    if (!confirm("Are you sure you want to leave this capstone group?")) return;
    setIsLeaving(true);
    try {
      await leaveGroup(group.id, user.id);
      await refreshUser();
      router.push("/groups");
    } catch (err: any) {
      alert(err.message || "Failed to leave group");
    } finally {
      setIsLeaving(false);
    }
  };

  const handleSendJoinRequest = async () => {
    if (!user || !group) return;
    setIsRequestingJoin(true);
    try {
      await sendJoinRequest(group.id, user.id, `Hi, I would like to join ${group.name}!`);
      setJoinRequested(true);
    } catch (err: any) {
      alert(err.message || "Failed to send request");
    } finally {
      setIsRequestingJoin(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Skeleton variant="rectangular" className="w-full h-40 rounded-2xl" />
        <Skeleton variant="rectangular" className="w-full h-64 rounded-2xl" />
      </div>
    );
  }

  if (error || !group) {
    return (
      <div className="max-w-md mx-auto py-12">
        <ErrorState
          title="Capstone Group Not Found"
          message="This project group may have been disbanded or doesn't exist."
          onRetry={() => router.push("/groups")}
        />
      </div>
    );
  }

  const isMember = user ? group.members.some((m) => m.user_id === user.id) : false;
  const isAdmin = user ? group.members.some((m) => m.user_id === user.id && m.role === "admin") : false;
  const isFull = group.members.length >= group.max_members;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Back button */}
      <div>
        <Link
          href="/groups"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5C6461] hover:text-[#181C1B] transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Capstone Groups</span>
        </Link>
      </div>

      {/* Main Group Header Card */}
      <section className="bg-white rounded-2xl border border-[#E7E5DF] p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FAF8F5] text-[#153E35] border border-[#E7E5DF]">
                <Layers className="w-3.5 h-3.5 text-[#153E35]" />
                {group.domain}
              </span>
              {isAdmin && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-[#FAF1EC] text-[#B8532F] border border-[#F5D7C7]">
                  <Shield className="w-3.5 h-3.5" />
                  Admin Controls Enabled
                </span>
              )}
            </div>

            <h1 className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#181C1B]">
              {group.name}
            </h1>
            <p className="text-xs sm:text-sm text-[#5C6461] leading-relaxed">
              {group.description}
            </p>
          </div>

          {/* Leave or Join Action */}
          <div className="shrink-0 flex items-center gap-2">
            {isMember ? (
              <button
                onClick={handleLeaveGroup}
                disabled={isLeaving}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-[#8C4020] bg-[#FAF1EC] hover:bg-[#F5E2D6] border border-[#F5D7C7] transition-colors cursor-pointer disabled:opacity-50"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Leave Group</span>
              </button>
            ) : joinRequested ? (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#EBF7EE] text-[#1B5E33] border border-[#C8EBD1]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Join Request Pending</span>
              </span>
            ) : isFull ? (
              <span className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#FAF8F5] text-[#8C9490] border border-[#E7E5DF]">
                Group Full
              </span>
            ) : (
              <button
                onClick={handleSendJoinRequest}
                disabled={isRequestingJoin}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#153E35] hover:bg-[#0E2B25] transition-colors cursor-pointer shadow-xs disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Request to Join Team</span>
              </button>
            )}
          </div>
        </div>

        {/* Capacity Bar & Requirements */}
        <div className="pt-4 border-t border-[#F0EFEA] grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div>
            <CapacityBar current={group.members.length} max={group.max_members} />
          </div>

          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8C9490] block">
              Required Capstone Skills:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {group.requirements.map((req) => (
                <span
                  key={req}
                  className="px-2.5 py-0.5 rounded-md text-xs font-medium bg-[#FAF8F5] text-[#181C1B] border border-[#E7E5DF]"
                >
                  {req}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Admin Only Gate: Pending Membership Applications */}
      <AdminOnlyGate groupId={group.id}>
        <section className="bg-white rounded-2xl border-2 border-[#153E35]/20 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#F0EFEA]">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#FAF1EC] text-[#B8532F] flex items-center justify-center">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-serif-heading text-base font-bold text-[#181C1B]">
                  Admin Join Requests Desk
                </h2>
                <p className="text-[11px] text-[#5C6461]">
                  Only visible to you as the group administrator. Review and approve incoming applicant students.
                </p>
              </div>
            </div>

            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-[#153E35] text-white">
              {requests.filter((r) => r.status === "pending").length} Pending
            </span>
          </div>

          {isFull && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-[#FAF1EC] border border-[#F5D7C7] text-xs text-[#8C4020]">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>
                <strong>Team Capacity Reached ({group.max_members}/{group.max_members}).</strong> You
                cannot accept more members unless you remove someone or increase capacity.
              </span>
            </div>
          )}

          {requests.filter((r) => r.status === "pending").length === 0 ? (
            <p className="text-xs text-[#8C9490] py-4 text-center">
              No pending join requests at the moment.
            </p>
          ) : (
            <div className="space-y-3">
              {requests
                .filter((r) => r.status === "pending")
                .map((req) => (
                  <div
                    key={req.id}
                    className="p-4 rounded-xl border border-[#E7E5DF] bg-[#FAF8F5] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/profile/${req.sender_id}`}
                          className="font-serif-heading text-sm font-semibold text-[#181C1B] hover:text-[#153E35] hover:underline"
                        >
                          {req.sender_name}
                        </Link>
                        <span className="text-xs text-[#5C6461]">
                          • {req.sender_college} (&apos;{String(req.sender_passing_year).slice(-2)})
                        </span>
                      </div>
                      {req.note && (
                        <p className="text-xs text-[#5C6461] leading-relaxed">
                          &ldquo;{req.note}&rdquo;
                        </p>
                      )}
                      <span className="text-[10px] text-[#8C9490] block">
                        Applied {formatDate(req.created_at)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleRespondRequest(req.id, "rejected")}
                        className="px-3 py-1.5 text-xs font-semibold text-[#8C4020] bg-white border border-[#F5D7C7] hover:bg-[#FAF1EC] rounded-lg transition-colors cursor-pointer"
                      >
                        Decline
                      </button>
                      <button
                        onClick={() => handleRespondRequest(req.id, "accepted")}
                        disabled={isFull}
                        className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#153E35] hover:bg-[#0E2B25] rounded-lg transition-colors cursor-pointer disabled:opacity-40"
                      >
                        Accept Member
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </section>
      </AdminOnlyGate>

      {/* Roster: Group Member List */}
      <section className="bg-white rounded-2xl border border-[#E7E5DF] p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-[#F0EFEA]">
          <div>
            <h2 className="font-serif-heading text-lg font-bold text-[#181C1B]">
              Project Team Roster
            </h2>
            <p className="text-xs text-[#5C6461]">
              Verified engineering students collaborating on this capstone.
            </p>
          </div>
          <span className="text-xs text-[#8C9490] font-medium">
            {group.members.length} of {group.max_members} spots filled
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {group.members.map((member) => {
            const avatarStyle = getAvatarColor(member.user_id);
            return (
              <div
                key={member.user_id}
                className="p-4 rounded-xl border border-[#E7E5DF] bg-[#FAF8F5] flex items-center justify-between hover:border-[#D1CEBE] transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-serif-heading font-bold text-sm shrink-0 border"
                    style={{
                      backgroundColor: avatarStyle.bg,
                      color: avatarStyle.text,
                      borderColor: avatarStyle.border,
                    }}
                  >
                    {getInitials(member.name)}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <Link
                        href={`/profile/${member.user_id}`}
                        className="text-xs sm:text-sm font-semibold text-[#181C1B] hover:text-[#153E35] truncate"
                      >
                        {member.name}
                      </Link>
                      {member.role === "admin" ? (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#FAF1EC] text-[#B8532F] font-semibold border border-[#F5D7C7]">
                          Lead
                        </span>
                      ) : (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#F0F4F8] text-[#24425F] font-semibold border border-[#CBDCEB]">
                          Member
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#5C6461] truncate">
                      {member.college} • &apos;{String(member.passing_year).slice(-2)}
                    </p>
                  </div>
                </div>

                <Link
                  href={`/profile/${member.user_id}`}
                  className="p-1.5 rounded-lg text-[#8C9490] hover:text-[#153E35] hover:bg-white transition-colors"
                  title="View Profile"
                >
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
