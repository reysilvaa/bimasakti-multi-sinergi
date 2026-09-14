/**
 * Application error carrying a business rc code (spec envelope) plus optional
 * payload. Thrown by services; controllers map it to an HTTP response.
 */
export interface ApiErrorPayload {
  [key: string]: unknown;
}

export class ApiError extends Error {
  public readonly rc: string;
  public readonly payload?: ApiErrorPayload;

  constructor(rc: string, message: string, payload?: ApiErrorPayload) {
    super(message);
    this.name = "ApiError";
    this.rc = rc;
    this.payload = payload;
  }

  /** Wrap any thrown value into an ApiError (preserves existing rc/payload). */
  public static from(err: unknown): ApiError {
    if (err instanceof ApiError) return err;

    // DuplicatePaymentError -> rc 33 + original transaction payload.
    const dup = err as {
      rc?: unknown;
      transaction?: unknown;
      receiptText?: unknown;
      message?: unknown;
    } | null;
    if (
      dup &&
      typeof dup === "object" &&
      dup.rc === "33" &&
      "transaction" in dup &&
      "receiptText" in dup
    ) {
      return new ApiError(
        "33",
        typeof dup.message === "string" ? dup.message : "Tagihan sudah dibayar sebelumnya (idempoten).",
        { transaction: dup.transaction, receiptText: dup.receiptText }
      );
    }

    const anyErr = err as { rc?: string; message?: string } | null;
    return new ApiError(
      anyErr && typeof anyErr.rc === "string" ? anyErr.rc : "99",
      (err instanceof Error && err.message) || "Terjadi kesalahan internal."
    );
  }
}
