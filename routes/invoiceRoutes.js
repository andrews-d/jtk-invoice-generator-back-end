import express from "express";
import {
  createInvoice,
  getInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
  restoreInvoice,
} from "../controllers/invoiceController.js";

const router = express.Router();

router.post("/", createInvoice);
router.get("/", getInvoices);
router.get("/:id", getInvoiceById);
router.put("/:id", updateInvoice);

/* 🔥 ADD THESE TWO — YOU MISSED THIS */
router.patch("/:id/delete", deleteInvoice);
router.patch("/:id/restore", restoreInvoice);

export default router;
