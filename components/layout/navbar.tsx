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
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-[#E7E5DF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-[#153E35] flex items-center justify-center text-white font-serif-heading font-bold text-lg shadow-xs group-hover:bg-[#0E2B25] transition-colors">
              C
            </div>
            <div className="flex flex-col">
              <span className="font-serif-heading text-lg font-semibold tracking-tight text-[#181C1B]">
                Capstone<span className="text-[#153E35]">Connect</span>
              </span>
              <span className="text-[10px] text-[#8C9490] tracking-wider uppercase font-medium -mt-1">
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
                  className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-[#EDF5F2] text-[#153E35] font-semibold"
                      : "text-[#5C6461] hover:text-[#181C1B] hover:bg-[#F5F4F0]"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                  {link.badge ? (
                    <span className="inline-flex items-center justify-center px-1.5 py-0.2 text-[11px] font-bold rounded-full bg-[#B8532F] text-white">
                      {link.badge}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-3">
          {/* Persona Switcher for senior live demo review */}
          <div className="relative" ref={personaRef}>
            <button
              onClick={() => setIsPersonaOpen(!isPersonaOpen)}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-[#E7E5DF] bg-[#FAF8F5] text-[#5C6461] hover:border-[#D1CEBE] hover:text-[#181C1B] transition-colors cursor-pointer"
              title="Switch demo student persona to test different permissions"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#B8532F]" />
              <span>Persona:</span>
              <span className="font-semibold text-[#181C1B] max-w-[110px] truncate">
                {user ? user.name.split(" ")[0] : "Guest"}
              </span>
              <ChevronDown className="w-3 h-3 text-[#8C9490]" />
            </button>

            {isPersonaOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl border border-[#E7E5DF] shadow-elevated p-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="px-3 py-2 border-b border-[#F0EFEA] mb-1">
                  <p className="text-xs font-semibold text-[#181C1B]">Demo Persona Switcher</p>
                  <p className="text-[11px] text-[#8C9490]">Test role permissions & group states live</p>
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
                          isSelected ? "bg-[#EDF5F2] text-[#153E35] font-semibold" : "hover:bg-[#F5F4F0] text-[#181C1B]"
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span>{p.name}</span>
                            {p.group_role === "admin" && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#FAF1EC] text-[#B8532F] font-medium border border-[#F5D7C7]">
                                Admin
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-[#8C9490]">
                            {p.college} • {p.group_name || "Looking for Group"}
                          </p>
                        </div>
                        {isSelected && <UserCheck className="w-4 h-4 text-[#153E35]" />}
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
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl border border-[#E7E5DF] shadow-elevated p-2 z-50">
                  <div className="px-3 py-2 border-b border-[#F0EFEA] mb-1">
                    <p className="text-xs font-semibold text-[#181C1B] truncate">{user.name}</p>
                    <p className="text-[11px] text-[#5C6461] truncate">{user.college}</p>
                    {user.group_name && (
                      <span className="inline-flex items-center gap-1 text-[10px] mt-1.5 px-1.5 py-0.5 rounded bg-[#F1F4F8] text-[#2D4B73]">
                        <ShieldCheck className="w-3 h-3" />
                        {user.group_name} ({user.group_role})
                      </span>
                    )}
                  </div>

                  <Link
                    href="/profile"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs text-[#181C1B] hover:bg-[#F5F4F0] rounded-lg transition-colors"
                  >
                    <span>View & Edit Profile</span>
                  </Link>

                  <Link
                    href={`/profile/${user.id}`}
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs text-[#181C1B] hover:bg-[#F5F4F0] rounded-lg transition-colors"
                  >
                    <span>Public View Preview</span>
                  </Link>

                  <Link
                    href="/groups"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs text-[#181C1B] hover:bg-[#F5F4F0] rounded-lg transition-colors"
                  >
                    <span>My Capstone Groups</span>
                  </Link>

                  <div className="border-t border-[#F0EFEA] my-1" />

                  <button
                    onClick={() => {
                      logout();
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#B8532F] hover:bg-[#FDF3EE] rounded-lg transition-colors cursor-pointer"
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
                className="px-3 py-1.5 text-xs font-medium text-[#181C1B] hover:bg-[#F5F4F0] rounded-lg transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/auth/signup"
                className="px-3.5 py-1.5 text-xs font-medium text-white bg-[#153E35] hover:bg-[#0E2B25] rounded-lg transition-colors"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Nav Bar */}
      <div className="flex md:hidden border-t border-[#E7E5DF] px-4 py-2 justify-around bg-[#FAF8F5]">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center gap-0.5 text-[11px] font-medium py-1 px-2 rounded-lg ${
                isActive ? "text-[#153E35] font-semibold" : "text-[#5C6461]"
              }`}
            >
              <div className="relative">
                <Icon className="w-4 h-4" />
                {link.badge ? (
                  <span className="absolute -top-1.5 -right-2 w-3.5 h-3.5 flex items-center justify-center text-[9px] font-bold rounded-full bg-[#B8532F] text-white">
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
