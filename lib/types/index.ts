export type GroupRole = "admin" | "member";

export type RequestStatus = "pending" | "accepted" | "rejected";

export type RequestDirection = "sent" | "received";

export interface User {
  id: string;
  name: string;
  college: string;
  department?: string;
  passing_year: number;
  phone: string;
  bio: string;
  skills: string[];
  resume_url?: string;
  github_url?: string;
  avatar_url?: string;
  group_id?: string | null;
  group_name?: string | null;
  group_role?: GroupRole | null;
  created_at: string;
}

export interface GroupMember {
  user_id: string;
  name: string;
  college: string;
  department?: string;
  passing_year: number;
  role: GroupRole;
  joined_at: string;
  avatar_url?: string;
  github_url?: string;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  max_members: number;
  requirements: string[]; // skill/domain requirements
  domain: string;
  created_by: string; // user_id
  created_at: string;
  members: GroupMember[];
  is_full?: boolean;
}

export interface JoinRequest {
  id: string;
  group_id: string;
  group_name: string;
  sender_id: string;
  sender_name: string;
  sender_college: string;
  sender_passing_year: number;
  receiver_id: string;
  receiver_name?: string;
  type: "join_request" | "invitation"; // user asking to join group vs group member inviting user
  status: RequestStatus;
  note?: string;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_name: string;
  text: string;
  created_at: string;
}

export interface Conversation {
  id: string;
  type: "direct" | "group";
  title: string;
  subtitle?: string;
  group_id?: string;
  participant_ids: string[];
  participants: {
    id: string;
    name: string;
    college: string;
    avatar_url?: string;
  }[];
  last_message?: {
    text: string;
    sender_name: string;
    created_at: string;
  };
  unread_count?: number;
  updated_at: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
}

export interface GitHubActivity {
  username: string;
  avatar_url: string;
  public_repos: number;
  followers: number;
  top_languages: { name: string; percentage: number; color: string }[];
  recent_repos: GitHubRepo[];
}

export interface PaginatedResult<T> {
  items: T[];
  nextCursor?: string | null;
  hasMore: boolean;
  total?: number;
}
