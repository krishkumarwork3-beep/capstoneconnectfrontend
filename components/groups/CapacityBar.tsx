import React from "react";
import { Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface CapacityBarProps {
  current: number;
  max: number;
  className?: string;
}

export function CapacityBar({ current, max, className }: CapacityBarProps) {
  const percentage = Math.min(100, Math.round((current / max) * 100));
  const isFull = current >= max;
  const remainingSlots = Math.max(0, max - current);

  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-center justify-between text-xs">
        <span className="flex items-center gap-1.5 font-medium text-[#5C6461]">
          <Users className="w-3.5 h-3.5 text-[#8C9490]" />
          <span>Team Capacity:</span>
        </span>
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-[#181C1B]">
            {current}/{max} slots
          </span>
          {isFull ? (
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#FAF1EC] text-[#8C4020] font-bold border border-[#F5D7C7]">
              FULL
            </span>
          ) : (
            <span className="text-[10px] text-[#1B5E33] font-medium">
              ({remainingSlots} open)
            </span>
          )}
        </div>
      </div>

      {/* Progress track with segmented blocks */}
      <div className="h-2 w-full bg-[#EFECE6] rounded-full overflow-hidden flex gap-0.5 p-0.5">
        {Array.from({ length: max }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "flex-1 h-full rounded-full transition-all duration-300",
              i < current
                ? isFull
                  ? "bg-[#8C4020]"
                  : "bg-[#153E35]"
                : "bg-transparent"
            )}
          />
        ))}
      </div>
    </div>
  );
}
