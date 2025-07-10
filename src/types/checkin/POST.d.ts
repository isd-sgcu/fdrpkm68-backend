import { EventType } from "@prisma/client";

export interface CheckinRequest {
  userId: string;
  event: EventType;
  status: CheckinStatusType;
}
