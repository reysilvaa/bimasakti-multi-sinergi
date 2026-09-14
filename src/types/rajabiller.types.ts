/**
 * Raw Rajabiller API types.
 */

export interface RajabillerRequest {
  method: "fastpay.inq" | "fastpay.pay";
  uid: string;
  pin: string;
  idpel1: string;
  idpel2: string;
  idpel3: string;
  kode_produk: string;
  ref1: string;
  nominal?: string;
  ref2?: string;
  ref3?: string;
}

export interface RajabillerRawResponse {
  kodeproduk?: string;
  waktu?: string;
  nominal?: string;
  biayaadmin?: string;
  ref1?: string;
  ref2?: string;
  status: string;
  keterangan?: string;
  billquantity?: string;
  noref2?: string;
  customername?: string;
  customeraddress?: string;
  nometer?: string;

  [key: string]: string | undefined;
}
