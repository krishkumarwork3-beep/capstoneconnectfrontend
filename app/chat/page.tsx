"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Users2,
  Search,
  Circle,
} from "lucide-react";
import { Conversation } from "@/lib/types";
import { getConversations } from "@/lib/api/chat";
import { useAuth } from "@/lib/context/auth-context";
import { useMessages } from "@/lib/hooks/useMessages";
import { ChatBubble } from "@/components/chat/ChatBubble";
import { ChatComposer } from "@/components/chat/ChatComposer";
import { EmptyChatState } from "@/components/common/EmptyState";
import { Skeleton } from "@/components/common/LoadingSkeleton";
import { formatDate, getAvatarColor, getInitials } from "@/lib/utils";

export default function ChatPage() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load conversations
  useEffect(() => {
    async function load() {
      if (!user) return;
      try {
        const list = await getConversations(user.id);
        setConversations(list);
        if (list.length > 0 && !activeConvId) {
          setActiveConvId(list[0].id);
        }
      } finally {
        setLoadingConvs(false);
      }
    }
    load();
  }, [user]);

  // Hook for messages of active thread
  const { messages, loading: messagesLoading, sendMessage } = useMessages(
    activeConvId,
    user?.id || null
  );

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const activeConv = conversations.find((c) => c.id === activeConvId);

  const filteredConversations = conversations.filter((c) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      c.title.toLowerCase().includes(q) ||
      (c.subtitle && c.subtitle.toLowerCase().includes(q))
    );
  });

  return (
    <div className="h-[calc(100vh-8.5rem)] flex flex-col rounded-2xl border border-[#E2E0D7] dark:border-[#293430] bg-white dark:bg-[#161B19] shadow-xs overflow-hidden">
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Conversation List */}
        <aside className="w-full sm:w-80 md:w-96 border-r border-[#E2E0D7] dark:border-[#293430] flex flex-col bg-[#FAF8F5] dark:bg-[#131715] shrink-0">
          {/* Header */}
          <div className="p-4 border-b border-[#E2E0D7] dark:border-[#293430] space-y-3 bg-white dark:bg-[#161B19]">
            <div className="flex items-center justify-between">
              <h2 className="font-serif-heading text-lg font-bold text-[#181C1B] dark:text-[#F3F5F4]">
                Messages & Channels
              </h2>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#EDF5F2] dark:bg-[#1C332B] text-[#153E35] dark:text-[#5CE08D] font-semibold border border-[#C8DFD7] dark:border-[#2B5446]">
                Live Polling (4s)
              </span>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#8C9490]" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search conversations..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#FAF8F5] dark:bg-[#1D2421] border border-[#E2E0D7] dark:border-[#293430] rounded-xl focus:border-[#153E35] dark:focus:border-[#5CE08D] focus:outline-hidden text-[#181C1B] dark:text-[#F3F5F4]"
              />
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#E2E0D7]/50 dark:divide-[#293430]/50">
            {loadingConvs ? (
              <div className="p-4 space-y-3">
                <Skeleton variant="card" className="h-16" />
                <Skeleton variant="card" className="h-16" />
                <Skeleton variant="card" className="h-16" />
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#8C9490]">
                No conversations found.
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const isSelected = conv.id === activeConvId;
                const isGroup = conv.type === "group";
                const avatarStyle = getAvatarColor(conv.id);

                return (
                  <button
                    key={conv.id}
                    onClick={() => setActiveConvId(conv.id)}
                    className={`w-full text-left p-3.5 flex items-start gap-3 transition-colors cursor-pointer ${
                      isSelected
                        ? "border-l-4 border-[#153E35] dark:border-[#5CE08D] bg-stone-100/80 dark:bg-[#1E2522]"
                        : "hover:bg-white/60 dark:hover:bg-[#1C221F]"
                    }`}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center font-serif-heading font-bold text-sm shrink-0 border mt-0.5"
                      style={{
                        backgroundColor: avatarStyle.bg,
                        color: avatarStyle.text,
                        borderColor: avatarStyle.border,
                      }}
                    >
                      {isGroup ? <Users2 className="w-5 h-5" /> : getInitials(conv.title)}
                    </div>

                    <div className="min-w-0 flex-1 space-y-0.5">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs text-[#181C1B] dark:text-[#F3F5F4] truncate">
                          {conv.title}
                        </span>
                        {conv.last_message && (
                          <span className="text-[10px] text-[#8C9490] dark:text-[#7A8883] shrink-0">
                            {formatDate(conv.last_message.created_at)}
                          </span>
                        )}
                      </div>

                      {conv.subtitle && (
                        <p className="text-[11px] text-[#3F4744] dark:text-[#B0B9B6] truncate">
                          {conv.subtitle}
                        </p>
                      )}

                      {conv.last_message && (
                        <p className="text-[11px] text-[#8C9490] dark:text-[#7A8883] line-clamp-1">
                          <span className="font-medium text-[#3F4744] dark:text-[#B0B9B6]">
                            {conv.last_message.sender_name.split(" ")[0]}:
                          </span>{" "}
                          {conv.last_message.text}
                        </p>
                      )}
                    </div>

                    {conv.unread_count ? (
                      <span className="w-2 h-2 rounded-full bg-[#B8532F] shrink-0 mt-2" />
                    ) : null}
                  </button>
                );
              })
            )}
          </div>
        </aside>

        {/* Right Panel: Active Thread */}
        <main className="flex-1 flex flex-col bg-[#FAF8F5] dark:bg-[#101413] overflow-hidden">
          {activeConv ? (
            <>
              {/* Thread Header */}
              <div className="h-16 px-6 bg-white dark:bg-[#161B19] border-b border-[#E2E0D7] dark:border-[#293430] flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#FAF8F5] dark:bg-[#1D2421] border border-[#E2E0D7] dark:border-[#293430] flex items-center justify-center text-[#153E35] dark:text-[#5CE08D] font-bold text-xs">
                    {activeConv.type === "group" ? (
                      <Users2 className="w-4 h-4" />
                    ) : (
                      getInitials(activeConv.title)
                    )}
                  </div>
                  <div>
                    <h3 className="font-serif-heading text-sm sm:text-base font-bold text-[#181C1B] dark:text-[#F3F5F4]">
                      {activeConv.title}
                    </h3>
                    <p className="text-[11px] text-[#3F4744] dark:text-[#B0B9B6]">
                      {activeConv.subtitle ||
                        `${activeConv.participants.length} project collaborators`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-[#1B5E33] dark:text-[#5CE08D] bg-[#EBF7EE] dark:bg-[#153320] px-2.5 py-1 rounded-full border border-[#C8EBD1] dark:border-[#235C37]">
                  <Circle className="w-2 h-2 fill-current" />
                  <span className="font-medium">Active</span>
                </div>
              </div>

              {/* Messages Scroll Area */}
              <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
                {messagesLoading ? (
                  <div className="space-y-4">
                    <Skeleton variant="rectangular" className="w-48 h-12 rounded-xl" />
                    <Skeleton variant="rectangular" className="w-64 h-14 rounded-xl ml-auto" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-12 text-xs text-[#8C9490]">
                    No messages yet in this channel. Say hello to your teammates!
                  </div>
                ) : (
                  messages.map((msg) => (
                    <ChatBubble
                      key={msg.id}
                      message={msg}
                      isSelf={msg.sender_id === user?.id}
                      showSenderName={activeConv.type === "group"}
                    />
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Composer */}
              <ChatComposer onSendMessage={sendMessage} />
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-6">
              <EmptyChatState />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
