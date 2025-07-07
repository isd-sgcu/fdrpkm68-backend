import { Request, Response } from "express";
import { AuthUsecase } from "@/usecase/auth/authUsecase";
import type { RegisterRequest } from "@/types/auth/POST";
import { AppErorr } from "@/types/error/AppError";

export class AuthController {
  private authUseCase: AuthUsecase;

  constructor() {
    this.authUseCase = new AuthUsecase();
  }

  async register(req: Request, res: Response): Promise<Response> {
    try {
      const user = await this.authUseCase.register(req.body as RegisterRequest);
      return res.status(201).json({ user });
    } catch (error: unknown) {
      if (error instanceof AppErorr) {
        return res.status(error.statusCode).json({
          message: error.message,
        });
      }

      console.error("Unexpected error:", error);
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }
}
