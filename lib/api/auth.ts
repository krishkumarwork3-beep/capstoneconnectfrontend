import { User } from "@/lib/types";
import { apiFetch, simulateDelay, USE_MOCK } from "./client";
import { mockDb } from "./mock/store";

export interface SignupPayload {
  name: string;
  college: string;
  department?: string;
  passing_year: number;
  phone: string;
  password?: string;
}

export interface LoginPayload {
  phone: string;
  password?: string;
}

export async function getMe(): Promise<User | null> {
  if (USE_MOCK) {
    await simulateDelay(150);
    return mockDb.getCurrentUser();
  }
  try {
    return await apiFetch<User>("/auth/me");
  } catch {
    return null;
  }
}

export async function login(payload: LoginPayload): Promise<User> {
  if (USE_MOCK) {
    await simulateDelay(250);
    const users = mockDb.getUsers({ limit: 100 }).items;
    const matched = users.find((u) => u.phone.replace(/\s+/g, "") === payload.phone.replace(/\s+/g, ""));
    const user = matched || users[0];
    mockDb.setCurrentUser(user.id);
    return user;
  }
  return apiFetch<User>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function signup(payload: SignupPayload): Promise<User> {
  if (USE_MOCK) {
    await simulateDelay(350);
    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: payload.name,
      college: payload.college,
      department: payload.department || "Engineering",
      passing_year: Number(payload.passing_year),
      phone: payload.phone,
      bio: "Engineering student eager to collaborate on ambitious capstone and hackathon projects.",
      skills: ["Problem Solving", "Git"],
      created_at: new Date().toISOString(),
    };
    mockDb.updateUser(newUser.id, newUser); // Or add to mockDb
    mockDb.setCurrentUser(newUser.id);
    return newUser;
  }
  return apiFetch<User>("/auth/signup", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function logout(): Promise<void> {
  if (USE_MOCK) {
    await simulateDelay(150);
    return;
  }
  await apiFetch<void>("/auth/logout", {
    method: "POST",
  });
}

export async function switchPersona(userId: string): Promise<User> {
  if (USE_MOCK) {
    mockDb.setCurrentUser(userId);
    return mockDb.getCurrentUser();
  }
  return (await getMe())!;
}
