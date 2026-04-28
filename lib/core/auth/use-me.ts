"use client";

import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import type { User } from "@/types";

const ME_KEY = ["me"] as const;

export function useMeQuery(cachedUser: User | null) {
  return useQuery<User>({
    queryKey: ME_KEY,
    queryFn: async () => {
      const { data } = await apiClient.get<User>("/api/auth/me");
      return data;
    },
    placeholderData: cachedUser ?? undefined,
  });
}
