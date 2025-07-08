import { Checkin, CheckinStatusType, User, EventType, Prisma } from "@prisma/client";
import { CheckinRepository } from "../../repository/checkin/checkinRepository";

export class CheckinUsecase {
  private checkinRepository: CheckinRepository;

  constructor() {
    this.checkinRepository = new CheckinRepository();
  }

  async findCheckinById(id: string): Promise<Checkin | null> {
    return this.checkinRepository.findCheckinById(id);
  }

  async findCheckinByUserIdAndEvent(
    userId: string,
    event: EventType
  ): Promise<Checkin | null> {
    return this.checkinRepository.findCheckinByUserIdAndEvent(userId, event);
  }

  async createCheckin(data: Prisma.CheckinCreateInput): Promise<Checkin> {
    try {
      return await this.checkinRepository.createCheckin(data);
    } catch (error) {
      console.error("Error creating checkin:", error);
      throw new Error("Failed to create checkin");
    }
  }

  async updateCheckin(
    id: string,
    data: Prisma.CheckinUpdateInput
  ): Promise<Checkin> {
    try {
      return await this.checkinRepository.updateCheckin(id, data);
    } catch (error) {
      console.error("Error updating checkin:", error);
      throw new Error("Failed to update checkin");
    }
  }

  async updateCheckinByUserIdAndEvent(
    userId: string,
    event: EventType,
    data: Prisma.CheckinUpdateInput
  ): Promise<number> {
    try {
      return await this.checkinRepository.updateCheckinByUserIdAndEvent(
        userId,
        event,
        data
      );
    } catch (error) {
      console.error("Error updating checkin by userId and event:", error);
      throw new Error("Failed to update checkin by userId and event");
    }
  }
}
