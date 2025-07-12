import { Checkin, CheckinStatusType, EventType } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { CheckinRequest, CheckinRequestWithStatus } from "@/types/checkin/POST";
import { AppError } from "@/types/error/AppError";

export class CheckinRepository {
  // async findCheckinById(id: string): Promise<
  //   | (Checkin & {
  //       id: string;
  //       userId: string;
  //       event: string;
  //       status: string;
  //       updatedAt: Date;
  //       createdAt: Date;
  //     })
  //   | null
  // > {
  //   try {
  //     return await prisma.checkin.findUnique({
  //       where: { id: id },
  //     });
  //   } catch (error) {
  //     console.error("Error finding checkin by ID:", error);
  //     throw new AppError("Failed to find checkin by ID", 404);
  //   }
  // }

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
      return await prisma.checkin.findFirst({
        where: {
          userId,
          event,
        },
        orderBy: {
          status: "desc",
        },
      });
    } catch (error) {
      console.error("Error finding checkin by userId and event:", error);
      throw new AppError("Failed to find checkin by userId and event", 404);
    }
  }
  async findCheckinByUserIdEventandStatus(
    userId: string,
    event: EventType,
    status: CheckinStatusType
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
      return await prisma.checkin.findFirst({
        where: {
          userId,
          event,
          status,
        },
        orderBy: {
          status: "desc",
        },
      });
    } catch (error) {
      console.error("Error finding checkin by userId and event:", error);
      throw new AppError("Failed to find checkin by userId and event", 404);
    }
  }

  async createCheckin(data: CheckinRequestWithStatus): Promise<Checkin> {
    try {
      const checkin = await prisma.checkin.create({
        data: {   
          userId: data.userId,
          event: data.event,
          status: data.status,
        },
      });
      return checkin;
    } catch (error) {
      console.error("Error creating checkin:", error);
      throw new AppError("Failed to create checkin", 404);
    }
  }

  // async updateCheckin(
  //   id: string,
  //   data: Prisma.CheckinUpdateInput
  // ): Promise<Checkin> {
  //   try {
  //     return await prisma.checkin.update({
  //       where: { id },
  //       data: {
  //         event: data.event,
  //         status: data.status,
  //       },
  //     });
  //   } catch (error) {
  //     console.error("Error updating checkin:", error);
  //     throw new AppError("Failed to update checkin", 404);
  //   }
  // }

  // async updateCheckinByUserIdAndEvent(
  //   userId: string,
  //   event: EventType,
  //   data: Prisma.CheckinUpdateInput
  // ): Promise<number> {
  //   try {
  //     const result = await prisma.checkin.updateMany({
  //       where: { userId, event },
  //       data,
  //     });
  //     return result.count;
  //   } catch (error) {
  //     console.error("Error updating checkin by userId and event:", error);
  //     throw new AppError("Failed to update checkin by userId and event", 404);
  //   }
  // }
}
