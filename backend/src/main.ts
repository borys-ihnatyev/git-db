import { type ErrorRequestHandler, type RequestHandler } from "express";
import express from "express";
import ErrorResult, { type ErrorResponseJSON } from "./core/ErrorResult.ts";
import { DB_PATH, PORT } from "../env.ts";
import cors from "cors";
import trpcExpressMiddleware from "./trpc/expressMiddleware.ts";

const notFoundErrorHandler: RequestHandler = (_req, _res, next) => {
  next(new ErrorResult("Not found", 404));
};

const globalErrorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  const maybeError = error as Partial<ErrorResult> | undefined;
  const message = maybeError?.message || "Unknown error";
  const status = maybeError?.status || 500;

  res.status(status).send({ status, message } satisfies ErrorResponseJSON);
};

express()
  .use(cors())
  .use("/trpc", trpcExpressMiddleware)
  .use(express.static(DB_PATH))
  .use(notFoundErrorHandler)
  .use(globalErrorHandler)
  .listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
  });
