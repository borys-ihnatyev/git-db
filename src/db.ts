import path from "path";
import fs from "fs/promises";
import { statSync } from "fs";
import { type CommitResult, simpleGit } from "simple-git";
import { DB_PATH } from "../env";
import ErrorResult from "./ErrorResult";

try {
  statSync(DB_PATH);
} catch {
  console.warn(`You need to bootstrap database at ${DB_PATH}`);
  console.log(`use npm run bootstrap`);
  process.exit(-1);
}

const git = simpleGit(DB_PATH);

export type ContentShape = {
  content: string;
};

export type ModifyFilePayload = ContentShape & {
  commitMessage?: string;
};

export type ModifyFileResult = Required<ModifyFilePayload> & {
  commitResult: CommitResult;
};

const db = {
  sanitizeFileName(rawFileName: string): string {
    const fileName = path.basename(rawFileName);
    if (fileName === ".git") {
      throw new ErrorResult("Illegal file name", 400);
    }
    return fileName;
  },

  resolveFilePath(fileName: string): string {
    return path.resolve(DB_PATH, db.sanitizeFileName(fileName));
  },

  async listFiles(): Promise<string[]> {
    return await fs.readdir(DB_PATH);
  },

  async readFile(fileName: string): Promise<ContentShape> {
    const filePath = db.resolveFilePath(fileName);
    const content = await fs.readFile(filePath, { encoding: "utf-8" });
    return { content };
  },

  async modifyFile(
    fileName: string,
    payload: ModifyFilePayload
  ): Promise<ModifyFileResult> {
    const sanitizedFileName = db.sanitizeFileName(fileName);
    const filePath = db.resolveFilePath(fileName);
    await fs.writeFile(filePath, payload.content);

    const revisionMessage = payload.commitMessage ?? "no description";

    const commitResult = await git
      .add(sanitizedFileName)
      .commit(revisionMessage);

    return {
      content: payload.content,
      commitMessage: commitResult.commit ? revisionMessage : "",
      commitResult,
    };
  },
} as const;

export default db;
