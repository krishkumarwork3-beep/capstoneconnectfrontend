import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
  });
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

// Deterministic warm tertiary hue assignment for avatars
const AVATAR_PALETTES = [
  { bg: "#EBF3EE", text: "#163832", border: "#C8E0D4" }, // Pine
  { bg: "#FBF0EA", text: "#8A3D1E", border: "#F5D4C3" }, // Terracotta
  { bg: "#EDF2F7", text: "#24425F", border: "#CBDCEB" }, // Petrol slate
  { bg: "#F8F1E7", text: "#78531D", border: "#EAD6BA" }, // Ochre
  { bg: "#F3EEF5", text: "#5B2A63", border: "#DECDE2" }, // Plum
  { bg: "#EEF4F4", text: "#1E5254", border: "#C4DFE1" }, // Teal
];

export function getAvatarColor(idOrName: string) {
  let hash = 0;
  for (let i = 0; i < idOrName.length; i++) {
    hash = idOrName.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_PALETTES.length;
  return AVATAR_PALETTES[index];
}
