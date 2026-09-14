import { Router } from "express";
import {
  downloadReceipt,
  getTransaction,
  listTransactions,
} from "@/controllers/history.controller.js";
import { inquiry } from "@/controllers/inquiry.controller.js";
import { payment } from "@/controllers/payment.controller.js";
import { SUPPORTED_PRODUCTS } from "@/domain/product.js";
import { RC } from "@/domain/protocol.js";

const router = Router();

router.get("/products", (_req, res) => {
  res.json({
    rc: RC.SUCCESS,
    ket: "Daftar produk berhasil didapatkan.",
    data: Object.entries(SUPPORTED_PRODUCTS).map(([code, p]) => ({
      code,
      name: p.name,
      defaultIdpel: p.defaultIdpel,
    })),
  });
});

router.post("/inquiry", inquiry);
router.post("/payment", payment);

router.get("/transactions", listTransactions);
router.get("/transactions/:id", getTransaction);
router.get("/transactions/:id/receipt", downloadReceipt);

router.get("/readme", async (_req, res, next) => {
  try {
    const fs = await import("node:fs");
    const path = await import("node:path");
    const readmePath = path.resolve(process.cwd(), "README.md");
    if (fs.existsSync(readmePath)) {
      const content = fs.readFileSync(readmePath, "utf-8");
      return res.json({ rc: "00", ket: "sukses", data: { content } });
    }
    return res.json({ rc: "00", ket: "sukses", data: { content: "" } });
  } catch (err) {
    next(err);
  }
});

export default router;
