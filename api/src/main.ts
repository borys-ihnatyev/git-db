import Fastify from "fastify";
import corsPlugin from "@fastify/cors";
import staticsPlugin from "@fastify/static";
import webSocketsPlugin from "@fastify/websocket";
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

await api.register(corsPlugin);
await api.register(webSocketsPlugin);
await api.register(fastifyTRPCPlugin, {
  prefix: "/trpc",
  useWSS: true,
  trpcOptions: {
    router: appRouter,
    onError({ path, error }) {
      api.log.error(`Error in tRPC handler on path '${path}':`, error);
    },
  },
} satisfies FastifyTRPCPluginOptions<AppRouter>);

await api.register(staticsPlugin, {
  root: DB_PATH,
});

await api.listen({ port: PORT });
