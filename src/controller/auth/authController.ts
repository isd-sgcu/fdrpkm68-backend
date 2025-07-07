import { Request, Response } from "express";

export class AuthController {
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({
          success: false,
          error: "Email and password are required",
          timestamp: new Date().toISOString(),
        });
        return;
      }
      res.status(200).json({
        success: true,
        message: "Login successful",
        data: {
          user: {
            id: "user-123",
            email: email,
            name: "Mock User",
          },
          token: "mock-jwt-token",
        },
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
