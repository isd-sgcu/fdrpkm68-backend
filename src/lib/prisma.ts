import { PrismaClient } from "@prisma/client";

class PrismaManager {
  private static instance: PrismaClient;

  public static getInstance(): PrismaClient {
    if (!PrismaManager.instance) {
      if (process.env.NODE_ENV === "development") {
        PrismaManager.instance = new PrismaClient({
          log: ["query", "error", "warn"],
        });
      } else {
        PrismaManager.instance = new PrismaClient({
          log: ["error", "warn"],
        });
      }
    }

    return PrismaManager.instance;
  }

  public static async disconnect(): Promise<void> {
    if (PrismaManager.instance) {
      await PrismaManager.instance.$disconnect();
    }
  }
}

export const prisma = PrismaManager.getInstance();
