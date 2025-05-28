import bodyParser from "body-parser";
import express, {
  type ErrorRequestHandler,
  type RequestHandler,
} from "express";
import db, { ModifyFilePayload } from "./db";

const PORT = 3000;

type ErrorResponse = {
  status?: number;
  message: string;
};

const globalErrorHandler: ErrorRequestHandler = (error, req, res, next) => {
  const maybeErrorResponse = error as Partial<ErrorResponse> | undefined;
  const status = maybeErrorResponse?.status || 500;
  const message = maybeErrorResponse?.message || "Unknown error";

  res.status(status).send({ status, message } satisfies ErrorResponse);
};

const notFoundErrorHandler: RequestHandler = (req, res, next) => {
  next({ status: 404, message: "Not found" } satisfies ErrorResponse);
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
      const errorResponse: ErrorResponse = {
        status: 400,
        message: "Expecting {content: string} body",
      };
      next(errorResponse);
      return;
    }

    res.send(await db.modifyFile(fileName, payload));
  })
  .use(notFoundErrorHandler)
  .use(globalErrorHandler);

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
