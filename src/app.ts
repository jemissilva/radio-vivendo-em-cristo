import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import { adminRouter } from "./routes/admin-routes";
import { publicRouter } from "./routes/public-routes";
import { errorHandler, notFoundHandler } from "./middleware/error-handler";

dotenv.config();

export const createApp = () => {
  const app = express();

  app.use(
    cors({
      origin: process.env.CORS_ORIGIN ?? "*",
    }),
  );
  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginResourcePolicy: { policy: "cross-origin" },
    }),
  );
  app.use(express.json({ limit: "2mb" }));

  app.get("/health", (_request, response) => {
    response.json({
      status: "ok",
      service: "radio-vivendo-em-cristo-backend",
      timestamp: new Date().toISOString(),
    });
  });

  app.use("/api/public", publicRouter);
  app.use("/api/admin", adminRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};