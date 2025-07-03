import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/userService';
import { CustomError } from '../types/error';

// Get My Profile Controller
export const getMyProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      const error: CustomError = new Error('Authentication error: User ID not found.');
      error.statusCode = 401;
      throw error;
    }

    const { student_id, citizen_id } = req.user;
    const user = await userService.findUserByStudentIdAndCitizenId(student_id, citizen_id);

    if (!user) {
      const error: CustomError = new Error('User not found.');
      error.statusCode = 404;
      throw error;
    }

    const userPublicData = {
      student_id: user.student_id,
      citizen_id: user.citizen_id,
      prefix: user.prefix,
      first_name: user.first_name,
      last_name: user.last_name,
      nickname: user.nickname,
      academic_year: user.academic_year,
      faculty: user.faculty,
      phone_number: user.phone_number,
      parent_name: user.parent_name,
      parent_phone_number: user.parent_phone_number,
      parent_relationship: user.parent_relationship,
      food_allergy: user.food_allergy,
      drug_allergy: user.drug_allergy,
      illness: user.illness,
      avatar_id: user.avatar_id,
    };

    res.status(200).json({
      status: 'User profile retrieved successfully',
      user: userPublicData,
    });
    return;
  } catch (error) {
    if (error instanceof Error) {
      return next(error);
    }
    res.status(500).json({
      status: 'error',
      message: 'An unexpected error occurred while fetching user profile.',
    });
    return;
  }
};

// Get Student  by ID Controller For Staff
export const findUsersByStudentId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const studentId = req.params.id;
    if (!studentId) {
      const error: CustomError = new Error('Student ID is required.');
      error.statusCode = 400;
      throw error;
    }

    const user = await userService.findUsersByStudentId(studentId);
    if (!user) {
      const error: CustomError = new Error('User not found.');
      error.statusCode = 404;
      throw error;
    }

    const userPublicData = {
      student_id: user.student_id,
      citizen_id: user.citizen_id,
      prefix: user.prefix,
      first_name: user.first_name,
      last_name: user.last_name,
      nickname: user.nickname,
      academic_year: user.academic_year,
      faculty: user.faculty,
      phone_number: user.phone_number,
      parent_name: user.parent_name,
      parent_phone_number: user.parent_phone_number,
      parent_relationship: user.parent_relationship,
      food_allergy: user.food_allergy,
      drug_allergy: user.drug_allergy,
      illness: user.illness,
      avatar_id: user.avatar_id,
    };

    res.status(200).json({
      status: 'User profile retrieved successfully',
      userPublicData,
    });
  } catch (error) {
    if (error instanceof Error) {
      return next(error);
    }
    res.status(500).json({
      status: 'error',
      message: 'An unexpected error occurred while fetching user profile by ID.',
    });
  }
};