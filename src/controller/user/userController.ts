import type { Response } from "express";

import type { AuthenticatedRequest } from "@/types/auth/authenticatedRequest";
import { UserUsecase } from "@/usecase/user/userUsecase";

export class UserController {
  private userUseCase: UserUsecase;

  constructor() {
    this.userUseCase = new UserUsecase();
  }

  async get(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const user = await this.userUseCase.get(req.user);
      res.status(200).json({
        user,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({
          message: error.message,
        });
        return;
      }
      console.error("Error fetching user:", error);
      res.status(500).json({
        message: "An unexpected error occurred",
      });
    }
  }

  async update(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const user = await this.userUseCase.update(req.user?.id, req.body);
      res.status(200).json({
        message: "User updated successfully",
        user,
      });
      return;
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({
          message: error.message,
        });
        return;
      }
      console.error("Error updating user:", error);
      res.status(500).json({
        message: "An unexpected error occurred",
      });
    }
  }
}
