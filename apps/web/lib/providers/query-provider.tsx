"use client";

import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Time in milliseconds to consider cached data as fresh
      staleTime: 5 * 60 * 1000, // 5 minutes
      // Time in milliseconds to keep unused data in cache
      gcTime: 15 * 60 * 1000, // 15 minutes (was cacheTime in v4)
      // Retry failed requests
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors except 401/403 (auth issues)
        if (
          error?.status >= 400 && error?.status < 500 &&
          ![401, 403].includes(error?.status)
        ) {
          return false;
        }
        return failureCount < 3;
      },
      // Refetch on window focus in development, but not in production
      refetchOnWindowFocus: process.env.NODE_ENV === "development",
      // Background refetch interval (disabled by default)
      refetchInterval: false,
    },
    mutations: {
      // Retry failed mutations
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors except 401/403 (auth issues)
        if (
          error?.status >= 400 && error?.status < 500 &&
          ![401, 403].includes(error?.status)
        ) {
          return false;
        }
        return failureCount < 2;
      },
    },
  },
});

export function QueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}

export { queryClient };
