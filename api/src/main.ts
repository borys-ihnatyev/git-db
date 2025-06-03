import Fastify from "fastify";
import cors from "@fastify/cors";
import statics from "@fastify/static";
import {
  fastifyTRPCPlugin,
  type FastifyTRPCPluginOptions,
} from "@trpc/server/adapters/fastify";
import { DB_PATH, PORT } from "../env.ts";
import appRouter, { type AppRouter } from "./trpc/appRouter.ts";

const api = Fastify({
  logger: {
    transport: {
      target: "pino-pretty",
    },
  },
});

await api.register(cors, {});
await api.register(fastifyTRPCPlugin, {
  prefix: "/trpc",
  trpcOptions: {
    router: appRouter,
    onError({ path, error }) {
      api.log.error(`Error in tRPC handler on path '${path}':`, error);
    },
  },
} satisfies FastifyTRPCPluginOptions<AppRouter>);

await api.register(statics, {
  root: DB_PATH,
});

await api.listen({ port: PORT });
