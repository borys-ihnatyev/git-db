import * as path from "path";
import * as fs from "fs/promises";
import { statSync } from "fs";
import { type CommitResult, simpleGit } from "simple-git";
import { DB_PATH, DB_CONTENT_PATH, DB_CONTENT_DIR, PORT } from "../../env.ts";
import ErrorResult from "./ErrorResult.ts";
import z from "zod";

export type FileInfo = {
  basename: string;
  href: string;
  relativePath: string;
};

export const FileOperationPayloadSchema = z.object({
  fileName: z.string(),
  commitMessage: z.string().optional(),
});

export type FileOperationPayload = z.infer<typeof FileOperationPayloadSchema>;
export type FileOperationResult = Required<FileOperationPayload> & {
  commitResult: CommitResult;
};

export const ModifyFilePayloadSchema = FileOperationPayloadSchema.extend({
  content: z.string(),
});

export type ModifyFilePayload = z.infer<typeof ModifyFilePayloadSchema>;
export type ModifyFileResult = Required<ModifyFilePayload> &
  FileOperationResult;

export type DeleteFilePayload = FileOperationPayload;
export type DeleteFileResult = ContentShape & FileOperationResult;

export type BuildPathResult = {
  name: string;
  relativePath: string;
};

export type ResolvePathResult = BuildPathResult & {
  absolutePath: string;
};

export type ContentShape = {
  content: string;
};

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

  async listFiles(): Promise<FileInfo[]> {
    const files = await fs.readdir(DB_CONTENT_PATH);
    return files.map((basename) => {
      const relativePath = `${DB_CONTENT_DIR}/${basename}`;
      return {
        basename,
        href: `http://localhost:${PORT}/${relativePath}`,
        relativePath,
      };
    });
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

  async modifyFile(payload: ModifyFilePayload): Promise<ModifyFileResult> {
    const { absolutePath, name, relativePath } = db.resolveFilePath(
      payload.fileName
    );
    await fs.writeFile(absolutePath, payload.content);

    const revisionMessage = payload.commitMessage ?? `modify ${name}`;

    const commitResult = await git.add(relativePath).commit(revisionMessage);

    return {
      fileName: name,
      content: payload.content,
      commitMessage: commitResult.commit ? revisionMessage : "",
      commitResult,
    };
  },

  async deleteFile(payload: DeleteFilePayload): Promise<DeleteFileResult> {
    const { absolutePath, name, relativePath } = db.resolveFilePath(
      payload.fileName
    );
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
      fileName: name,
      content,
      commitMessage: commitResult.commit ? revisionMessage : "",
      commitResult,
    };
  },
} as const;

export default db;
