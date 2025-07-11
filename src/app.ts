import "dotenv/config";
import bodyParser from "body-parser";
import cors from "cors";
import express, { Request, Response } from "express";

import { RouterManager } from "@/router";

const app = express();
const PORT = 8080;

app.use(cors());
app.use(bodyParser.json());

// Simple request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

const routerManager = new RouterManager();

app.use(routerManager.getRouter());

app.get("/healthz", (_req: Request, res: Response) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

async function startServer() {
  try {
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
