"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Inbox, ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { JoinRequest, RequestStatus } from "@/lib/types";
import { getRequests } from "@/lib/api/requests";
import { useAuth } from "@/lib/context/auth-context";
import { JoinRequestCard } from "@/components/requests/JoinRequestCard";
import { Skeleton } from "@/components/common/LoadingSkeleton";
import { EmptyRequestsState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";

export default function RequestsInboxPage() {
  const { user, refreshUser } = useAuth();
  const [direction, setDirection] = useState<"received" | "sent">("received");
  const [statusFilter, setStatusFilter] = useState<"all" | RequestStatus>("all");
  const [requests, setRequests] = useState<JoinRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadRequests = useCallback(async () => {
    if (!user) return;
    setError(false);
    try {
      const data = await getRequests(user.id, direction);
      setRequests(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [user, direction]);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const filteredRequests = requests.filter((r) => {
    if (statusFilter === "all") return true;
    return r.status === statusFilter;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Editorial Header */}
      <section className="bg-white dark:bg-[#161B19] rounded-2xl border border-[#E2E0D7] dark:border-[#293430] py-6 px-6 shadow-xs space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-[#FAF8F5] dark:bg-[#1D2421] text-[#153E35] dark:text-[#5CE08D] border border-[#E2E0D7] dark:border-[#293430]">
          <Inbox className="w-3.5 h-3.5 text-[#B8532F] dark:text-[#FF8D66]" />
          <span>Collaboration Invites & Requests</span>
        </div>
        <h1 className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#181C1B] dark:text-[#F3F5F4] tracking-tight">
          Requests & Invitations Desk
        </h1>
        <p className="text-xs sm:text-sm text-[#3F4744] dark:text-[#B0B9B6] leading-relaxed">
          Manage join requests sent to your capstone groups and track the status of applications you
          sent to other student projects.
        </p>
      </section>

      {/* Direction & Status Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E7E5DF] dark:border-[#293430] pb-3">
        {/* Direction Switcher */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDirection("received")}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              direction === "received"
                ? "bg-[#153E35] dark:bg-[#225C50] text-white"
                : "bg-white dark:bg-[#161B19] border border-[#E7E5DF] dark:border-[#293430] text-[#5C6461] dark:text-[#B0B9B6] hover:border-[#D1CEBE] dark:hover:border-[#384842]"
            }`}
          >
            <ArrowDownLeft className="w-3.5 h-3.5" />
            <span>Received Requests</span>
          </button>

          <button
            onClick={() => setDirection("sent")}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              direction === "sent"
                ? "bg-[#153E35] dark:bg-[#225C50] text-white"
                : "bg-white dark:bg-[#161B19] border border-[#E7E5DF] dark:border-[#293430] text-[#5C6461] dark:text-[#B0B9B6] hover:border-[#D1CEBE] dark:hover:border-[#384842]"
            }`}
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Sent Applications</span>
          </button>
        </div>

        {/* Status Filter Chips */}
        <div className="flex items-center gap-1 text-xs">
          <button
            onClick={() => setStatusFilter("all")}
            className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
              statusFilter === "all"
                ? "font-semibold text-[#181C1B] dark:text-[#F3F5F4] bg-[#F5F4F0] dark:bg-[#222B27]"
                : "text-[#8C9490] dark:text-[#7A8883] hover:text-[#181C1B] dark:hover:text-[#F3F5F4]"
            }`}
          >
            All ({requests.length})
          </button>
          <button
            onClick={() => setStatusFilter("pending")}
            className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
              statusFilter === "pending"
                ? "font-semibold text-[#181C1B] dark:text-[#F3F5F4] bg-[#F5F4F0] dark:bg-[#222B27]"
                : "text-[#8C9490] dark:text-[#7A8883] hover:text-[#181C1B] dark:hover:text-[#F3F5F4]"
            }`}
          >
            Pending ({requests.filter((r) => r.status === "pending").length})
          </button>
          <button
            onClick={() => setStatusFilter("accepted")}
            className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
              statusFilter === "accepted"
                ? "font-semibold text-[#181C1B] dark:text-[#F3F5F4] bg-[#F5F4F0] dark:bg-[#222B27]"
                : "text-[#8C9490] dark:text-[#7A8883] hover:text-[#181C1B] dark:hover:text-[#F3F5F4]"
            }`}
          >
            Accepted ({requests.filter((r) => r.status === "accepted").length})
          </button>
          <button
            onClick={() => setStatusFilter("rejected")}
            className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
              statusFilter === "rejected"
                ? "font-semibold text-[#181C1B] dark:text-[#F3F5F4] bg-[#F5F4F0] dark:bg-[#222B27]"
                : "text-[#8C9490] dark:text-[#7A8883] hover:text-[#181C1B] dark:hover:text-[#F3F5F4]"
            }`}
          >
            Declined ({requests.filter((r) => r.status === "rejected").length})
          </button>
        </div>
      </div>

      {/* Requests List */}
      {loading ? (
        <div className="space-y-4">
          <Skeleton variant="card" className="h-28" />
          <Skeleton variant="card" className="h-28" />
        </div>
      ) : error ? (
        <ErrorState onRetry={loadRequests} />
      ) : filteredRequests.length === 0 ? (
        <EmptyRequestsState type={direction} />
      ) : (
        <div className="space-y-3">
          {filteredRequests.map((req) => (
            <JoinRequestCard
              key={req.id}
              request={req}
              direction={direction}
              onStatusChange={() => {
                loadRequests();
                refreshUser();
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
