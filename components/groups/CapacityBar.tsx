import React from "react";
import { Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface CapacityBarProps {
  current: number;
  max: number;
  className?: string;
}

export function CapacityBar({ current, max, className }: CapacityBarProps) {
  const isFull = current >= max;
  const remainingSlots = Math.max(0, max - current);

  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-center justify-between text-xs">
        <span className="flex items-center gap-1.5 font-medium text-[#3F4744] dark:text-[#B0B9B6]">
          <Users className="w-3.5 h-3.5 text-[#8C9490] dark:text-[#7A8883]" />
          <span>Team Capacity:</span>
        </span>
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-[#181C1B] dark:text-[#F3F5F4]">
            {current}/{max} slots
          </span>
          {isFull ? (
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#FAF1EC] dark:bg-[#3D1A10] text-[#8C4020] dark:text-[#FF8D66] font-bold border border-[#F5D7C7] dark:border-[#5A2616]">
              FULL
            </span>
          ) : (
            <span className="text-[10px] text-[#1B5E33] dark:text-[#5CE08D] font-medium">
              ({remainingSlots} open)
            </span>
          )}
        </div>
      </div>

      {/* Progress track with segmented blocks */}
      <div className="h-2 w-full bg-[#EFECE6] dark:bg-[#222B27] rounded-full overflow-hidden flex gap-0.5 p-0.5">
        {Array.from({ length: max }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "flex-1 h-full rounded-full transition-all duration-300",
              i < current
                ? isFull
                  ? "bg-[#8C4020] dark:bg-[#FF8D66]"
                  : "bg-[#153E35] dark:bg-[#5CE08D]"
                : "bg-transparent"
            )}
          />
        ))}
      </div>
    </div>
  );
}
