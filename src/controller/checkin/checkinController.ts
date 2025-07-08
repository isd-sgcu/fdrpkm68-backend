import { Request, Response } from "express";
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
      const checkin = await this.checkinUsecase.findCheckinById(id);
      if (!checkin) {
        return res.status(404).json({ message: "Check-in not found" });
      }
      res.json(checkin);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch check-in" });
    }
  }

  // Create a new check-in
  async createCheckin(req: Request, res: Response) {
    const { id, event, status } = req.body;
    try {
      const newCheckin = await this.checkinUsecase.createCheckin({
        userId: id, // Assuming id is the userId
        event,
        status,
      });
      res.status(201).json(newCheckin);
    } catch (error) {
      res.status(500).json({ error: "Failed to create check-in" });
    }
  }

  // Update a check-in by id
  async updateCheckin(req: Request, res: Response) {
    const id = req.params.id; // UUID string
    const { event, status } = req.body;
    try {
      const updatedCheckin = await this.checkinUsecase.updateCheckin(id, {
        event,
        status,
        updatedAt: new Date(),
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
      const count = await this.checkinUsecase.updateCheckinByUserIdAndEvent(
        userId,
        event,
        {
          status,
          updatedAt: new Date(),
        }
      );
      if (count === 0) {
        return res.status(404).json({ error: "Check-in not found for this user and event" });
      }
      res.json({ message: "Check-in updated", count });
    } catch (error) {
      res.status(500).json({ error: "Failed to update check-in" });
    }
  }
}
