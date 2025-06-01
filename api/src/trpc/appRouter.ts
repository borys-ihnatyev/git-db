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
  },
});

export default appRouter;

export type AppRouter = typeof appRouter;
