"use client";

import React, { useState, useEffect } from "react";
import { Search, X, Filter, SlidersHorizontal, Check } from "lucide-react";

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
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C9490]" />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search students by name, skills (e.g. PyTorch, Rust, ROS), or domain..."
            className="w-full pl-10 pr-10 py-2.5 text-sm bg-white rounded-xl border border-[#E7E5DF] focus:border-[#153E35] focus:outline-hidden text-[#181C1B] placeholder-[#8C9490] shadow-xs transition-colors"
          />
          {localSearch && (
            <button
              onClick={() => {
                setLocalSearch("");
                onSearchChange("");
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C9490] hover:text-[#181C1B] p-0.5"
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
                ? "bg-[#153E35] text-white"
                : "bg-white border border-[#E7E5DF] text-[#5C6461] hover:border-[#D1CEBE]"
            }`}
          >
            All Students
          </button>
          <button
            onClick={() => onHasGroupFilterChange(false)}
            className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer shrink-0 flex items-center gap-1.5 ${
              hasGroupFilter === false
                ? "bg-[#153E35] text-white"
                : "bg-white border border-[#E7E5DF] text-[#1B5E33] hover:border-[#C8EBD1]"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#1B5E33] shrink-0" />
            Looking for Group
          </button>
          <button
            onClick={() => onHasGroupFilterChange(true)}
            className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer shrink-0 ${
              hasGroupFilter === true
                ? "bg-[#153E35] text-white"
                : "bg-white border border-[#E7E5DF] text-[#24425F] hover:border-[#CBDCEB]"
            }`}
          >
            In a Group
          </button>
        </div>
      </div>

      {/* Secondary dropdown row: College, Passout year, and Reset */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[#8C9490] flex items-center gap-1 font-medium mr-1">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Filter by:
          </span>

          {/* College Selector */}
          <select
            value={college}
            onChange={(e) => onCollegeChange(e.target.value)}
            aria-label="Filter by College"
            className="px-2.5 py-1.5 rounded-lg border border-[#E7E5DF] bg-white text-[#181C1B] hover:border-[#D1CEBE] focus:outline-hidden cursor-pointer"
          >
            {COLLEGES.map((c) => (
              <option key={c} value={c === "All Colleges" ? "all" : c}>
                {c}
              </option>
            ))}
          </select>

          {/* Passing Year Selector */}
          <select
            value={passingYear}
            onChange={(e) => onPassingYearChange(e.target.value)}
            aria-label="Filter by Passing Year"
            className="px-2.5 py-1.5 rounded-lg border border-[#E7E5DF] bg-white text-[#181C1B] hover:border-[#D1CEBE] focus:outline-hidden cursor-pointer"
          >
            {PASSING_YEARS.map((y) => (
              <option key={y} value={y === "All Years" ? "all" : y}>
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
