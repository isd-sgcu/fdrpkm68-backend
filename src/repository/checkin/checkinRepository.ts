import { Checkin, CheckinStatusType, EventType } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import {  CheckinRequestWithStatus,CheckinRequestWithStatusandStudentId } from "@/types/checkin/POST";
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
    async createCheckinByStudentIdandCitizenId(
    data: CheckinRequestWithStatusandStudentId
  ): Promise<Checkin> {
    try {
      // Find userId by studentId
      const user = await prisma.user.findFirst({
        where: { studentId: data.studentId, citizenId: data.citizenId },
        select: { id: true },
      });

      if (!user) {
        throw new AppError("User not found for given student ID", 404);
      }

      const checkin = await prisma.checkin.create({
        data: {
          userId: user.id,
          event: data.event,
          status: data.status,
        },
      });
      return checkin;
    } catch (error) {
      console.error("Error creating checkin by student ID:", error);
      throw new AppError("Failed to create checkin by student ID", 404);
    }
  }

  async findCheckinByStudentIdEventandStatus(
    studentId: string,
    citizenId: string,
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
      // Find user by studentId and citizenId to get userId
      const user = await prisma.user.findFirst({
        where: { studentId, citizenId },
        select: { id: true },
      });

      if (!user) {
        throw new AppError(
          "User not found for given student ID and citizen ID",
          404
        );
      }

      return await prisma.checkin.findFirst({
        where: {
          userId: user.id,
          event,
          status,
        },
      });
    } catch (error) {
      console.error(
        "Error finding checkin by studentId, event and status:",
        error
      );
      throw new AppError(
        "Failed to find checkin by studentId, event and status",
        404
      );
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
