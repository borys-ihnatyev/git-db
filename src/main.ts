import bodyParser from "body-parser";
import express, {
  type ErrorRequestHandler,
  type RequestHandler,
} from "express";
import ErrorResult, { ErrorResponseJSON } from "./core/ErrorResult";
import contentRouter from "./contentRouter";
import { DB_PATH, PORT } from "../env";

const notFoundErrorHandler: RequestHandler = (req, res, next) => {
  next(new ErrorResult("Not found", 404));
};

const globalErrorHandler: ErrorRequestHandler = (error, req, res, next) => {
  const maybeError = error as Partial<ErrorResult> | undefined;
  const message = maybeError?.message || "Unknown error";
  const status = maybeError?.status || 500;

  res.status(status).send({ status, message } satisfies ErrorResponseJSON);
};

express()
  .use(bodyParser.json())
  .use(contentRouter)
  .use("/static", express.static(DB_PATH))
  .use(notFoundErrorHandler)
  .use(globalErrorHandler)
  .listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
  });
