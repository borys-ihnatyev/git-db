import path from "path";
import fs from "fs/promises";
import { statSync } from "fs";
import { type CommitResult, simpleGit } from "simple-git";
import { DB_PATH, DB_CONTENT_PATH, DB_CONTENT_DIR } from "../../env";
import ErrorResult from "./ErrorResult";

type BuildPathResult = {
  name: string;
  relativePath: string;
};

type ResolvePathResult = BuildPathResult & {
  absolutePath: string;
};

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
    return path.basename(rawFileName);
  },

  buildFilePath(fileName: string): BuildPathResult {
    const name = db.sanitizeFileName(fileName);
    const relativePath = path.join(DB_CONTENT_DIR, name);
    return {
      name,
      relativePath,
    };
  },

  resolveFilePath(fileName: string): ResolvePathResult {
    const buildPathResult = db.buildFilePath(fileName);
    const absolutePath = path.resolve(DB_PATH, buildPathResult.relativePath);
    return {
      ...buildPathResult,
      absolutePath,
    };
  },

  async listFiles(): Promise<string[]> {
    return await fs.readdir(DB_CONTENT_PATH);
  },

  async readFile(fileName: string): Promise<ContentShape> {
    const { absolutePath, name } = db.resolveFilePath(fileName);
    try {
      const content = await fs.readFile(absolutePath, { encoding: "utf-8" });
      return { content };
    } catch (error: any) {
      if (error?.code === "ENOENT") {
        throw new ErrorResult(`File ${name} was not found`, 404);
      }
      throw error;
    }
  },

  async modifyFile(
    fileName: string,
    payload: ModifyFilePayload
  ): Promise<ModifyFileResult> {
    const { absolutePath, name, relativePath } = db.resolveFilePath(fileName);
    await fs.writeFile(absolutePath, payload.content);

    const revisionMessage = payload.commitMessage ?? `modify ${name}`;

    const commitResult = await git.add(relativePath).commit(revisionMessage);

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
    const { absolutePath, name, relativePath } = db.resolveFilePath(fileName);
    let content: string | undefined;

    try {
      content = await fs.readFile(absolutePath, { encoding: "utf-8" });
      await fs.rm(absolutePath);
    } catch {
      throw new ErrorResult(`File ${name} was not found`, 404);
    }

    const revisionMessage = payload?.commitMessage ?? `delete ${name}`;

    const commitResult = await git.add(relativePath).commit(revisionMessage);

    return {
      content,
      commitMessage: commitResult.commit ? revisionMessage : "",
      commitResult,
    };
  },
} as const;

export default db;
