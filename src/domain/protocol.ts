export const RC = {
  SUCCESS: "00",
  INVALID_PRODUCT: "01",
  INVALID_IDPEL: "02",
  INCOMPLETE_PAYMENT: "03",
  NOT_FOUND: "04",
  ALREADY_PAID: "33",
  INTERNAL_ERROR: "99",
} as const;

export function envelope<T>(rc: string, ket: string, data?: T) {
  return data === undefined ? { rc, ket } : { rc, ket, data };
}
