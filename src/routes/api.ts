import { Router } from "express";
import { inquiry } from "../controllers/inquiryController.js";
import { payment } from "../controllers/paymentController.js";
import {
  listTransactions,
  getTransaction,
  downloadReceipt,
} from "../controllers/historyController.js";
import { SUPPORTED_PRODUCTS } from "../config/constants.js";

const router = Router();

router.get("/products", (_req, res) => {
  res.json({
    rc: "00",
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
