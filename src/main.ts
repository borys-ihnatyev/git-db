import bodyParser from "body-parser";
import express, {
  type ErrorRequestHandler,
  type RequestHandler,
} from "express";
import db, { ModifyFilePayload } from "./db";
import ErrorResult, { ErrorResponseJSON } from "./ErrorResult";

const PORT = 3000;

const globalErrorHandler: ErrorRequestHandler = (error, req, res, next) => {
  const maybeError = error as Partial<ErrorResult> | undefined;
  const message = maybeError?.message || "Unknown error";
  const status = maybeError?.status || 500;

  res.status(status).send({ status, message } satisfies ErrorResponseJSON);
};

const notFoundErrorHandler: RequestHandler = (req, res, next) => {
  next(new ErrorResult("Not found", 404));
};

const app = express();

app
  .use(bodyParser.json())

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
  .use(notFoundErrorHandler)
  .use(globalErrorHandler);

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
