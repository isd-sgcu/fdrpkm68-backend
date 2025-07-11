import { UserUsecase } from "@/usecase/user/userUsecase";

import type { AuthenticatedRequest } from "@/types/auth/authenticatedRequest";
import type { RegisterRequest } from "@/types/auth/POST";
import { AppError } from "@/types/error/AppError";
import type { Response } from "express";


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
      res.status(500).json({
        message: "An unexpected error occurred",
      });
    }
  }

}
