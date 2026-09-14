import { SUPPORTED_PRODUCTS } from "../config/constants.js";
import { PdamProductCode } from "../models/transaction.js";

/** Type guard: a product code is supported iff it is a key of SUPPORTED_PRODUCTS. */
export function isSupportedProduct(code: unknown): code is PdamProductCode {
  return typeof code === "string" && code in SUPPORTED_PRODUCTS;
}

/** Spec point 4 response envelope: { rc, ket, data }. rc "00" = success. */
export function envelope<T>(rc: string, ket: string, data?: T) {
  return data === undefined ? { rc, ket } : { rc, ket, data };
}
