import { ApiError } from "../utils/apiError.js";
import { envelope } from "../utils/apiResponse.js";
import { Response } from "express";

/**
 * Controller layer: shared error mapping.
 * ApiError.rc (spec business code) → HTTP status, then spec envelope body.
 */

/** Map a thrown error to an HTTP status following the rc semantics. */
export function httpStatusFor(err: ApiError): number {
  switch (err.rc) {
    case "01":
    case "02":
    case "03":
      return 400;
    case "33":
      return 409;
    case "04":
      return 404;
    case "99":
      return err.message.includes("Rajabiller") ? 502 : 500;
    default:
      // Upstream Rajabiller business codes (e.g. status != 00) → bad gateway.
      return 502;
  }
}

export function sendError(res: Response, err: unknown): void {
  const apiErr = ApiError.from(err);
  res.status(httpStatusFor(apiErr)).json(envelope(apiErr.rc, apiErr.message, apiErr.payload));
}
