import { query } from '../database/client';
import { CustomError } from '../types/error';
import { Checkin } from '../types/checkin';
import { CheckinStatusType } from '../types/enum';

// Get all checkin data
export const getAllCheckin = async (): Promise<Checkin[]> => {
  try {
    const result = await query(`SELECT * FROM checkin`);
    return result.rows;
  } catch (error) {
    const customError: CustomError = new Error(
      'Failed to get all checkin'
    );
    customError.statusCode = 500;
    throw customError;
  }
};

// Create checkin with status = 'PRE_REGISTER'
export const createCheckin = async (
  student_id: string,
  citizen_id: string,
  event: string,
) => {
  try {
    const result = await query(
      `
        INSERT INTO checkin (user_student_id, user_citizen_id, event, status)
        VALUES ($1, $2, $3, $4);
      `,
      [student_id, citizen_id, event, CheckinStatusType.PRE_REGISTER]
    );
  } catch (error) {
    const customError: CustomError = new Error(
      'Failed to create checkin'
    );
    customError.statusCode = 500;
    throw customError;
  }
};

// Get checkin by userId and event
export const getCheckinByUserIdAndEvent = async (
  student_id: string,
  citizen_id: string,
  event: string,
): Promise<Checkin | undefined> => {
  try {
    const result = await query(
      `
        SELECT *
        FROM checkin
        WHERE user_student_id = $1 AND user_citizen_id = $2 AND event = $3;
      `,
      [student_id, citizen_id, event]
    );
    return result.rows[0]
  } catch (error) {
    const customError: CustomError = new Error(
      'Failed to get checkin by userId and event'
    );
    customError.statusCode = 500;
    throw customError;
  }
}

// Update checkin status from 'PRE_REGISTER' to 'EVENT_REGISTER'
export const updateCheckinStatus = async (
  student_id: string,
  citizen_id: string,
  event: string,
) => {
  try {
    const result = await query(
      `
        UPDATE checkin
        SET status = $1, updated_at = $2
        WHERE user_student_id = $3 AND user_citizen_id = $4 AND event = $5;
      `,
      [
        CheckinStatusType.EVENT_REGISTER, new Date(),
        student_id, citizen_id, event
      ]
    );
  } catch (error) {
    const customError: CustomError = new Error(
      'Failed to update checkin status'
    );
    customError.statusCode = 500;
    throw customError;
  }
};
