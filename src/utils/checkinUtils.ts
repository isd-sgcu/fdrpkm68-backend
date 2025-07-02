import { EventType } from "../types/enum"

const eventIntervals = {
	// 19/7/68 00:00 - 23:59
	[EventType.FIRSTDATE]: {
		start: new Date('2025-07-19T00:00:00+07:00'),
		end: new Date('2025-07-19T23:59:59+07:00'),
	},
	// 1/8/68  00:00 - 23:59
	[EventType.RPKM]: {
		start: new Date('2025-08-01T00:00:00+07:00'),
		end: new Date('2025-08-01T23:59:59+07:00'),
	},
	// 3/8/68  00:00 - 23:59
	[EventType.FRESHMENNIGHT]: {
		start: new Date('2025-08-03T00:00:00+07:00'),
		end: new Date('2025-08-03T23:59:59+07:00'),
	},
};

// Get current event by date now
export const getCurrentEvent = (): EventType | null => {
	const now = new Date();

	return (Object.keys(eventIntervals) as EventType[])
		.find(eventName => {
			const { start, end } = eventIntervals[eventName];
			return now >= start && now <= end;
		}) ?? null;
}