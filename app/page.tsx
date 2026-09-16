"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  Users2,
  Sparkles,
  Shield,
  ArrowRight,
  Inbox,
  PlusCircle,
  ExternalLink,
  ChevronRight,
  Filter,
} from "lucide-react";
import { User } from "@/lib/types";
import { getUsers } from "@/lib/api/users";
import { useAuth } from "@/lib/context/auth-context";
import { UserCard } from "@/components/feed/UserCard";
import { FeedFilters } from "@/components/feed/FeedFilters";
import { UserCardSkeleton } from "@/components/common/LoadingSkeleton";
import { EmptyUsersState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";

export default function HomeDiscoverPage() {
  const { user } = useAuth();

  // Search & Filter state
  const [search, setSearch] = useState("");
  const [college, setCollege] = useState("all");
  const [passingYear, setPassingYear] = useState("all");
  const [hasGroupFilter, setHasGroupFilter] = useState<boolean | null>(null);

  // Pagination & Data state
  const [users, setUsers] = useState<User[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  // Sentinel observer for infinite scroll
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const fetchUsers = useCallback(
    async (isInitial = true, nextCursor?: string | null) => {
      if (isInitial) setLoading(true);
      else setLoadingMore(true);
      setError(false);

      try {
        const res = await getUsers({
          search: search.trim() || undefined,
          college: college !== "all" ? college : undefined,
          passing_year: passingYear !== "all" ? Number(passingYear) : undefined,
          hasGroup: hasGroupFilter !== null ? hasGroupFilter : undefined,
          cursor: nextCursor || undefined,
          limit: 6,
        });

        if (isInitial) {
          setUsers(res.items);
        } else {
          setUsers((prev) => [...prev, ...res.items]);
        }

        setCursor(res.nextCursor || null);
        setHasMore(res.hasMore);
        setTotalCount(res.total || res.items.length);
      } catch (err) {
        setError(true);
      } finally {
        if (isInitial) setLoading(false);
        else setLoadingMore(false);
      }
    },
    [search, college, passingYear, hasGroupFilter]
  );

  // Re-fetch whenever filters change
  useEffect(() => {
    fetchUsers(true);
  }, [fetchUsers]);

  // Infinite scroll IntersectionObserver
  useEffect(() => {
    if (!sentinelRef.current || !hasMore || loading || loadingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && cursor) {
          fetchUsers(false, cursor);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasMore, loading, loadingMore, cursor, fetchUsers]);

  const handleResetFilters = () => {
    setSearch("");
    setCollege("all");
    setPassingYear("all");
    setHasGroupFilter(null);
  };

  return (
    <div className="space-y-8">
      {/* Editorial Page Header */}
      <section className="relative overflow-hidden rounded-2xl bg-white border border-[#E7E5DF] p-6 sm:p-8 shadow-xs">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#FAF8F5] text-[#153E35] border border-[#E7E5DF]">
            <Sparkles className="w-3.5 h-3.5 text-[#B8532F]" />
            <span>Pan-India Capstone Collaboration</span>
          </div>
          <h1 className="font-serif-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-[#181C1B] tracking-tight">
            Discover Student Collaborators & Engineers
          </h1>
          <p className="text-xs sm:text-sm text-[#5C6461] leading-relaxed">
            Connect with pre-vetted engineering peers across premier Indian colleges. Assemble your
            final-year capstone team, find missing hardware or ML talent, and review verified GitHub
            activity.
          </p>
        </div>
      </section>

      {/* Main Layout Grid: Feed on Left (2/3), Contextual Sidebar on Right (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 8 cols: Filters, User Card Feed, Infinite Scroll */}
        <div className="lg:col-span-8 space-y-6">
          <FeedFilters
            search={search}
            onSearchChange={setSearch}
            college={college}
            onCollegeChange={setCollege}
            passingYear={passingYear}
            onPassingYearChange={setPassingYear}
            hasGroupFilter={hasGroupFilter}
            onHasGroupFilterChange={setHasGroupFilter}
            onReset={handleResetFilters}
          />

          {/* Results Counter Bar */}
          <div className="flex items-center justify-between text-xs text-[#5C6461] px-1">
            <span className="font-medium">
              Showing <strong className="text-[#181C1B]">{users.length}</strong> of{" "}
              <strong className="text-[#181C1B]">{totalCount}</strong> students
            </span>
            {hasGroupFilter === false && (
              <span className="text-[#1B5E33] font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1B5E33]" />
                Filter: Looking for Group Only
              </span>
            )}
          </div>

          {/* Feed Content */}
          {loading ? (
            <div className="space-y-4">
              <UserCardSkeleton />
              <UserCardSkeleton />
              <UserCardSkeleton />
            </div>
          ) : error ? (
            <ErrorState onRetry={() => fetchUsers(true)} />
          ) : users.length === 0 ? (
            <EmptyUsersState onReset={handleResetFilters} />
          ) : (
            <div className="space-y-4">
              {users.map((student) => (
                <UserCard
                  key={student.id}
                  user={student}
                  onInviteSuccess={() => fetchUsers(true)}
                />
              ))}

              {/* Infinite Scroll Sentinel */}
              <div ref={sentinelRef} className="py-4 text-center">
                {loadingMore && (
                  <div className="flex items-center justify-center gap-2 text-xs text-[#5C6461]">
                    <div className="w-4 h-4 rounded-full border-2 border-[#153E35] border-t-transparent animate-spin" />
                    <span>Loading more student profiles...</span>
                  </div>
                )}
                {!hasMore && users.length > 0 && (
                  <p className="text-xs text-[#8C9490] pt-2">
                    You have viewed all matching students in the registry.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right 4 cols: Sticky Contextual Panel */}
        <aside className="lg:col-span-4 space-y-6">
          {/* User's Current Group Status Widget */}
          <div className="bg-white rounded-xl border border-[#E7E5DF] p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0EFEA]">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#8C9490]">
                Your Capstone Status
              </span>
              <Shield className="w-4 h-4 text-[#153E35]" />
            </div>

            {user?.group_id ? (
              <div className="space-y-3">
                <div>
                  <h3 className="font-serif-heading text-base font-semibold text-[#181C1B]">
                    {user.group_name}
                  </h3>
                  <p className="text-xs text-[#5C6461]">
                    Role:{" "}
                    <span className="font-semibold text-[#181C1B] capitalize">
                      {user.group_role}
                    </span>
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-[#FAF8F5] border border-[#E7E5DF] text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[#5C6461]">Recruiting Actions:</span>
                    <span className="text-[#1B5E33] font-medium">Active</span>
                  </div>
                  <p className="text-[11px] text-[#8C9490]">
                    You can click &ldquo;Invite to Group&rdquo; on any student card to send them a direct
                    capstone team invitation.
                  </p>
                </div>

                <Link
                  href={`/groups/${user.group_id}`}
                  className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold text-white bg-[#153E35] hover:bg-[#0E2B25] transition-colors cursor-pointer"
                >
                  <span>Open Group Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              <div className="space-y-3 text-left">
                <p className="text-xs text-[#5C6461] leading-relaxed">
                  You are currently unaffiliated with a capstone team. Create an open project to
                  recruit members, or request to join an existing group.
                </p>
                <div className="flex flex-col gap-2">
                  <Link
                    href="/groups/create"
                    className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold text-white bg-[#153E35] hover:bg-[#0E2B25] transition-colors cursor-pointer"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Create a Capstone Project</span>
                  </Link>
                  <Link
                    href="/groups"
                    className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold text-[#181C1B] bg-[#FAF8F5] border border-[#E7E5DF] hover:bg-[#F5F4F0] transition-colors"
                  >
                    <span>Browse Open Teams</span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#8C9490]" />
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Quick Links / Requests Inbox Preview */}
          <div className="bg-white rounded-xl border border-[#E7E5DF] p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#F0EFEA]">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#8C9490]">
                Activity Shortcuts
              </span>
            </div>

            <Link
              href="/requests"
              className="flex items-center justify-between p-2.5 rounded-lg hover:bg-[#FAF8F5] transition-colors border border-transparent hover:border-[#E7E5DF] group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#FAF1EC] text-[#B8532F] flex items-center justify-center">
                  <Inbox className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#181C1B]">Requests Inbox</p>
                  <p className="text-[11px] text-[#8C9490]">2 pending requests to review</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#8C9490] group-hover:text-[#181C1B]" />
            </Link>

            <Link
              href="/chat"
              className="flex items-center justify-between p-2.5 rounded-lg hover:bg-[#FAF8F5] transition-colors border border-transparent hover:border-[#E7E5DF] group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#EDF5F2] text-[#153E35] flex items-center justify-center">
                  <Users2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#181C1B]">Project Team Chat</p>
                  <p className="text-[11px] text-[#8C9490]">1 unread message in Rover</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#8C9490] group-hover:text-[#181C1B]" />
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
