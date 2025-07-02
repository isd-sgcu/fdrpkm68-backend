import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as userService from './userService'; 
import { config } from '../config';
import { User, UserRegistrationRequest } from '../types/user'; 
import { CustomError } from '../types/error'; 
import { NextFunction } from 'express';
// Register Logic
export const register = async (userData: UserRegistrationRequest) => {
  const { student_id, citizen_id, password ,...rest} = userData;

  // check if user already exists
  const existingUser = await userService.findUserByStudentIdAndCitizenId(student_id, citizen_id);
  if (existingUser) {
    const error: CustomError = new Error('User already exists with this student ID and citizen ID.');
    error.statusCode = 409;
    console.error('User already exists:', error);
  }

  // hash the password
  const salt = await bcrypt.genSalt(10);
  //   console.log('Password received for hashing:', password);
  // console.log('Salt Rounds:', salt);
  const password_hash = await bcrypt.hash(password, salt);

  // crerate user for database
  const role = (userData as any).role || 'FRESHMAN'; //testing purposes naja
  const newUser : User = {...userData, password_hash, role, created_at: new Date(), updated_at: new Date()}
  const addedUser = await userService.createUser(newUser);
  // console.log('User created successfully:', addedUser);
  return addedUser;
};

// Login 
export const login = async (student_id: string, citizen_id:string ,password: string): Promise<{ token: string; user: User }> => {

  const user = await userService.findUserByStudentIdAndCitizenId(student_id,citizen_id);
  if(!user){
    const error: CustomError = new Error('User not found.Student ID or Citizen ID is incorrect.');
    error.statusCode = 401;
    throw error;
  }
  // check password
  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    const error: CustomError = new Error('passwrod is incorrect. please try again.');
    error.statusCode = 401;
    throw error;
  }

  // create JWT token
  const payload = {
    student_id: user.student_id,
    citizen_id: user.citizen_id,
    role: user.role,
  };
  const token = jwt.sign(payload, config.SECRET_JWT_KEY, {
    expiresIn: '1h', 
  });

    return { token, user };
};