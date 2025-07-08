import { Checkin, Prisma, EventType } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export class CheckinRepository {
  async findCheckinById(id: string): Promise<
    | (Checkin & {
        id: string;
        userId: string;
        event: string;
        status: string;
        updatedAt: Date;
        createdAt: Date;
      })
    | null
  > {
    try {
      return await prisma.checkin.findUnique({
        where: { id: id },
      });
    } catch (error) {
      console.error("Error finding checkin by ID:", error);
      throw new Error("Failed to find checkin by ID");
    }
  }

  async findCheckinByUserIdAndEvent(
    userId: string,
    event: EventType
  ): Promise<
    | (Checkin & {
        id: string;
        userId: string;
        event: string;
        status: string;
        updatedAt: Date;
        createdAt: Date;
      })
    | null
  > {
    try {
      return await prisma.checkin.findUnique({
        where: {
          userId_event: {
            userId,
            event,
          },
        },
      });
    } catch (error) {
      console.error("Error finding checkin by userId and event:", error);
      throw new Error("Failed to find checkin by userId and event");
    }
  }

  async createCheckin(data: Prisma.CheckinCreateInput): Promise<Checkin> {
    try {
      const checkin = await prisma.checkin.create({ data });
      return checkin;
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
      return await prisma.checkin.update({
        where: { id },
        data: {
          event: data.event,
          status: data.status,
        },
      });
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
      const result = await prisma.checkin.updateMany({
        where: { userId, event },
        data,
      });
      return result.count;
    } catch (error) {
      console.error("Error updating checkin by userId and event:", error);
      throw new Error("Failed to update checkin by userId and event");
    }
  }
}
