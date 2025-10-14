import express from "express";
import cors from "cors";
import morgan from "morgan";
import { setupSwagger } from "./config/swagger";
import { errorHandler } from "./middlewares/errorHandler";

// Routes
import authRoutes from "./modules/auth/auth.routes";
import userRoutes from "./modules/user/user.routes";
import companyRoutes from "./modules/company/company.routes";
import workerRoutes from "./modules/worker/worker.routes";
import analyticsRoutes from "./modules/analytics/analytics.routes";
import jobRoutes from "./modules/job/job.routes";
import walletRoutes from "./modules/wallet/wallet.routes";
import storage from "./modules/storage/storage.routes";
import notificationRoutes from "./modules/notification/notification.routes";
import bankRoutes from "./modules/bank/bank.routes";
import planRoutes from "./modules/plans/plan.routes";
import paymentReceiptRoutes from "./modules/paymentReceipt/paymentReceipt.routes";
import subscriptionRoutes from "./modules/subscription/subscription.routes";
import chapaRoutes from "./modules/onlinePayment/chapa.route";


const app = express();

// Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Admin Panel API is running 🚀" });
});

// Register routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/workers", workerRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/wallets", walletRoutes);
app.use("/api/storage", storage);
app.use("/api/notifications", notificationRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/subscription", subscriptionRoutes);
app.use("/api/banks", bankRoutes);
app.use("/api/receipts", paymentReceiptRoutes);
app.use("/api/online-payments", chapaRoutes);

// Setup Swagger
setupSwagger(app);

// Error handler (must be last)
app.use(errorHandler);

export default app;
