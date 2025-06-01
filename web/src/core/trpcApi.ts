import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import { QueryClient } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "@git-db/api";

export const queryClient = new QueryClient();

export const api = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: import.meta.env.VITE_API_URL,
    }),
  ],
});

export const queryApi = createTRPCOptionsProxy<AppRouter>({
  client: api,
  queryClient,
});
