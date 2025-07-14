import { EventType } from "@prisma/client";
import { Response } from "express";

import { CheckinRequest } from "@/types/checkin/POST";
import { AppError } from "@/types/error/AppError";
import { CheckinUsecase } from "@/usecase/checkin/checkinUsecase";

import type { AuthenticatedRequest } from "@/types/auth/authenticatedRequest";

export class CheckinController {
  private checkinUsecase: CheckinUsecase;

  constructor() {
    this.checkinUsecase = new CheckinUsecase();
  }

  // Get a check-in by id
  // async getCheckinById(req: Request, res: Response) {
  //   const id = req.params.id; // UUID string
  //   try {
  //     const checkin = await this.checkinUsecase.findCheckinById(id);
  //     if (!checkin) {
  //       return res.status(404).json({ message: "Check-in not found" });
  //     }
  //     res.json(checkin);
  //   } catch (error) {
  //     res.status(500).json({ error: "Failed to fetch check-in" });
  //   }
  // }

  async getCheckinByUserIdAndEvent(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const event = req.params?.event;
      // Validate userId and event

      if (!userId || !event) {
        res.status(400).json({ message: "User ID and event are required" });
        return;
      }
      const checkin = await this.checkinUsecase.findCheckinByUserIdAndEvent(
        userId,
        event as EventType
      );
      if (!checkin) {
        res.status(404).json({ message: "Check-in not found" });
        return;
      }
      res.json(checkin);
    } catch (error: unknown) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          message: error.message,
        });
        return;
      }
      console.error("Error fetching check-in:", error);
      res.status(500).json({ error: "Failed to fetch check-in" });
    }
  }

  // Create a new check-in
  async register(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user!.id; // Get userId from authenticated user
      const checkinData = req.body as CheckinRequest;
      // checkinData.userId = userId; // Ensure userId is set from authenticated user
      const newCheckin = await this.checkinUsecase.createCheckin({
        ...checkinData,
        userId,
      });
      res.status(201).json(newCheckin);
    } catch (error: unknown) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
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

  async registerByStaff(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.body.userId; // Get userId from request body or authenticated user

      if (!userId) {
        res.status(400).json({ message: "User ID and event are required" });
        return;
      }

      const newCheckin = await this.checkinUsecase.createCheckinByUserId({
        userId,
      });
      res.status(201).json(newCheckin);
    } catch (error: unknown) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          message: error.message,
        });
        return;
      }
      console.error("Error creating check-in by user ID:", error);
      res.status(500).json({
        message: "An unexpected error occurred",
      });
    }
  }
  // Update a check-in by id
  // async updateCheckin(req: Request, res: Response) {
  //   const id = req.params.id; // UUID string
  //   const { event, status } = req.body;
  //   try {
  //     const updatedCheckin = await this.checkinUsecase.updateCheckin(id, {
  //       event,
  //       status,
  //       updatedAt: new Date(),
  //     });
  //     res.json(updatedCheckin);
  //   } catch (error) {
  //     res.status(500).json({ error: "Failed to update check-in" });
  //   }
  // }

  // Update a check-in by userId and event
  // async updateCheckinByUserId(req: Request, res: Response) {
  //   const userId = req.params.userId; // UUID string
  //   const { event, status } = req.body;
  //   try {
  //     const count = await this.checkinUsecase.updateCheckinByUserIdAndEvent(
  //       userId,
  //       event,
  //       {
  //         status,
  //         updatedAt: new Date(),
  //       }
  //     );
  //     if (count === 0) {
  //       return res.status(404).json({ error: "Check-in not found for this user and event" });
  //     }
  //     res.json({ message: "Check-in updated", count });
  //   } catch (error) {
  //     res.status(500).json({ error: "Failed to update check-in" });
  //   }
  // }
}
