"use client";

import React, { useState } from "react";
import { Send, Paperclip } from "lucide-react";

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
      className="p-3 bg-white border-t border-[#E7E5DF] flex items-end gap-2"
    >
      <div className="relative flex-1">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message to your capstone team... (Enter to send, Shift+Enter for new line)"
          rows={1}
          disabled={disabled}
          className="w-full text-xs sm:text-sm p-3 max-h-32 min-h-[44px] rounded-xl border border-[#E7E5DF] focus:border-[#153E35] focus:outline-hidden resize-none bg-[#FAF8F5] text-[#181C1B]"
        />
      </div>

      <button
        type="submit"
        disabled={!text.trim() || sending || disabled}
        className="w-11 h-11 rounded-xl bg-[#153E35] hover:bg-[#0E2B25] text-white flex items-center justify-center transition-colors shrink-0 disabled:opacity-40 cursor-pointer shadow-2xs"
        title="Send message"
      >
        <Send className="w-4 h-4" />
      </button>
    </form>
  );
}
