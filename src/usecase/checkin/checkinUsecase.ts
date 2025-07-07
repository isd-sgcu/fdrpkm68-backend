import { Checkin, CheckinStatusType,User, EventType } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export class CheckinUsecase {
  async getCheckinById(id: string): Promise<Checkin | null> {
    return prisma.checkin.findUnique({ where: { id } });
  }
}