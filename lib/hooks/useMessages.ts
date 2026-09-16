"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { ChatMessage } from "@/lib/types";
import { getMessages, sendMessage as apiSendMessage } from "@/lib/api/chat";

export function useMessages(conversationId: string | null, senderId: string | null) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const isPollingRef = useRef(true);

  const fetchMessages = useCallback(async (showLoading = false) => {
    if (!conversationId) return;
    if (showLoading) setLoading(true);
    try {
      const data = await getMessages(conversationId);
      setMessages(data);
      setError(false);
    } catch {
      setError(true);
    } finally {
      if (showLoading) setLoading(false);
    }
  }, [conversationId]);

  // Initial fetch on conversation switch
  useEffect(() => {
    if (conversationId) {
      fetchMessages(true);
    } else {
      setMessages([]);
      setLoading(false);
    }
  }, [conversationId, fetchMessages]);

  // Polling every 4.5 seconds for real-time synchronization
  useEffect(() => {
    if (!conversationId) return;
    isPollingRef.current = true;

    const interval = setInterval(() => {
      if (isPollingRef.current) {
        fetchMessages(false);
      }
    }, 4500);

    return () => {
      isPollingRef.current = false;
      clearInterval(interval);
    };
  }, [conversationId, fetchMessages]);

  // Optimistic Send message function
  const sendMessage = async (text: string) => {
    if (!conversationId || !senderId || !text.trim()) return;

    // Optimistic message
    const tempId = `temp_${Date.now()}`;
    const optimisticMsg: ChatMessage = {
      id: tempId,
      conversation_id: conversationId,
      sender_id: senderId,
      sender_name: "You",
      text: text.trim(),
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimisticMsg]);

    try {
      const realMsg = await apiSendMessage(conversationId, senderId, text.trim());
      setMessages((prev) =>
        prev.map((m) => (m.id === tempId ? realMsg : m))
      );
    } catch (err) {
      // Revert if failed
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
      throw err;
    }
  };

  return {
    messages,
    loading,
    error,
    sendMessage,
    refetch: () => fetchMessages(false),
  };
}
