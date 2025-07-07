import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
const app = express();
const PORT = 8080;

app.use(cors());
app.use(bodyParser.json());

app.get("/healthz", (_req: Request, res: Response) => {
  res.json({ status: "healthy" });
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
