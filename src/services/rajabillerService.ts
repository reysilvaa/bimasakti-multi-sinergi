import { RAJABILLER } from "@/config/rajabiller.js";
import { ApiError } from "@/domain/errors.js";
import type { InquiryData, SpecBill } from "@/domain/inquiry.js";
import { type PdamProductCode, SUPPORTED_PRODUCTS } from "@/domain/product.js";
import { RC } from "@/domain/protocol.js";
import type {
  RajabillerRawResponse,
  RajabillerRequest,
} from "@/domain/rajabiller.js";
import type { TransactionRecord } from "@/domain/transaction.js";
import { extractBills } from "@/services/receiptService.js";
import { toInt } from "@/utils/helpers.js";
import { terbilang } from "@/utils/terbilang.js";

function toInquiryData(
  raw: RajabillerRawResponse,
  sentRef1: string,
): InquiryData {
  const bills: SpecBill[] = extractBills(raw);
  const nominal = toInt(raw.nominal);
  const admin = toInt(raw.biayaadmin);

  return {
    idpel: raw.customerid1 || raw.idpelanggan1 || "",
    nometer: raw.nometer || "",
    alamat: raw.customeraddress || "",
    nama: raw.customername || "",
    nominal,
    admin,
    total_bayar: nominal + admin,
    jumlah_bulan: raw.billquantity || String(bills.length),
    data_bill: bills,
    ref1: raw.ref1 || sentRef1,
    ref2: raw.ref2 || "",
  };
}

async function sendRajabillerRequest(
  payload: RajabillerRequest,
  opts?: { throwOnBusinessError?: boolean },
): Promise<RajabillerRawResponse> {
  const response = await fetch(RAJABILLER.URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new ApiError(
      RC.INTERNAL_ERROR,
      `Rajabiller HTTP Error: ${response.status} ${response.statusText}`,
    );
  }

  const raw = (await response.json()) as RajabillerRawResponse;
  if (raw.status !== RC.SUCCESS && opts?.throwOnBusinessError !== false) {
    throw new ApiError(
      raw.status,
      raw.keterangan || "Rajabiller request failed",
    );
  }
  return raw;
}

export class RajabillerService {
  private static buildRequest(
    method: "fastpay.inq" | "fastpay.pay",
    productCode: PdamProductCode,
    idpel: string,
    ref1: string,
    extra?: { nominal?: string; ref2?: string; ref3?: string },
  ): RajabillerRequest {
    return {
      method,
      uid: RAJABILLER.UID,
      pin: RAJABILLER.PIN,
      idpel1: idpel.trim(),
      idpel2: "",
      idpel3: "",
      kode_produk: productCode,
      ref1,
      ...extra,
    };
  }

  public static async executeInquiry(
    productCode: PdamProductCode,
    customerId: string,
    ref1: string,
  ): Promise<InquiryData> {
    const ref1Value =
      ref1 ||
      `INQ_${Date.now()}_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const payload = this.buildRequest(
      "fastpay.inq",
      productCode,
      customerId,
      ref1Value,
    );
    const raw = await sendRajabillerRequest(payload);
    return toInquiryData(raw, ref1Value);
  }

  public static async executePayment(params: {
    productCode: PdamProductCode;
    customerId: string;
    ref1: string;
    ref2: string;
    nominal: string;
  }): Promise<{
    record: Omit<
      TransactionRecord,
      "id" | "createdAt" | "productCode" | "ref2"
    >;
    keterangan: string;
  }> {
    const payload = this.buildRequest(
      "fastpay.pay",
      params.productCode,
      params.customerId,
      params.ref1,
      {
        nominal: params.nominal,
        ref2: params.ref2,
        ref3: "",
      },
    );
    const raw = await sendRajabillerRequest(payload, {
      throwOnBusinessError: false,
    });

    const isSuccess = raw.status === RC.SUCCESS;
    if (!isSuccess && raw.status !== RC.ALREADY_PAID) {
      throw new ApiError(
        raw.status,
        raw.keterangan || "Pembayaran gagal diproses oleh Rajabiller.",
      );
    }

    const bills = extractBills(raw);
    const nominalValue = toInt(raw.nominal);
    const adminFee = toInt(raw.biayaadmin);
    const penalty = bills.reduce((acc, b) => acc + b.denda, 0);
    const miscFee = bills.reduce((acc, b) => acc + b.nonair, 0);
    const meterUsage = bills.reduce(
      (acc, b) => acc + Math.max(0, b.meterAkhir - b.meterAwal),
      0,
    );
    const totalAmount = nominalValue + adminFee;

    return {
      record: {
        ref1: raw.ref1 || params.ref1,
        noResi: raw.noref2 || raw.ref2 || params.ref2,
        pdamName: SUPPORTED_PRODUCTS[params.productCode].name,
        customerId: raw.customerid1 || params.customerId,
        customerName: raw.customername || "-",
        customerAddress: raw.customeraddress || "-",
        nominal: nominalValue,
        adminFee,
        penalty,
        miscFee,
        meterUsage,
        totalAmount,
        terbilang: terbilang(totalAmount),
        status: raw.status,
        statusDescription:
          raw.keterangan || (isSuccess ? "SUKSES" : "SUDAH DIBAYAR"),
        rawRequest: JSON.stringify(payload),
        rawResponse: JSON.stringify(raw),
      },
      keterangan: raw.keterangan || "Pembayaran tagihan berhasil!",
    };
  }
}
