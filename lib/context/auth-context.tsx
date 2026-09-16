"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "@/lib/types";
import { getMe, switchPersona, logout as apiLogout } from "@/lib/api/auth";
import { MOCK_USERS } from "@/lib/api/mock/data";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  loginAs: (userId: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  availablePersonas: User[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const currentUser = await getMe();
      setUser(currentUser);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const loginAs = async (userId: string) => {
    setIsLoading(true);
    try {
      const updated = await switchPersona(userId);
      setUser(updated);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await apiLogout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        loginAs,
        logout,
        refreshUser,
        availablePersonas: MOCK_USERS.slice(0, 6), // Top 6 diverse test personas
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
