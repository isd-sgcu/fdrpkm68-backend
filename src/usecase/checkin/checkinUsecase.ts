import { Checkin, CheckinStatusType, EventType } from "@prisma/client";
import { DateTime } from "luxon";

import { EVENT_PERIODS } from "@/constant/event_periods";
import { CheckinRepository } from "@/repository/checkin/checkinRepository";
import {
  CheckinRequest,
  UserIdRequest,
  CheckinRequestWithStatus,
} from "@/types/checkin/POST";
import { AppError } from "@/types/error/AppError";

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
    const now = DateTime.now().setZone("Asia/Bangkok");
    const period = EVENT_PERIODS[event];
    if (!period) {
      throw new AppError("Invalid event type", 400);
    }
    if (now < period.PRE_REGISTER.start) {
      throw new AppError("Checking is not allowed before register period", 400);
    }
    if (now > period.PRE_REGISTER.end) {
      throw new AppError("Checking is not allowed after register period", 400);
    }
    return this.checkinRepository.findCheckinByUserIdAndEvent(userId, event);
  }

  async createCheckin(data: CheckinRequest): Promise<Checkin> {
    // Check if check-in already exists for this user and event
    const existing =
      await this.checkinRepository.findCheckinByUserIdEventandStatus(
        data.userId,
        data.event,
        CheckinStatusType.PRE_REGISTER
      );
    if (existing) {
      throw new AppError(
        "Check-in already exists for this user and event",
        400
      );
    }

    // Period check based on status
    const now = DateTime.now();
    const period = EVENT_PERIODS[data.event];
    if (!period) {
      throw new AppError("Invalid event type", 400);
    }
    if (now < period.PRE_REGISTER.start) {
      throw new AppError("Checking is not allowed before register period", 400);
    }
    if (now > period.PRE_REGISTER.end) {
      throw new AppError("Checking is not allowed after register period", 400);
    }
    const checkinData: CheckinRequestWithStatus = {
      userId: data.userId,
      event: data.event,
      status: CheckinStatusType.PRE_REGISTER,
    };
    return await this.checkinRepository.createCheckin(checkinData);
  }

  async createCheckinByUserId(data: UserIdRequest): Promise<Checkin> {
    const now = DateTime.now();
    let event: EventType | null = null;

    // Determine event based on current time
    for (const [eventKey, period] of Object.entries(EVENT_PERIODS)) {
      if (
        now >= period.EVENT_REGISTER.start &&
        now <= period.EVENT_REGISTER.end
      ) {
        event = eventKey as EventType;
        break;
      }
    }
    if (!event) {
      throw new AppError(
        "No event is open for EVENT_REGISTER at this time",
        400
      );
    }

    // Check if check-in already exists for this user and event with EVENT_REGISTER status
    const existing =
      await this.checkinRepository.findCheckinByUserIdEventandStatus(
        data.userId,
        event,
        CheckinStatusType.EVENT_REGISTER
      );
    if (existing) {
      throw new AppError(
        "Check-in already exists for this user and event",
        400
      );
    }

    // Check if now is in the event period
    const period = EVENT_PERIODS[event];
    if (now < period.EVENT_REGISTER.start || now > period.EVENT_REGISTER.end) {
      throw new AppError("Checking is not allowed outside event period", 400);
    }
    // Create the check-in
    const newCheckin = await this.checkinRepository.createCheckin({
      userId: data.userId,
      event: event,
      status: CheckinStatusType.EVENT_REGISTER,
    });

    return newCheckin;
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
