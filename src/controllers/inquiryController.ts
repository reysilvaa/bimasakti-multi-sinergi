import { Request, Response } from "express";
import { RajabillerService } from "../services/rajabillerService.js";
import { isSupportedProduct, envelope } from "../utils/helpers.js";

export async function handleInquiry(req: Request, res: Response): Promise<void> {
  try {
    const { productCode, customerId } = req.body as {
      productCode?: string;
      customerId?: string;
    };

    if (!isSupportedProduct(productCode)) {
      res.status(400).json(envelope("01", "Kode produk tidak valid. Pilih WASDA (PDAM Sidoarjo) atau WABONDO (PDAM Bondowoso)."));
      return;
    }

    if (!customerId || !customerId.trim()) {
      res.status(400).json(envelope("02", "Nomor ID Pelanggan (idpel) wajib diisi."));
      return;
    }

    const data = await RajabillerService.executeInquiry(productCode, customerId.trim(), "");
    res.json(envelope("00", "Inquiry tagihan berhasil didapatkan.", data));
  } catch (error: any) {
    res.status(502).json(envelope(error.rc || "99", error.message || "Gagal melakukan inquiry ke server Rajabiller."));
  }
}
