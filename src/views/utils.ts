export const formatRupiah = (amount: number): string =>
  `Rp ${amount.toLocaleString("id-ID")}`;

export type Product = { code: string; name: string; defaultIdpel: string };
export type Envelope<T> = { rc: string; ket: string; data?: T };
