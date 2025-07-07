import { UUID } from "@/types/common";
import { HouseRepository } from "@/repository/house/houseRepository";
import { House } from "@/types/house/house";

export class GetHouseByIdUseCase {
  private houseRepository: HouseRepository;
  constructor() {
    this.houseRepository = new HouseRepository();
  }

  async execute(id: UUID): Promise<House | null> {
    try {
      const house = await this.houseRepository.getHouseById(id);
      return house;
    } catch (error) {
      throw new Error(
        `Failed to get house by ID: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }
}
