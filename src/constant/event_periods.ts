import { EventType } from "@prisma/client";
import { DateTime } from "luxon";

export const EVENT_PERIODS: Record<
  EventType,
  {
    PRE_REGISTER: { start: DateTime; end: DateTime };
    EVENT_REGISTER: { start: DateTime; end: DateTime };
  }
> = {
  FIRSTDATE: {
    PRE_REGISTER: {
      start: DateTime.fromISO("2025-07-17T19:00:00+07:00"),
      end: DateTime.fromISO("2025-07-19T23:59:59+07:00"),
      // 17/7 19.00 - 19/7 23.59
    },
    EVENT_REGISTER: {
      start: DateTime.fromISO("2025-07-19T00:00:00+07:00"),
      end: DateTime.fromISO("2025-07-19T23:59:59+07:00"),
      // 19/7 0.00 - 23.59
    },
  },
  RPKM: {
    PRE_REGISTER: {
      start: DateTime.fromISO("2025-07-20T19:00:00+07:00"),
      end: DateTime.fromISO("2025-08-03T23:59:59+07:00"),
      // 20/7 19.00 - 3/8 23.59
    },
    EVENT_REGISTER: {
      start: DateTime.fromISO("2025-08-02T00:00:00+07:00"),
      end: DateTime.fromISO("2025-08-02T23:59:59+07:00"),
      // 2/8 0.00 - 23.59
    },
  },
  FRESHMENNIGHT: {
    PRE_REGISTER: {
      start: DateTime.fromISO("2025-08-01T19:00:00+07:00"),
      end: DateTime.fromISO("2025-08-03T23:59:59+07:00"),
      // 1/8 19.00 - 3/8 23.59
    },
    EVENT_REGISTER: {
      start: DateTime.fromISO("2025-08-03T00:00:00+07:00"),
      end: DateTime.fromISO("2025-08-03T23:59:59+07:00"),
      // 3/8 0.00 - 23.59
    },
  },
};
