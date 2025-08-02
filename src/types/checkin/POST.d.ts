import { CheckinStatusType, EventType } from "@prisma/client";

export interface CheckinRequest {
  userId: string;
  event: EventType;
}

export interface CheckinRequestWithStatus extends CheckinRequest {
  status: CheckinStatusType;
}
export interface UserIdRequest {
  userId: string;
}

export interface StudentIdRequest {
  studentId: string;
  citizenId: string;
}
export interface CheckinRequestwithStudentId {
  studentId: string;
  citizenId: string;
  event: EventType;
}

export interface CheckinRequestWithStatusandStudentId
  extends CheckinRequestwithStudentId {
  status: CheckinStatusType;
}
