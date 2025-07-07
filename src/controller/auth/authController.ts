import { Request, Response } from "express";
import { AuthUsecase } from "@/usecase/auth/authUsecase";

export class AuthController {
  private authUseCase: AuthUsecase;

  constructor() {
    this.authUseCase = new AuthUsecase();
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { studentId, password } = req.body;

      if (!studentId || !password) {
        res.status(400).json({
          success: false,
          error: "studentId and password are required",
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const { user, token } = await this.authUseCase.login({
        studentId,
        password,
      });

      res.status(200).json({
        success: true,
        message: "Login successful",
        data: { user, token },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({
        success: false,
        error: "Internal server error",
        timestamp: new Date().toISOString(),
      });
    }
  }
}
