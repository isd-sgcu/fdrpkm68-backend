import { UUID } from "@/types/common";
import { HouseRepository } from "@/repository/house/houseRepository";
import { House } from "@/types/house/house";
import { AppError } from "@/types/error/AppError";

export class HouseUseCase {
  private houseRepository: HouseRepository;

  constructor() {
    this.houseRepository = new HouseRepository();
  }

  async getHouseById(id: UUID): Promise<House | null> {
    try {
      const house = await this.houseRepository.getHouseById(id);
      return house;
    } catch (error) {
      throw new AppError(
        `Failed to get house by ID: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        500
      );
    }
  }

  async getAllHouses(): Promise<House[]> {
    try {
      const houses = await this.houseRepository.getAllHouses();
      return houses;
    } catch (error) {
      throw new AppError(
        `Failed to get all houses: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        500
      );
    }
  }
}
