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
          <span className="text-[11px] font-semibold text-[#5C6461] ml-1">
            {message.sender_name}
          </span>
        )}

        <div
          className={cn(
            "p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-2xs",
            isSelf
              ? "bg-[#153E35] text-white rounded-br-xs"
              : "bg-white text-[#181C1B] border border-[#E7E5DF] rounded-bl-xs"
          )}
        >
          <p className="whitespace-pre-wrap">{message.text}</p>
        </div>

        <div
          className={cn(
            "text-[10px] text-[#8C9490] px-1",
            isSelf ? "text-right" : "text-left"
          )}
        >
          {formatDate(message.created_at)}
        </div>
      </div>
    </div>
  );
}
