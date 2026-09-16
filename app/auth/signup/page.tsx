"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User as UserIcon, GraduationCap, Calendar, Phone, Lock, ArrowRight } from "lucide-react";
import { signup } from "@/lib/api/auth";

const COLLEGES = [
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
  "Other Indian Institution",
];

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    college: "IIT Bombay",
    department: "Computer Science & Engg",
    passing_year: 2026,
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await signup({
        name: formData.name,
        college: formData.college,
        department: formData.department,
        passing_year: Number(formData.passing_year),
        phone: formData.phone,
        password: formData.password,
      });
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto py-8 sm:py-12">
      <div className="bg-white rounded-2xl border border-[#E7E5DF] p-7 sm:p-8 shadow-xs space-y-6">
        <div className="text-center space-y-1.5">
          <div className="w-10 h-10 rounded-xl bg-[#153E35] text-white font-serif-heading font-bold text-xl flex items-center justify-center mx-auto shadow-2xs">
            C
          </div>
          <h1 className="font-serif-heading text-2xl font-bold text-[#181C1B]">
            Create your Student Profile
          </h1>
          <p className="text-xs text-[#5C6461]">
            Join the capstone network to showcase your research, find teammates, and build projects.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-[#FAF1EC] border border-[#F5D7C7] text-xs text-[#8C4020]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-[#181C1B] mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C9490]" />
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Aarav Sharma"
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-[#FAF8F5] border border-[#E7E5DF] rounded-xl focus:border-[#153E35] focus:outline-hidden text-[#181C1B]"
              />
            </div>
          </div>

          {/* College and Department */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#181C1B] mb-1.5">
                College / University
              </label>
              <div className="relative">
                <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C9490]" />
                <select
                  value={formData.college}
                  onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-[#FAF8F5] border border-[#E7E5DF] rounded-xl focus:border-[#153E35] focus:outline-hidden text-[#181C1B] cursor-pointer"
                >
                  {COLLEGES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#181C1B] mb-1.5">
                Department / Major
              </label>
              <input
                type="text"
                required
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                placeholder="e.g. Computer Science"
                className="w-full px-3 py-2 text-xs sm:text-sm bg-[#FAF8F5] border border-[#E7E5DF] rounded-xl focus:border-[#153E35] focus:outline-hidden text-[#181C1B]"
              />
            </div>
          </div>

          {/* Passing Year and Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#181C1B] mb-1.5">
                Passing Year
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C9490]" />
                <select
                  value={formData.passing_year}
                  onChange={(e) => setFormData({ ...formData, passing_year: Number(e.target.value) })}
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-[#FAF8F5] border border-[#E7E5DF] rounded-xl focus:border-[#153E35] focus:outline-hidden text-[#181C1B] cursor-pointer"
                >
                  <option value={2024}>2024</option>
                  <option value={2025}>2025</option>
                  <option value={2026}>2026</option>
                  <option value={2027}>2027</option>
                  <option value={2028}>2028</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#181C1B] mb-1.5">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C9490]" />
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-[#FAF8F5] border border-[#E7E5DF] rounded-xl focus:border-[#153E35] focus:outline-hidden text-[#181C1B]"
                />
              </div>
            </div>
          </div>

          {/* Password and Confirm Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#181C1B] mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C9490]" />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Min 8 characters"
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-[#FAF8F5] border border-[#E7E5DF] rounded-xl focus:border-[#153E35] focus:outline-hidden text-[#181C1B]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#181C1B] mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C9490]" />
                <input
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="Repeat password"
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-[#FAF8F5] border border-[#E7E5DF] rounded-xl focus:border-[#153E35] focus:outline-hidden text-[#181C1B]"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#153E35] hover:bg-[#0E2B25] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-60 pt-2"
          >
            <span>{loading ? "Creating Account..." : "Complete Sign Up"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 text-xs text-[#5C6461]">
          Already have an account?{" "}
          <Link href="/auth/login" className="font-semibold text-[#153E35] hover:underline">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
