import type { User } from "@prisma/client";
import bcrypt from "bcrypt";

import { UserRepository } from "@/repository/user/userRepository";

import { RegisterRequest } from "@/types/auth/POST";
import { AppErorr } from "@/types/error/AppError";

export class AuthUsecase {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async register(body: RegisterRequest) {
    if (this.validateRegisterRequest(body) === false) {
      throw new AppErorr("Invalid registration request", 400);
    }
    const existingUser = await this.userRepository.findExists(
      body.studentId,
      body.citizenId
    );
    if (existingUser) {
      throw new AppErorr(
        "User with this student ID or citizen ID already exists",
        400
      );
    }
    const hashedPassword = await bcrypt.hash(body.password, 10);
    body.password = hashedPassword;
    const user: User = await this.userRepository.create(body);

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  private validateRegisterRequest(body: RegisterRequest): boolean {
    if (body.studentId.length !== 10 || body.citizenId.length !== 13) {
      return false;
    }
    if (!/^\d+$/.test(body.studentId) || !/^\d+$/.test(body.citizenId)) {
      return false;
    }
    return false;
  }
}
