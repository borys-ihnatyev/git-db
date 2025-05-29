import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "../../backend/src/trpc/client";

export const api = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "http://localhost:3000/trpc",
    }),
  ],
});
