import React from "react";
import { LucideIcon, FolderSearch, Users, MailQuestion, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon: Icon = FolderSearch,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-2xl border border-dashed border-[#D1CEBE] bg-[#FAF8F5]",
        className
      )}
    >
      <div className="w-14 h-14 rounded-2xl bg-white border border-[#E7E5DF] flex items-center justify-center mb-4 text-[#153E35] shadow-xs">
        <Icon className="w-7 h-7 stroke-[1.75]" />
      </div>
      <h3 className="font-serif-heading text-xl font-medium text-[#181C1B] mb-2">{title}</h3>
      <p className="text-sm text-[#5C6461] max-w-md mb-6 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-[#153E35] hover:bg-[#0E2B25] rounded-lg transition-colors cursor-pointer"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export function EmptyUsersState({ onReset }: { onReset?: () => void }) {
  return (
    <EmptyState
      icon={Users}
      title="No matching students found"
      description="We couldn't find any college students matching your current search or filters. Try adjusting your tech stack keywords or clearing the college filter."
      actionLabel={onReset ? "Clear all filters" : undefined}
      onAction={onReset}
    />
  );
}

export function EmptyRequestsState({ type }: { type: "sent" | "received" }) {
  return (
    <EmptyState
      icon={MailQuestion}
      title={type === "received" ? "No pending requests" : "No invitations sent"}
      description={
        type === "received"
          ? "You're all caught up! When other students ask to join your capstone group or invite you to theirs, they'll appear here."
          : "You haven't requested to join any groups yet. Explore open capstone teams in the Discover tab to find your project partners."
      }
    />
  );
}

export function EmptyChatState() {
  return (
    <EmptyState
      icon={MessageSquare}
      title="Select a conversation"
      description="Choose a teammate or capstone group from the left panel to coordinate tasks, share repository updates, and discuss your thesis."
    />
  );
}
