import { JoinRequest, RequestStatus } from "@/lib/types";
import { apiFetch, simulateDelay, USE_MOCK } from "./client";
import { mockDb } from "./mock/store";

export async function getRequests(userId: string, direction: "sent" | "received"): Promise<JoinRequest[]> {
  if (USE_MOCK) {
    await simulateDelay(200);
    return mockDb.getRequests({ userId, direction });
  }
  return apiFetch<JoinRequest[]>(`/requests?direction=${direction}`);
}

export async function sendJoinRequest(groupId: string, senderId: string, note?: string): Promise<JoinRequest> {
  if (USE_MOCK) {
    await simulateDelay(250);
    return mockDb.sendJoinRequest(groupId, senderId, note);
  }
  return apiFetch<JoinRequest>(`/groups/${groupId}/join-requests`, {
    method: "POST",
    body: JSON.stringify({ note }),
  });
}

export async function sendInvitation(
  targetUserId: string,
  groupId: string,
  senderId: string,
  note?: string
): Promise<JoinRequest> {
  if (USE_MOCK) {
    await simulateDelay(250);
    return mockDb.sendInvitation(targetUserId, groupId, senderId, note);
  }
  return apiFetch<JoinRequest>(`/users/${targetUserId}/invitations`, {
    method: "POST",
    body: JSON.stringify({ group_id: groupId, note }),
  });
}

export async function respondRequest(requestId: string, status: RequestStatus): Promise<JoinRequest> {
  if (USE_MOCK) {
    await simulateDelay(250);
    return mockDb.respondRequest(requestId, status);
  }
  return apiFetch<JoinRequest>(`/requests/${requestId}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}
