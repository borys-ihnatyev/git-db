import { Router } from "express";
import db, { DeleteFilePayload, ModifyFilePayload } from "./core/db";
import ErrorResult from "./core/ErrorResult";

export default Router()
  .get("/content", async (_, res) => {
    res.send(await db.listFiles());
  })

  .get("/content/:fileName", async (req, res) => {
    const { fileName } = req.params;
    res.send(await db.readFile(fileName));
  })

  .post("/content/:fileName", async (req, res, next) => {
    const { fileName } = req.params;
    const payload = req.body as ModifyFilePayload;

    if (!("content" in payload) || typeof payload.content !== "string") {
      next(new ErrorResult("Expecting {content: string} body", 400));
      return;
    }

    res.send(await db.modifyFile(fileName, payload));
  })

  .delete("/content/:fileName", async (req, res, next) => {
    const { fileName } = req.params;
    const payload = req.body as DeleteFilePayload;
    res.send(await db.deleteFile(fileName, payload));
  });
