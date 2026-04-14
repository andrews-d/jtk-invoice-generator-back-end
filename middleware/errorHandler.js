import { ERROR_CODES } from "../constants/errorCodes.js";

export const errorHandler = (err, req, res, next) => {
  console.error("🔥 ERROR:", err);

  // =========================
  // 🔥 MongoDB Duplicate Key
  // =========================
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || err.keyValue || {})[0];

    let message = `${field} already exists. Please use a different value.`;
    let code = `${field?.toUpperCase()}_DUPLICATE`;

    if (field === "invoiceNo") {
      message =
        "Invoice number already exists. Please generate or enter a unique invoice number.";
      code = ERROR_CODES.INVOICE_DUPLICATE;
    }

    return res.status(409).json({
      success: false,
      error: {
        code,
        message,
        field,
      },
    });
  }

  // =========================
  // 🔥 Mongoose Validation Error
  // =========================
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);

    return res.status(400).json({
      success: false,
      error: {
        code: ERROR_CODES.VALIDATION_ERROR,
        message: "Validation failed",
        details: messages,
      },
    });
  }

  // =========================
  // 🔥 CastError (Invalid ObjectId)
  // =========================
  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      error: {
        code: ERROR_CODES.VALIDATION_ERROR,
        message: `Invalid ${err.path}: ${err.value}`,
      },
    });
  }

  // =========================
  // 🔥 JWT Errors
  // =========================
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      error: {
        code: ERROR_CODES.UNAUTHORIZED,
        message: "Invalid token. Please login again.",
      },
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      error: {
        code: ERROR_CODES.UNAUTHORIZED,
        message: "Session expired. Please login again.",
      },
    });
  }

  // =========================
  // 🔥 Default Server Error
  // =========================
  return res.status(500).json({
    success: false,
    error: {
      code: ERROR_CODES.SERVER_ERROR,
      message: err.message || "Something went wrong",
    },
  });
};
