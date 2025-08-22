import express from "express";
import cors from "cors";
import morgan from "morgan";
import { setupSwagger } from "./config/swagger";
import { errorHandler } from "./middlewares/errorHandler";

// Routes
import authRoutes from "./modules/auth/auth.routes";
import userRoutes from "./modules/user/user.routes";

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

// Setup Swagger
setupSwagger(app);

// Error handler (must be last)
app.use(errorHandler);

export default app;
