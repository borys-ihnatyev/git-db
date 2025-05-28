import bodyParser from "body-parser";
import express, {
  type ErrorRequestHandler,
  type RequestHandler,
} from "express";
import db, { DeleteFilePayload, ModifyFilePayload } from "./core/db";
import ErrorResult, { ErrorResponseJSON } from "./core/ErrorResult";
import contentRouter from "./contentRouter";

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
  .use(contentRouter)
  .use(notFoundErrorHandler)
  .use(globalErrorHandler);

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
