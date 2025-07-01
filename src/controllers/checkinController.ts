import { Request, Response, NextFunction } from 'express';
import * as checkinService from '../services/checkinService';
import * as userService from '../services/userService';
import { CheckinStatusType, EventType } from '../types/enum';

// Get all checkin data
export const getAllCheckin = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const checkin = await checkinService.getAllCheckin();
		res.status(200).json({
			checkin,
		})
	} catch (error) {
		if (error instanceof Error) {
			return next(error);
		}
		res.status(500).json({
			status: 'error',
			message: 'An unexpected error occurred while fetching checkin.',
		});
	}
}

// Create checkin event with status = 'PRE_REGISTER'
export const createCheckin = async (req: Request, res: Response, next: NextFunction) => {
	interface CheckinCreateRequest {
		student_id: string;
		citizen_id: string;
		event: string;
	}

	try {
		const { student_id, citizen_id, event } = req.body as CheckinCreateRequest
		const validationError: string[] = []

		if (!student_id || typeof student_id !== 'string')
			validationError.push('student_id: required');

		if (!citizen_id || typeof citizen_id !== 'string')
			validationError.push('citizen_id: required');

		if (!event || typeof event !== 'string' || !Object.values(EventType).includes(event as EventType))
			validationError.push('event: required');

		if (validationError.length > 0) {
			res.status(400).json({
				error: 'Bad Request',
				message: validationError.join(', '),
			})
			return
		}
		// Invalid student_id or citizen_id
		const user = await userService.findUserByStudentIdAndCitizenId(student_id, citizen_id);
		if (!user) {
			res.status(404).json({
				error: 'Not Found',
				message: 'Invalid student_id or citizen_id',
			})
			return
		}
		// Taken
		const checkin = await checkinService.getCheckinByUserIdAndEvent(student_id, citizen_id, event)
		if (checkin) {
			res.status(409).json({
				error: 'Conflict',
				message: `Checkin has already created event: ${event}`
			})
			return
		}

		await checkinService.createCheckin(student_id, citizen_id, event)

		res.status(201).json({
			message: 'Checkin created successfully',
		})
	} catch (error) {
		if (error instanceof Error) {
			return next(error);
		}
		res.status(500).json({
			status: 'error',
			message: 'An unexpected error occurred while fetching checkin.',
		});
	}
}

// Update checkin status from 'PRE_REGISTER' to 'EVENT_REGISTER'
export const updateCheckinStatus = async (req: Request, res: Response, next: NextFunction) => {
	interface CheckinUpdateRequest {
		student_id: string;
		citizen_id: string;
		event: string;
	}

	try {
		const { student_id, citizen_id, event } = req.body as CheckinUpdateRequest
		const validationError: string[] = []

		if (!student_id || typeof student_id !== 'string')
			validationError.push('student_id: required');

		if (!citizen_id || typeof citizen_id !== 'string')
			validationError.push('citizen_id: required');

		if (!event || typeof event !== 'string' || !Object.values(EventType).includes(event as EventType))
			validationError.push('event: required');

		if (validationError.length > 0) {
			res.status(400).json({
				error: 'Bad Request',
				message: validationError.join(', '),
			})
			return
		}
		// Invalid student_id or citizen_id
		const user = await userService.findUserByStudentIdAndCitizenId(student_id, citizen_id);
		if (!user) {
			res.status(404).json({
				error: 'Not Found',
				message: 'Invalid student_id or citizen_id',
			})
			return
		}
		// Not Found
		const checkin = await checkinService.getCheckinByUserIdAndEvent(student_id, citizen_id, event)
		if (!checkin) {
			res.status(404).json({
				error: 'Not Found',
				message: 'Checkin not found',
			})
			return
		}
		// Taken
		if (checkin.status === CheckinStatusType.EVENT_REGISTER) {
			res.status(409).json({
				error: 'Conflict',
				message: `User has already checkin event: ${event}`,
				lastCheckIn: checkin.updated_at
			})
			return
		}

		await checkinService.updateCheckinStatus(student_id, citizen_id, event)

		res.status(200).json({
			student_id,
			citizen_id,
			nickname: user.nickname,
			first_name: user.first_name,
			last_name: user.last_name,
			lastCheckIn: checkin.updated_at
		})
	} catch (error) {
		if (error instanceof Error) {
			return next(error);
		}
		res.status(500).json({
			status: 'error',
			message: 'An unexpected error occurred while fetching checkin.',
		});
	}
}