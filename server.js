import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";

import connectDB from "./config/db.js";

/* Routes */
import authRoutes from "./routes/authRoutes.js";
import vendorRoutes from "./routes/vendorRoutes.js";
import invoiceRoutes from "./routes/invoiceRoutes.js";

/* Error system */
import { errorHandler } from "./middleware/errorHandler.js";
import { ERROR_CODES } from "./constants/errorCodes.js";

dotenv.config();

const app = express();

/* =========================
   ✅ DB CONNECT
========================= */
connectDB();

/* =========================
   ✅ MIDDLEWARE
========================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: true, // allow all origins (dev mode)
    credentials: true,
  }),
);

/* =========================
   ✅ HEALTH CHECK
========================= */
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API Running 🚀",
  });
});

/* =========================
   ✅ ROUTES
========================= */
app.use("/api/auth", authRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/invoices", invoiceRoutes);

/* =========================
   ❌ 404 HANDLER
========================= */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: ERROR_CODES.NOT_FOUND,
      message: "Route not found",
    },
  });
});

/* =========================
   🔥 GLOBAL ERROR HANDLER
   MUST BE LAST
========================= */
app.use(errorHandler);

/* =========================
   🚀 SERVER
========================= */
const server = http.createServer(app);

server.keepAliveTimeout = 120000;
server.headersTimeout = 120000;

const PORT = process.env.PORT || 10000;

server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
