import { z } from "zod";

export const RC = {
  SUCCESS: "00",
  INVALID_PRODUCT: "01",
  INVALID_IDPEL: "02",
  INCOMPLETE_PAYMENT: "03",
  NOT_FOUND: "04",
  ALREADY_PAID: "33",
  INTERNAL_ERROR: "99",
} as const;

export type Rc = (typeof RC)[keyof typeof RC];

export const envelopeSchema = z.object({
  rc: z.string(),
  ket: z.string(),
  data: z.unknown().optional(),
});
export type Envelope = z.infer<typeof envelopeSchema>;

export function envelope<T>(rc: string, ket: string, data?: T) {
  return data === undefined ? { rc, ket } : { rc, ket, data };
}
