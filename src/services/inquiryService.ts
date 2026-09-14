import { ApiError } from "@/domain/errors.js";
import type { InquiryData } from "@/domain/inquiry.js";
import type { PdamProductCode } from "@/domain/product.js";
import { isSupportedProduct } from "@/domain/product.js";
import { RC } from "@/domain/protocol.js";
import { RajabillerService } from "@/services/rajabillerService.js";

export class InquiryService {
  public static async inquire(input: {
    productCode?: string;
    customerId?: string;
  }): Promise<InquiryData> {
    if (!isSupportedProduct(input.productCode)) {
      throw new ApiError(
        RC.INVALID_PRODUCT,
        "Kode produk tidak valid. Pilih WASDA (PDAM Sidoarjo) atau WABONDO (PDAM Bondowoso).",
      );
    }

    const customerId = (input.customerId || "").trim();
    if (!customerId) {
      throw new ApiError(
        RC.INVALID_IDPEL,
        "Nomor ID Pelanggan (idpel) wajib diisi.",
      );
    }

    return RajabillerService.executeInquiry(
      input.productCode as PdamProductCode,
      customerId,
      "",
    );
  }
}
