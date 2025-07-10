import { Request, Response } from "express";

import { UUID } from "@/types/common";

import { HouseUseCase } from "../../usecase/house/houseUsecase";


export class HouseController {
  private houseUserCase: HouseUseCase;
  constructor() {
    this.houseUserCase = new HouseUseCase();
  }

  // Get all houses
  async getAllHouses(req: Request, res: Response): Promise<void> {
    try {
      const houses = await this.houseUserCase.getAllHouses();
      res.status(200).json({
        success: true,
        data: houses,
        message: "Houses retrieved successfully",
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Get all houses error:", error);
      res.status(500).json({
        success: false,
        error: "Internal server error",
        message: "Failed to retrieve houses",
        timestamp: new Date().toISOString(),
      });
    }
  }

  // Get house by ID
  async getHouseById(req: Request, res: Response): Promise<void> {
    try {
      const houseId: UUID = req.params.id;

      // Basic UUID format validation
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(houseId)) {
        res.status(400).json({
          success: false,
          error: "Invalid house ID",
          message: "House ID must be a valid UUID",
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const house = await this.houseUserCase.getHouseById(houseId);

      if (!house) {
        res.status(404).json({
          success: false,
          error: "House not found",
          message: `House with ID ${houseId} not found`,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: house,
        message: "House retrieved successfully",
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Get house by ID error:", error);
      res.status(500).json({
        success: false,
        error: "Internal server error",
        message: "Failed to retrieve house",
        timestamp: new Date().toISOString(),
      });
    }
  }
}
