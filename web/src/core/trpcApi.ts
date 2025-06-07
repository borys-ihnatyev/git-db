import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import { QueryClient } from "@tanstack/react-query";
import {
  createTRPCClient,
  createWSClient,
  httpBatchLink,
  splitLink,
  wsLink,
} from "@trpc/client";
import type { AppRouter } from "@git-db/api";

export const queryClient = new QueryClient();

const wsClient = createWSClient({
  url: "ws://localhost:3000/trpc",
});

export const api = createTRPCClient<AppRouter>({
  links: [
    splitLink({
      condition: (operation) => operation.type === "subscription",
      true: wsLink({
        client: wsClient,
      }),
      false: httpBatchLink({
        url: import.meta.env.VITE_API_URL,
      }),
    }),
  ],
});

export const queryApi = createTRPCOptionsProxy<AppRouter>({
  client: api,
  queryClient,
});
