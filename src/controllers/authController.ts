import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/authService';
import * as userService from '../services/userService';

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
    next(error); 
  }
};

// Login Controller
export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { student_id, password } = req.body;
    const { token, user } = await authService.login(student_id, password); 

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
    next(error); 
  }
};