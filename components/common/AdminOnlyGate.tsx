"use client";

import React from "react";
import { useAuth } from "@/lib/context/auth-context";

interface AdminOnlyGateProps {
  groupId: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function AdminOnlyGate({ groupId, children, fallback = null }: AdminOnlyGateProps) {
  const { user } = useAuth();

  if (!user) return <>{fallback}</>;

  const isAdmin = user.group_id === groupId && user.group_role === "admin";

  if (!isAdmin) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
