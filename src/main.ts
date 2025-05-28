import bodyParser from "body-parser";
import express from "express";
import fs from "fs/promises";
import path from "path";

const PORT = 3000;

const DB_CONTENT_PATH = path.resolve(__dirname, "..", "db", "content");

const db = {
  resolveFilePath(fileName: string): string {
    const sanitizedFileName = path.basename(fileName);
    return path.resolve(DB_CONTENT_PATH, sanitizedFileName);
  },
} as const;

type ContentShape =
  | {
      content?: string;
    }
  | undefined;

type ErrorResponse = {
  message: string;
};

express()
  .use(bodyParser.json())
  .get("/content", async (_, res) => {
    const content = await fs.readdir(DB_CONTENT_PATH);
    res.send(content);
  })
  .get("/content/:fileName", async (req, res) => {
    const { fileName } = req.params;
    const filePath = db.resolveFilePath(fileName);
    const content = await fs.readFile(filePath, { encoding: "utf-8" });
    const data = { content } satisfies ContentShape;
    res.send(data);
  })
  .post("/content/:fileName", async (req, res) => {
    const data = req.body as ContentShape;
    if (!data?.content) {
      res.status(400);
      const errorResponse: ErrorResponse = {
        message: "Expecting {content: string} body",
      };
      res.send(errorResponse);
      return;
    }

    const { fileName } = req.params;
    const filePath = db.resolveFilePath(fileName);
    try {
      await fs.writeFile(filePath, data.content);
      res.send(data);
    } catch (error: unknown) {
      const errorResponse: ErrorResponse = {
        message: (error as Error).message || "Unknown error",
      };

      res.status(404);
      res.send(errorResponse);
    }
  })
  .listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
  });
