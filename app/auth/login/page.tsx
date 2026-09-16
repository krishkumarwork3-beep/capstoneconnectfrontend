"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Phone, Lock, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { login } from "@/lib/api/auth";
import { useAuth } from "@/lib/context/auth-context";

export default function LoginPage() {
  const router = useRouter();
  const { loginAs, availablePersonas } = useAuth();
  const [phone, setPhone] = useState("+91 98765 43210");
  const [password, setPassword] = useState("••••••••");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login({ phone, password });
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Failed to log in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-10 sm:py-16">
      <div className="bg-white rounded-2xl border border-[#E7E5DF] p-7 sm:p-8 shadow-xs space-y-6">
        {/* Header */}
        <div className="text-center space-y-1.5">
          <div className="w-10 h-10 rounded-xl bg-[#153E35] text-white font-serif-heading font-bold text-xl flex items-center justify-center mx-auto shadow-2xs">
            C
          </div>
          <h1 className="font-serif-heading text-2xl font-bold text-[#181C1B]">
            Welcome back to CapstoneConnect
          </h1>
          <p className="text-xs text-[#5C6461]">
            Log in with your registered phone number to manage your team & collaborate.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-[#FAF1EC] border border-[#F5D7C7] text-xs text-[#8C4020]">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#181C1B] mb-1.5">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C9490]" />
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-[#FAF8F5] border border-[#E7E5DF] rounded-xl focus:border-[#153E35] focus:outline-hidden text-[#181C1B]"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-[#181C1B]">Password</label>
              <span className="text-[11px] text-[#8C9490]">Demo auth active</span>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C9490]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-[#FAF8F5] border border-[#E7E5DF] rounded-xl focus:border-[#153E35] focus:outline-hidden text-[#181C1B]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#153E35] hover:bg-[#0E2B25] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-60"
          >
            <span>{loading ? "Signing in..." : "Log in to your account"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Fast Login Panel */}
        <div className="pt-4 border-t border-[#F0EFEA] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#8C9490] flex items-center gap-1 uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-[#B8532F]" />
              1-Click Demo Personas
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {availablePersonas.slice(0, 4).map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={async () => {
                  await loginAs(p.id);
                  router.push("/");
                }}
                className="text-left p-2 rounded-lg border border-[#E7E5DF] bg-[#FAF8F5] hover:border-[#153E35] hover:bg-[#EDF5F2] transition-colors text-xs cursor-pointer"
              >
                <p className="font-semibold text-[#181C1B] truncate">{p.name}</p>
                <p className="text-[10px] text-[#5C6461] truncate">
                  {p.college} • {p.group_role || "No group"}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center pt-2 text-xs text-[#5C6461]">
          Don&apos;t have an account yet?{" "}
          <Link href="/auth/signup" className="font-semibold text-[#153E35] hover:underline">
            Sign up now
          </Link>
        </div>
      </div>
    </div>
  );
}
