import { RajabillerService } from "./rajabillerService.js";
import { InquiryData } from "../models/transaction.js";
import { ApiError } from "../utils/apiError.js";
import { isSupportedProduct } from "../utils/apiResponse.js";

/**
 * Service layer: inquiry use case.
 * Validates input (domain rules) and delegates to the Rajabiller client.
 */
export class InquiryService {
  /** Async for signature parity with the other async services. */
  public static async inquire(
    input: { productCode?: string; customerId?: string }
  ): Promise<InquiryData> {
    if (!isSupportedProduct(input.productCode)) {
      throw new ApiError(
        "01",
        "Kode produk tidak valid. Pilih WASDA (PDAM Sidoarjo) atau WABONDO (PDAM Bondowoso)."
      );
    }

    const customerId = (input.customerId || "").trim();
    if (!customerId) {
      throw new ApiError("02", "Nomor ID Pelanggan (idpel) wajib diisi.");
    }

    return RajabillerService.executeInquiry(input.productCode, customerId, "");
  }
}
