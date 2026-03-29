import Invoice from "../models/Invoice.js";

/* Utility */
const calculateAmounts = (items = [], received = 0) => {
  const total = items.reduce((s, i) => s + (i.amount || 0), 0);
  return {
    totalAmount: total,
    balanceAmount: total - received,
  };
};

const normalizeDate = (d) => {
  if (!d) return null;

  // If already ISO / Date → works
  const parsed = new Date(d);

  if (!isNaN(parsed)) return parsed;

  // If coming as "DD-MM-YYYY"
  const [day, month, year] = d.split("-");
  return new Date(`${year}-${month}-${day}`);
};

/* ✅ CREATE */
export const createInvoice = async (req, res, next) => {
  try {
    const data = req.body;

    const date = normalizeDate(data.date);
    const dateOfSupply = normalizeDate(data.dateOfSupply);

    const invoice = await Invoice.create({
      ...data,
      date,
      dateOfSupply,
      invoiceYear: date.getFullYear(), // 🔥 IMPORTANT
    });

    res.status(201).json(invoice);
  } catch (err) {
    next(err);
  }
};

/* ✅ GET ALL */
export const getInvoices = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      invoiceYear,
      search = "",
      isActive = "true",
    } = req.query;

    const query = {
      isActive: isActive === "true",
    };

    if (invoiceYear) {
      query.invoiceYear = Number(invoiceYear); // 🔥 super fast
    }

    if (search) {
      query.$or = [
        { invoiceNo: { $regex: search, $options: "i" } },
        { vendorName: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    const [invoices, total] = await Promise.all([
      Invoice.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Invoice.countDocuments(query),
    ]);

    res.json({
      data: invoices,
      total,
      page: Number(page),
      limit: Number(limit),
    });
  } catch (err) {
    next(err);
  }
};

/* ✅ GET BY ID */
export const getInvoiceById = async (req, res, next) => {
  try {
    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    res.json(invoice);
  } catch (err) {
    next(err);
  }
};

/* ✅ UPDATE */
export const updateInvoice = async (req, res, next) => {
  try {
    const data = req.body;

    const date = normalizeDate(data.date);
    const dateOfSupply = normalizeDate(data.dateOfSupply);

    const updated = await Invoice.findByIdAndUpdate(
      req.params.id,
      {
        ...data,
        date,
        dateOfSupply,
        invoiceYear: date.getFullYear(),
      },
      { new: true },
    );

    res.json(updated);
  } catch (err) {
    next(err);
  }
};

/* ✅ SOFT DELETE */
export const deleteInvoice = async (req, res, next) => {
  try {
    await Invoice.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ message: "Invoice moved to trash" });
  } catch (err) {
    next(err);
  }
};

/* ✅ RESTORE */
export const restoreInvoice = async (req, res, next) => {
  try {
    await Invoice.findByIdAndUpdate(req.params.id, { isActive: true });
    res.json({ message: "Invoice restored" });
  } catch (err) {
    next(err);
  }
};
