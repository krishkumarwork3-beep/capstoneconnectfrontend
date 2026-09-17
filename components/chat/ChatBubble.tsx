import React from "react";
import { ChatMessage } from "@/lib/types";
import { cn, formatDate, getAvatarColor, getInitials } from "@/lib/utils";

interface ChatBubbleProps {
  message: ChatMessage;
  isSelf: boolean;
  showSenderName?: boolean;
}

export function ChatBubble({ message, isSelf, showSenderName = true }: ChatBubbleProps) {
  const avatarStyle = getAvatarColor(message.sender_id);

  return (
    <div
      className={cn(
        "flex items-end gap-2.5 max-w-[85%] sm:max-w-[70%]",
        isSelf ? "ml-auto flex-row-reverse" : "mr-auto"
      )}
    >
      {!isSelf && (
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 border mb-0.5"
          style={{
            backgroundColor: avatarStyle.bg,
            color: avatarStyle.text,
            borderColor: avatarStyle.border,
          }}
        >
          {getInitials(message.sender_name)}
        </div>
      )}

      <div className={cn("space-y-1", isSelf ? "items-end" : "items-start")}>
        {!isSelf && showSenderName && (
          <span className="text-[11px] font-semibold text-[#3F4744] dark:text-[#B0B9B6] ml-1">
            {message.sender_name}
          </span>
        )}

        <div
          className={cn(
            "p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed",
            isSelf
              ? "bg-[#153E35] dark:bg-[#225C50] text-white shadow-xs rounded-br-xs"
              : "bg-white dark:bg-[#161B19] border border-stone-200 dark:border-[#293430] text-stone-900 dark:text-[#F3F5F4] shadow-xs rounded-bl-xs"
          )}
        >
          <p className="whitespace-pre-wrap">{message.text}</p>
        </div>

        <div
          className={cn(
            "text-[10px] text-[#8C9490] dark:text-[#7A8883] px-1",
            isSelf ? "text-right" : "text-left"
          )}
        >
          {formatDate(message.created_at)}
        </div>
      </div>
    </div>
  );
}
