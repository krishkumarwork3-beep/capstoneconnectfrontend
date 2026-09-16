"use client";

import React, { useEffect } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Uncaught application error:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8">
      <div className="w-14 h-14 rounded-2xl bg-[#FAF1EC] border border-[#F5D7C7] flex items-center justify-center mb-4 text-[#8C4020] shadow-xs">
        <AlertCircle className="w-7 h-7 stroke-[2]" />
      </div>
      <h2 className="font-serif-heading text-2xl font-bold text-[#181C1B] mb-2">
        Something unexpected occurred
      </h2>
      <p className="text-xs sm:text-sm text-[#5C6461] max-w-md mb-6 leading-relaxed">
        {error.message || "An error occurred while loading this view. You can try refreshing the state."}
      </p>
      <button
        onClick={() => reset()}
        className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#153E35] hover:bg-[#0E2B25] rounded-xl transition-colors shadow-2xs cursor-pointer"
      >
        <RefreshCw className="w-3.5 h-3.5" />
        <span>Reload View</span>
      </button>
    </div>
  );
}
