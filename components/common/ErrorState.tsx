import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  message = "We encountered an unexpected error while loading this content. Please try again.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 rounded-2xl border border-[#F5D7C7] bg-[#FDF7F4]",
        className
      )}
    >
      <div className="w-12 h-12 rounded-full bg-[#FCECE4] flex items-center justify-center mb-3 text-[#B8532F]">
        <AlertCircle className="w-6 h-6 stroke-[2]" />
      </div>
      <h3 className="font-serif-heading text-lg font-medium text-[#181C1B] mb-1">{title}</h3>
      <p className="text-sm text-[#5C6461] max-w-sm mb-5 leading-relaxed">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#181C1B] bg-white border border-[#E7E5DF] hover:bg-[#F5F4F0] rounded-lg transition-colors cursor-pointer shadow-xs"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Try Again
        </button>
      )}
    </div>
  );
}
