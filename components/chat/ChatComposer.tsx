"use client";

import React, { useState } from "react";
import { Send } from "lucide-react";

interface ChatComposerProps {
  onSendMessage: (text: string) => Promise<void>;
  disabled?: boolean;
}

export function ChatComposer({ onSendMessage, disabled = false }: ChatComposerProps) {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!text.trim() || sending || disabled) return;

    setSending(true);
    try {
      await onSendMessage(text.trim());
      setText("");
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-3 bg-white dark:bg-[#161B19] border-t border-[#E7E5DF] dark:border-[#293430] flex items-end gap-2"
    >
      <div className="relative flex-1">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message to your capstone team... (Enter to send, Shift+Enter for new line)"
          rows={1}
          disabled={disabled}
          className="w-full text-xs sm:text-sm p-3 max-h-32 min-h-[44px] rounded-xl border border-[#E7E5DF] dark:border-[#293430] focus:border-[#153E35] dark:focus:border-[#5CE08D] focus:outline-hidden resize-none bg-[#FAF8F5] dark:bg-[#1D2421] text-[#181C1B] dark:text-[#F3F5F4]"
        />
      </div>

      <button
        type="submit"
        disabled={!text.trim() || sending || disabled}
        className="w-11 h-11 rounded-xl bg-[#153E35] dark:bg-[#225C50] hover:bg-[#0E2B25] dark:hover:bg-[#2B7364] text-white flex items-center justify-center transition-colors shrink-0 disabled:opacity-40 cursor-pointer shadow-2xs"
        title="Send message"
      >
        <Send className="w-4 h-4" />
      </button>
    </form>
  );
}
