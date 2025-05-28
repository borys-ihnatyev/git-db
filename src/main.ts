import bodyParser from "body-parser";
import express from "express";
import fs from "fs/promises";
import path from "path";

const PORT = 3000;

const DB_CONTENT_PATH = path.resolve(__dirname, "..", "db", "content");

express()
  .use(bodyParser.json())
  .get("/content", async (_, res) => {
    const content = await fs.readdir(DB_CONTENT_PATH);
    res.send(content);
  })
  .listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
  });
