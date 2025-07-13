import { CheckinStatusType, EventType } from "@prisma/client";

export interface CheckinRequest {
  userId: string;
  event: EventType;
}
export interface CheckinRequestWithStatus extends CheckinRequest    {
  status: CheckinStatusType
}
export interface UserIdRequest  {
  userId: string;
}
