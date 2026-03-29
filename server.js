import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import http from "http";

import authRoutes from "./routes/authRoutes.js";
import vendorRoutes from "./routes/vendorRoutes.js";
import invoiceRoutes from "./routes/invoiceRoutes.js";

dotenv.config();

const app = express();

/* ✅ Connect DB FIRST */
connectDB();

/* ✅ Body parser */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ✅ CORS (works for local + future deploy) */
app.use(
  cors({
    origin: true, // 🔥 allow any origin for now
    credentials: true,
  }),
);

/* ✅ Health check */
app.get("/", (req, res) => {
  res.send("API Running 🚀");
});

/* ✅ Routes */
app.use("/api/auth", authRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/invoices", invoiceRoutes);

/* ✅ 404 handler */
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

/* ✅ Global Error handler */
app.use((err, req, res, next) => {
  console.error("❌ ERROR:", err.message);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

const server = http.createServer(app);

server.keepAliveTimeout = 120000;
server.headersTimeout = 120000;

const PORT = process.env.PORT || 10000;

server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });
