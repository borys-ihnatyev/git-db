import path from "path";
import fs from "fs/promises";
import { statSync } from "fs";
import { type CommitResult, simpleGit } from "simple-git";
import { DB_PATH } from "../../env";
import ErrorResult from "./ErrorResult";

type OperationPayload = {
  commitMessage?: string;
};

type OperationResult = Required<OperationPayload> & {
  commitResult: CommitResult;
};

export type ContentShape = {
  content: string;
};

export type ModifyFilePayload = ContentShape & OperationPayload;

export type ModifyFileResult = ContentShape & OperationResult;

export type DeleteFilePayload = OperationPayload | undefined;
export type DeleteFileResult = Partial<ContentShape> & OperationResult;

const GIT_DIR_NAME = ".git";

try {
  statSync(DB_PATH);
} catch {
  console.warn(`You need to bootstrap database at ${DB_PATH}`);
  console.log(`use npm run bootstrap`);
  process.exit(-1);
}

const git = simpleGit(DB_PATH);

const db = {
  sanitizeFileName(rawFileName: string): string {
    const fileName = path.basename(rawFileName);
    if (fileName === GIT_DIR_NAME) {
      throw new ErrorResult("Illegal operation", 400);
    }
    return fileName;
  },

  resolveFilePath(fileName: string): string {
    return path.resolve(DB_PATH, db.sanitizeFileName(fileName));
  },

  async listFiles(): Promise<string[]> {
    return (await fs.readdir(DB_PATH)).filter((name) => name !== GIT_DIR_NAME);
  },

  async readFile(fileName: string): Promise<ContentShape> {
    const sanitizedFileName = db.sanitizeFileName(fileName);
    const filePath = db.resolveFilePath(fileName);
    try {
      const content = await fs.readFile(filePath, { encoding: "utf-8" });
      return { content };
    } catch (error: any) {
      if (error?.code === "ENOENT") {
        throw new ErrorResult(`File ${sanitizedFileName} was not found`, 404);
      }
      throw error;
    }
  },

  async modifyFile(
    fileName: string,
    payload: ModifyFilePayload
  ): Promise<ModifyFileResult> {
    const sanitizedFileName = db.sanitizeFileName(fileName);
    const filePath = db.resolveFilePath(fileName);
    await fs.writeFile(filePath, payload.content);

    const revisionMessage =
      payload.commitMessage ?? `modify ${sanitizedFileName}`;

    const commitResult = await git
      .add(sanitizedFileName)
      .commit(revisionMessage);

    return {
      content: payload.content,
      commitMessage: commitResult.commit ? revisionMessage : "",
      commitResult,
    };
  },

  async deleteFile(
    fileName: string,
    payload: DeleteFilePayload
  ): Promise<DeleteFileResult> {
    const sanitizedFileName = db.sanitizeFileName(fileName);
    const filePath = db.resolveFilePath(fileName);
    let content: string | undefined;

    try {
      content = await fs.readFile(filePath, { encoding: "utf-8" });
      await fs.rm(filePath);
    } catch {
      throw new ErrorResult(`File ${sanitizedFileName} was not found`, 404);
    }

    const revisionMessage =
      payload?.commitMessage ?? `delete ${sanitizedFileName}`;

    const commitResult = await git
      .add(sanitizedFileName)
      .commit(revisionMessage);

    return {
      content,
      commitMessage: commitResult.commit ? revisionMessage : "",
      commitResult,
    };
  },
} as const;

export default db;
