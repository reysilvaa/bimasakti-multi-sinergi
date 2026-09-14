import { z } from "zod";

export interface PdamProduct {
  name: string;
  defaultIdpel: string;
}

export const SUPPORTED_PRODUCTS = {
  WASDA: { name: "PDAM SIDOARJO", defaultIdpel: "01002676" },
  WABONDO: { name: "PDAM BONDOWOSO", defaultIdpel: "09000879" },
} as const satisfies Record<string, PdamProduct>;

export type PdamProductCode = keyof typeof SUPPORTED_PRODUCTS;

const productCodes = Object.keys(SUPPORTED_PRODUCTS) as [
  PdamProductCode,
  ...PdamProductCode[],
];
export const pdamProductCodeSchema = z.enum(productCodes);

export function isSupportedProduct(code: unknown): code is PdamProductCode {
  return pdamProductCodeSchema.safeParse(code).success;
}
