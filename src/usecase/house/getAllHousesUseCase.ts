import { House } from "@/types/house/house";
import { HouseRepository } from "@/repository/house/houseRepository";

export class GetAllHousesUseCase {
  private houseRepository: HouseRepository;
  constructor() {
    this.houseRepository = new HouseRepository();
  }

  async execute(): Promise<House[]> {
    try {
      const houses = await this.houseRepository.getAllHouses();
      return houses;
    } catch (error) {
      throw new Error(
        `Failed to get all houses: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }
}
