import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  particular: String,
  qty: Number,
  rate: Number,
  amount: Number,
});

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNo: { type: String, required: true, unique: true, index: true },

    date: { type: Date, required: true },
    dateOfSupply: { type: Date, required: true },

    vehicleNumber: String,
    containerNo: String,
    placeOfSupply: String,
    bookingDetails: String,

    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor" },

    vendorName: String,
    gstin: String,
    state: String,
    address1: String,
    address2: String,
    address3: String,
    pinCode: Number,

    items: [itemSchema],

    received: { type: Number, default: 0 },
    totalAmount: Number,
    balanceAmount: Number,

    isActive: { type: Boolean, default: true },

    // 🔥 PERFORMANCE FIELD
    invoiceYear: { type: Number, index: true },
  },
  { timestamps: true },
);

export default mongoose.model("Invoice", invoiceSchema);
