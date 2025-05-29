import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import { QueryClient } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "@git-db/backend";

export const queryClient = new QueryClient();

console.log(import.meta.env.MODE);
console.log(import.meta.env);

const client = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: import.meta.env.VITE_API_URL,
    }),
  ],
});

export const api = createTRPCOptionsProxy<AppRouter>({
  client,
  queryClient,
});
