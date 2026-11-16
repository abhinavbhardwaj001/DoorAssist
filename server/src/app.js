import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import env from "./config/env.js";

import authRoutes from "./modules/auth/auth.routes.js";
import userRoutes from "./modules/users/user.routes.js";
import providerRoutes from "./modules/providers/provider.routes.js";
import serviceRoutes from "./modules/services/service.routes.js";
import categoryRoutes from "./modules/categories/category.routes.js";
import bookingRoutes from "./modules/bookings/booking.routes.js";
import reviewRoutes from "./modules/reviews/review.routes.js";
import paymentRoutes from "./modules/payments/payment.routes.js";
import aiRoutes from "./modules/ai/ai.routes.js";
import errorHandler from "./middlewares/error.middleware.js";

const app = express();

app.set("trust proxy", 1);

app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));

app.use(
  cors({
    origin: env.frontendUrl?.replace(/\/$/, ""),
    credentials: true,
  }),
);

app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true, limit: "100kb" }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/providers", providerRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/ai", aiRoutes);

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use(errorHandler);

export default app;
