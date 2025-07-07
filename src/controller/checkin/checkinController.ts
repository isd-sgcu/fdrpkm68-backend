import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { CheckinUsecase } from "@/usecase/checkin/checkinUsecase";
  

export class CheckinController {
  private checkinUsecase: CheckinUsecase;

  constructor() {
    this.checkinUsecase = new CheckinUsecase();
  }

  // Get a check-in by id
  async getCheckinById(req: Request, res: Response) {
    const id = req.params.id; // UUID string
    try {
      const checkin = await this.checkinUsecase.getCheckinById(id);
      if (!checkin) {
        return res.status(404).json({ message: "Check-in not found" });
      }
      res.json(checkin);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch check-in" });
    }
  }

  // Get check-ins by userId
  // async getCheckinsByUserId(req: Request, res: Response) {
  //   const userId = req.params.userId; // UUID string
  //   try {
  //     const userCheckins = await prisma.checkin.findMany({ where: { userId } });
  //     res.json(userCheckins);
  //   } catch (error) {
  //     res.status(500).json({ error: "Failed to fetch check-ins by userId" });
  //   }
  // }

  // Create a new check-in
  async createCheckin(req: Request, res: Response) {
    
      const newCheckin = await.create({
        data: {
          userId,
          event,
          status,
        },
      });
      res.status(201).json(newCheckin);
    } catch (error) {
      res.status(500).json({ error: "Failed to create check-in" });
    }
  }

  // Update a check-in
  async updateCheckin(req: Request, res: Response) {
    const id = req.params.id; // UUID string
    const { userId, event, status } = req.body;
    try {
      const updatedCheckin = await prisma.checkin.update({
        where: { id },
        data: {
          userId,
          event,
          status,
          updatedAt: new Date(),
        },
      });
      res.json(updatedCheckin);
    } catch (error) {
      res.status(500).json({ error: "Failed to update check-in" });
    }
  }

  // Update a check-in by userId and event
  async updateCheckinByUserId(req: Request, res: Response) {
    const userId = req.params.userId; // UUID string
    const { event, status } = req.body;
    try {
      const updatedCheckin = await prisma.checkin.updateMany({
        where: { userId, event },
        data: {
          status,
          updatedAt: new Date(),
        },
      });
      if (updatedCheckin.count === 0) {
        return res.status(404).json({ error: "Check-in not found for this user and event" });
      }
      res.json({ message: "Check-in updated", count: updatedCheckin.count });
    } catch (error) {
      res.status(500).json({ error: "Failed to update check-in" });
    }
  }
}
