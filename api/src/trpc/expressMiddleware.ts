import * as trpcExpress from "@trpc/server/adapters/express";
import appRouter from "./appRouter.ts";

export default trpcExpress.createExpressMiddleware({
  router: appRouter,
});
