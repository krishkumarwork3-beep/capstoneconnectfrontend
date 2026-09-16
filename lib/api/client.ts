// API Client configuration
// Respects USE_MOCK flag, falls back to true in demo/frontend-only mode

export const USE_MOCK =
  process.env.NEXT_PUBLIC_USE_MOCK !== "false"; // default to true if not explicitly disabled

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

export async function simulateDelay(ms: number = 300) {
  if (typeof window !== "undefined") {
    await new Promise((res) => setTimeout(res, ms));
  }
}

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: "include", // For httpOnly cookies
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      errorData.message || `Request failed with status ${response.status}`,
      response.status,
      errorData
    );
  }

  return response.json();
}
