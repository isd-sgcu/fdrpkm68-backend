import { Request, Response, NextFunction } from 'express';
import { validateCheckinInput } from '../utils/validationUtils';

export const validateParamsMiddleware = (options: { eventRequired: boolean }) => (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { student_id, citizen_id, event } = req.params;

	const validationError = validateCheckinInput(student_id, citizen_id, options.eventRequired, event);
	if (validationError.length > 0) {
		res.status(400).json({
			error: 'Bad Request',
			message: validationError,
		});
		return;
	}

	next();
};

export const validateBodyMiddleware = (options: { eventRequired: boolean }) => (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { student_id, citizen_id, event } = req.body;

	const validationError = validateCheckinInput(student_id, citizen_id, options.eventRequired, event);
	if (validationError.length > 0) {
		res.status(400).json({
			error: 'Bad Request',
			message: validationError,
		});
		return;
	}

	next();
};