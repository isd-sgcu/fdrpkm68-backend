import { Request, Response, NextFunction } from 'express';
import * as checkinService from '../services/checkinService';
import * as userService from '../services/userService';
import { CheckinStatusType, EventType } from '../types/enum';
import { getCurrentEvent } from '../utils/checkinUtils';

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
			error: 'Internal Server Error',
			message: 'An unexpected error occurred while fetching all checkin data.',
		});
	}
}

// Create checkin event with status = 'PRE_REGISTER'
export const createCheckin = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { student_id, citizen_id, event } = req.body

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
			const checkinStatus =
				checkin.status === CheckinStatusType.PRE_REGISTER ? 'Pre-Register' : 'Checkin';

			res.status(409).json({
				error: 'Conflict',
				status: checkin.status,
				message: `User has already ${checkinStatus} event: ${event}`
			})
			return
		}

		await checkinService.createCheckin(student_id, citizen_id, event)

		res.status(201).json({
			status: CheckinStatusType.PRE_REGISTER,
			message: 'Pre-Register created successfully',
		})
	} catch (error) {
		if (error instanceof Error) {
			return next(error);
		}
		res.status(500).json({
			error: 'Internal Server Error',
			message: 'An unexpected error occurred while create checkin.',
		});
	}
}

// Update checkin status from 'PRE_REGISTER' to 'EVENT_REGISTER'
export const updateCheckinStatus = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { student_id, citizen_id } = req.body

		// Get current event
		const event = getCurrentEvent();
		if (!event) {
			res.status(404).json({
				error: 'No Active Event',
				message: 'No event is currently active',
			});
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
				message: `User has not pre-register event: ${event}`,
			})
			return
		}
		// Taken
		if (checkin.status === CheckinStatusType.EVENT_REGISTER) {
			res.status(409).json({
				error: 'Conflict',
				status: CheckinStatusType.EVENT_REGISTER,
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
			error: 'Internal Server Error',
			message: 'An unexpected error occurred while update checkin status.',
		});
	}
}