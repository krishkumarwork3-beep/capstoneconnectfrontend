import { Conversation, ChatMessage } from "@/lib/types";
import { apiFetch, simulateDelay, USE_MOCK } from "./client";
import { mockDb } from "./mock/store";

export async function getConversations(userId: string): Promise<Conversation[]> {
  if (USE_MOCK) {
    await simulateDelay(200);
    return mockDb.getConversations(userId);
  }
  return apiFetch<Conversation[]>("/conversations");
}

export async function getConversationById(id: string): Promise<Conversation> {
  if (USE_MOCK) {
    await simulateDelay(150);
    const conv = mockDb.getConversationById(id);
    if (!conv) throw new Error("Conversation not found");
    return conv;
  }
  return apiFetch<Conversation>(`/conversations/${id}`);
}

export async function getMessages(conversationId: string): Promise<ChatMessage[]> {
  if (USE_MOCK) {
    await simulateDelay(150);
    return mockDb.getMessages(conversationId);
  }
  return apiFetch<ChatMessage[]>(`/conversations/${conversationId}/messages`);
}

export async function sendMessage(conversationId: string, senderId: string, text: string): Promise<ChatMessage> {
  if (USE_MOCK) {
    await simulateDelay(150);
    return mockDb.sendMessage(conversationId, senderId, text);
  }
  return apiFetch<ChatMessage>(`/conversations/${conversationId}/messages`, {
    method: "POST",
    body: JSON.stringify({ text }),
  });
}
