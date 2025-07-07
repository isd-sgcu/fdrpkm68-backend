import { Checkin, Prisma ,EventType} from "@prisma/client";
import { prisma } from "@/lib/prisma";

export class CheckinRepository {
  async findById(id: string): Promise<Checkin & {
    id: string;
    userId: string;
    event: string;
    status: string;
    updatedAt: Date;
    createdAt: Date;
} | null> {
      try {
        return await prisma.checkin.findUnique({
          where: { id: id },
         
        });
      } catch (error) {
        console.error("Error finding checkin by ID:", error);
        throw new Error("Failed to find checkin by ID");
      }
    }

  async findByUserIdAndEvent(userId: string, event: EventType): Promise<Checkin & {
    id: string;
    userId: string;
    event: string;
    status: string;
    updatedAt: Date;
    createdAt: Date;
  } | null> {
    return prisma.checkin.findUnique({
      where: {
        userId_event: {
          userId,
          event,
        },
      },
    });
  }

  async create(data: Prisma.CheckinCreateInput): Promise<Checkin> {
    return prisma.checkin.create({ data });
  }

  async update(id: string, data: Prisma.CheckinUpdateInput): Promise<Checkin> {
    return prisma.checkin.update({
      where: { id },
      data,
    });
  }

  async updateByUserIdAndEvent(
    userId: string,
    event: EventType,
    data: Prisma.CheckinUpdateInput
  ): Promise<number> {
    const result = await prisma.checkin.updateMany({
      where: { userId, event },
      data,
    });
    return result.count;
}