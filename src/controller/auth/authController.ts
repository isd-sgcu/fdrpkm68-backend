import { Request, Response } from "express";
import { AuthUsecase } from "@/usecase/auth/authUsecase";
import type { RegisterRequest } from "@/types/auth/POST";
import { AppError } from "@/types/error/AppError";

export class AuthController {
  private authUseCase: AuthUsecase;

  constructor() {
    this.authUseCase = new AuthUsecase();
  }

  async register(req: Request, res: Response): Promise<void> {
    try {
      const user = await this.authUseCase.register(req.body as RegisterRequest);
      res.status(201).json({ user });
      return;
    } catch (error: unknown) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          message: error.message,
        });
        return;
      }

      console.error("Unexpected error:", error);
      res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const token = await this.authUseCase.login(req.body);
      res.cookie("token", token, {
        maxAge: 2 * 24 * 60 * 60 * 1000,
      });
      res.status(200).json({ token });
    } catch (error: unknown) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          message: error.message,
        });
        return;
      }

      console.error("Unexpected error:", error);
      res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  async forgotPassword(req: Request, res: Response): Promise<void> {
    try {
      const status = await this.authUseCase.forgotPassword(req.body);
      if (status) {
        res.status(200).json({
          message: "Your password has been reset.",
        });
      }
    } catch (error: unknown) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          message: error.message,
        });
        return;
      }

      console.error("Unexpected error:", error);
      res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    res.clearCookie("token", {});

    res.status(200).json({
      message: "Logged out successfully",
    });
  }
}
