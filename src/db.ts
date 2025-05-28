import path from "path";
import fs from "fs/promises";
import { simpleGit } from "simple-git";
import { DB_CONTENT_PATH, DB_PATH } from "../env";

const git = simpleGit(DB_PATH);

export type ContentShape = {
  content: string;
};

export type ModifyFilePayload = ContentShape & {
  revisionMessage?: string;
};

const db = {
  resolveFilePath(fileName: string): string {
    const sanitizedFileName = path.basename(fileName);
    return path.resolve(DB_CONTENT_PATH, sanitizedFileName);
  },

  async listFiles(): Promise<string[]> {
    return await fs.readdir(DB_CONTENT_PATH);
  },

  async readFile(fileName: string): Promise<ContentShape> {
    const filePath = db.resolveFilePath(fileName);
    const content = await fs.readFile(filePath, { encoding: "utf-8" });
    return { content };
  },

  async modifyFile(
    fileName: string,
    payload: ModifyFilePayload
  ): Promise<Required<ModifyFilePayload>> {
    const filePath = db.resolveFilePath(fileName);
    await fs.writeFile(filePath, payload.content);

    const revisionMessage = payload.revisionMessage ?? "no description";
    await git.commit(revisionMessage, filePath);

    return { content: payload.content, revisionMessage };
  },
} as const;

export default db;
