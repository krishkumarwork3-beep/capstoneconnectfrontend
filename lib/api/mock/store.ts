import {
  User,
  Group,
  JoinRequest,
  Conversation,
  ChatMessage,
  GitHubActivity,
  RequestStatus,
} from "@/lib/types";
import {
  MOCK_USERS,
  MOCK_GROUPS,
  MOCK_REQUESTS,
  MOCK_CONVERSATIONS,
  MOCK_MESSAGES,
  MOCK_GITHUB_PROFILES,
} from "./data";

const STORAGE_KEYS = {
  USERS: "capstone_users",
  GROUPS: "capstone_groups",
  REQUESTS: "capstone_requests",
  CONVERSATIONS: "capstone_conversations",
  MESSAGES: "capstone_messages",
  CURRENT_USER_ID: "capstone_current_user_id",
};

class MockDatabase {
  private users: User[] = [];
  private groups: Group[] = [];
  private requests: JoinRequest[] = [];
  private conversations: Conversation[] = [];
  private messages: Record<string, ChatMessage[]> = {};
  private currentUserId: string = "usr_1"; // Default persona: Aarav Sharma (Admin of Agri-Rover)
  private initialized: boolean = false;

  constructor() {
    this.init();
  }

  private init() {
    if (typeof window !== "undefined") {
      try {
        const storedUsers = localStorage.getItem(STORAGE_KEYS.USERS);
        const storedGroups = localStorage.getItem(STORAGE_KEYS.GROUPS);
        const storedRequests = localStorage.getItem(STORAGE_KEYS.REQUESTS);
        const storedConvs = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
        const storedMsgs = localStorage.getItem(STORAGE_KEYS.MESSAGES);
        const storedUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);

        this.users = storedUsers ? JSON.parse(storedUsers) : [...MOCK_USERS];
        this.groups = storedGroups ? JSON.parse(storedGroups) : [...MOCK_GROUPS];
        this.requests = storedRequests ? JSON.parse(storedRequests) : [...MOCK_REQUESTS];
        this.conversations = storedConvs ? JSON.parse(storedConvs) : [...MOCK_CONVERSATIONS];
        this.messages = storedMsgs ? JSON.parse(storedMsgs) : { ...MOCK_MESSAGES };
        if (storedUser) this.currentUserId = storedUser;
        this.initialized = true;
        return;
      } catch {
        // Fallback to in-memory
      }
    }
    this.users = [...MOCK_USERS];
    this.groups = [...MOCK_GROUPS];
    this.requests = [...MOCK_REQUESTS];
    this.conversations = [...MOCK_CONVERSATIONS];
    this.messages = { ...MOCK_MESSAGES };
    this.initialized = true;
  }

  private persist() {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(this.users));
        localStorage.setItem(STORAGE_KEYS.GROUPS, JSON.stringify(this.groups));
        localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(this.requests));
        localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(this.conversations));
        localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(this.messages));
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, this.currentUserId);
      } catch (e) {
        console.warn("Could not persist mock state to localStorage", e);
      }
    }
  }

  public resetToDefault() {
    this.users = [...MOCK_USERS];
    this.groups = [...MOCK_GROUPS];
    this.requests = [...MOCK_REQUESTS];
    this.conversations = [...MOCK_CONVERSATIONS];
    this.messages = { ...MOCK_MESSAGES };
    this.currentUserId = "usr_1";
    this.persist();
  }

  public getCurrentUser(): User {
    const user = this.users.find((u) => u.id === this.currentUserId);
    return user || this.users[0];
  }

  public setCurrentUser(userId: string) {
    const user = this.users.find((u) => u.id === userId);
    if (user) {
      this.currentUserId = user.id;
      this.persist();
    }
  }

  public getUsers(options?: {
    search?: string;
    college?: string;
    passing_year?: number;
    hasGroup?: boolean;
    cursor?: string;
    limit?: number;
  }) {
    const limit = options?.limit || 6;
    let list = [...this.users];

    if (options?.search) {
      const q = options.search.toLowerCase();
      list = list.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.college.toLowerCase().includes(q) ||
          u.bio.toLowerCase().includes(q) ||
          u.skills.some((s) => s.toLowerCase().includes(q))
      );
    }

    if (options?.college && options.college !== "all") {
      list = list.filter((u) => u.college === options.college);
    }

    if (options?.passing_year) {
      list = list.filter((u) => u.passing_year === Number(options.passing_year));
    }

    if (options?.hasGroup !== undefined) {
      list = list.filter((u) => (options.hasGroup ? Boolean(u.group_id) : !u.group_id));
    }

    const startIndex = options?.cursor ? parseInt(options.cursor, 10) : 0;
    const items = list.slice(startIndex, startIndex + limit);
    const nextIndex = startIndex + limit;
    const hasMore = nextIndex < list.length;

    return {
      items,
      nextCursor: hasMore ? String(nextIndex) : null,
      hasMore,
      total: list.length,
    };
  }

  public getUserById(id: string): User | undefined {
    return this.users.find((u) => u.id === id);
  }

  public updateUser(id: string, updates: Partial<User>): User {
    const idx = this.users.findIndex((u) => u.id === id);
    if (idx === -1) throw new Error("User not found");
    this.users[idx] = { ...this.users[idx], ...updates };
    this.persist();
    return this.users[idx];
  }

  public getGroups(options?: {
    search?: string;
    domain?: string;
    openOnly?: boolean;
    cursor?: string;
    limit?: number;
  }) {
    const limit = options?.limit || 6;
    let list = [...this.groups];

    if (options?.search) {
      const q = options.search.toLowerCase();
      list = list.filter(
        (g) =>
          g.name.toLowerCase().includes(q) ||
          g.description.toLowerCase().includes(q) ||
          g.domain.toLowerCase().includes(q) ||
          g.requirements.some((r) => r.toLowerCase().includes(q))
      );
    }

    if (options?.domain && options.domain !== "all") {
      list = list.filter((g) => g.domain === options.domain);
    }

    if (options?.openOnly !== false) {
      // By default show open slots unless explicitly overridden
      list = list.filter((g) => g.members.length < g.max_members);
    }

    const startIndex = options?.cursor ? parseInt(options.cursor, 10) : 0;
    const items = list.slice(startIndex, startIndex + limit);
    const nextIndex = startIndex + limit;
    const hasMore = nextIndex < list.length;

    return {
      items,
      nextCursor: hasMore ? String(nextIndex) : null,
      hasMore,
      total: list.length,
    };
  }

  public getGroupById(id: string): Group | undefined {
    return this.groups.find((g) => g.id === id);
  }

  public getMyGroups(userId: string): Group[] {
    return this.groups.filter((g) => g.members.some((m) => m.user_id === userId));
  }

  public createGroup(
    creatorId: string,
    data: {
      name: string;
      description: string;
      max_members: number;
      requirements: string[];
      domain: string;
    }
  ): Group {
    const creator = this.getUserById(creatorId);
    if (!creator) throw new Error("Creator not found");

    const newGroup: Group = {
      id: `grp_${Date.now()}`,
      name: data.name,
      description: data.description,
      max_members: Number(data.max_members),
      requirements: data.requirements,
      domain: data.domain,
      created_by: creatorId,
      created_at: new Date().toISOString(),
      members: [
        {
          user_id: creator.id,
          name: creator.name,
          college: creator.college,
          department: creator.department,
          passing_year: creator.passing_year,
          role: "admin",
          joined_at: new Date().toISOString(),
        },
      ],
      is_full: false,
    };

    this.groups.unshift(newGroup);

    // Update user's current group
    this.updateUser(creatorId, {
      group_id: newGroup.id,
      group_name: newGroup.name,
      group_role: "admin",
    });

    this.persist();
    return newGroup;
  }

  public leaveGroup(groupId: string, userId: string) {
    const group = this.getGroupById(groupId);
    if (!group) throw new Error("Group not found");

    group.members = group.members.filter((m) => m.user_id !== userId);
    group.is_full = group.members.length >= group.max_members;

    this.updateUser(userId, {
      group_id: null,
      group_name: null,
      group_role: null,
    });

    this.persist();
    return group;
  }

  public getRequests(options: { userId: string; direction: "sent" | "received" }) {
    if (options.direction === "sent") {
      return this.requests.filter((r) => r.sender_id === options.userId);
    } else {
      // Received either directly as receiver or as an admin of the requested group
      const adminGroupIds = this.groups
        .filter((g) => g.members.some((m) => m.user_id === options.userId && m.role === "admin"))
        .map((g) => g.id);

      return this.requests.filter(
        (r) =>
          r.receiver_id === options.userId ||
          (r.type === "join_request" && adminGroupIds.includes(r.group_id))
      );
    }
  }

  public sendJoinRequest(groupId: string, senderId: string, note?: string): JoinRequest {
    const group = this.getGroupById(groupId);
    if (!group) throw new Error("Group not found");
    const sender = this.getUserById(senderId);
    if (!sender) throw new Error("Sender not found");

    // Check if already full
    if (group.members.length >= group.max_members) {
      throw new Error("This capstone group is already at full capacity");
    }

    // Check if existing pending request exists
    const existing = this.requests.find(
      (r) => r.group_id === groupId && r.sender_id === senderId && r.status === "pending"
    );
    if (existing) return existing;

    const newReq: JoinRequest = {
      id: `req_${Date.now()}`,
      group_id: groupId,
      group_name: group.name,
      sender_id: sender.id,
      sender_name: sender.name,
      sender_college: sender.college,
      sender_passing_year: sender.passing_year,
      receiver_id: group.created_by,
      type: "join_request",
      status: "pending",
      note: note || `Hi, I'd like to join ${group.name}!`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.requests.unshift(newReq);
    this.persist();
    return newReq;
  }

  public sendInvitation(targetUserId: string, groupId: string, senderId: string, note?: string): JoinRequest {
    const group = this.getGroupById(groupId);
    if (!group) throw new Error("Group not found");
    const sender = this.getUserById(senderId);
    if (!sender) throw new Error("Sender not found");
    const targetUser = this.getUserById(targetUserId);
    if (!targetUser) throw new Error("Target user not found");

    const existing = this.requests.find(
      (r) => r.group_id === groupId && r.receiver_id === targetUserId && r.status === "pending"
    );
    if (existing) return existing;

    const newReq: JoinRequest = {
      id: `req_${Date.now()}`,
      group_id: groupId,
      group_name: group.name,
      sender_id: sender.id,
      sender_name: sender.name,
      sender_college: sender.college,
      sender_passing_year: sender.passing_year,
      receiver_id: targetUserId,
      receiver_name: targetUser.name,
      type: "invitation",
      status: "pending",
      note: note || `We would love for you to join ${group.name}!`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.requests.unshift(newReq);
    this.persist();
    return newReq;
  }

  public respondRequest(requestId: string, status: RequestStatus): JoinRequest {
    const req = this.requests.find((r) => r.id === requestId);
    if (!req) throw new Error("Request not found");

    req.status = status;
    req.updated_at = new Date().toISOString();

    if (status === "accepted") {
      const group = this.getGroupById(req.group_id);
      if (group) {
        const userToAddId = req.type === "join_request" ? req.sender_id : req.receiver_id;
        const userToAdd = this.getUserById(userToAddId);

        if (userToAdd && !group.members.some((m) => m.user_id === userToAdd.id)) {
          if (group.members.length < group.max_members) {
            group.members.push({
              user_id: userToAdd.id,
              name: userToAdd.name,
              college: userToAdd.college,
              department: userToAdd.department,
              passing_year: userToAdd.passing_year,
              role: "member",
              joined_at: new Date().toISOString(),
            });
            group.is_full = group.members.length >= group.max_members;

            this.updateUser(userToAdd.id, {
              group_id: group.id,
              group_name: group.name,
              group_role: "member",
            });
          }
        }
      }
    }

    this.persist();
    return req;
  }

  public getConversations(userId: string): Conversation[] {
    return this.conversations.filter(
      (c) => c.participant_ids.includes(userId) || (c.type === "group" && Boolean(c.group_id))
    );
  }

  public getConversationById(id: string): Conversation | undefined {
    return this.conversations.find((c) => c.id === id);
  }

  public getMessages(conversationId: string): ChatMessage[] {
    return this.messages[conversationId] || [];
  }

  public sendMessage(conversationId: string, senderId: string, text: string): ChatMessage {
    const sender = this.getUserById(senderId);
    if (!sender) throw new Error("Sender not found");

    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      conversation_id: conversationId,
      sender_id: senderId,
      sender_name: sender.name,
      text,
      created_at: new Date().toISOString(),
    };

    if (!this.messages[conversationId]) {
      this.messages[conversationId] = [];
    }
    this.messages[conversationId].push(newMsg);

    const conv = this.conversations.find((c) => c.id === conversationId);
    if (conv) {
      conv.last_message = {
        text,
        sender_name: sender.name,
        created_at: newMsg.created_at,
      };
      conv.updated_at = newMsg.created_at;
    }

    this.persist();
    return newMsg;
  }

  public getGitHubActivity(userId: string): GitHubActivity | null {
    if (MOCK_GITHUB_PROFILES[userId]) {
      return MOCK_GITHUB_PROFILES[userId];
    }
    const user = this.getUserById(userId);
    if (!user) return null;

    // Generated profile for other users
    const username = user.github_url?.split("/").pop() || user.name.toLowerCase().replace(/\s+/g, "-");
    return {
      username,
      avatar_url: `https://avatars.githubusercontent.com/u/${Math.abs(user.id.charCodeAt(0) * 12345)}`,
      public_repos: 8,
      followers: 24,
      top_languages: [
        { name: "Python", percentage: 50, color: "#3572A5" },
        { name: "TypeScript", percentage: 35, color: "#3178C6" },
        { name: "C++", percentage: 15, color: "#F34B7D" },
      ],
      recent_repos: [
        {
          id: 991,
          name: `${username}-capstone-core`,
          description: `Research codebase and experimental notebooks for ${user.college} capstone thesis`,
          html_url: user.github_url || `https://github.com/${username}`,
          language: "Python",
          stargazers_count: 12,
          forks_count: 3,
          updated_at: "2024-09-12T10:00:00Z",
        },
        {
          id: 992,
          name: "indic-dsp-bench",
          description: "Benchmarking signal processing pipelines on low resource edge processors",
          html_url: user.github_url || `https://github.com/${username}`,
          language: "TypeScript",
          stargazers_count: 9,
          forks_count: 1,
          updated_at: "2024-08-30T16:00:00Z",
        },
      ],
    };
  }
}

export const mockDb = new MockDatabase();
