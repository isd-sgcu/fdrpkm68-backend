import type { User } from "@prisma/client";

import { UserRepository } from "@/repository/user/userRepository";
import type {
  ForgotPasswordRequest,
  LoginRequest,
  RegisterRequest,
} from "@/types/auth/POST";
import { AppError } from "@/types/error/AppError";
import { signJwt } from "@/utils/jwt";
import { hashPassword, comparePassword } from "@/utils/password";
import { validatePhoneNumber } from "@/utils/validatePhoneNumber";

export class AuthUsecase {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async register(body: RegisterRequest) {
    if (this.validateRegisterRequest(body) === false) {
      throw new AppError("Invalid registration request", 400);
    }
    const existingUser = await this.userRepository.findExists(
      body.studentId,
      body.citizenId
    );
    if (existingUser) {
      throw new AppError(
        "User with this student ID or citizen ID already exists",
        400
      );
    }
    body.password = await hashPassword(body.password);
    const user: User = await this.userRepository.create(body);

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async login(body: LoginRequest) {
    const user = await this.userRepository.getUserByCredentials(
      body.studentId,
      body.citizenId
    );
    if (!user) {
      throw new AppError("Invalid student ID or citizen ID", 401);
    }
    const isPasswordValid = await comparePassword(body.password, user.password);
    if (!isPasswordValid) {
      throw new AppError("Invalid password", 401);
    }
    return signJwt({
      id: user.id,
      studentId: user.studentId,
      citizenId: user.citizenId,
    });
  }

  async forgotPassword(body: ForgotPasswordRequest) {
    if (this.validateForgotPasswordRequest(body) === false) {
      throw new AppError("Invalid forgot password request", 400);
    }
    const user = await this.userRepository.getUserByCredentials(
      body.studentId,
      body.citizenId
    );
    if (!user) {
      throw new AppError("Invalid student ID or citizen ID", 401);
    }
    body.newPassword = await hashPassword(body.newPassword);
    const updatedUser = await this.userRepository.changePassword(
      user.id,
      body.newPassword
    );
    if (!updatedUser) {
      throw new AppError("Failed to update password", 500);
    }
    return true;
  }

  private validateRegisterRequest(body: RegisterRequest): boolean {
    if (body.studentId.length !== 10 || body.citizenId.length !== 13) {
      return false;
    }
    if (!/^\d+$/.test(body.studentId) || !/^\d+$/.test(body.citizenId)) {
      return false;
    }
    if (
      !/[A-Z]/.test(body.password) ||
      !/[a-z]/.test(body.password) ||
      !/\d/.test(body.password) ||
      body.password.length < 8 ||
      body.password.length > 20
    ) {
      return false;
    }
    const validPrefixes = ["MR", "MS", "MRS", "Other"];
    if (!validPrefixes.includes(body.prefix)) {
      return false;
    }
    if (
      !validatePhoneNumber(body.phoneNumber) ||
      !validatePhoneNumber(body.parentPhoneNumber)
    ) {
      return false;
    }
    const validRoles = ["STAFF", "FRESHMAN"];
    if (!validRoles.includes(body.role)) {
      return false;
    }
    return true;
  }

  private validateForgotPasswordRequest(body: ForgotPasswordRequest): boolean {
    if (body.studentId.length !== 10 || body.citizenId.length !== 13) {
      return false;
    }
    if (
      !/[A-Z]/.test(body.newPassword) ||
      !/[a-z]/.test(body.newPassword) ||
      !/\d/.test(body.newPassword) ||
      body.newPassword.length < 8 ||
      body.newPassword.length > 20
    ) {
      return false;
    }
    return true;
  }
}
