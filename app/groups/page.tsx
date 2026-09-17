"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  Users2,
  Compass,
  PlusCircle,
  Search,
  Layers,
  Shield,
  X,
} from "lucide-react";
import { Group } from "@/lib/types";
import { getGroups, getMyGroups } from "@/lib/api/groups";
import { useAuth } from "@/lib/context/auth-context";
import { GroupCard } from "@/components/groups/GroupCard";
import { GroupCardSkeleton } from "@/components/common/LoadingSkeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";

const DOMAINS = [
  "All Domains",
  "Robotics & Computer Vision",
  "Biomedical & Edge AI",
  "Aerospace & Embedded Systems",
  "CleanTech & Power Electronics",
  "Cryptography & Web3",
  "Quantum Computing & Web Graphics",
];

export default function GroupsHubPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"my-groups" | "discover">("my-groups");

  // Discover tab state
  const [search, setSearch] = useState("");
  const [domain, setDomain] = useState("all");
  const [openOnly, setOpenOnly] = useState(true);
  const [groups, setGroups] = useState<Group[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(false);

  // My groups state
  const [myGroups, setMyGroups] = useState<Group[]>([]);
  const [myGroupsLoading, setMyGroupsLoading] = useState(true);

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Load My Groups
  const fetchMyGroups = useCallback(async () => {
    if (!user) return;
    try {
      const data = await getMyGroups(user.id);
      setMyGroups(data);
    } catch {
      // Handle error
    } finally {
      setMyGroupsLoading(false);
    }
  }, [user]);

  // Load Discover Groups
  const fetchDiscoverGroups = useCallback(
    async (isInitial = true, nextCursor?: string | null) => {
      if (!isInitial) {
        setLoadingMore(true);
      }
      setError(false);

      try {
        const res = await getGroups({
          search: search.trim() || undefined,
          domain: domain !== "all" ? domain : undefined,
          openOnly,
          cursor: nextCursor || undefined,
          limit: 6,
        });

        if (isInitial) {
          setGroups(res.items);
        } else {
          setGroups((prev) => [...prev, ...res.items]);
        }

        setCursor(res.nextCursor || null);
        setHasMore(res.hasMore);
      } catch {
        setError(true);
      } finally {
        if (isInitial) setLoading(false);
        else setLoadingMore(false);
      }
    },
    [search, domain, openOnly]
  );

  useEffect(() => {
    if (user) {
      fetchMyGroups();
    }
  }, [user, fetchMyGroups]);

  useEffect(() => {
    fetchDiscoverGroups(true);
  }, [fetchDiscoverGroups]);

  // Infinite scroll observer for Discover
  useEffect(() => {
    if (activeTab !== "discover" || !sentinelRef.current || !hasMore || loading || loadingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && cursor) {
          fetchDiscoverGroups(false, cursor);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [activeTab, hasMore, loading, loadingMore, cursor, fetchDiscoverGroups]);

  return (
    <div className="space-y-8">
      {/* Editorial Header */}
      <section className="bg-white dark:bg-[#161B19] rounded-2xl border border-[#E2E0D7] dark:border-[#293430] py-6 px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xs">
        <div className="max-w-2xl space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-[#FAF8F5] dark:bg-[#1D2421] text-[#153E35] dark:text-[#5CE08D] border border-[#E2E0D7] dark:border-[#293430]">
            <Layers className="w-3.5 h-3.5 text-[#B8532F] dark:text-[#FF8D66]" />
            <span>Capstone Engineering Hub</span>
          </div>
          <h1 className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#181C1B] dark:text-[#F3F5F4] tracking-tight">
            Capstone Groups & Project Teams
          </h1>
          <p className="text-xs sm:text-sm text-[#3F4744] dark:text-[#B0B9B6] leading-relaxed">
            Manage your project roster, review incoming join requests, or explore inter-college
            capstone teams looking for domain specialists.
          </p>
        </div>

        <Link
          href="/groups/create"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#153E35] dark:bg-[#225C50] hover:bg-[#0E2B25] dark:hover:bg-[#2B7364] transition-colors shadow-2xs shrink-0 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create New Capstone</span>
        </Link>
      </section>

      {/* Tabs Switcher: "My Groups" vs "Discover" */}
      <div className="flex items-center justify-between border-b border-[#E7E5DF] dark:border-[#293430] pb-px">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("my-groups")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === "my-groups"
                ? "border-[#153E35] dark:border-[#5CE08D] text-[#153E35] dark:text-[#5CE08D]"
                : "border-transparent text-[#5C6461] dark:text-[#8C9490] hover:text-[#181C1B] dark:hover:text-[#F3F5F4]"
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>My Capstone Groups</span>
            <span className="text-[11px] px-2 py-0.2 rounded-full bg-[#FAF8F5] dark:bg-[#1D2421] text-[#5C6461] dark:text-[#B0B9B6] border border-[#E7E5DF] dark:border-[#293430]">
              {myGroups.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("discover")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === "discover"
                ? "border-[#153E35] dark:border-[#5CE08D] text-[#153E35] dark:text-[#5CE08D]"
                : "border-transparent text-[#5C6461] dark:text-[#8C9490] hover:text-[#181C1B] dark:hover:text-[#F3F5F4]"
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Discover Teams</span>
            <span className="text-[11px] px-2 py-0.2 rounded-full bg-[#FAF8F5] dark:bg-[#1D2421] text-[#5C6461] dark:text-[#B0B9B6] border border-[#E7E5DF] dark:border-[#293430]">
              {groups.length}
            </span>
          </button>
        </div>
      </div>

      {/* Tab 1: My Groups */}
      {activeTab === "my-groups" && (
        <div className="space-y-6">
          {myGroupsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <GroupCardSkeleton />
              <GroupCardSkeleton />
            </div>
          ) : myGroups.length === 0 ? (
            <EmptyState
              icon={Users2}
              title="You haven't joined any capstone group yet"
              description="To participate in capstone projects, you can either assemble your own group and recruit teammates, or browse teams looking for your tech stack."
              actionLabel="Browse Open Capstone Teams"
              onAction={() => setActiveTab("discover")}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {myGroups.map((grp) => (
                <GroupCard
                  key={grp.id}
                  group={grp}
                  variant="my-groups"
                  onRequestSuccess={fetchMyGroups}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Discover Open Groups */}
      {activeTab === "discover" && (
        <div className="space-y-6">
          {/* Filters for discover groups */}
          <div className="bg-white dark:bg-[#161B19] rounded-xl border border-[#E7E5DF] dark:border-[#293430] p-4 space-y-3 shadow-xs">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C9490]" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search groups by project title, description, or required skills..."
                  className="w-full pl-10 pr-10 py-2 text-xs sm:text-sm bg-[#FAF8F5] dark:bg-[#1D2421] rounded-xl border border-[#E7E5DF] dark:border-[#293430] focus:border-[#153E35] dark:focus:border-[#5CE08D] focus:outline-hidden text-[#181C1B] dark:text-[#F3F5F4]"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C9490] hover:text-[#181C1B] dark:hover:text-[#F3F5F4]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <select
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="px-3 py-2 rounded-xl border border-[#E7E5DF] dark:border-[#293430] bg-[#FAF8F5] dark:bg-[#1D2421] text-xs sm:text-sm text-[#181C1B] dark:text-[#F3F5F4] focus:border-[#153E35] dark:focus:border-[#5CE08D] focus:outline-hidden cursor-pointer"
              >
                {DOMAINS.map((d) => (
                  <option key={d} value={d === "All Domains" ? "all" : d}>
                    {d}
                  </option>
                ))}
              </select>

              <label className="flex items-center gap-2 text-xs font-medium text-[#181C1B] dark:text-[#F3F5F4] cursor-pointer px-2 py-1 select-none">
                <input
                  type="checkbox"
                  checked={openOnly}
                  onChange={(e) => setOpenOnly(e.target.checked)}
                  className="rounded border-[#E7E5DF] dark:border-[#293430] text-[#153E35] focus:ring-0"
                />
                <span>Open slots only</span>
              </label>
            </div>
          </div>

          {/* Groups Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <GroupCardSkeleton />
              <GroupCardSkeleton />
              <GroupCardSkeleton />
              <GroupCardSkeleton />
            </div>
          ) : error ? (
            <ErrorState onRetry={() => fetchDiscoverGroups(true)} />
          ) : groups.length === 0 ? (
            <EmptyState
              icon={Users2}
              title="No capstone groups matched your search"
              description="Try adjusting your keywords, choosing another engineering domain, or unchecking 'Open slots only'."
            />
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {groups.map((grp) => (
                  <GroupCard
                    key={grp.id}
                    group={grp}
                    variant="discover"
                    onRequestSuccess={() => fetchDiscoverGroups(true)}
                  />
                ))}
              </div>

              {/* Sentinel */}
              <div ref={sentinelRef} className="py-4 text-center">
                {loadingMore && (
                  <div className="flex items-center justify-center gap-2 text-xs text-[#5C6461] dark:text-[#8C9490]">
                    <div className="w-4 h-4 rounded-full border-2 border-[#153E35] dark:border-[#5CE08D] border-t-transparent animate-spin" />
                    <span>Loading more capstone teams...</span>
                  </div>
                )}
                {!hasMore && groups.length > 0 && (
                  <p className="text-xs text-[#8C9490] dark:text-[#7A8883]">
                    Showing all available capstone groups.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
