import { Request, Response, NextFunction } from 'express';
import { EventType } from '../types/enum';
import { validateCheckinRequest } from '../utils/validationUtils';

declare module 'express-serve-static-core' {
	interface Request {
		student_id: string;
		citizen_id: string;
		event: EventType;
	}
}

export const checkinMiddleware = (options: { eventRequired: boolean }) => (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { student_id, citizen_id, event } = req.body;

	const validationError = validateCheckinRequest(student_id, citizen_id, options.eventRequired, event);
	if (validationError.length > 0) {
		res.status(400).json({
			error: 'Bad Request',
			message: validationError,
		});
		return;
	}

	next();
};