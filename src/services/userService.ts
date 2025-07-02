import { query } from '../database/client';
import { User, UserRegistrationRequest } from '../types/user';
import { CustomError } from '../types/error';
import { validateCitizenIdChecksum } from '../utils/validationUtils'; 
import bcrypt from 'bcryptjs';
import { ForgotPasswordReq } from '../types/user';


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
      food_allergy,
      drug_allergy,
      illness,
      avatar_id,
      role
    } = userData;

    const result = await query(
      `INSERT INTO users (
        student_id, citizen_id, prefix, first_name, last_name, nickname,
        academic_year, faculty, password_hash, phone_number,
        parent_name, parent_phone_number, parent_relationship, food_allergy, drug_allergy, illness, avatar_id, role
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16 ,$17,$18) RETURNING *`, 
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
        food_allergy,
        drug_allergy,
        illness,
        avatar_id, 
        role
      ]
    );
    // console.log('User created successfully:', result);
    return result.rows[0]; 
  } catch (error: any) {
    const customError: CustomError = new Error(error.message || 'Failed to create user');
    customError.statusCode = error.statusCode || 500;
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

export const updateUserPassword = async ( Userdata : ForgotPasswordReq): Promise<User> => {
    const { student_id, citizen_id, new_password ,confirm_new_password} = Userdata;

    if(new_password !== confirm_new_password) {
      const error: CustomError = new Error('New password and confirmation do not match.');
      error.statusCode = 400;
      throw error;
    }

    // hash the new password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(new_password, salt);

    const result = await query(
      `UPDATE users SET password_hash = $1, updated_at = NOW() WHERE student_id = $2 AND citizen_id = $3 RETURNING *`,
      [password_hash, student_id, citizen_id]
    );

    if (result.rows.length === 0) {
      const error: CustomError = new Error('User not found with the provided student ID and citizen ID.');
      error.statusCode = 404;
      throw error;
    }

    return result.rows[0];
}

