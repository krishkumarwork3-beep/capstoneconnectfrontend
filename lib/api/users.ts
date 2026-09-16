import { User, GitHubActivity, PaginatedResult } from "@/lib/types";
import { apiFetch, simulateDelay, USE_MOCK } from "./client";
import { mockDb } from "./mock/store";

export interface GetUsersParams {
  search?: string;
  college?: string;
  passing_year?: number;
  hasGroup?: boolean;
  cursor?: string;
  limit?: number;
}

export async function getUsers(params?: GetUsersParams): Promise<PaginatedResult<User>> {
  if (USE_MOCK) {
    await simulateDelay(250);
    return mockDb.getUsers(params);
  }

  const query = new URLSearchParams();
  if (params?.search) query.set("search", params.search);
  if (params?.college) query.set("college", params.college);
  if (params?.passing_year) query.set("passing_year", String(params.passing_year));
  if (params?.cursor) query.set("cursor", params.cursor);
  if (params?.limit) query.set("limit", String(params.limit));

  return apiFetch<PaginatedResult<User>>(`/users?${query.toString()}`);
}

export async function getUserById(id: string): Promise<User> {
  if (USE_MOCK) {
    await simulateDelay(200);
    const user = mockDb.getUserById(id);
    if (!user) throw new Error("User not found");
    return user;
  }
  return apiFetch<User>(`/users/${id}`);
}

export async function updateUser(id: string, updates: Partial<User>): Promise<User> {
  if (USE_MOCK) {
    await simulateDelay(300);
    return mockDb.updateUser(id, updates);
  }
  return apiFetch<User>(`/users/${id}`, {
    method: "PATCH",
    body: JSON.stringify(updates),
  });
}

export async function uploadResume(userId: string, file: File): Promise<{ resume_url: string }> {
  if (USE_MOCK) {
    await simulateDelay(400);
    const fakeUrl = `/resumes/${userId}_${encodeURIComponent(file.name)}`;
    mockDb.updateUser(userId, { resume_url: fakeUrl });
    return { resume_url: fakeUrl };
  }

  const formData = new FormData();
  formData.append("resume", file);

  const response = await fetch(`/api/users/${userId}/resume`, {
    method: "POST",
    body: formData,
  });
  if (!response.ok) throw new Error("Failed to upload resume");
  return response.json();
}

export async function getGitHubActivity(userId: string): Promise<GitHubActivity | null> {
  if (USE_MOCK) {
    await simulateDelay(350);
    return mockDb.getGitHubActivity(userId);
  }
  try {
    return await apiFetch<GitHubActivity>(`/users/${userId}/github`);
  } catch (error) {
    console.error("GitHub activity fetch failed", error);
    return null;
  }
}
