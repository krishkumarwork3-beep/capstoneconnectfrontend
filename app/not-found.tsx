import Link from "next/link";
import { Compass, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8">
      <div className="w-16 h-16 rounded-2xl bg-white border border-[#E7E5DF] flex items-center justify-center mb-4 text-[#153E35] shadow-xs">
        <Compass className="w-8 h-8 stroke-[1.75]" />
      </div>
      <h1 className="font-serif-heading text-3xl font-bold text-[#181C1B] mb-2">
        Page Not Found
      </h1>
      <p className="text-xs sm:text-sm text-[#5C6461] max-w-md mb-6 leading-relaxed">
        The student profile, capstone group, or route you are attempting to view does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#153E35] hover:bg-[#0E2B25] rounded-xl transition-colors shadow-2xs"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Return to Collaborators Feed</span>
      </Link>
    </div>
  );
}
