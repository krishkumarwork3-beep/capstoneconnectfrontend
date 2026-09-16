import React from "react";
import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "circular" | "rectangular" | "card";
}

export function Skeleton({ className, variant = "rectangular", ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse bg-[#EFECE6]",
        variant === "circular" && "rounded-full",
        variant === "text" && "h-4 rounded",
        variant === "rectangular" && "rounded-lg",
        variant === "card" && "rounded-xl border border-[#E7E5DF] p-6 space-y-4",
        className
      )}
      {...props}
    />
  );
}

export function UserCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-[#E7E5DF] p-5 space-y-4 shadow-xs">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Skeleton variant="circular" className="w-12 h-12" />
          <div className="space-y-2">
            <Skeleton variant="text" className="w-32 h-4" />
            <Skeleton variant="text" className="w-48 h-3" />
          </div>
        </div>
        <Skeleton variant="rectangular" className="w-24 h-6 rounded-full" />
      </div>
      <Skeleton variant="text" className="w-full h-12" />
      <div className="flex gap-2">
        <Skeleton variant="rectangular" className="w-16 h-6 rounded" />
        <Skeleton variant="rectangular" className="w-16 h-6 rounded" />
        <Skeleton variant="rectangular" className="w-16 h-6 rounded" />
      </div>
      <div className="pt-3 border-t border-[#F0EFEA] flex justify-between">
        <Skeleton variant="rectangular" className="w-28 h-8 rounded-lg" />
        <Skeleton variant="rectangular" className="w-36 h-8 rounded-lg" />
      </div>
    </div>
  );
}

export function GroupCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-[#E7E5DF] p-6 space-y-4 shadow-xs">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <Skeleton variant="text" className="w-44 h-5" />
          <Skeleton variant="text" className="w-28 h-3" />
        </div>
        <Skeleton variant="rectangular" className="w-20 h-6 rounded-full" />
      </div>
      <Skeleton variant="text" className="w-full h-10" />
      <Skeleton variant="rectangular" className="w-full h-2 rounded-full" />
      <div className="pt-4 border-t border-[#F0EFEA] flex justify-between items-center">
        <Skeleton variant="text" className="w-32 h-4" />
        <Skeleton variant="rectangular" className="w-28 h-8 rounded-lg" />
      </div>
    </div>
  );
}
