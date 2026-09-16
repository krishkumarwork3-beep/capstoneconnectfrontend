"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Clock,
  CheckCircle2,
  XCircle,
  ExternalLink,
  GraduationCap,
  Shield,
  MessageSquare,
} from "lucide-react";
import { JoinRequest, RequestStatus } from "@/lib/types";
import { respondRequest } from "@/lib/api/requests";
import { formatDate, getAvatarColor, getInitials } from "@/lib/utils";

interface JoinRequestCardProps {
  request: JoinRequest;
  direction: "sent" | "received";
  onStatusChange?: (updated: JoinRequest) => void;
}

export function JoinRequestCard({
  request: initialRequest,
  direction,
  onStatusChange,
}: JoinRequestCardProps) {
  const [request, setRequest] = useState<JoinRequest>(initialRequest);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleRespond = async (status: RequestStatus) => {
    setIsUpdating(true);
    try {
      const updated = await respondRequest(request.id, status);
      setRequest(updated);
      onStatusChange?.(updated);
    } catch (err: any) {
      alert(err.message || "Failed to update request status");
    } finally {
      setIsUpdating(false);
    }
  };

  const isReceived = direction === "received";
  const avatarStyle = getAvatarColor(request.sender_id);

  return (
    <div className="bg-white rounded-xl border border-[#E7E5DF] p-5 hover:border-[#D1CEBE] transition-all">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        {/* Left Side: Avatar, Sender metadata, Note */}
        <div className="flex items-start gap-3.5 min-w-0">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center font-serif-heading font-bold text-sm shrink-0 border"
            style={{
              backgroundColor: avatarStyle.bg,
              color: avatarStyle.text,
              borderColor: avatarStyle.border,
            }}
          >
            {getInitials(request.sender_name)}
          </div>

          <div className="min-w-0 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <Link
                href={`/profile/${request.sender_id}`}
                className="font-serif-heading text-base font-semibold text-[#181C1B] hover:text-[#153E35] transition-colors"
              >
                {request.sender_name}
              </Link>
              <span className="text-xs text-[#8C9490]">
                {request.type === "join_request" ? "requested to join" : "invited you to"}
              </span>
              <Link
                href={`/groups/${request.group_id}`}
                className="font-medium text-xs text-[#153E35] bg-[#EDF5F2] px-2 py-0.5 rounded border border-[#C8DFD7] hover:bg-[#DCEDE7]"
              >
                {request.group_name}
              </Link>
            </div>

            <div className="flex items-center gap-2 text-xs text-[#5C6461]">
              <span className="flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5 text-[#8C9490]" />
                {request.sender_college} (&apos;{String(request.sender_passing_year).slice(-2)})
              </span>
              <span className="text-[#D1CEBE]">•</span>
              <span className="flex items-center gap-1 text-[#8C9490]">
                <Clock className="w-3 h-3" />
                {formatDate(request.created_at)}
              </span>
            </div>

            {request.note && (
              <div className="mt-2 p-2.5 rounded-lg bg-[#FAF8F5] border border-[#E7E5DF] text-xs text-[#5C6461] leading-relaxed">
                &ldquo;{request.note}&rdquo;
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Status Badge or Accept/Reject Actions */}
        <div className="shrink-0 flex sm:flex-col items-end justify-between sm:justify-start gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#F0EFEA]">
          {request.status === "pending" ? (
            isReceived ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleRespond("rejected")}
                  disabled={isUpdating}
                  className="px-3 py-1.5 text-xs font-medium text-[#8C4020] bg-[#FAF1EC] hover:bg-[#F5E2D6] rounded-lg border border-[#F5D7C7] transition-colors cursor-pointer disabled:opacity-50"
                >
                  Decline
                </button>
                <button
                  onClick={() => handleRespond("accepted")}
                  disabled={isUpdating}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#153E35] hover:bg-[#0E2B25] rounded-lg transition-colors cursor-pointer disabled:opacity-50 shadow-2xs"
                >
                  Accept Member
                </button>
              </div>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#FAF8F5] text-[#5C6461] border border-[#E7E5DF]">
                <Clock className="w-3 h-3 text-[#8C9490]" />
                Pending Review
              </span>
            )
          ) : request.status === "accepted" ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#EBF7EE] text-[#1B5E33] border border-[#C8EBD1]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Accepted
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#FAF1EC] text-[#8C4020] border border-[#F5D7C7]">
              <XCircle className="w-3.5 h-3.5" />
              Declined
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
