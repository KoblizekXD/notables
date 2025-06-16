"use client";

import { auth } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  return useQuery({
    queryKey: ["auth-session"],
    queryFn: async () => {
      try {
        const session = await auth.api.getSession({
          headers: new Headers(),
        });
        return session;
      } catch (error) {
        console.error("Error fetching session:", error);
        return null;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}
