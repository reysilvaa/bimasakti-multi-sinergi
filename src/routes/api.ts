import { Router } from "express";
import {
  downloadReceipt,
  getTransaction,
  listTransactions,
} from "@/controllers/historyController.js";
import { inquiry } from "@/controllers/inquiryController.js";
import { payment } from "@/controllers/paymentController.js";
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

export default router;
