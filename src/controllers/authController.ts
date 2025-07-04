import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/authService';
import * as userService from '../services/userService';
import { errorHandler } from '../middlewares/errorHandler';
// Register Controller
export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userData = req.body; 
    const newUser = await authService.register(userData); 

    res.status(201).json({
      status: 'success',
      message: 'User registered successfully.',
      user: {
        student_id: newUser.student_id,
        citizen_id: newUser.citizen_id,
        first_name: newUser.first_name,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      return next(error); 
    }
    res.status(400).json({
      status: 'error',
      message: error,
    });
  }
};

// Login Controller
export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { student_id,citizen_id, password } = req.body;
    const { token, user } = await authService.login(student_id, citizen_id, password); 

    res.status(200).json({
      status: 'success',
      message: 'Login successful.',
      token,
      user: {
        student_id: user.student_id,
        citizen_id: user.citizen_id,
        first_name: user.first_name,
        role: user.role,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      return next(error); 
    }
    res.status(400).json({
      status: 'error',
      message: error,
    });
  }
};

// Forgot Password Controller
export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { student_id, citizen_id, new_password, confirm_new_password } = req.body;
    const updatedUser = await userService.updateUserPassword({
      student_id,
      citizen_id,
      new_password,
      confirm_new_password,
    });

    res.status(200).json({
      status: 'success',
      message: 'Password updated successfully.',
      user: {
        student_id: updatedUser.student_id,
        citizen_id: updatedUser.citizen_id,
        first_name: updatedUser.first_name,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      return next(error); 
    }
    res.status(400).json({
      status: 'error',
      message: error,
    });
  }
};