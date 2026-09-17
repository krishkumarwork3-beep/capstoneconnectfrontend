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
  ChevronRight,
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

  const loadMoreUsers = useCallback(
    async (nextCursor: string) => {
      setLoadingMore(true);
      try {
        const res = await getUsers({
          search: search.trim() || undefined,
          college: college !== "all" ? college : undefined,
          passing_year: passingYear !== "all" ? Number(passingYear) : undefined,
          hasGroup: hasGroupFilter !== null ? hasGroupFilter : undefined,
          cursor: nextCursor,
          limit: 6,
        });
        setUsers((prev) => [...prev, ...res.items]);
        setCursor(res.nextCursor || null);
        setHasMore(res.hasMore);
        setTotalCount(res.total || 0);
      } catch {
        setError(true);
      } finally {
        setLoadingMore(false);
      }
    },
    [search, college, passingYear, hasGroupFilter]
  );

  // Re-fetch whenever filters change
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(false);

    getUsers({
      search: search.trim() || undefined,
      college: college !== "all" ? college : undefined,
      passing_year: passingYear !== "all" ? Number(passingYear) : undefined,
      hasGroup: hasGroupFilter !== null ? hasGroupFilter : undefined,
      limit: 6,
    })
      .then((res) => {
        if (active) {
          setUsers(res.items);
          setCursor(res.nextCursor || null);
          setHasMore(res.hasMore);
          setTotalCount(res.total || res.items.length);
          setLoading(false);
        }
      })
      .catch(() => {
        if (active) {
          setError(true);
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [search, college, passingYear, hasGroupFilter]);

  // Infinite scroll IntersectionObserver
  useEffect(() => {
    if (!sentinelRef.current || !hasMore || loading || loadingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && cursor) {
          loadMoreUsers(cursor);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasMore, loading, loadingMore, cursor, loadMoreUsers]);

  const handleResetFilters = () => {
    setSearch("");
    setCollege("all");
    setPassingYear("all");
    setHasGroupFilter(null);
  };

  const handleRefresh = () => {
    getUsers({
      search: search.trim() || undefined,
      college: college !== "all" ? college : undefined,
      passing_year: passingYear !== "all" ? Number(passingYear) : undefined,
      hasGroup: hasGroupFilter !== null ? hasGroupFilter : undefined,
      limit: 6,
    }).then((res) => {
      setUsers(res.items);
      setCursor(res.nextCursor || null);
      setHasMore(res.hasMore);
      setTotalCount(res.total || res.items.length);
    });
  };

  return (
    <div className="space-y-8">
      {/* Editorial Page Header */}
      <section className="relative overflow-hidden rounded-2xl bg-white dark:bg-[#161B19] border border-[#E2E0D7] dark:border-[#293430] py-6 px-6 shadow-xs transition-colors">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#FAF8F5] dark:bg-[#1D2421] text-[#153E35] dark:text-[#5CE08D] border border-[#E2E0D7] dark:border-[#293430]">
            <Sparkles className="w-3.5 h-3.5 text-[#B8532F] dark:text-[#D96841]" />
            <span>Pan-India Capstone Collaboration</span>
          </div>
          <h1 className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#181C1B] dark:text-[#F3F5F4] tracking-tight">
            Discover Student Collaborators & Engineers
          </h1>
          <p className="text-xs sm:text-sm text-[#3F4744] dark:text-[#B0B9B6] leading-relaxed">
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
          <div className="flex items-center justify-between text-xs text-[#3F4744] dark:text-[#B0B9B6] px-1">
            <span className="font-medium">
              Showing <strong className="text-[#181C1B] dark:text-[#F3F5F4]">{users.length}</strong> of{" "}
              <strong className="text-[#181C1B] dark:text-[#F3F5F4]">{totalCount}</strong> students
            </span>
            {hasGroupFilter === false && (
              <span className="text-[#1B5E33] dark:text-[#5CE08D] font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1B5E33] dark:bg-[#5CE08D]" />
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
            <ErrorState onRetry={handleRefresh} />
          ) : users.length === 0 ? (
            <EmptyUsersState onReset={handleResetFilters} />
          ) : (
            <div className="space-y-4">
              {users.map((student) => (
                <UserCard
                  key={student.id}
                  user={student}
                  onInviteSuccess={handleRefresh}
                />
              ))}

              {/* Infinite Scroll Sentinel */}
              <div ref={sentinelRef} className="py-4 text-center">
                {loadingMore && (
                  <div className="flex items-center justify-center gap-2 text-xs text-[#3F4744] dark:text-[#B0B9B6]">
                    <div className="w-4 h-4 rounded-full border-2 border-[#153E35] dark:border-[#5CE08D] border-t-transparent animate-spin" />
                    <span>Loading more student profiles...</span>
                  </div>
                )}
                {!hasMore && users.length > 0 && (
                  <p className="text-xs text-[#8C9490] dark:text-[#74807C] pt-2">
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
          <div className="bg-white dark:bg-[#161B19] rounded-xl border border-[#E2E0D7] dark:border-[#293430] p-5 shadow-xs space-y-4 transition-colors">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0EFEA] dark:border-[#293430]">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#8C9490] dark:text-[#74807C]">
                Your Capstone Status
              </span>
              <Shield className="w-4 h-4 text-[#153E35] dark:text-[#5CE08D]" />
            </div>

            {user?.group_id ? (
              <div className="space-y-3">
                <div>
                  <h3 className="font-serif-heading text-base font-semibold text-[#181C1B] dark:text-[#F3F5F4]">
                    {user.group_name}
                  </h3>
                  <p className="text-xs text-[#3F4744] dark:text-[#B0B9B6]">
                    Role:{" "}
                    <span className="font-semibold text-[#181C1B] dark:text-[#F3F5F4] capitalize">
                      {user.group_role}
                    </span>
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-[#FAF8F5] dark:bg-[#1D2421] border border-[#E2E0D7] dark:border-[#293430] text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[#3F4744] dark:text-[#B0B9B6]">Recruiting Actions:</span>
                    <span className="text-[#1B5E33] dark:text-[#5CE08D] font-medium">Active</span>
                  </div>
                  <p className="text-[11px] text-[#8C9490] dark:text-[#74807C]">
                    You can click &ldquo;Invite to Group&rdquo; on any student card to send them a direct
                    capstone team invitation.
                  </p>
                </div>

                <Link
                  href={`/groups/${user.group_id}`}
                  className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold text-white bg-[#153E35] dark:bg-[#225C50] hover:bg-[#0E2B25] dark:hover:bg-[#2B7364] transition-colors cursor-pointer"
                >
                  <span>Open Group Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              <div className="space-y-3 text-left">
                <p className="text-xs text-[#3F4744] dark:text-[#B0B9B6] leading-relaxed">
                  You are currently unaffiliated with a capstone team. Create an open project to
                  recruit members, or request to join an existing group.
                </p>
                <div className="flex flex-col gap-2">
                  <Link
                    href="/groups/create"
                    className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold text-white bg-[#153E35] dark:bg-[#225C50] hover:bg-[#0E2B25] dark:hover:bg-[#2B7364] transition-colors cursor-pointer"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Create a Capstone Project</span>
                  </Link>
                  <Link
                    href="/groups"
                    className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold text-[#181C1B] dark:text-[#F3F5F4] bg-[#FAF8F5] dark:bg-[#1D2421] border border-[#E2E0D7] dark:border-[#293430] hover:bg-[#F5F4F0] dark:hover:bg-[#222B27] transition-colors"
                  >
                    <span>Browse Open Teams</span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#8C9490] dark:text-[#74807C]" />
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Quick Links / Requests Inbox Preview */}
          <div className="bg-white dark:bg-[#161B19] rounded-xl border border-[#E2E0D7] dark:border-[#293430] p-5 shadow-xs space-y-3 transition-colors">
            <div className="flex items-center justify-between pb-2 border-b border-[#F0EFEA] dark:border-[#293430]">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#8C9490] dark:text-[#74807C]">
                Activity Shortcuts
              </span>
            </div>

            <Link
              href="/requests"
              className="flex items-center justify-between p-2.5 rounded-lg hover:bg-[#FAF8F5] dark:hover:bg-[#1D2421] transition-colors border border-transparent hover:border-[#E2E0D7] dark:hover:border-[#293430] group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#FAF1EC] dark:bg-[#2E1B14] text-[#B8532F] dark:text-[#D96841] flex items-center justify-center">
                  <Inbox className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#181C1B] dark:text-[#F3F5F4]">Requests Inbox</p>
                  <p className="text-[11px] text-[#8C9490] dark:text-[#74807C]">2 pending requests to review</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#8C9490] dark:text-[#74807C] group-hover:text-[#181C1B] dark:group-hover:text-[#F3F5F4]" />
            </Link>

            <Link
              href="/chat"
              className="flex items-center justify-between p-2.5 rounded-lg hover:bg-[#FAF8F5] dark:hover:bg-[#1D2421] transition-colors border border-transparent hover:border-[#E2E0D7] dark:hover:border-[#293430] group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#EDF5F2] dark:bg-[#162B25] text-[#153E35] dark:text-[#5CE08D] flex items-center justify-center">
                  <Users2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#181C1B] dark:text-[#F3F5F4]">Project Team Chat</p>
                  <p className="text-[11px] text-[#8C9490] dark:text-[#74807C]">1 unread message in Rover</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#8C9490] dark:text-[#74807C] group-hover:text-[#181C1B] dark:group-hover:text-[#F3F5F4]" />
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
