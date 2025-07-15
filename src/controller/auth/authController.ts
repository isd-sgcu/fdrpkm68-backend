import { Request, Response } from "express";

import { AppError } from "@/types/error/AppError";
import { AuthUsecase } from "@/usecase/auth/authUsecase";
import { UserUsecase } from "@/usecase/user/userUsecase";

import type { RegisterRequest } from "@/types/auth/POST";

export class AuthController {
  private authUseCase: AuthUsecase;
  private userUseCase: UserUsecase;

  constructor() {
    this.authUseCase = new AuthUsecase();
    this.userUseCase = new UserUsecase();
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


    async registerStaff(req: Request, res: Response): Promise<void> {
      try {
        const user = await this.userUseCase.registerStaff(
          req.body as RegisterRequest
        );
        res.status(201).json({ user });
        return;
      } catch (error: unknown) {
        if (error instanceof AppError) {
          res.status(error.statusCode).json({ message: error.message });
          return;
        }
        console.error("Error registering staff:", error);
        
      }
    }
}
