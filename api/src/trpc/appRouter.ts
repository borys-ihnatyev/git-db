import db, {
  FileOperationPayloadSchema,
  ModifyFilePayloadSchema,
} from "../core/db.ts";
import { publicProcedure, router } from "./trpc.ts";
import z from "zod";

const appRouter = router({
  content: {
    listFiles: publicProcedure.query(db.listFiles),
    getFile: publicProcedure
      .input(z.string())
      .query(({ input }) => db.readFile(input)),
    modifyFile: publicProcedure
      .input(ModifyFilePayloadSchema)
      .mutation(({ input }) => db.modifyFile(input)),
    deleteFile: publicProcedure
      .input(FileOperationPayloadSchema)
      .mutation(({ input }) => db.deleteFile(input)),
    fileChange: publicProcedure.subscription(async function* ({ signal }) {
      const fileChanges = db.fileChangeAsyncIterable(signal);

      for await (const fileChange of fileChanges) {
        yield fileChange;
      }
    }),
    listFiles$: publicProcedure.subscription(async function* ({ signal }) {
      const fileChanges = db.fileChangeAsyncIterable(signal);

      yield await db.listFiles();

      for await (const _ of fileChanges) {
        yield await db.listFiles();
      }
    }),
  },
});

export default appRouter;

export type AppRouter = typeof appRouter;
