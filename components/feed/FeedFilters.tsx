"use client";

import React, { useState, useEffect } from "react";
import { Search, X, SlidersHorizontal } from "lucide-react";

interface FeedFiltersProps {
  search: string;
  onSearchChange: (val: string) => void;
  college: string;
  onCollegeChange: (val: string) => void;
  passingYear: string;
  onPassingYearChange: (val: string) => void;
  hasGroupFilter: boolean | null;
  onHasGroupFilterChange: (val: boolean | null) => void;
  onReset: () => void;
}

const COLLEGES = [
  "All Colleges",
  "IIT Bombay",
  "BITS Pilani",
  "NIT Trichy",
  "IIIT Hyderabad",
  "COEP Pune",
  "IIT Madras",
  "DTU Delhi",
  "RVCE Bangalore",
  "Jadavpur University",
  "IIT Delhi",
];

const PASSING_YEARS = ["All Years", "2025", "2026", "2027"];

export function FeedFilters({
  search,
  onSearchChange,
  college,
  onCollegeChange,
  passingYear,
  onPassingYearChange,
  hasGroupFilter,
  onHasGroupFilterChange,
  onReset,
}: FeedFiltersProps) {
  const [localSearch, setLocalSearch] = useState(search);

  // Debounce search input by 300ms
  useEffect(() => {
    const handler = setTimeout(() => {
      onSearchChange(localSearch);
    }, 300);
    return () => clearTimeout(handler);
  }, [localSearch, onSearchChange]);

  const hasActiveFilters =
    search.trim() !== "" ||
    college !== "all" ||
    passingYear !== "all" ||
    hasGroupFilter !== null;

  return (
    <div className="space-y-3 mb-8">
      {/* Primary search bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C9490] dark:text-[#74807C]" />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search students by name, skills (e.g. PyTorch, Rust, ROS), or domain..."
            className="w-full pl-10 pr-10 py-2.5 text-sm bg-white dark:bg-[#161B19] rounded-xl border border-[#E2E0D7] dark:border-[#293430] focus:border-[#153E35] dark:focus:border-[#5CE08D] focus:outline-hidden text-[#181C1B] dark:text-[#F3F5F4] placeholder-[#8C9490] dark:placeholder-[#74807C] shadow-xs transition-colors"
          />
          {localSearch && (
            <button
              onClick={() => {
                setLocalSearch("");
                onSearchChange("");
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C9490] dark:text-[#74807C] hover:text-[#181C1B] dark:hover:text-white p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Status Quick Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 shrink-0">
          <button
            onClick={() => onHasGroupFilterChange(null)}
            className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer shrink-0 ${
              hasGroupFilter === null
                ? "bg-[#153E35] dark:bg-[#225C50] text-white"
                : "bg-white dark:bg-[#161B19] border border-[#E2E0D7] dark:border-[#293430] text-[#3F4744] dark:text-[#B0B9B6] hover:border-[#C5C2B2] dark:hover:border-[#405049]"
            }`}
          >
            All Students
          </button>
          <button
            onClick={() => onHasGroupFilterChange(false)}
            className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer shrink-0 flex items-center gap-1.5 ${
              hasGroupFilter === false
                ? "bg-[#153E35] dark:bg-[#225C50] text-white"
                : "bg-white dark:bg-[#161B19] border border-[#E2E0D7] dark:border-[#293430] text-[#1B5E33] dark:text-[#5CE08D] hover:border-[#C8EBD1] dark:hover:border-[#1F4D31]"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#1B5E33] dark:bg-[#5CE08D] shrink-0" />
            Looking for Group
          </button>
          <button
            onClick={() => onHasGroupFilterChange(true)}
            className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer shrink-0 ${
              hasGroupFilter === true
                ? "bg-[#153E35] dark:bg-[#225C50] text-white"
                : "bg-white dark:bg-[#161B19] border border-[#E2E0D7] dark:border-[#293430] text-[#24425F] dark:text-[#7DB2E8] hover:border-[#CBDCEB] dark:hover:border-[#22374D]"
            }`}
          >
            In a Group
          </button>
        </div>
      </div>

      {/* Secondary dropdown row: College, Passout year, and Reset */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[#8C9490] dark:text-[#74807C] flex items-center gap-1 font-medium mr-1">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Filter by:
          </span>

          {/* College Selector */}
          <select
            value={college}
            onChange={(e) => onCollegeChange(e.target.value)}
            aria-label="Filter by College"
            className="px-2.5 py-1.5 rounded-lg border border-[#E2E0D7] dark:border-[#293430] bg-white dark:bg-[#161B19] text-[#181C1B] dark:text-[#F3F5F4] hover:border-[#C5C2B2] dark:hover:border-[#405049] focus:outline-hidden cursor-pointer"
          >
            {COLLEGES.map((c) => (
              <option key={c} value={c === "All Colleges" ? "all" : c} className="dark:bg-[#161B19] dark:text-[#F3F5F4]">
                {c}
              </option>
            ))}
          </select>

          {/* Passing Year Selector */}
          <select
            value={passingYear}
            onChange={(e) => onPassingYearChange(e.target.value)}
            aria-label="Filter by Passing Year"
            className="px-2.5 py-1.5 rounded-lg border border-[#E2E0D7] dark:border-[#293430] bg-white dark:bg-[#161B19] text-[#181C1B] dark:text-[#F3F5F4] hover:border-[#C5C2B2] dark:hover:border-[#405049] focus:outline-hidden cursor-pointer"
          >
            {PASSING_YEARS.map((y) => (
              <option key={y} value={y === "All Years" ? "all" : y} className="dark:bg-[#161B19] dark:text-[#F3F5F4]">
                {y === "All Years" ? "Graduation Year: All" : `Class of ${y}`}
              </option>
            ))}
          </select>
        </div>

        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="inline-flex items-center gap-1 text-xs text-[#B8532F] hover:underline font-medium cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            Reset all filters
          </button>
        )}
      </div>
    </div>
  );
}
