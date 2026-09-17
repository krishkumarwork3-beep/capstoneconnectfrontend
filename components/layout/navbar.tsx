"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Compass,
  Users2,
  Inbox,
  MessageSquare,
  UserCheck,
  ChevronDown,
  LogOut,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "@/lib/context/auth-context";
import { getAvatarColor, getInitials } from "@/lib/utils";
import { ThemeToggle } from "@/components/common/ThemeToggle";

export function Navbar() {
  const pathname = usePathname();
  const { user, loginAs, logout, availablePersonas } = useAuth();
  const [isPersonaOpen, setIsPersonaOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const personaRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (personaRef.current && !personaRef.current.contains(e.target as Node)) {
        setIsPersonaOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { href: "/", label: "Discover", icon: Compass },
    { href: "/groups", label: "Groups", icon: Users2 },
    { href: "/requests", label: "Requests", icon: Inbox, badge: 2 },
    { href: "/chat", label: "Chat", icon: MessageSquare, badge: 1 },
  ];

  const avatarStyle = user ? getAvatarColor(user.id) : { bg: "#EDF5F2", text: "#153E35", border: "#C8DFD7" };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-[#161B19]/95 backdrop-blur-md border-b border-[#E2E0D7] dark:border-[#293430] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-[#153E35] dark:bg-[#225C50] flex items-center justify-center text-white font-serif-heading font-bold text-lg shadow-xs group-hover:bg-[#0E2B25] dark:group-hover:bg-[#2B7364] transition-colors">
              C
            </div>
            <div className="flex flex-col">
              <span className="font-serif-heading text-lg font-semibold tracking-tight text-[#181C1B] dark:text-[#F3F5F4]">
                Capstone<span className="text-[#153E35] dark:text-[#5CE08D]">Connect</span>
              </span>
              <span className="text-[10px] text-[#8C9490] dark:text-[#74807C] tracking-wider uppercase font-medium -mt-1">
                Indian Engineering Network
              </span>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-t-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-[#EDF5F2] dark:bg-[#162B25] text-[#153E35] dark:text-[#5CE08D] font-semibold border-b-2 border-emerald-800 dark:border-[#5CE08D]"
                      : "text-[#3F4744] dark:text-[#B0B9B6] hover:text-[#181C1B] dark:hover:text-[#F3F5F4] hover:bg-[#F5F4F0] dark:hover:bg-[#222B27] border-b-2 border-transparent"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                  {link.badge ? (
                    <span className="inline-flex items-center justify-center px-1.5 py-0.2 text-[11px] font-bold rounded-full bg-[#B8532F] dark:bg-[#D96841] text-white">
                      {link.badge}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2.5">
          {/* Theme Toggle Button */}
          <ThemeToggle />

          {/* Persona Switcher for senior live demo review */}
          <div className="relative" ref={personaRef}>
            <button
              onClick={() => setIsPersonaOpen(!isPersonaOpen)}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-[#E2E0D7] dark:border-[#293430] bg-[#FAF8F5] dark:bg-[#1D2421] text-[#3F4744] dark:text-[#B0B9B6] hover:border-[#C5C2B2] dark:hover:border-[#405049] hover:text-[#181C1B] dark:hover:text-[#F3F5F4] transition-colors cursor-pointer"
              title="Switch demo student persona to test different permissions"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#B8532F] dark:text-[#D96841]" />
              <span>Persona:</span>
              <span className="font-semibold text-[#181C1B] dark:text-[#F3F5F4] max-w-[110px] truncate">
                {user ? user.name.split(" ")[0] : "Guest"}
              </span>
              <ChevronDown className="w-3 h-3 text-[#8C9490] dark:text-[#74807C]" />
            </button>

            {isPersonaOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-[#1A211E] rounded-xl border border-[#E2E0D7] dark:border-[#293430] shadow-elevated p-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="px-3 py-2 border-b border-[#F0EFEA] dark:border-[#293430] mb-1">
                  <p className="text-xs font-semibold text-[#181C1B] dark:text-[#F3F5F4]">Demo Persona Switcher</p>
                  <p className="text-[11px] text-[#8C9490] dark:text-[#74807C]">Test role permissions & group states live</p>
                </div>
                <div className="space-y-1 max-h-72 overflow-y-auto">
                  {availablePersonas.map((p) => {
                    const isSelected = user?.id === p.id;
                    return (
                      <button
                        key={p.id}
                        onClick={() => {
                          loginAs(p.id);
                          setIsPersonaOpen(false);
                        }}
                        className={`w-full text-left p-2 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer ${
                          isSelected ? "bg-[#EDF5F2] dark:bg-[#162B25] text-[#153E35] dark:text-[#5CE08D] font-semibold" : "hover:bg-[#F5F4F0] dark:hover:bg-[#222B27] text-[#181C1B] dark:text-[#F3F5F4]"
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span>{p.name}</span>
                            {p.group_role === "admin" && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#FAF1EC] dark:bg-[#2E1B14] text-[#B8532F] dark:text-[#D96841] font-medium border border-[#F5D7C7] dark:border-[#4A2B1F]">
                                Admin
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-[#8C9490] dark:text-[#74807C]">
                            {p.college} • {p.group_name || "Looking for Group"}
                          </p>
                        </div>
                        {isSelected && <UserCheck className="w-4 h-4 text-[#153E35] dark:text-[#5CE08D]" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* User Profile dropdown */}
          {user ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-[#F5F4F0] transition-colors cursor-pointer"
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border"
                  style={{
                    backgroundColor: avatarStyle.bg,
                    color: avatarStyle.text,
                    borderColor: avatarStyle.border,
                  }}
                >
                  {getInitials(user.name)}
                </div>
                <div className="hidden lg:flex flex-col text-left">
                  <span className="text-xs font-semibold text-[#181C1B] leading-tight">{user.name}</span>
                  <span className="text-[10px] text-[#8C9490] leading-tight truncate max-w-[120px]">
                    {user.college}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-[#8C9490]" />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#1A211E] rounded-xl border border-[#E2E0D7] dark:border-[#293430] shadow-elevated p-2 z-50">
                  <div className="px-3 py-2 border-b border-[#F0EFEA] dark:border-[#293430] mb-1">
                    <p className="text-xs font-semibold text-[#181C1B] dark:text-[#F3F5F4] truncate">{user.name}</p>
                    <p className="text-[11px] text-[#3F4744] dark:text-[#B0B9B6] truncate">{user.college}</p>
                    {user.group_name && (
                      <span className="inline-flex items-center gap-1 text-[10px] mt-1.5 px-1.5 py-0.5 rounded bg-[#F1F4F8] dark:bg-[#152433] text-[#2D4B73] dark:text-[#7DB2E8]">
                        <ShieldCheck className="w-3 h-3" />
                        {user.group_name} ({user.group_role})
                      </span>
                    )}
                  </div>

                  <Link
                    href="/profile"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs text-[#181C1B] dark:text-[#F3F5F4] hover:bg-[#F5F4F0] dark:hover:bg-[#222B27] rounded-lg transition-colors"
                  >
                    <span>View & Edit Profile</span>
                  </Link>

                  <Link
                    href={`/profile/${user.id}`}
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs text-[#181C1B] dark:text-[#F3F5F4] hover:bg-[#F5F4F0] dark:hover:bg-[#222B27] rounded-lg transition-colors"
                  >
                    <span>Public View Preview</span>
                  </Link>

                  <Link
                    href="/groups"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs text-[#181C1B] dark:text-[#F3F5F4] hover:bg-[#F5F4F0] dark:hover:bg-[#222B27] rounded-lg transition-colors"
                  >
                    <span>My Capstone Groups</span>
                  </Link>

                  <div className="border-t border-[#F0EFEA] dark:border-[#293430] my-1" />

                  <button
                    onClick={() => {
                      logout();
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#B8532F] dark:text-[#D96841] hover:bg-[#FDF3EE] dark:hover:bg-[#2E1B14] rounded-lg transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/auth/login"
                className="px-3 py-1.5 text-xs font-medium text-[#181C1B] dark:text-[#F3F5F4] hover:bg-[#F5F4F0] dark:hover:bg-[#222B27] rounded-lg transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/auth/signup"
                className="px-3.5 py-1.5 text-xs font-medium text-white bg-[#153E35] dark:bg-[#225C50] hover:bg-[#0E2B25] dark:hover:bg-[#2B7364] rounded-lg transition-colors"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Nav Bar */}
      <div className="flex md:hidden border-t border-[#E2E0D7] dark:border-[#293430] px-4 py-2 justify-around bg-[#FAF8F5] dark:bg-[#161B19]">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center gap-0.5 text-[11px] font-medium py-1 px-2 transition-colors ${
                isActive ? "text-[#153E35] dark:text-[#5CE08D] font-semibold border-b-2 border-emerald-800 dark:border-[#5CE08D]" : "text-[#3F4744] dark:text-[#B0B9B6] border-b-2 border-transparent"
              }`}
            >
              <div className="relative">
                <Icon className="w-4 h-4" />
                {link.badge ? (
                  <span className="absolute -top-1.5 -right-2 w-3.5 h-3.5 flex items-center justify-center text-[9px] font-bold rounded-full bg-[#B8532F] dark:bg-[#D96841] text-white">
                    {link.badge}
                  </span>
                ) : null}
              </div>
              <span>{link.label}</span>
            </Link>
          );
        })}
      </div>
    </header>
  );
}
