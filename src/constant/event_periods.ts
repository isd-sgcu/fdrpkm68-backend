import { EventType } from "@prisma/client";

export const EVENT_PERIODS: Record<
  EventType,
  {
    PRE_REGISTER: { start: Date; end: Date };
    EVENT_REGISTER: { start: Date; end: Date };
  }
> = {
  FIRSTDATE: {
    PRE_REGISTER: {
      start: new Date("2025-07-17T19:00:00+07:00"),
      end: new Date("2025-07-19T23:59:59+07:00"),
      //17/7 19.00 - 19/7 23.59
    },
    EVENT_REGISTER: {
      start: new Date("2025-07-19T00:00:00+07:00"),
      end: new Date("2025-07-19T23:59:59+07:00"),
      //19/7 0.00 - 23.59
    },
  },
  RPKM: {
    PRE_REGISTER: {
      start: new Date("2025-07-20T19:00:00+07:00"),
      end: new Date("2025-08-03T23:59:59+07:00"),
      //20/7 19.00 - 3/8 23.59
    },
    EVENT_REGISTER: {
      start: new Date("2025-08-01T00:00:00+07:00"),
      end: new Date("2025-08-01T23:59:59+07:00"),
      //1/8 0.00 - 23.59
    },
  },
  FRESHMENNIGHT: {
    PRE_REGISTER: {
      start: new Date("2025-07-20T19:00:00+07:00"),
      end: new Date("2025-08-03T23:59:59+07:00"),
      //20/7 19.00 - 3/8 23.59
    },
    EVENT_REGISTER: {
      start: new Date("2025-08-03T00:00:00+07:00"),
      end: new Date("2025-08-03T23:59:59+07:00"),
      //3/8 0.00 - 23.59
    },
  },
};
