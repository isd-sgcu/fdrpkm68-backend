import { query } from '../database/client';
import { User, UserRegistrationRequest } from '../types/user';
import { CustomError } from '../types/error';
import { validateCitizenIdChecksum } from '../utils/validationUtils'; 

export const createUser = async (userData: User): Promise<User> => {
  try {
    // checksum SSN
    if (!validateCitizenIdChecksum(userData.citizen_id)) {
      const error: CustomError = new Error('Invalid Citizen ID checksum.');
      error.statusCode = 400;
      throw error;
    }

    const {
      student_id,
      citizen_id,
      prefix,
      first_name,
      last_name,
      nickname,
      academic_year,
      faculty,
      password_hash,
      phone_number,
      parent_name,
      parent_phone_number,
      parent_relationship,
      role,
    } = userData;

    const result = await query(
      `INSERT INTO users (
        student_id, citizen_id, prefix, first_name, last_name, nickname,
        academic_year, faculty, password_hash, phone_number,
        parent_name, parent_phone_number, parent_relationship, role
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`, 
      [
        student_id,
        citizen_id,
        prefix,
        first_name,
        last_name,
        nickname,
        academic_year,
        faculty,
        password_hash,
        phone_number,
        parent_name,
        parent_phone_number,
        parent_relationship,
        role,
      ]
    );
    return result.rows[0]; 
  } catch (error) {
    if (error instanceof Error && 'statusCode' in error) {
      throw error;
    }
    const customError: CustomError = new Error('Failed to create user');
    customError.statusCode = 500;
    throw customError;
  }
};

export const findUsersByStudentId = async (student_id: string): Promise<User[]> => {
  try {
    const result = await query(
      `SELECT * FROM users WHERE student_id = $1`,
      [student_id]
    );
    return result.rows;
  } catch (error) {
    const customError: CustomError = new Error('Failed to find users by student ID');
    customError.statusCode = 500;
    throw customError;
  }
};

export const findUserBySSN = async (citizen_id: string): Promise<User | undefined> => {
  try {
    const result = await query(
      `SELECT * FROM users WHERE citizen_id = $1`,
      [citizen_id]
    );
    return result.rows[0];
  } catch (error) {
    const customError: CustomError = new Error('Failed to find user by citizen ID');
    customError.statusCode = 500;
    throw customError;
  }
};

export const findUserByStudentIdAndCitizenId = async (
  student_id: string,
  citizen_id: string
): Promise<User | undefined> => {
  try {
    const result = await query(
      `SELECT * FROM users WHERE student_id = $1 AND citizen_id = $2`,
      [student_id, citizen_id]
    );
    return result.rows[0];
  } catch (error) {
    const customError: CustomError = new Error('Failed to find user by student ID and citizen ID');
    customError.statusCode = 500;
    throw customError;
  }
};

