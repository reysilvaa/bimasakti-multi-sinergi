import { RC } from "./protocol.js";

export class ApiError extends Error {
  public readonly rc: string;
  public readonly payload?: Record<string, unknown>;

  constructor(rc: string, message: string, payload?: Record<string, unknown>) {
    super(message);
    this.name = "ApiError";
    this.rc = rc;
    this.payload = payload;
  }

  public static from(err: unknown): ApiError {
    if (err instanceof ApiError) return err;
    const rc = (err as { rc?: unknown } | null)?.rc;
    return new ApiError(
      typeof rc === "string" ? rc : RC.INTERNAL_ERROR,
      (err instanceof Error && err.message) || "Terjadi kesalahan internal.",
    );
  }
}
