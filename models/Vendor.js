import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema(
  {
    vendorName: {
      type: String,
      required: true,
    },
    gstin: {
      type: String,
    },
    state: {
      type: String,
    },
    address1: {
      type: String,
    },
    address2: {
      type: String,
    },
    address3: {
      type: String,
    },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Vendor", vendorSchema);
