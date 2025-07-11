import { Checkin, CheckinStatusType, User, EventType, Prisma } from "@prisma/client";
import { CheckinRepository } from "../../repository/checkin/checkinRepository";
import { CheckinRequest } from "../../types/checkin/POST";
import { AppError } from "../../types/error/AppError";
    
    
const EVENT_PERIODS: Record<EventType, {
  PRE_REGISTER: { start: Date; end: Date };
  EVENT_REGISTER: { start: Date; end: Date };
}> = {
  FIRSTDATE: {
    PRE_REGISTER: {
      start: new Date("2025-07-17T19:00:00+07:00"),
      end:   new Date("2025-07-19T23:59:59+07:00"),
    },
    EVENT_REGISTER: {
      start: new Date("2025-07-19T00:00:00+07:00"),
      end:   new Date("2025-07-19T23:59:59+07:00"),
    },
  },
  RPKM: {
    PRE_REGISTER: {
      start: new Date("2025-07-20T19:00:00+07:00"),
      end:   new Date("2025-08-03T23:59:59+07:00"),
    },
    EVENT_REGISTER: {
      start: new Date("2025-08-01T00:00:00+07:00"),
      end:   new Date("2025-08-01T23:59:59+07:00"),
    },
  },
  FRESHMENNIGHT: {
    PRE_REGISTER: {
      start: new Date("2025-07-20T19:00:00+07:00"),
      end:   new Date("2025-08-03T23:59:59+07:00"),
    },
    EVENT_REGISTER: {
      start: new Date("2025-08-03T00:00:00+07:00"),
      end:   new Date("2025-08-03T23:59:59+07:00"),
    },
  },
};

export class CheckinUsecase {
  private checkinRepository: CheckinRepository;

  constructor() {
    this.checkinRepository = new CheckinRepository();
  }

  // async findCheckinById(id: string): Promise<Checkin | null> {
  //   return this.checkinRepository.findCheckinById(id);
  // }

  async findCheckinByUserIdAndEvent(
    userId: string,
    event: EventType
  ): Promise<Checkin | null> {
    return this.checkinRepository.findCheckinByUserIdAndEvent(userId, event);
  }

  async createCheckin(data: CheckinRequest): Promise<Checkin> {
    try {
      // Check if check-in already exists for this user and event
      const existing = await this.checkinRepository.findCheckinByUserIdEventandStatus(
        data.userId,
        data.event,
        data.status
      );
      if (existing) {
        throw new AppError("Check-in already exists for this user and event",400);
      }

      // Period check based on status
      const now = new Date();
      const period = EVENT_PERIODS[data.event];
      if (!period) {
        throw new AppError("Invalid event type",400);
      }

      if (data.status === CheckinStatusType.PRE_REGISTER) {
        if (now < period.PRE_REGISTER.start) {
          throw new AppError("Checking is not allowed before register period",400);
        }
        if (now > period.PRE_REGISTER.end) {
          throw new AppError("Checking is not allowed after register period",400);
        }
      } else if (data.status === CheckinStatusType.EVENT_REGISTER) {
        if (now < period.EVENT_REGISTER.start) {
          throw new AppError("Checking is not allowed before event period",400);
        }
        if (now > period.EVENT_REGISTER.end) {
          throw new AppError("Checking is not allowed after event period",400);
        }
      }
      return await this.checkinRepository.createCheckin(data);
    } catch (error) {
      console.error("Error creating checkin:", error);
      throw new AppError("Failed to create checkin",500);
    }
  }

  // async updateCheckin(
  //   id: string,
  //   data: Prisma.CheckinUpdateInput
  // ): Promise<Checkin> {
  //   try {
  //     return await this.checkinRepository.updateCheckin(id, data);
  //   } catch (error) {
  //     console.error("Error updating checkin:", error);
  //     throw new Error("Failed to update checkin");
  //   }
  // }

  // async updateCheckinByUserIdAndEvent(
  //   userId: string,
  //   event: EventType,
  //   data: Prisma.CheckinUpdateInput
  // ): Promise<number> {
  //   try {
  //     return await this.checkinRepository.updateCheckinByUserIdAndEvent(
  //       userId,
  //       event,
  //       data
  //     );
  //   } catch (error) {
  //     console.error("Error updating checkin by userId and event:", error);
  //     throw new Error("Failed to update checkin by userId and event");
  //   }
  // }
}
