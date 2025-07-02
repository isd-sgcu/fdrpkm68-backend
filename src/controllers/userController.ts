import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/userService';

// Get My Profile Controller
export const getMyProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ status: 'error', message: 'User not authenticated.' });
    }

    const { student_id, citizen_id } = req.user;
    const user = await userService.findUserByStudentIdAndCitizenId(student_id, citizen_id);

    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found.' });
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
      group_role: user.group_role,
      group_id: user.group_id,
      role: user.role,
    };

    res.status(200).json({
      status: 'success',
      user: userPublicData,
    });
  } catch (error) {
    if (error instanceof Error) {
      return next(error); 
    }
    res.status(500).json({
      status: 'error',
      message: 'An unexpected error occurred while fetching user profile.',
    });
  }
};

