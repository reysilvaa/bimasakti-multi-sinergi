import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { RC, envelope } from "../domain/protocol.js";
import { ApiError } from "../domain/errors.js";

export function httpStatusFor(err: ApiError): number {
  switch (err.rc) {
    case RC.INVALID_PRODUCT:
    case RC.INVALID_IDPEL:
    case RC.INCOMPLETE_PAYMENT:
      return 400;
    case RC.ALREADY_PAID:
      return 409;
    case RC.NOT_FOUND:
      return 404;
    case RC.INTERNAL_ERROR:
      return err.message.includes("Rajabiller") ? 502 : 500;
    default:
      return 502;
  }
}

function zodToApiError(err: ZodError): ApiError {
  const first = err.issues[0];
  const field = first?.path?.join(".") || "body";
  return new ApiError(
    RC.INVALID_IDPEL,
    first ? `${first.message} (field: ${field})` : "Payload tidak valid.",
  );
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const apiErr =
    err instanceof ZodError ? zodToApiError(err) : ApiError.from(err);
  const status = httpStatusFor(apiErr);

  if (apiErr.payload && typeof apiErr.payload.plainText === "string") {
    res
      .status(status)
      .type("text/plain; charset=utf-8")
      .send(apiErr.payload.plainText);
    return;
  }

  res.status(status).json(envelope(apiErr.rc, apiErr.message, apiErr.payload));
}
