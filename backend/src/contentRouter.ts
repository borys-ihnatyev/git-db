import { Router } from "express";
import db, { type DeleteFilePayload, type ModifyFilePayload } from "./core/db";
import ErrorResult from "./core/ErrorResult";

export default Router()
  .get("/content", async (_, res) => {
    res.send(await db.listFiles());
  })

  .get("/content/:fileName", async (req, res) => {
    const { fileName } = req.params;
    res.send(await db.readFile(fileName));
  })

  .post("/content/:fileName", async (req, res) => {
    const { fileName } = req.params;
    const payload = req.body as ModifyFilePayload;

    if (!("content" in payload) || typeof payload.content !== "string") {
      throw new ErrorResult("Expecting {content: string} body", 400);
    }

    res.send(await db.modifyFile(fileName, payload));
  })

  .delete("/content/:fileName", async (req, res, next) => {
    const { fileName } = req.params;
    const payload = req.body as DeleteFilePayload;
    res.send(await db.deleteFile(fileName, payload));
  });
