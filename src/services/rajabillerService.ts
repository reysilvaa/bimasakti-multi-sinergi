import { CONFIG } from "../config/constants.js";
import { RajabillerRawResponse, RajabillerRequest } from "../types/rajabiller.types.js";
import { InquiryData, PdamProductCode } from "../types/transaction.types.js";
import { toInquiryData, sendRajabillerRequest } from "../utils/helpers.js";

/**
 * Rajabiller fastpay.inq / fastpay.pay client (spec point 5).
 * Inquiry: non-"00" throws (with .rc). Payment: raw response always returned —
 * the controller decides what status "33" (already paid) means.
 */
export class RajabillerService {
  private static buildRequest(
    method: "fastpay.inq" | "fastpay.pay",
    productCode: PdamProductCode,
    idpel: string,
    ref1: string,
    extra?: { nominal?: string; ref2?: string; ref3?: string }
  ): RajabillerRequest {
    return {
      method,
      uid: CONFIG.RAJABILLER.UID,
      pin: CONFIG.RAJABILLER.PIN,
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
    ref1: string
  ): Promise<InquiryData> {
    const ref1Value = ref1 || `INQ_${Date.now()}_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const payload = this.buildRequest("fastpay.inq", productCode, customerId, ref1Value);
    const raw = await sendRajabillerRequest(payload);
    return toInquiryData(raw, productCode, ref1Value);
  }

  public static async executePayment(params: {
    productCode: PdamProductCode;
    customerId: string;
    ref1: string;
    ref2: string;
    nominal: string;
  }): Promise<{ rawRequest: RajabillerRequest; rawResponse: RajabillerRawResponse }> {
    const payload = this.buildRequest("fastpay.pay", params.productCode, params.customerId, params.ref1, {
      nominal: params.nominal,
      ref2: params.ref2,
      ref3: "",
    });
    const rawResponse = await sendRajabillerRequest(payload, { throwOnBusinessError: false });
    return { rawRequest: payload, rawResponse };
  }
}
