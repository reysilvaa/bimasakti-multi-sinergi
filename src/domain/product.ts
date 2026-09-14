import { z } from "zod";

export const pdamProductCodeSchema = z.enum(["WASDA", "WABONDO"]);
export type PdamProductCode = z.infer<typeof pdamProductCodeSchema>;

export const pdamProductSchema = z.object({
  name: z.string(),
  defaultIdpel: z.string(),
});
export type PdamProduct = z.infer<typeof pdamProductSchema>;

export const SUPPORTED_PRODUCTS: Record<PdamProductCode, PdamProduct> = {
  WASDA: { name: "PDAM SIDOARJO", defaultIdpel: "01002676" },
  WABONDO: { name: "PDAM BONDOWOSO", defaultIdpel: "09000879" },
};

z.record(pdamProductCodeSchema, pdamProductSchema).parse(SUPPORTED_PRODUCTS);

export function isSupportedProduct(code: unknown): code is PdamProductCode {
  return pdamProductCodeSchema.safeParse(code).success;
}
