import { Group, PaginatedResult } from "@/lib/types";
import { apiFetch, simulateDelay, USE_MOCK } from "./client";
import { mockDb } from "./mock/store";

export interface GetGroupsParams {
  search?: string;
  domain?: string;
  openOnly?: boolean;
  cursor?: string;
  limit?: number;
}

export interface CreateGroupPayload {
  name: string;
  description: string;
  max_members: number;
  requirements: string[];
  domain: string;
}

export async function getGroups(params?: GetGroupsParams): Promise<PaginatedResult<Group>> {
  if (USE_MOCK) {
    await simulateDelay(250);
    return mockDb.getGroups(params);
  }

  const query = new URLSearchParams();
  if (params?.search) query.set("search", params.search);
  if (params?.domain) query.set("domain", params.domain);
  if (params?.openOnly !== undefined) query.set("openOnly", String(params.openOnly));
  if (params?.cursor) query.set("cursor", params.cursor);
  if (params?.limit) query.set("limit", String(params.limit));

  return apiFetch<PaginatedResult<Group>>(`/groups?${query.toString()}`);
}

export async function getGroupById(id: string): Promise<Group> {
  if (USE_MOCK) {
    await simulateDelay(200);
    const group = mockDb.getGroupById(id);
    if (!group) throw new Error("Group not found");
    return group;
  }
  return apiFetch<Group>(`/groups/${id}`);
}

export async function getMyGroups(userId: string): Promise<Group[]> {
  if (USE_MOCK) {
    await simulateDelay(200);
    return mockDb.getMyGroups(userId);
  }
  return apiFetch<Group[]>(`/groups/mine`);
}

export async function createGroup(creatorId: string, payload: CreateGroupPayload): Promise<Group> {
  if (USE_MOCK) {
    await simulateDelay(350);
    return mockDb.createGroup(creatorId, payload);
  }
  return apiFetch<Group>("/groups", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateGroup(groupId: string, updates: Partial<Group>): Promise<Group> {
  if (USE_MOCK) {
    await simulateDelay(250);
    const group = mockDb.getGroupById(groupId);
    if (!group) throw new Error("Group not found");
    Object.assign(group, updates);
    return group;
  }
  return apiFetch<Group>(`/groups/${groupId}`, {
    method: "PATCH",
    body: JSON.stringify(updates),
  });
}

export async function leaveGroup(groupId: string, userId: string): Promise<Group> {
  if (USE_MOCK) {
    await simulateDelay(250);
    return mockDb.leaveGroup(groupId, userId);
  }
  return apiFetch<Group>(`/groups/${groupId}/leave`, {
    method: "POST",
  });
}
